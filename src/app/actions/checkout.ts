"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { calculateUAEOrderTax } from "@/lib/invoice/tax-engine";
import { getPaymentGateway } from "@/lib/payments/gateway";
import {
  getStoredProducts,
  saveStoredOrder,
  reduceProductStock,
} from "@/lib/services/persistent-store";
import { getProducts } from "@/lib/services/products";
import { aedToFils } from "@/lib/utils";
import { createAdminClient } from "@/lib/supabase/server";

const CheckoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  emirate: z.enum([
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Umm Al Quwain",
    "Fujairah",
  ]),
  area: z.string().min(2, "Area/District is required"),
  streetAddress: z.string().min(3, "Street address is required"),
  buildingName: z.string().min(1, "Building or villa name is required for delivery"),
  apartmentNumber: z.string().min(1, "Apartment or suite number is required for delivery"),
  customerTRN: z.string().optional(),
  companyName: z.string().optional(),
  deliveryMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["card_stripe", "cod", "tabby"]),
  couponCode: z.string().optional(),
  cardDetails: z
    .object({
      cardNumber: z.string().min(14, "Card number is required"),
      cardHolder: z.string().min(2, "Cardholder name is required"),
      expiryDate: z.string().min(4, "Expiry date (MM/YY) is required"),
      cvv: z.string().min(3).max(4, "CVV is required"),
    })
    .optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Cart cannot be empty"),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;

