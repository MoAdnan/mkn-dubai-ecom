"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Eye, ShieldCheck, Check } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatAED } from "@/lib/utils";
import type { DemoProduct } from "@/lib/products-data";

export function TrendingProducts({ products }: { products: DemoProduct[] }) {
  const { addItem } = useCart();
  const [activeFilter, setActiveFilter] = React.useState<string>("all");
  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});

  const filtered = React.useMemo(() => {
    if (activeFilter === "all") return products;
    return products.filter((p) => p.category_slug === activeFilter);
  }, [products, activeFilter]);

  const handleAddToCart = (product: DemoProduct) => {
    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      priceFils: product.sale_price_fils || product.base_price_fils,
      image: product.images[0]?.url || "",
      maxStock: product.stock_quantity,
      slug: product.slug,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-1 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Official UAE Stock</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
            Trending Electronics
          </h2>
          <p className="text-sm text-muted-foreground">
            The most sought-after devices in Dubai right now.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All Items" },
            { id: "smartphones", label: "Smartphones" },
            { id: "laptops", label: "Laptops" },
            { id: "audio", label: "Audio & Hi-Fi" },
            { id: "wearables", label: "Wearables" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((product) => {
          const isAdded = !!addedIds[product.id];
          const isOutOfStock = product.stock_quantity <= 0;
          return (
            <div
              key={product.id}
              className="group relative rounded-2xl bg-card border border-border/70 hover:border-cyan-500/40 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between"
            >
              {/* Image & Quick View Link */}
              <div className="relative w-full aspect-square rounded-xl bg-muted/30 overflow-hidden mb-4 p-4 flex items-center justify-center">
                <Image
                  src={product.images[0]?.url || "/placeholder.png"}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className={`object-contain group-hover:scale-105 transition-transform duration-300 ${
                    isOutOfStock ? "grayscale opacity-50" : ""
                  }`}
                />

                {isOutOfStock && (
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-md">
                    Out of Stock
                  </div>
                )}

                {/* Quick view hover action */}
                <Link
                  href={`/product/${product.slug}`}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-background/80 backdrop-blur-md border border-border/60 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:border-cyan-500"
                  aria-label={`View ${product.title}`}
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>

              {/* Product Info */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[11px]">
                      {product.brand_name}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{product.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground font-normal">({product.reviews_count})</span>
                    </div>
                  </div>

                  <Link
                    href={`/product/${product.slug}`}
                    className="font-medium text-sm text-foreground hover:text-cyan-400 transition-colors line-clamp-2"
                  >
                    {product.title}
                  </Link>

                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {product.short_description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/40 mt-3">
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
                  <p className="text-[10px] text-muted-foreground">
                    {isOutOfStock ? (
                      <span className="text-rose-400 font-semibold">Currently Sold Out</span>
                    ) : (
                      "Incl. 5% UAE VAT"
                    )}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => !isOutOfStock && handleAddToCart(product)}
                      disabled={isOutOfStock}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all duration-200 ${
                        isOutOfStock
                          ? "bg-muted text-muted-foreground border border-border/70 cursor-not-allowed"
                          : isAdded
                          ? "bg-emerald-500 text-black"
                          : "bg-primary text-primary-foreground hover:bg-cyan-500 hover:text-black"
                      }`}
                    >
                      {isOutOfStock ? (
                        <span>Out of Stock</span>
                      ) : isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

