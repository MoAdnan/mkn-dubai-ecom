"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatAED } from "@/lib/utils";

interface WishlistItem {
  id: string;
  title: string;
  brand_name?: string;
  slug: string;
  priceFils: number;
  image: string;
  stock_quantity?: number;
}

const WISHLIST_STORAGE_KEY = "mkn_wishlist_items";

export default function WishlistPage() {
  const { addItem, setIsCartOpen } = useCart();
  const [wishlistItems, setWishlistItems] = React.useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        setWishlistItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load wishlist from storage");
    } finally {
      setLoaded(true);
    }
  }, []);

  const removeItem = (id: string) => {
    setWishlistItems((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("wishlist-updated"));
      } catch {}
      return updated;
    });
  };

  const handleAddToCart = (product: WishlistItem) => {
    addItem({
      id: product.id,
      productId: product.id,
      title: product.title,
      priceFils: product.priceFils,
      image: product.image,
      maxStock: product.stock_quantity || 10,
      slug: product.slug,
    });
    setIsCartOpen(true);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          href="/account"
          className="text-xs text-muted-foreground hover:text-cyan-400 flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account Overview</span>
        </Link>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
          My Saved Wishlist ({wishlistItems.length})
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Electronics you saved to purchase later with live UAE stock tracking
        </p>
      </div>

      {!loaded ? (
        <div className="py-20 text-center text-xs text-muted-foreground">
          Loading wishlist...
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-4">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="font-heading text-lg font-bold">Your wishlist is empty</h2>
          <p className="text-xs text-muted-foreground">
            Explore the flagship catalogue and tap the heart icon on any device to save it here.
          </p>
          <Link
            href="/catalogue"
            className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-semibold hover:opacity-95 transition-opacity"
          >
            Explore Catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 flex flex-col justify-between shadow-sm hover:border-cyan-500/40 transition-colors"
            >
              <div className="relative aspect-square w-full rounded-xl bg-muted/40 p-4 overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain"
                    sizes="250px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ShoppingBag className="w-8 h-8 opacity-40" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                {product.brand_name && (
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">
                    {product.brand_name}
                  </span>
                )}
                <Link
                  href={`/product/${product.slug}`}
                  className="block font-medium text-xs text-foreground hover:text-cyan-400 line-clamp-2"
                >
                  {product.title}
                </Link>
                <p className="font-heading font-black text-base text-foreground pt-1">
                  {formatAED(product.priceFils)}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="p-2 rounded-xl border border-border/80 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                  title="Remove from wishlist"
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