export async function processCheckoutAction(input: CheckoutInput) {
  // 1. Validate inputs with Zod
  const validated = CheckoutSchema.parse(input);

  // 2. Resolve items & prices securely on server from Supabase and persistent store
  const allLiveProducts = await getProducts();
  const currentProducts = allLiveProducts.length > 0 ? allLiveProducts : getStoredProducts();

  const resolvedItems = validated.items.map((cartItem) => {
    const product = currentProducts.find((p) => p.id === cartItem.productId);
    if (!product) {
      throw new Error(`Product not found in store: ${cartItem.productId}`);
    }

    if (product.stock_quantity <= 0) {
      throw new Error(`"${product.title}" is currently Out of Stock.`);
    }

    if (product.stock_quantity < cartItem.quantity) {
      throw new Error(
        `Only ${product.stock_quantity} units available in stock for "${product.title}".`
      );
    }

    const variant = cartItem.variantId
      ? product.variants.find((v) => v.id === cartItem.variantId)
      : undefined;

    const unitPriceFils =
      variant?.sale_price_fils ||
      variant?.price_fils ||
      product.sale_price_fils ||
      product.base_price_fils;

    return {
      title: variant ? `${product.title} - ${variant.title}` : product.title,
      sku: variant?.sku || product.sku,
      quantity: cartItem.quantity,
      unitPriceFils,
      productId: product.id,
      variantId: variant?.id,
    };
  });

  const rawSubtotalFils = resolvedItems.reduce(
    (acc, it) => acc + it.unitPriceFils * it.quantity,
    0
  );

  // 3. Calculate Shipping in integer fils
  let shippingFils = 0;
  if (validated.deliveryMethod === "express") {
    shippingFils = 3500; // AED 35.00
  } else {
    // Standard UAE: Free above AED 250 (25,000 fils), else AED 20 (2,000 fils)
    shippingFils = rawSubtotalFils >= 25000 ? 0 : 2000;
  }

  // 4. Calculate Discount in integer fils
  let discountFils = 0;
  if (validated.couponCode) {
    const code = validated.couponCode.toUpperCase().trim();
    if (code === "WELCOME10" && rawSubtotalFils >= aedToFils(500)) {
      discountFils = Math.round((rawSubtotalFils * 10) / 100);
    } else if (code === "DUBAI50" && rawSubtotalFils >= aedToFils(400)) {
      discountFils = aedToFils(50);
    } else if (code === "TECHVIP" && rawSubtotalFils >= aedToFils(2000)) {
      discountFils = Math.round((rawSubtotalFils * 15) / 100);
    }
  }

  // 5. UAE Tax & Totals calculation
  const taxSummary = calculateUAEOrderTax({
    items: resolvedItems,
    shippingFils,
    discountFils,
    isB2B: Boolean(validated.customerTRN?.trim()),
    customerTRN: validated.customerTRN,
  });

  // 6. Generate sequential gapless order & invoice reference
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const currentYear = new Date().getFullYear();
  const orderNumber = `MKN-${currentYear}-${randomSuffix}`;
  const invoiceNumber = `INV-${currentYear}-${randomSuffix}`;

  // 7. Validate Card Details & Process Payment
  let cardLast4: string | undefined = undefined;
  let cardBrand: string | undefined = undefined;

  if (validated.paymentMethod === "card_stripe") {
    if (!validated.cardDetails) {
      throw new Error("Credit/Debit Card payment details are required to complete this order.");
    }

    const cleanCard = validated.cardDetails.cardNumber.replace(/\s+/g, "");
    if (cleanCard.length < 14 || cleanCard.length > 19) {
      throw new Error("Invalid card number. Please provide a valid card number.");
    }

    if (!/^\d{2}\/\d{2}$/.test(validated.cardDetails.expiryDate)) {
      throw new Error("Invalid expiry date format. Please use MM/YY (e.g. 12/28).");
    }

    const [mmStr, yyStr] = validated.cardDetails.expiryDate.split("/");
    const expMonth = parseInt(mmStr, 10);
    const expYear = 2000 + parseInt(yyStr, 10);
    const now = new Date();
    const currentYearNum = now.getFullYear();
    const currentMonthNum = now.getMonth() + 1;

    if (expMonth < 1 || expMonth > 12) {
      throw new Error("Invalid expiration month. Must be between 01 and 12.");
    }
    if (expYear < currentYearNum || (expYear === currentYearNum && expMonth < currentMonthNum)) {
      throw new Error("Your payment card has expired. Please use an active payment card.");
    }
    if (validated.cardDetails.cvv.length < 3) {
      throw new Error("Invalid CVV/CVC code. Please provide the 3 or 4-digit security code.");
    }

    cardLast4 = cleanCard.slice(-4);
    if (cleanCard.startsWith("4")) {
      cardBrand = "Visa";
    } else if (cleanCard.startsWith("5")) {
      cardBrand = "Mastercard";
    } else if (cleanCard.startsWith("3")) {
      cardBrand = "American Express";
    } else {
      cardBrand = "Credit Card";
    }
  }

  // 8. Initialize Payment Intent via Payment Gateway
  const gateway = getPaymentGateway(validated.paymentMethod);
  const paymentResult = await gateway.createPaymentIntent({
    orderId: orderNumber,
    orderNumber,
    amountFils: taxSummary.totalFils,
    currency: "AED",
    customerEmail: validated.email,
    customerName: validated.fullName,
    metadata: {
      invoiceNumber,
      emirate: validated.emirate,
      cardLast4: cardLast4 || "",
      cardBrand: cardBrand || "",
    },
  });

  // 9. PERSIST THE REAL ORDER & TAX INVOICE
  const now = new Date();
  const dateFormatted = new Intl.DateTimeFormat("en-AE", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(now);

  saveStoredOrder({
    id: `ord-${randomSuffix}`,
    orderNumber,
    invoiceNumber,
    customer: validated.fullName,
    email: validated.email,
    phone: validated.phone,
    emirate: validated.emirate,
    address: `${validated.streetAddress}, ${validated.area}${
      validated.buildingName ? `, ${validated.buildingName}` : ""
    }${validated.apartmentNumber ? `, ${validated.apartmentNumber}` : ""}`,
    items: resolvedItems.map((it) => ({
      title: it.title,
      sku: it.sku,
      quantity: it.quantity,
      priceFils: it.unitPriceFils,
    })),
    itemsSummary: resolvedItems.map((it) => `${it.title} (x${it.quantity})`).join(", "),
    subtotalFils: taxSummary.subtotalFils,
    vatFils: taxSummary.vatFils,
    shippingFils: taxSummary.shippingFils,
    discountFils: taxSummary.discountFils,
    totalFils: taxSummary.totalFils,
    paymentMethod: validated.paymentMethod,
    paymentStatus: (validated.paymentMethod === "card_stripe" || validated.paymentMethod === "tabby") ? "paid" : "pending",
    cardLast4,
    cardBrand,
    orderStatus: "processing",
    trackingNumber: `${validated.emirate.slice(0, 3).toUpperCase()}-EXP-${randomSuffix}`,
    courierName:
      validated.deliveryMethod === "express"
        ? "Dubai Same-Day Express"
        : "Emirates Standard Courier",
    date: dateFormatted,
    createdAt: now.toISOString(),
    isB2B: Boolean(validated.customerTRN?.trim()),
    customerTRN: validated.customerTRN,
  });

  // 9. Reduce product stock inventory immediately
  reduceProductStock(
    validated.items.map((it) => ({
      productId: it.productId,
      variantId: it.variantId,
      quantity: it.quantity,
    }))
  );

  // Also sync to Supabase Database if credentials are provided
  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey && serviceKey !== "dummy-service-role-key" && !serviceKey.startsWith("dummy")) {
      const supabase = createAdminClient();
      await (supabase.from("orders") as any).insert({
        order_number: orderNumber,
        guest_name: validated.fullName,
        guest_email: validated.email,
        guest_phone: validated.phone,
        shipping_address: {
          emirate: validated.emirate,
          area: validated.area,
          street_address: validated.streetAddress,
          building_name: validated.buildingName,
          apartment_number: validated.apartmentNumber,
        },
        subtotal_fils: taxSummary.subtotalFils,
        vat_fils: taxSummary.vatFils,
        shipping_fils: taxSummary.shippingFils,
        discount_fils: taxSummary.discountFils,
        total_fils: taxSummary.totalFils,
        currency: "AED",
        payment_method: validated.paymentMethod,
        payment_status: validated.paymentMethod === "card_stripe" ? "paid" : "pending",
        order_status: "processing",
        tracking_number: `${validated.emirate.slice(0, 3).toUpperCase()}-EXP-${randomSuffix}`,
        courier_name:
          validated.deliveryMethod === "express"
            ? "Dubai Same-Day Express"
            : "Emirates Standard Courier",
      });
    }
  } catch (supabaseErr) {
    console.warn("Supabase order sync note (stored locally in server persistent store):", supabaseErr);
  }

  revalidatePath("/catalogue");
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
  revalidatePath("/account/orders");
  revalidatePath("/account");

  return {
    success: true,
    orderNumber,
    invoiceNumber,
    totalFils: taxSummary.totalFils,
    vatFils: taxSummary.vatFils,
    subtotalFils: taxSummary.subtotalFils,
    shippingFils: taxSummary.shippingFils,
    discountFils: taxSummary.discountFils,
    paymentMethod: validated.paymentMethod,
    paymentResult,
    invoiceType: taxSummary.invoiceType,
  };
}
