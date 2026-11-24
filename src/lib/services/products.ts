import { createClient } from "@/lib/supabase/client";
import { getStoredProducts } from "@/lib/services/persistent-store";
import type { DemoProduct } from "@/lib/products-data";

export interface GetProductsParams {
  category?: string;
  brand?: string;
  minPriceFils?: number;
  maxPriceFils?: number;
  search?: string;
  sort?: "featured" | "price_asc" | "price_desc" | "rating" | "newest";
  dealsOnly?: boolean;
}

export async function getProducts(params: GetProductsParams = {}): Promise<DemoProduct[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("products")
      .select(`
        *,
        categories (id, name, slug),
        brands (id, name, slug),
        product_images (image_url, alt_text, is_primary),
        product_variants (id, title, sku, price_fils, sale_price_fils, stock_quantity, color, storage)
      `)
      .eq("is_published", true);

    if (params.dealsOnly) {
      query = query.eq("is_deal", true);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Supabase products query error:", error.message);
      // Check local store as fallback
      const stored = getStoredProducts();
      return filterDemoProducts(stored, params);
    }

    if (!data || data.length === 0) {
      const stored = getStoredProducts();
      return filterDemoProducts(stored, params);
    }

    // Map Supabase rows to uniform DemoProduct interface
    const mapped: DemoProduct[] = data.map((p: any) => ({
      id: p.id,
      category_id: p.category_id,
      category_name: p.categories?.name || "General",
      category_slug: p.categories?.slug || "general",
      brand_id: p.brand_id,
      brand_name: p.brands?.name || "Generic",
      brand_slug: p.brands?.slug || "generic",
      title: p.title,
      slug: p.slug,
      short_description: p.short_description || "",
      description: p.description || "",
      sku: p.sku,
      base_price_fils: p.base_price_fils,
      sale_price_fils: p.sale_price_fils,
      stock_quantity: p.stock_quantity,
      rating: Number(p.rating) || 5.0,
      reviews_count: p.reviews_count || 0,
      is_featured: p.is_featured,
      is_deal: p.is_deal,
      warranty_months: p.warranty_months,
      warranty_type: p.warranty_type,
      images: (p.product_images || []).map((img: any) => ({
        url: img.image_url,
        alt: img.alt_text || p.title,
        is_primary: img.is_primary,
      })),
      variants: (p.product_variants || []).map((v: any) => ({
        id: v.id,
        title: v.title,
        sku: v.sku,
        price_fils: v.price_fils,
        sale_price_fils: v.sale_price_fils,
        stock: v.stock_quantity,
        color: v.color,
        storage: v.storage,
      })),
      specs: p.specs || {},
    }));

    return filterDemoProducts(mapped, params);
  } catch (err) {
    console.error("Products service error:", err);
    const stored = getStoredProducts();
    return filterDemoProducts(stored, params);
  }
}

export async function getProductBySlug(slug: string): Promise<DemoProduct | null> {
  const all = await getProducts();
  const found = all.find((p) => p.slug === slug);
  return found || null;
}

export async function getFeaturedProducts(): Promise<DemoProduct[]> {
  const all = await getProducts();
  return all.filter((p) => p.is_featured);
}

export async function getDealProducts(): Promise<DemoProduct[]> {
  const all = await getProducts();
  return all.filter((p) => p.is_deal);
}

function filterDemoProducts(products: DemoProduct[], params: GetProductsParams): DemoProduct[] {
  let list = [...products];

  if (params.category && params.category !== "all") {
    list = list.filter((p) => p.category_slug.toLowerCase() === params.category!.toLowerCase());
  }

  if (params.brand && params.brand !== "all") {
    list = list.filter((p) => p.brand_slug.toLowerCase() === params.brand!.toLowerCase());
  }

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand_name.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q)
    );
  }

  if (params.minPriceFils !== undefined) {
    list = list.filter((p) => (p.sale_price_fils || p.base_price_fils) >= params.minPriceFils!);
  }

  if (params.maxPriceFils !== undefined) {
    list = list.filter((p) => (p.sale_price_fils || p.base_price_fils) <= params.maxPriceFils!);
  }

  if (params.dealsOnly) {
    list = list.filter((p) => p.is_deal);
  }

  // Sorting
  switch (params.sort) {
    case "price_asc":
      list.sort((a, b) => (a.sale_price_fils || a.base_price_fils) - (b.sale_price_fils || b.base_price_fils));
      break;
    case "price_desc":
      list.sort((a, b) => (b.sale_price_fils || b.base_price_fils) - (a.sale_price_fils || a.base_price_fils));
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      break;
    case "featured":
    default:
      list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
      break;
  }

  return list;
}
