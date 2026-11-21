"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { DEMO_PRODUCTS } from "@/lib/products-data";
import { formatAED } from "@/lib/utils";

export default function WishlistPage() {
  const { addItem } = useCart();
  const [wishlistItems, setWishlistItems] = React.useState(DEMO_PRODUCTS.slice(0, 3));

  const removeItem = (id: string) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          href="/account"
          className="text-xs text-muted-foreground hover:text-cyan-400 flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
          My Wishlist ({wishlistItems.length})
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Saved gadgets and electronics with real-time UAE stock updates.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-4">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="font-heading text-lg font-bold">Your wishlist is empty</h2>
          <p className="text-xs text-muted-foreground">
            Explore the catalogue and save devices you love.
          </p>
          <Link
            href="/catalogue"
            className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full rounded-xl bg-muted/40 p-4 overflow-hidden">
                <Image
                  src={product.images[0]?.url || ""}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="250px"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase">
                  {product.brand_name}
                </span>
                <Link
                  href={`/product/${product.slug}`}
                  className="block font-medium text-xs text-foreground hover:text-cyan-400 line-clamp-2"
                >
                  {product.title}
                </Link>
                <p className="font-heading font-black text-base text-foreground pt-1">
                  {formatAED(product.sale_price_fils || product.base_price_fils)}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
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
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-cyan-500 hover:text-black transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="p-2 rounded-xl border border-border/70 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

