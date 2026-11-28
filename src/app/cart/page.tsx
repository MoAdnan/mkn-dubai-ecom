"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatAED, aedToFils } from "@/lib/utils";

const AVAILABLE_COUPONS: Record<
  string,
  { type: "percentage" | "fixed"; value: number; minFils: number; desc: string }
> = {
  WELCOME10: {
    type: "percentage",
    value: 10,
    minFils: aedToFils(500),
    desc: "10% off on tech orders over AED 500",
  },
  DUBAI50: {
    type: "fixed",
    value: aedToFils(50),
    minFils: aedToFils(400),
    desc: "AED 50 off on orders over AED 400",
  },
  TECHVIP: {
    type: "percentage",
    value: 15,
    minFils: aedToFils(2000),
    desc: "15% VIP discount on orders over AED 2,000",
  },
};

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotalFils,
    vatFils,
    totalFils,
  } = useCart();

  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  const [couponError, setCouponError] = React.useState<string | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();

    const found = AVAILABLE_COUPONS[code];
    if (!found) {
      setCouponError("Invalid promo code. Try WELCOME10, DUBAI50, or TECHVIP.");
      return;
    }

    if (subtotalFils < found.minFils) {
      setCouponError(
        `Order subtotal must be at least ${formatAED(found.minFils)} to apply code ${code}.`
      );
      return;
    }

    setAppliedCoupon(code);
    setCouponCode("");
  };

  // Calculate discount in fils
  const discountFils = React.useMemo(() => {
    if (!appliedCoupon) return 0;
    const rule = AVAILABLE_COUPONS[appliedCoupon];
    if (!rule) return 0;

    if (rule.type === "fixed") {
      return Math.min(rule.value, subtotalFils);
    } else {
      return Math.round((subtotalFils * rule.value) / 100);
    }
  }, [appliedCoupon, subtotalFils]);

  const finalTotalFils = Math.max(0, totalFils - discountFils);

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="font-heading text-2xl font-black text-foreground">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-muted-foreground">
            Discover our collection of flagship smartphones, creator laptops, and audiophile gear.
          </p>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <span>Explore Electronics Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-heading text-3xl font-black text-foreground mb-8">
        Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card divide-y divide-border/40 p-4 sm:p-6">
            {items.map((item) => (
              <div key={item.id} className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-center">
                <div className="relative w-24 h-24 rounded-xl bg-muted/40 p-2 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.title}
                    fill
                    className="object-contain p-1"
                    sizes="96px"
                  />
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <Link
                    href={`/product/${item.slug}`}
                    className="font-medium text-base text-foreground hover:text-cyan-400 transition-colors line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  {item.variantName && (
                    <p className="text-xs text-muted-foreground">{item.variantName}</p>
                  )}
                  <p className="text-xs text-cyan-400 font-mono">
                    {formatAED(item.priceFils)} each
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border/80 rounded-xl bg-background">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-muted-foreground hover:text-foreground"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold font-mono">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-muted-foreground hover:text-foreground"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-28 text-right font-heading font-black text-base text-foreground">
                    {formatAED(item.priceFils * item.quantity)}
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive p-2"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <Link href="/catalogue" className="hover:text-cyan-400">
              ← Continue Shopping
            </Link>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official UAE Brand Warranty Guaranteed</span>
            </span>
          </div>
        </div>

        {/* Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-5">
            <h2 className="font-heading font-bold text-lg text-foreground">
              Order Summary
            </h2>

            {/* Coupon Box */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-muted/40 border border-border/80 rounded-xl text-xs uppercase focus:outline-none focus:border-cyan-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-muted hover:bg-accent text-xs font-semibold"
                >
                  Apply
                </button>
              </form>

              {couponError && (
                <p className="text-xs text-destructive mt-1.5">{couponError}</p>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{appliedCoupon}</strong> active</span>
                  </span>
                  <button
                    onClick={() => setAppliedCoupon(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs pt-3 border-t border-border/40">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono text-foreground font-semibold">
                  {formatAED(subtotalFils)}
                </span>
              </div>

              {discountFils > 0 && (
                <div className="flex justify-between text-cyan-400 font-medium">
                  <span>Discount</span>
                  <span className="font-mono">-{formatAED(discountFils)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>5% UAE VAT (Included)</span>
                <span className="font-mono">{formatAED(vatFils)}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>UAE Delivery</span>
                <span>Calculated at next step</span>
              </div>

              <div className="pt-3 border-t border-border/40 flex justify-between text-base font-bold text-foreground">
                <span>Estimated Total</span>
                <span className="text-cyan-400 font-mono">{formatAED(finalTotalFils)}</span>
              </div>
            </div>

            <Link
              href={`/checkout${appliedCoupon ? `?coupon=${appliedCoupon}` : ""}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all"
            >
              <span>Proceed to UAE Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[11px] text-muted-foreground text-center">
              🔒 256-bit Encrypted Checkout • Tax Invoice Generated Automatically
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

