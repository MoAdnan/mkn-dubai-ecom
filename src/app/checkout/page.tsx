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
  Sparkles,
  CheckCircle2,
  Loader2,
  Building2,
  Shield,
  Layers,
  Calendar,
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
  const [paymentMethod, setPaymentMethod] = React.useState<"card_stripe" | "tabby" | "cod">("card_stripe");
  const [couponCode, setCouponCode] = React.useState(prefilledCoupon);

  // Card Payment Details State
  const [cardNumber, setCardNumber] = React.useState("4242 4242 4242 4242");
  const [cardHolder, setCardHolder] = React.useState("Adnan Al-Hashimi");
  const [expiryDate, setExpiryDate] = React.useState("12/28");
  const [cvv, setCvv] = React.useState("123");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Interactive Payment Gateway Step Simulation
  const [paymentStep, setPaymentStep] = React.useState<
    "idle" | "authorizing" | "3ds_verifying" | "capturing" | "success"
  >("idle");

  // Delivery calculation
  const shippingFils = deliveryMethod === "express" ? 3500 : subtotalFils >= 25000 ? 0 : 2000;

  // COD Handling Fee in UAE (Standard AED 15 courier fee, waived when paying online)
  const codFeeFils = paymentMethod === "cod" ? 1500 : 0;

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

  const totalPayableFils = Math.max(0, subtotalFils + shippingFils + codFeeFils - discountFils);
  const tabbyInstallmentFils = Math.round(totalPayableFils / 4);

  // Card formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(" ") : raw);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      setExpiryDate(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiryDate(raw);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(raw);
  };

  const fillTestCard = () => {
    setCardNumber("4242 4242 4242 4242");
    setCardHolder(fullName || "Adnan Al-Hashimi");
    setExpiryDate("12/28");
    setCvv("123");
  };

  const cardBrand = React.useMemo(() => {
    const clean = cardNumber.replace(/\s+/g, "");
    if (clean.startsWith("4")) return "VISA";
    if (clean.startsWith("5")) return "MASTERCARD";
    if (clean.startsWith("3")) return "AMEX";
    return "CARD";
  }, [cardNumber]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (items.length === 0) {
        throw new Error("Your cart is empty. Please add items before checking out.");
      }

      // Check COD limit (standard Dubai courier threshold is AED 5,000)
      if (paymentMethod === "cod" && totalPayableFils > aedToFils(5000)) {
        throw new Error(
          "Cash on Delivery is limited to AED 5,000 as per UAE courier safety limits. Please select Card or Tabby for this high-value order."
        );
      }

      // If Card or Tabby Payment, show interactive payment verification stages
      if (paymentMethod === "card_stripe" || paymentMethod === "tabby") {
        setPaymentStep("authorizing");
        await new Promise((r) => setTimeout(r, 600));

        setPaymentStep("3ds_verifying");
        await new Promise((r) => setTimeout(r, 700));

        setPaymentStep("capturing");
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
        cardDetails:
          paymentMethod === "card_stripe"
            ? {
                cardNumber,
                cardHolder,
                expiryDate,
                cvv,
              }
            : undefined,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      });

      if (res.success) {
        if (paymentMethod === "card_stripe" || paymentMethod === "tabby") {
          setPaymentStep("success");
          await new Promise((r) => setTimeout(r, 400));
        }
        clearCart();
        router.push(
          `/order-confirmation/${res.orderNumber}?invoice=${res.invoiceNumber}&total=${res.totalFils}&method=${res.paymentMethod}`
        );
      }
    } catch (err: any) {
      setPaymentStep("idle");
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
      {/* 3D Secure / Tabby / Payment Gateway Processing Modal Overlay */}
      {paymentStep !== "idle" && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border border-border/80 bg-card p-8 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
              {paymentStep === "success" ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              ) : (
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {paymentMethod === "tabby"
                  ? "TABBY BNPL SHARIA COMPLIANT"
                  : "STRIPE 3D SECURE 2.0 GATEWAY"}
              </span>
              <h3 className="font-heading font-black text-xl text-foreground">
                {paymentMethod === "tabby" ? (
                  <>
                    {paymentStep === "authorizing" && "Connecting to Tabby..."}
                    {paymentStep === "3ds_verifying" && "Verifying UAE Mobile OTP..."}
                    {paymentStep === "capturing" && "4 Installments Approved!"}
                    {paymentStep === "success" && "Tabby Order Confirmed!"}
                  </>
                ) : (
                  <>
                    {paymentStep === "authorizing" && "Authorizing Card..."}
                    {paymentStep === "3ds_verifying" && "3D Secure 2.0 Bank Verification"}
                    {paymentStep === "capturing" && "Capturing Payment in AED..."}
                    {paymentStep === "success" && "Payment Succeeded!"}
                  </>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                {paymentMethod === "tabby" ? (
                  <>
                    {paymentStep === "authorizing" && `Authenticating mobile number ${phone}...`}
                    {paymentStep === "3ds_verifying" && "Validating first installment of " + formatAED(tabbyInstallmentFils) + "..."}
                    {paymentStep === "capturing" && "Payment plan activated: 4 monthly installments."}
                    {paymentStep === "success" && "Generating official FTA Tax Invoice..."}
                  </>
                ) : (
                  <>
                    {paymentStep === "authorizing" && `Contacting payment gateway for card ending in ${cardNumber.slice(-4)}...`}
                    {paymentStep === "3ds_verifying" && "Authenticating with UAE Central Bank secure payment network..."}
                    {paymentStep === "capturing" && `Securing payment of ${formatAED(totalPayableFils)}...`}
                    {paymentStep === "success" && "Transaction approved. Generating official FTA Tax Invoice..."}
                  </>
                )}
              </p>
            </div>

            {/* Stages visualization */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-xs text-left space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{paymentMethod === "tabby" ? "Tabby Eligibility" : "Card Validation"}</span>
                </span>
                <span className="text-emerald-400 font-bold text-[11px]">✓ Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{paymentMethod === "tabby" ? "UAE Mobile Authorization" : "3DS 2.0 Authentication"}</span>
                </span>
                <span className="text-[11px] font-bold text-foreground">
                  {paymentStep === "authorizing" ? "Pending..." : "✓ Approved"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Tax Invoice Generation</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-cyan-400">
                  {paymentStep === "success" ? "✓ Issued" : "Processing..."}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Please do not close or refresh this page.
            </p>
          </div>
        </div>
      )}

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
                    className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500"
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
                    placeholder="e.g. Downtown Dubai / Al Barsha"
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
                    placeholder="e.g. Sheikh Zayed Road"
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

              {/* B2B / Tax Invoice Details */}
              <div className="pt-3 border-t border-border/40">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
                  <input
                    type="checkbox"
                    checked={isB2B}
                    onChange={(e) => setIsB2B(e.target.checked)}
                    className="rounded border-border text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Ordering for a UAE Business (Request Full B2B Tax Invoice)</span>
                </label>

                {isB2B && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in">
                    <div>
                      <label className="font-medium text-foreground block mb-1">
                        Registered Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Al-Hashimi Ventures LLC"
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

            {/* 3. Payment Method: Card, Tabby BNPL, or COD */}
            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
              <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-mono flex items-center justify-center font-bold">
                  3
                </span>
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3 text-xs">
                {/* Option A: Credit / Debit Card */}
                <div
                  className={`rounded-xl border transition-all ${
                    paymentMethod === "card_stripe"
                      ? "border-cyan-500 bg-cyan-500/5 ring-1 ring-cyan-500/30"
                      : "border-border/70 hover:border-border"
                  }`}
                >
                  <label className="flex items-center justify-between p-4 cursor-pointer">
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
                          Visa, Mastercard, American Express, Apple Pay
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-cyan-400" />
                    </div>
                  </label>

                  {/* Card Entry Fields */}
                  {paymentMethod === "card_stripe" && (
                    <div className="px-4 pb-5 pt-1 space-y-4 border-t border-border/50 animate-in fade-in">
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Card Information (256-Bit SSL Encrypted)</span>
                        </span>
                        <button
                          type="button"
                          onClick={fillTestCard}
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Fill Test Card (4242)</span>
                        </button>
                      </div>

                      {/* Card Number */}
                      <div>
                        <label className="font-medium text-foreground block mb-1 text-[11px]">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="4242 4242 4242 4242"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            className="w-full p-2.5 rounded-xl bg-background border border-border/80 text-xs font-mono text-foreground focus:outline-none focus:border-cyan-500 pr-16"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {cardBrand}
                          </span>
                        </div>
                      </div>

                      {/* Cardholder, Expiry, CVV */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <label className="font-medium text-foreground block mb-1 text-[11px]">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Name on card"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-background border border-border/80 text-xs text-foreground focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div>
                          <label className="font-medium text-foreground block mb-1 text-[11px]">
                            Expires (MM/YY)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="12/28"
                            value={expiryDate}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            className="w-full p-2.5 rounded-xl bg-background border border-border/80 text-xs font-mono text-foreground focus:outline-none focus:border-cyan-500 text-center"
                          />
                        </div>

                        <div>
                          <label className="font-medium text-foreground block mb-1 text-[11px] flex items-center justify-between">
                            <span>CVV / CVC</span>
                            <span className="text-[10px] text-muted-foreground">3-4 digits</span>
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="123"
                            value={cvv}
                            onChange={handleCvvChange}
                            maxLength={4}
                            className="w-full p-2.5 rounded-xl bg-background border border-border/80 text-xs font-mono text-foreground focus:outline-none focus:border-cyan-500 text-center"
                          />
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 text-[10px] text-muted-foreground flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>
                          Direct bank authorization. 3D Secure 2.0 verification will be performed automatically.
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Option B: Tabby (Pay in 4 Installments) */}
                <div
                  className={`rounded-xl border transition-all ${
                    paymentMethod === "tabby"
                      ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/30"
                      : "border-border/70 hover:border-border"
                  }`}
                >
                  <label className="flex items-center justify-between p-4 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "tabby"}
                        onChange={() => setPaymentMethod("tabby")}
                        className="text-emerald-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">
                            Tabby — Pay in 4 Interest-Free Installments
                          </span>
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950">
                            0% INTEREST
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          Split into 4 monthly payments of {formatAED(tabbyInstallmentFils)}. Sharia-compliant.
                        </span>
                      </div>
                    </div>
                    <span className="font-black text-sm px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-heading">
                      tabby
                    </span>
                  </label>

                  {/* Tabby Schedule Details */}
                  {paymentMethod === "tabby" && (
                    <div className="px-4 pb-4 pt-1 space-y-3 border-t border-border/50 animate-in fade-in">
                      <p className="text-[11px] text-foreground font-semibold">Payment Schedule Breakdown:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-xl bg-card border border-emerald-500/30">
                          <span className="text-[10px] text-muted-foreground block">Today (25%)</span>
                          <span className="font-mono font-bold text-emerald-400 text-xs">
                            {formatAED(tabbyInstallmentFils)}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card border border-border/60">
                          <span className="text-[10px] text-muted-foreground block">In 1 Month</span>
                          <span className="font-mono font-bold text-foreground text-xs">
                            {formatAED(tabbyInstallmentFils)}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card border border-border/60">
                          <span className="text-[10px] text-muted-foreground block">In 2 Months</span>
                          <span className="font-mono font-bold text-foreground text-xs">
                            {formatAED(tabbyInstallmentFils)}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card border border-border/60">
                          <span className="text-[10px] text-muted-foreground block">In 3 Months</span>
                          <span className="font-mono font-bold text-foreground text-xs">
                            {formatAED(tabbyInstallmentFils)}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        You will be authorized securely using your UAE mobile number ({phone}). No credit check, no paperwork.
                      </p>
                    </div>
                  )}
                </div>

                {/* Option C: Cash on Delivery (COD) */}
                <div
                  className={`rounded-xl border transition-all ${
                    paymentMethod === "cod"
                      ? "border-cyan-500 bg-cyan-500/5 ring-1 ring-cyan-500/30"
                      : "border-border/70 hover:border-border"
                  }`}
                >
                  <label className="flex items-center justify-between p-4 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="text-cyan-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">
                            Cash / Card on Delivery (COD)
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            +AED 15.00 FEE
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          Pay cash or tap card via courier POS machine upon arrival at your doorstep
                        </span>
                      </div>
                    </div>
                    <Banknote className="w-5 h-5 text-emerald-400" />
                  </label>

                  {paymentMethod === "cod" && (
                    <div className="px-4 pb-4 pt-1 space-y-2 border-t border-border/50 animate-in fade-in text-xs">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] space-y-1">
                        <p className="font-semibold">🇦🇪 How Cash on Delivery Works in the UAE (Noon/Amazon Model):</p>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                          • Our courier carries cash collection bags and a wireless POS terminal (card on delivery supported).<br />
                          • Standard courier cash transit fee of AED 15.00 applies.<br />
                          • <strong className="text-foreground">Pro-Tip:</strong> Pay online via Card or Tabby to waive the AED 15 courier fee!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
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

                {paymentMethod === "cod" && (
                  <div className="flex justify-between text-amber-400 font-medium">
                    <span>COD Courier Transit Surcharge</span>
                    <span className="font-mono">+{formatAED(codFeeFils)}</span>
                  </div>
                )}

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

                {paymentMethod === "tabby" && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs">
                    <span className="text-foreground font-semibold">Pay Today with Tabby:</span>
                    <span className="font-mono font-black text-emerald-400">
                      {formatAED(tabbyInstallmentFils)}
                    </span>
                  </div>
                )}
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {paymentMethod === "card_stripe" && `Pay & Authorize ${formatAED(totalPayableFils)}`}
                      {paymentMethod === "tabby" && `Pay ${formatAED(tabbyInstallmentFils)} with Tabby (4 Payments)`}
                      {paymentMethod === "cod" && `Confirm Cash on Delivery (${formatAED(totalPayableFils)})`}
                    </span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>FTA-compliant PDF Tax Invoice issued upon payment completion</span>
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
          <span>Secure Checkout & Payment</span>
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
