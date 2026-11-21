"use server";

import { z } from "zod";
import { calculateUAEOrderTax } from "@/lib/invoice/tax-engine";
import { getPaymentGateway } from "@/lib/payments/gateway";
import { DEMO_PRODUCTS } from "@/lib/products-data";
import { aedToFils } from "@/lib/utils";

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
  buildingName: z.string().optional(),
  apartmentNumber: z.string().optional(),
  customerTRN: z.string().optional(),
  companyName: z.string().optional(),
  deliveryMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["card_stripe", "cod"]),
  couponCode: z.string().optional(),
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

  // 2. Resolve items & prices securely on server (Never trust client prices)
  const resolvedItems = validated.items.map((cartItem) => {
    const product = DEMO_PRODUCTS.find((p) => p.id === cartItem.productId);
    if (!product) {
      throw new Error(`Product not found: ${cartItem.productId}`);
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

  // 7. Initialize Payment Intent via Payment Gateway
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
    },
  });

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

