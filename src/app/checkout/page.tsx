"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatAED, aedToFils } from "@/lib/utils";
import { processCheckoutAction } from "@/app/actions/checkout";

const UAE_EMIRATES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Umm Al Quwain",
  "Fujairah",
] as const;

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, subtotalFils, vatFils, clearCart } = useCart();

  const prefilledCoupon = searchParams.get("coupon") || "";

  // Form State
  const [fullName, setFullName] = React.useState("Adnan Al-Hashimi");
  const [email, setEmail] = React.useState("adnan@example.ae");
  const [phone, setPhone] = React.useState("+971 50 123 4567");
  const [emirate, setEmirate] = React.useState<typeof UAE_EMIRATES[number]>("Dubai");
  const [area, setArea] = React.useState("Downtown Dubai");
  const [streetAddress, setStreetAddress] = React.useState("Sheikh Mohammed bin Rashid Blvd");
  const [buildingName, setBuildingName] = React.useState("Burj Crown Tower");
  const [apartmentNumber, setApartmentNumber] = React.useState("Suite 1402");
  const [isB2B, setIsB2B] = React.useState(false);
  const [companyName, setCompanyName] = React.useState("");
  const [customerTRN, setCustomerTRN] = React.useState("");
  const [deliveryMethod, setDeliveryMethod] = React.useState<"standard" | "express">("express");
  const [paymentMethod, setPaymentMethod] = React.useState<"card_stripe" | "cod">("card_stripe");
  const [couponCode, setCouponCode] = React.useState(prefilledCoupon);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Delivery calculation
  const shippingFils = deliveryMethod === "express" ? 3500 : subtotalFils >= 25000 ? 0 : 2000;

  // Coupon discount calculation
  const discountFils = React.useMemo(() => {
    if (!couponCode) return 0;
    const code = couponCode.toUpperCase().trim();
    if (code === "WELCOME10" && subtotalFils >= aedToFils(500)) {
      return Math.round((subtotalFils * 10) / 100);
    } else if (code === "DUBAI50" && subtotalFils >= aedToFils(400)) {
      return aedToFils(50);
    } else if (code === "TECHVIP" && subtotalFils >= aedToFils(2000)) {
      return Math.round((subtotalFils * 15) / 100);
    }
    return 0;
  }, [couponCode, subtotalFils]);

  const totalPayableFils = Math.max(0, subtotalFils + shippingFils - discountFils);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (items.length === 0) {
        throw new Error("Your cart is empty. Please add items before checking out.");
      }

      const res = await processCheckoutAction({
        fullName,
        email,
        phone,
        emirate,
        area,
        streetAddress,
        buildingName,
        apartmentNumber,
        companyName: isB2B ? companyName : undefined,
        customerTRN: isB2B ? customerTRN : undefined,
        deliveryMethod,
        paymentMethod,
        couponCode: couponCode || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      });

      if (res.success) {
        clearCart();
        router.push(
          `/order-confirmation/${res.orderNumber}?invoice=${res.invoiceNumber}&total=${res.totalFils}&method=${res.paymentMethod}`
        );
      }
    } catch (err: any) {
      setError(err?.message || "Failed to process checkout. Please check the details.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-heading text-2xl font-black mb-2">No Items In Cart</h1>
        <p className="text-xs text-muted-foreground mb-6">
          Add items to your cart to proceed with UAE checkout.
        </p>
        <Link
          href="/catalogue"
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs"
        >
          Browse Catalogue
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Delivery Address, Shipping, & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact & Customer Details */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
              <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-mono flex items-center justify-center font-bold">
                  1
                </span>
                <span>Contact & Shipping Details</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Email Address (For Tax Invoice) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    UAE Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+971 50 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Emirate *
                  </label>
                  <select
                    value={emirate}
                    onChange={(e) => setEmirate(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500 font-medium"
                  >
                    {UAE_EMIRATES.map((em) => (
                      <option key={em} value={em}>
                        {em}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Area / District *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Downtown Dubai, JLT, Al Barsha"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Street name / Number"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Building / Tower Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Burj Crown Tower"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Apartment / Villa Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apt 1402"
                    value={apartmentNumber}
                    onChange={(e) => setApartmentNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* B2B Invoicing Checkbox */}
              <div className="pt-3 border-t border-border/40">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isB2B}
                    onChange={(e) => setIsB2B(e.target.checked)}
                    className="rounded border-border text-cyan-500 focus:ring-cyan-500/20"
                  />
                  <span className="font-medium text-foreground">
                    This is a Corporate / B2B Order (Generate Full Tax Invoice with TRN)
                  </span>
                </label>

                {isB2B && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-3 p-3 bg-muted/30 rounded-xl border border-border/40">
                    <div>
                      <label className="font-medium text-foreground block mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="Company Name LLC"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full p-2 rounded-lg bg-background border border-border/80 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-medium text-foreground block mb-1">
                        UAE TRN (15 digits)
                      </label>
                      <input
                        type="text"
                        placeholder="100XXXXXXXXXXXX"
                        value={customerTRN}
                        onChange={(e) => setCustomerTRN(e.target.value)}
                        className="w-full p-2 rounded-lg bg-background border border-border/80 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Delivery Options */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
              <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-mono flex items-center justify-center font-bold">
                  2
                </span>
                <span>UAE Delivery Method</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <label
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === "express"
                      ? "border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/30"
                      : "border-border/70 hover:border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === "express"}
                        onChange={() => setDeliveryMethod("express")}
                        className="text-cyan-500"
                      />
                      <span className="font-bold text-foreground">
                        Same-Day Express (Dubai & Sharjah)
                      </span>
                    </div>
                    <span className="font-mono font-bold text-cyan-400">AED 35.00</span>
                  </div>
                  <p className="text-muted-foreground mt-2 pl-5 text-[11px]">
                    ⚡ Delivered within 4 hours if ordered before 4 PM GST.
                  </p>
                </label>

                <label
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === "standard"
                      ? "border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/30"
                      : "border-border/70 hover:border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="delivery"
                        checked={deliveryMethod === "standard"}
                        onChange={() => setDeliveryMethod("standard")}
                        className="text-cyan-500"
                      />
                      <span className="font-bold text-foreground">Standard UAE Delivery</span>
                    </div>
                    <span className="font-mono font-bold text-foreground">
                      {subtotalFils >= 25000 ? "FREE" : "AED 20.00"}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-2 pl-5 text-[11px]">
                    📦 Delivered within 1-2 business days across all 7 Emirates.
                  </p>
                </label>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
              <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-mono flex items-center justify-center font-bold">
                  3
                </span>
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3 text-xs">
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "card_stripe"
                      ? "border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/30"
                      : "border-border/70 hover:border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "card_stripe"}
                      onChange={() => setPaymentMethod("card_stripe")}
                      className="text-cyan-500"
                    />
                    <div>
                      <span className="font-bold text-foreground block">
                        Credit / Debit Card (Stripe Gateway)
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Visa, Mastercard, Apple Pay accepted
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-cyan-400" />
                  </div>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/30"
                      : "border-border/70 hover:border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="text-cyan-500"
                    />
                    <div>
                      <span className="font-bold text-foreground block">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Pay cash or card to the courier upon delivery
                      </span>
                    </div>
                  </div>
                  <Banknote className="w-5 h-5 text-emerald-400" />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
              <h2 className="font-heading font-bold text-base text-foreground">
                Your Order ({items.length} items)
              </h2>

              {/* Items summary */}
              <div className="divide-y divide-border/40 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg bg-muted/40 p-1 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-0.5"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground line-clamp-1">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-foreground">
                      {formatAED(item.priceFils * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 text-xs pt-4 border-t border-border/40">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground font-semibold">
                    {formatAED(subtotalFils)}
                  </span>
                </div>

                {discountFils > 0 && (
                  <div className="flex justify-between text-cyan-400 font-semibold">
                    <span>Coupon Discount</span>
                    <span className="font-mono">-{formatAED(discountFils)}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>UAE Delivery ({deliveryMethod === "express" ? "Express" : "Standard"})</span>
                  <span className="font-mono text-foreground">
                    {shippingFils === 0 ? "FREE" : formatAED(shippingFils)}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>5% UAE VAT (Included in subtotal)</span>
                  <span className="font-mono">{formatAED(vatFils)}</span>
                </div>

                <div className="pt-3 border-t border-border/40 flex justify-between text-lg font-bold text-foreground">
                  <span>Gross Total (AED)</span>
                  <span className="text-cyan-400 font-mono font-black">
                    {formatAED(totalPayableFils)}
                  </span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Generating Tax Invoice & Processing...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Place Order & Pay {formatAED(totalPayableFils)}</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FTA-compliant PDF Tax Invoice issued upon order completion</span>
                </p>
                <p className="text-[10px] text-muted-foreground">
                  MKN Electronics L.L.C. • Commercial License No. 1048291 • TRN 100482918200003
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <nav className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
          <Link href="/cart" className="hover:text-foreground">Cart</Link>
          <span>/</span>
          <span className="text-foreground font-medium">UAE Checkout</span>
        </nav>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2">
          <span>Secure Checkout</span>
          <span className="text-xs font-mono font-normal text-muted-foreground px-2 py-0.5 rounded bg-muted">
            SSL 256-Bit Encrypted
          </span>
        </h1>
      </div>

      <Suspense
        fallback={
          <div className="py-20 text-center text-muted-foreground animate-pulse">
            Loading secure UAE checkout...
          </div>
        }
      >
        <CheckoutForm />
      </Suspense>
    </main>
  );
}
