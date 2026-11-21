"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  SlidersHorizontal,
  Grid,
  List,
  Search,
  Star,
  ShoppingBag,
  Check,
  X,
  Filter,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { formatAED, aedToFils, filsToAED } from "@/lib/utils";
import type { DemoProduct } from "@/lib/products-data";

interface CatalogueViewProps {
  initialProducts: DemoProduct[];
  categories: { id: string; name: string; slug: string }[];
  brands: { id: string; name: string; slug: string }[];
}

export function CatalogueView({
  initialProducts,
  categories,
  brands,
}: CatalogueViewProps) {
  const searchParams = useSearchParams();
  const { addItem } = useCart();

  const urlCategory = searchParams.get("category") || "all";
  const urlBrand = searchParams.get("brand") || "all";
  const urlQuery = searchParams.get("q") || "";
  const urlDeals = searchParams.get("deals") === "true";

  const [selectedCategory, setSelectedCategory] = React.useState(urlCategory);
  const [selectedBrand, setSelectedBrand] = React.useState(urlBrand);
  const [searchQuery, setSearchQuery] = React.useState(urlQuery);
  const [dealsOnly, setDealsOnly] = React.useState(urlDeals);
  const [minPriceAED, setMinPriceAED] = React.useState<number>(0);
  const [maxPriceAED, setMaxPriceAED] = React.useState<number>(15000);
  const [minRating, setMinRating] = React.useState<number>(0);
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<string>("featured");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});

  // Synchronize state when URL params change
  React.useEffect(() => {
    if (searchParams.get("category")) setSelectedCategory(searchParams.get("category")!);
    if (searchParams.get("brand")) setSelectedBrand(searchParams.get("brand")!);
    if (searchParams.get("q")) setSearchQuery(searchParams.get("q")!);
    if (searchParams.get("deals")) setDealsOnly(searchParams.get("deals") === "true");
  }, [searchParams]);

  // Filtering & Sorting
  const filteredProducts = React.useMemo(() => {
    let list = [...initialProducts];

    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter((p) => p.category_slug.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedBrand && selectedBrand !== "all") {
      list = list.filter((p) => p.brand_slug.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (dealsOnly) {
      list = list.filter((p) => p.is_deal);
    }

    if (inStockOnly) {
      list = list.filter((p) => p.stock_quantity > 0);
    }

    if (minRating > 0) {
      list = list.filter((p) => p.rating >= minRating);
    }

    const minFils = aedToFils(minPriceAED);
    const maxFils = aedToFils(maxPriceAED);
    list = list.filter((p) => {
      const price = p.sale_price_fils || p.base_price_fils;
      return price >= minFils && price <= maxFils;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand_name.toLowerCase().includes(q) ||
          p.category_name.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price_asc":
        list.sort((a, b) => (a.sale_price_fils || a.base_price_fils) - (b.sale_price_fils || b.base_price_fils));
        break;
      case "price_desc":
        list.sort((a, b) => (b.sale_price_fils || b.base_price_fils) - (a.sale_price_fils || a.base_price_fils));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }

    return list;
  }, [
    initialProducts,
    selectedCategory,
    selectedBrand,
    dealsOnly,
    inStockOnly,
    minRating,
    minPriceAED,
    maxPriceAED,
    searchQuery,
    sortBy,
  ]);

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

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSearchQuery("");
    setDealsOnly(false);
    setMinPriceAED(0);
    setMaxPriceAED(15000);
    setMinRating(0);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    dealsOnly ||
    searchQuery.trim() !== "" ||
    minRating > 0 ||
    inStockOnly ||
    minPriceAED > 0 ||
    maxPriceAED < 15000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-6">
        <nav className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Catalogue</span>
          {selectedCategory !== "all" && (
            <>
              <span>/</span>
              <span className="text-cyan-400 capitalize">{selectedCategory}</span>
            </>
          )}
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
              Electronics Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Showing {filteredProducts.length} premium devices with official UAE warranty
            </p>
          </div>

          {/* Mobile Filter Toggle & View Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border/80 text-xs font-semibold"
            >
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filters ({hasActiveFilters ? "Active" : "All"})</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-card border border-border/70 rounded-xl p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-muted text-cyan-400" : "text-muted-foreground"
                }`}
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-muted text-cyan-400" : "text-muted-foreground"
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-card border border-border/80 text-xs font-medium py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-cyan-500"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-muted/30 border border-border/40 text-xs">
          <span className="text-muted-foreground font-medium">Active filters:</span>
          {selectedCategory !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory("all")}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedBrand !== "all" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
              Brand: {selectedBrand}
              <button onClick={() => setSelectedBrand("all")}><X className="w-3 h-3" /></button>
            </span>
          )}
          {dealsOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Deals Only
              <button onClick={() => setDealsOnly(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              In Stock Only
              <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-destructive underline ml-auto"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-card border border-border/70 rounded-2xl p-5 space-y-6">
            {/* Search within results */}
            <div>
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground mb-2.5">
                Search
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-muted/40 border border-border/80 rounded-xl focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground mb-2.5">
                Category
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-cyan-500/15 text-cyan-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat.slug
                        ? "bg-cyan-500/15 text-cyan-400 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground mb-2.5">
                Brand
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedBrand("all")}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedBrand === "all"
                      ? "bg-cyan-500/15 text-cyan-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  All Brands
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedBrand === b.slug
                        ? "bg-cyan-500/15 text-cyan-400 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range in AED */}
            <div>
              <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground mb-2.5">
                Price (AED)
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-muted-foreground">Min AED</label>
                  <input
                    type="number"
                    value={minPriceAED}
                    onChange={(e) => setMinPriceAED(Number(e.target.value) || 0)}
                    className="w-full p-2 bg-muted/40 border border-border/80 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground">Max AED</label>
                  <input
                    type="number"
                    value={maxPriceAED}
                    onChange={(e) => setMaxPriceAED(Number(e.target.value) || 15000)}
                    className="w-full p-2 bg-muted/40 border border-border/80 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dealsOnly}
                  onChange={(e) => setDealsOnly(e.target.checked)}
                  className="rounded border-border text-cyan-500 focus:ring-cyan-500/20"
                />
                <span className="text-foreground">Dubai Deals Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-border text-cyan-500 focus:ring-cyan-500/20"
                />
                <span className="text-foreground">In Stock in Dubai</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Cards Container */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold">No electronics found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No products match the selected filters or search keyword. Try clearing some filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isAdded = !!addedIds[product.id];
                const isOutOfStock = product.stock_quantity <= 0;
                return (
                  <div
                    key={product.id}
                    className="group rounded-2xl bg-card border border-border/70 hover:border-cyan-500/40 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/5 flex flex-col justify-between"
                  >
                    <div className="relative w-full aspect-square rounded-xl bg-muted/30 overflow-hidden mb-4 p-4 flex items-center justify-center">
                      <Image
                        src={product.images[0]?.url || "/placeholder.png"}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={`object-contain group-hover:scale-105 transition-transform duration-300 ${
                          isOutOfStock ? "grayscale opacity-50" : ""
                        }`}
                      />
                      {isOutOfStock ? (
                        <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-rose-500/90 text-white text-[10px] font-bold shadow-md">
                          Out of Stock
                        </div>
                      ) : product.is_deal ? (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-cyan-500 text-black text-[10px] font-bold">
                          Deal
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-cyan-400 uppercase tracking-wider text-[10px]">
                            {product.brand_name}
                          </span>
                          <div className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{product.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <Link
                          href={`/product/${product.slug}`}
                          className="font-medium text-sm text-foreground hover:text-cyan-400 transition-colors line-clamp-2"
                        >
                          {product.title}
                        </Link>
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

                        <button
                          type="button"
                          onClick={() => !isOutOfStock && handleAddToCart(product)}
                          disabled={isOutOfStock}
                          className={`mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-semibold text-xs transition-all duration-200 ${
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
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const isAdded = !!addedIds[product.id];
                const isOutOfStock = product.stock_quantity <= 0;
                return (
                  <div
                    key={product.id}
                    className="group rounded-2xl bg-card border border-border/70 hover:border-cyan-500/40 p-4 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-center"
                  >
                    <div className="relative w-36 h-36 rounded-xl bg-muted/30 overflow-hidden flex-shrink-0 p-3">
                      <Image
                        src={product.images[0]?.url || "/placeholder.png"}
                        alt={product.title}
                        fill
                        sizes="144px"
                        className={`object-contain group-hover:scale-105 transition-transform duration-300 ${
                          isOutOfStock ? "grayscale opacity-50" : ""
                        }`}
                      />
                      {isOutOfStock && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5 text-center sm:text-left">
                      <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                        {product.brand_name} • {product.category_name}
                      </span>
                      <Link
                        href={`/product/${product.slug}`}
                        className="block font-medium text-base text-foreground hover:text-cyan-400 transition-colors"
                      >
                        {product.title}
                      </Link>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground pt-1">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{product.rating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({product.reviews_count} reviews)</span>
                        </span>
                        <span>•</span>
                        {isOutOfStock ? (
                          <span className="text-rose-400 font-semibold">Out of Stock</span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>In Stock ({product.stock_quantity})</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex flex-col justify-between sm:w-44 border-t sm:border-t-0 sm:border-l border-border/40 pt-3 sm:pt-0 sm:pl-5">
                      <div>
                        <div className="font-heading font-black text-xl text-foreground">
                          {formatAED(product.sale_price_fils || product.base_price_fils)}
                        </div>
                        {product.sale_price_fils && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatAED(product.base_price_fils)}
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground">Incl. 5% UAE VAT</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => !isOutOfStock && handleAddToCart(product)}
                        disabled={isOutOfStock}
                        className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-semibold text-xs transition-all duration-200 ${
                          isOutOfStock
                            ? "bg-muted text-muted-foreground border border-border/70 cursor-not-allowed"
                            : isAdded
                            ? "bg-emerald-500 text-black"
                            : "bg-primary text-primary-foreground hover:bg-cyan-500 hover:text-black"
                        }`}
                      >
                        {isOutOfStock ? "Out of Stock" : isAdded ? "Added" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

