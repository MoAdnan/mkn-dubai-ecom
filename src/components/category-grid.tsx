import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { DEMO_CATEGORIES } from "@/lib/products-data";

export function CategoryGrid() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
            Shop by Category
          </h2>
          <p className="text-sm text-muted-foreground">
            Curated electronics designed for professionals, gamers, and audiophiles.
          </p>
        </div>
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>View All Categories</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {DEMO_CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/catalogue?category=${category.slug}`}
            className="group relative rounded-2xl bg-card border border-border/70 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 flex flex-col"
          >
            <div className="relative aspect-square w-full bg-muted/40 overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
            </div>

            <div className="p-3.5 space-y-0.5">
              <h3 className="font-heading font-bold text-sm text-foreground group-hover:text-cyan-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-muted-foreground">{category.count}+ items</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

