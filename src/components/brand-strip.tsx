import * as React from "react";
import Link from "next/link";
import { DEMO_BRANDS } from "@/lib/products-data";

export function BrandStrip() {
  return (
    <section className="py-12 border-y border-border/40 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
          Authorized UAE Retailer For World-Leading Brands
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
          {DEMO_BRANDS.map((brand) => (
            <Link
              key={brand.id}
              href={`/catalogue?brand=${brand.slug}`}
              className="text-muted-foreground/60 hover:text-cyan-400 font-heading font-black text-xl md:text-2xl tracking-tighter transition-colors"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

