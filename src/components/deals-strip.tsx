"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Clock, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatAED } from "@/lib/utils";
import type { DemoProduct } from "@/lib/products-data";

export function DealsStrip({ dealProducts }: { dealProducts: DemoProduct[] }) {
  const { addItem } = useCart();

  // Simple, deterministic countdown to midnight
  const [timeLeft, setTimeLeft] = React.useState({
    hours: "08",
    minutes: "42",
    seconds: "19",
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = Math.max(0, endOfDay.getTime() - now.getTime());

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-b from-cyan-950/20 via-background to-background border-y border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Live Countdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5 fill-cyan-400 animate-pulse" />
              <span>Limited-Time UAE Flash Offers</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
              Dubai Tech Deals
            </h2>
            <p className="text-sm text-muted-foreground">
              Guaranteed lowest prices in the UAE with official manufacturer warranty.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-card/80 border border-border/80 px-4 py-2.5 rounded-2xl backdrop-blur-md">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-muted-foreground uppercase">Ends In:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-sm">
              <span className="px-2 py-1 rounded-lg bg-background border border-border/60 text-foreground">
                {timeLeft.hours}
              </span>
              <span>:</span>
              <span className="px-2 py-1 rounded-lg bg-background border border-border/60 text-foreground">
                {timeLeft.minutes}
              </span>
              <span>:</span>
              <span className="px-2 py-1 rounded-lg bg-background border border-border/60 text-cyan-400">
                {timeLeft.seconds}
              </span>
            </div>
          </div>
        </div>

        {/* Deals Carousel / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.slice(0, 4).map((product) => {
            const savingsFils = product.sale_price_fils
              ? product.base_price_fils - product.sale_price_fils
              : 0;

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl bg-card border border-border/70 hover:border-cyan-500/40 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between"
              >
                {/* Savings Badge */}
                {savingsFils > 0 && (
                  <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-cyan-500 text-black text-[11px] font-bold">
                    Save {formatAED(savingsFils)}
                  </div>
                )}

                {/* Image */}
                <div className="relative w-full aspect-square rounded-xl bg-muted/30 overflow-hidden mb-4 p-4 flex items-center justify-center">
                  <Image
                    src={product.images[0]?.url || "/placeholder.png"}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                      {product.brand_name}
                    </span>
                    <Link
                      href={`/product/${product.slug}`}
                      className="block font-medium text-sm text-foreground hover:text-cyan-400 transition-colors line-clamp-2 mt-0.5"
                    >
                      {product.title}
                    </Link>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-black text-lg text-foreground">
                        {formatAED(product.sale_price_fils || product.base_price_fils)}
                      </span>
                      {product.sale_price_fils && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatAED(product.base_price_fils)}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">Includes 5% UAE VAT</p>

                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          id: product.id,
                          productId: product.id,
                          title: product.title,
                          priceFils: product.sale_price_fils || product.base_price_fils,
                          image: product.images[0]?.url || "",
                          maxStock: product.stock_quantity,
                          slug: product.slug,
                        })
                      }
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-muted hover:bg-cyan-500 hover:text-black font-semibold text-xs transition-colors duration-200"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

