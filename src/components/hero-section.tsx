"use client";

import * as React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Truck, CheckCircle2 } from "lucide-react";

// Lazy-load Three.js Canvas with static graphic fallback
const HeroScene = dynamic(
  () => import("@/components/hero-canvas").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  }
);

function HeroFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="w-64 h-96 rounded-3xl bg-gradient-to-tr from-cyan-950/40 via-card to-violet-950/40 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 flex flex-col items-center justify-between p-6 animate-pulse">
        <div className="w-16 h-3 rounded-full bg-cyan-500/20" />
        <div className="w-28 h-28 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Sparkles className="w-10 h-10" />
        </div>
        <div className="w-32 h-2 rounded bg-muted" />
      </div>
    </div>
  );
}

export function HeroSection() {
  const [useFallback, setUseFallback] = React.useState(false);

  React.useEffect(() => {
    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setUseFallback(true);
    }
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-4.5rem)] flex items-center py-12 lg:py-20 bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(0,242,254,0.12),rgba(112,0,255,0.06),transparent)]">
      {/* Ambient background glow dots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Dubai Exclusive Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official UAE Launch • 2026 Flagship Collections</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.08]">
              Next-Gen Tech, <br />
              Delivered Same-Day in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400">
                Dubai & UAE.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience the pinnacle of consumer electronics. Official TDRA-approved iPhones,
              M4 Max MacBooks, ROG gaming titans, and audiophile gear with 100% genuine UAE distributor warranty and 5% VAT tax invoices.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/catalogue"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-cyan-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/catalogue?deals=true"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-border/80 bg-card/60 hover:bg-accent/40 text-foreground font-semibold text-sm transition-all duration-200 hover:border-cyan-500/40"
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Dubai Deals (Save Up to 25%)</span>
              </Link>
            </div>

            {/* Trust Bulletpoints */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-border/40 text-xs text-muted-foreground text-left">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Same-Day Dubai Express</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>Official UAE Brand Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>FTA Compliant Tax Invoices</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Showcase */}
          <div className="lg:col-span-5 h-[380px] sm:h-[460px] lg:h-[520px] relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent rounded-3xl" />
            {useFallback ? <HeroFallback /> : <HeroScene />}
          </div>
        </div>
      </div>
    </section>
  );
}

