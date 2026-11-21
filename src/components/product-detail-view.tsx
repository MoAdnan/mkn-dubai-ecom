"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Share2,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  Info,
  Clock,
  Box,
  Layers,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatAED } from "@/lib/utils";
import type { DemoProduct } from "@/lib/products-data";

interface ProductDetailViewProps {
  product: DemoProduct;
  relatedProducts: DemoProduct[];
}

export function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [selectedVariantId, setSelectedVariantId] = React.useState<string>(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = React.useState(1);
  const [isAdded, setIsAdded] = React.useState(false);
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [show360, setShow360] = React.useState(false);
  const [rotationAngle, setRotationAngle] = React.useState(0);
  const [showStickyBar, setShowStickyBar] = React.useState(false);

  // Selected variant details
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const effectiveStock = selectedVariant
    ? (selectedVariant.stock ?? product.stock_quantity)
    : product.stock_quantity;
  const isOutOfStock = effectiveStock <= 0;

  const activePriceFils =
    selectedVariant?.sale_price_fils ||
    selectedVariant?.price_fils ||
    product.sale_price_fils ||
    product.base_price_fils;

  const originalPriceFils =
    selectedVariant?.price_fils || product.base_price_fils;
  const savingsFils = originalPriceFils > activePriceFils ? originalPriceFils - activePriceFils : 0;

  // Track scroll for sticky bottom bar
  React.useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    addItem(
      {
        id: selectedVariant ? selectedVariant.id : product.id,
        productId: product.id,
        variantId: selectedVariant?.id,
        title: product.title,
        variantName: selectedVariant?.title,
        priceFils: activePriceFils,
        image: product.images[selectedImageIndex]?.url || product.images[0]?.url || "",
        maxStock: selectedVariant?.stock || product.stock_quantity,
        slug: product.slug,
      },
      quantity
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="text-xs text-muted-foreground flex items-center gap-1.5 mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/catalogue" className="hover:text-foreground">Catalogue</Link>
        <span>/</span>
        <Link
          href={`/catalogue?category=${product.category_slug}`}
          className="hover:text-foreground capitalize"
        >
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium line-clamp-1">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Gallery & 360 Viewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-card border border-border/80 p-8 flex items-center justify-center overflow-hidden">
            {product.is_deal && (
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-cyan-500 text-black text-xs font-bold">
                UAE Special Deal
              </div>
            )}

            <button
              onClick={() => setShow360(!show360)}
              className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/80 text-xs font-medium hover:border-cyan-500 transition-colors"
            >
              <Box className="w-3.5 h-3.5 text-cyan-400" />
              <span>{show360 ? "Exit 360°" : "360° Interactive View"}</span>
            </button>

            {show360 ? (
              <div className="w-full h-full flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing">
                <div
                  className="relative w-72 h-72 transition-transform duration-75"
                  style={{ transform: `rotateY(${rotationAngle}deg)` }}
                  onMouseMove={(e) => {
                    if (e.buttons === 1) {
                      setRotationAngle((prev) => prev + e.movementX * 1.5);
                    }
                  }}
                  onTouchMove={(e) => {
                    const touch = e.touches[0];
                    setRotationAngle((prev) => prev + 2);
                  }}
                >
                  <Image
                    src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
                    alt={product.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-4 animate-pulse">
                  ⇄ Drag horizontally to rotate 360°
                </p>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={product.images[selectedImageIndex]?.url || product.images[0]?.url}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setShow360(false);
                  }}
                  className={`relative w-20 h-20 rounded-2xl bg-card border overflow-hidden p-2 flex-shrink-0 transition-all ${
                    selectedImageIndex === idx && !show360
                      ? "border-cyan-500 ring-2 ring-cyan-500/20"
                      : "border-border/60 hover:border-border"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${product.title} photo ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Warranty & Guarantee Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-card border border-border/70 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-semibold text-foreground">Official UAE Warranty</h4>
                <p className="text-muted-foreground">{product.warranty_months} Months TDRA coverage</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/70 flex items-start gap-3">
              <Truck className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-semibold text-foreground">Dubai Express Delivery</h4>
                <p className="text-muted-foreground">Same-day across Dubai & Sharjah</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/70 flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <h4 className="font-semibold text-foreground">7-Day Easy Returns</h4>
                <p className="text-muted-foreground">Unopened items eligible</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Variants, Pricing, Add to Cart */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                {product.brand_name}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">
                SKU: {selectedVariant?.sku || product.sku}
              </span>
            </div>

            <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground leading-tight">
              {product.title}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mt-3 text-xs">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating.toFixed(2)}</span>
              </div>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-muted-foreground">{product.reviews_count} customer reviews</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-emerald-400 font-medium">100% Genuine</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-card to-muted/20 border border-border/80 space-y-1.5">
            <div className="flex items-baseline gap-3">
              <span className="font-heading font-black text-3xl text-foreground">
                {formatAED(activePriceFils)}
              </span>
              {savingsFils > 0 && (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatAED(originalPriceFils)}
                  </span>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Save {formatAED(savingsFils)}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Price includes 5% UAE VAT. Sequential Tax Invoice provided automatically.
            </p>
          </div>

          {/* Variants Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Select Configuration / Storage
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedVariantId === variant.id
                        ? "border-cyan-500 bg-cyan-500/10 text-foreground ring-1 ring-cyan-500/30"
                        : "border-border/70 bg-card hover:border-border text-muted-foreground"
                    }`}
                  >
                    <div className="font-semibold text-xs text-foreground">{variant.title}</div>
                    <div className="text-xs font-mono mt-1 text-cyan-400 font-medium">
                      {formatAED(variant.sale_price_fils || variant.price_fils)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability */}
          {isOutOfStock ? (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 flex-shrink-0" />
              <span>
                <strong>Out of Stock</strong> at Dubai Central Fulfillment Warehouse. Restocking expected shortly.
              </span>
            </div>
          ) : effectiveStock <= 5 ? (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
              <span>
                <strong>Low Stock Alert:</strong> Only <strong>{effectiveStock}</strong> units remaining in stock. Order within <strong>2 hours</strong> for Same-Day Delivery.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>
                <strong>In Stock ({effectiveStock} available)</strong> at Dubai Central Fulfillment Warehouse. Order within{" "}
                <strong>2 hours</strong> for Same-Day Delivery.
              </span>
            </div>
          )}

          {/* Quantity & Add to Cart Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center border border-border/80 rounded-xl bg-card px-2 py-1.5 ${
                  isOutOfStock ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock || quantity <= 1}
                  className="px-2 text-muted-foreground hover:text-foreground font-bold disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 text-sm font-bold font-mono">
                  {isOutOfStock ? 0 : quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(effectiveStock, quantity + 1))}
                  disabled={isOutOfStock || quantity >= effectiveStock}
                  className="px-2 text-muted-foreground hover:text-foreground font-bold disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-xl transition-all duration-200 ${
                  isOutOfStock
                    ? "bg-muted text-muted-foreground border border-border/80 cursor-not-allowed shadow-none"
                    : isAdded
                    ? "bg-emerald-500 text-black shadow-emerald-500/20"
                    : "bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-cyan-500/20 hover:scale-[1.01]"
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

              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3.5 rounded-2xl border transition-colors ${
                  isWishlisted
                    ? "border-rose-500 text-rose-500 bg-rose-500/10"
                    : "border-border/80 bg-card hover:bg-muted text-muted-foreground"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500" : ""}`} />
              </button>
            </div>

            {!isOutOfStock ? (
              <Link
                href="/checkout"
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center py-3 px-6 rounded-2xl bg-card border border-border/80 hover:bg-accent/40 font-semibold text-sm transition-colors"
              >
                Express Checkout (1-Click)
              </Link>
            ) : (
              <div className="w-full py-2.5 px-6 rounded-2xl bg-muted/40 border border-border/60 text-center text-xs text-muted-foreground font-medium">
                Currently Sold Out — Restocking Soon
              </div>
            )}
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-border/40 space-y-2">
            <h3 className="font-heading font-bold text-sm text-foreground">Overview</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="mt-16 border-t border-border/40 pt-10">
        <h2 className="font-heading text-xl sm:text-2xl font-black text-foreground mb-6">
          Technical Specifications
        </h2>
        <div className="rounded-2xl border border-border/70 overflow-hidden bg-card">
          <table className="w-full text-xs sm:text-sm">
            <tbody className="divide-y divide-border/40">
              {Object.entries(product.specs).map(([key, value], idx) => (
                <tr key={key} className={idx % 2 === 0 ? "bg-muted/15" : "bg-card"}>
                  <td className="py-3 px-5 font-semibold text-foreground w-1/3 sm:w-1/4">
                    {key}
                  </td>
                  <td className="py-3 px-5 text-muted-foreground">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-border/40 pt-10">
          <h2 className="font-heading text-xl sm:text-2xl font-black text-foreground mb-6">
            Recommended With This Device
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <Link
                key={rel.id}
                href={`/product/${rel.slug}`}
                className="group rounded-2xl bg-card border border-border/70 hover:border-cyan-500/40 p-4 transition-all"
              >
                <div className="relative aspect-square w-full rounded-xl bg-muted/30 overflow-hidden mb-3 p-3">
                  <Image
                    src={rel.images[0]?.url || "/placeholder.png"}
                    alt={rel.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <span className="text-[10px] font-semibold text-cyan-400 uppercase">
                  {rel.brand_name}
                </span>
                <h4 className="font-medium text-xs text-foreground line-clamp-1 mt-0.5">
                  {rel.title}
                </h4>
                <p className="font-bold text-sm text-foreground mt-2">
                  {formatAED(rel.sale_price_fils || rel.base_price_fils)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar on Scroll */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-card/90 backdrop-blur-lg border-t border-border/80 px-4 py-3 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg bg-muted/40 overflow-hidden hidden sm:block">
              <Image
                src={product.images[0]?.url || ""}
                alt={product.title}
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1">
                {product.title}
              </h4>
              <p className="text-xs font-mono text-cyan-400 font-bold">
                {formatAED(activePriceFils)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs shadow-lg transition-all ${
              isOutOfStock
                ? "bg-muted text-muted-foreground cursor-not-allowed border border-border/80"
                : "bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-cyan-500/20"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

