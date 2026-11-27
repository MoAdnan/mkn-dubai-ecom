"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Star,
  CheckCircle2,
  Clock,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { formatAED } from "@/lib/utils";
import type { DemoProduct } from "@/lib/products-data";

interface HeroShowcaseProps {
  products: DemoProduct[];
}

const GLOW_COLORS = [
  "rgba(0, 242, 254, 0.25)",
  "rgba(112, 0, 255, 0.25)",
  "rgba(16, 185, 129, 0.25)",
  "rgba(245, 158, 11, 0.25)",
];

const GRADIENTS = [
  "from-cyan-500/20 via-sky-500/10 to-transparent",
  "from-violet-500/20 via-purple-500/10 to-transparent",
  "from-emerald-500/20 via-cyan-500/10 to-transparent",
  "from-amber-500/20 via-orange-500/10 to-transparent",
];

export function HeroShowcase({ products }: HeroShowcaseProps) {
  const [activeTab, setActiveTab] = React.useState(0);

  // Take the first 4 products from the database
  const showcaseList = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    return products.slice(0, 4);
  }, [products]);

  // Ensure active tab stays in bounds
  const safeIndex = Math.min(activeTab, Math.max(0, showcaseList.length - 1));
  const current = showcaseList[safeIndex];

  if (!current) {
    return null;
  }

  const glowColor = GLOW_COLORS[safeIndex % GLOW_COLORS.length];
  const gradient = GRADIENTS[safeIndex % GRADIENTS.length];
  const activePriceFils = current.sale_price_fils || current.base_price_fils;
  const originalPriceFils = current.sale_price_fils ? current.base_price_fils : undefined;
  const isOutOfStock = current.stock_quantity <= 0;

  // Extract specs from database or construct sensible fallback
  const specList = Object.entries(current.specs || {}).length > 0
    ? Object.entries(current.specs).slice(0, 3).map(([k, v]) => `${k}: ${v}`)
    : [
        `${current.warranty_months}M Official Warranty`,
        "TDRA Approved",
        isOutOfStock ? "Out of Stock" : "In Stock (Dubai)",
      ];

  const badgeText = current.is_deal
    ? "Special Dubai Deal"
    : current.is_featured
    ? "Featured Flagship"
    : "Original Stock";

  return (
    <div className="w-full max-w-lg mx-auto relative flex flex-col items-center">
      {/* Dynamic ambient backlight from database item */}
      <div
        className="absolute -inset-4 rounded-3xl blur-2xl transition-all duration-700 pointer-events-none opacity-70"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${glowColor}, transparent 70%)`,
        }}
      />

      {/* Main Glassmorphic Showcase Card */}
      <div className="w-full relative rounded-3xl border border-cyan-500/30 bg-card/80 backdrop-blur-xl p-6 sm:p-7 shadow-2xl shadow-cyan-500/10 space-y-6 overflow-hidden">
        {/* Subtle decorative mesh background */}
        <div
          className={`absolute inset-0 bg-gradient-to-tr ${gradient} pointer-events-none transition-all duration-700`}
        />

        {/* Top Header Row with dynamic switcher pills from database */}
        <div className="relative z-10 flex items-center justify-between gap-2 border-b border-border/50 pb-4">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border/60 overflow-x-auto max-w-[260px] sm:max-w-none">
            {showcaseList.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  safeIndex === idx
                    ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.category_name || item.brand_name || `Item ${idx + 1}`}
              </button>
            ))}
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
              isOutOfStock
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOutOfStock ? "bg-rose-400" : "bg-emerald-400 animate-ping"
              }`}
            />
            <span>{isOutOfStock ? "Out of Stock" : "In Stock"}</span>
          </div>
        </div>

        {/* Device Image Display with Floating Badges */}
        <div className="relative z-10 w-full aspect-[4/3] rounded-2xl bg-muted/20 border border-border/40 overflow-hidden flex items-center justify-center p-6 group">
          {/* Floating Live Spec Badge Top-Left */}
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-xl bg-background/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{badgeText}</span>
          </div>

          {/* Floating Brand Badge Top-Right */}
          <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-xl bg-background/80 backdrop-blur-md border border-border/60 text-foreground text-[10px] font-mono font-bold uppercase shadow-lg">
            {current.brand_name}
          </div>

          {/* Primary High-Resolution Product Image with Floating Hover Micro-Interaction */}
          <div className="relative w-full h-full flex items-center justify-center transition-all duration-500 group-hover:scale-105">
            <Image
              src={current.images[0]?.url || "/placeholder.png"}
              alt={current.title}
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              className={`object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] ${
                isOutOfStock ? "grayscale opacity-50" : ""
              }`}
              priority
            />
          </div>

          {/* Bottom Floating Delivery Tag */}
          <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between text-[10px] px-3 py-1.5 rounded-xl bg-background/70 backdrop-blur-md border border-border/60 text-muted-foreground font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>
                {isOutOfStock ? "Restocking in progress" : "Order within 2 hrs for Same-Day Dubai"}
              </span>
            </span>
            <span className="text-emerald-400 font-bold">Official UAE Warranty</span>
          </div>
        </div>

        {/* Product Details & Pricing Bar */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                {current.brand_name} • {current.category_name}
              </span>
              <h3 className="font-heading font-black text-lg sm:text-xl text-foreground line-clamp-1">
                {current.title}
              </h3>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="font-heading font-black text-xl text-foreground font-mono">
                {formatAED(activePriceFils)}
              </div>
              {originalPriceFils && (
                <div className="text-[11px] text-muted-foreground line-through font-mono">
                  {formatAED(originalPriceFils)}
                </div>
              )}
            </div>
          </div>

          {/* Key Specs Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {specList.map((spec, sIdx) => (
              <span
                key={sIdx}
                className="px-2.5 py-1 rounded-lg bg-muted/50 border border-border/60 text-muted-foreground font-medium"
              >
                {spec}
              </span>
            ))}
          </div>

          {/* CTA Buttons Row */}
          <div className="pt-2 flex items-center gap-3">
            <Link
              href={`/product/${current.slug}`}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs shadow-lg transition-all duration-200 ${
                isOutOfStock
                  ? "bg-muted text-muted-foreground border border-border/80"
                  : "bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-cyan-500/20"
              }`}
            >
              <span>{isOutOfStock ? "View Out of Stock Item" : "View Product Details"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/catalogue"
              className="px-4 py-3 rounded-xl border border-border/80 bg-muted/40 hover:bg-muted text-foreground font-semibold text-xs transition-colors"
            >
              All Devices
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
