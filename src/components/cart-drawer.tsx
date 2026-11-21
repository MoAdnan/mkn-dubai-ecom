"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatAED, aedToFils } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD_FILS = aedToFils(250); // AED 250

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    totalCount,
    subtotalFils,
    vatFils,
    totalFils,
  } = useCart();

  // Close on ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_FILS - subtotalFils);
  const freeShippingProgress = Math.min(100, Math.round((subtotalFils / FREE_SHIPPING_THRESHOLD_FILS) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background border-l border-border/80 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              <h2 className="font-heading text-lg font-bold">Shopping Cart</h2>
              <span className="bg-cyan-500/10 text-cyan-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-cyan-500/20">
                {totalCount} {totalCount === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3 bg-muted/30 border-b border-border/40">
            <div className="flex justify-between items-center text-xs mb-1.5">
              {remainingForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-cyan-400">{formatAED(remainingForFreeShipping)}</strong> more for <strong>FREE UAE Delivery</strong>
                </span>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  ✓ You have unlocked FREE UAE Delivery!
                </span>
              )}
              <span className="text-muted-foreground font-mono">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-border/40">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
                  <ShoppingBag className="w-8 h-8 opacity-70" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-1">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground max-w-xs mb-6">
                  Explore Dubai&apos;s best deals on flagship phones, laptops, and smart electronics.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl bg-muted/40 border border-border/60 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-medium text-sm hover:text-cyan-400 transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.variantName && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.variantName}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-border/70 rounded-lg overflow-hidden bg-background">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          {formatAED(item.priceFils * item.quantity)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatAED(item.priceFils)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer summary */}
          {items.length > 0 && (
            <div className="border-t border-border/60 p-6 bg-card/60 backdrop-blur-md space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground">{formatAED(subtotalFils)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>Includes 5% UAE VAT</span>
                  <span className="font-mono">{formatAED(vatFils)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>UAE Delivery</span>
                  <span>{remainingForFreeShipping === 0 ? "FREE" : "Calculated at checkout"}</span>
                </div>
                <div className="border-t border-border/40 pt-2 flex justify-between font-bold text-base">
                  <span>Estimated Total</span>
                  <span className="text-cyan-400 font-mono">{formatAED(totalFils)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all duration-200"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl border border-border/80 hover:bg-accent/40 text-sm font-medium transition-colors"
                >
                  View Full Cart & Coupons
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Secure Checkout | Official UAE Warranty</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

