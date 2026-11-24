"use server";

import { revalidatePath } from "next/cache";
import {
  getStoredProducts,
  saveStoredProduct,
  deleteStoredProduct,
} from "@/lib/services/persistent-store";
import { getProducts } from "@/lib/services/products";
import { createAdminClient } from "@/lib/supabase/server";
import type { DemoProduct } from "@/lib/products-data";

export async function getAdminProductsAction(): Promise<DemoProduct[]> {
  try {
    const products = await getProducts();
    if (products.length > 0) return products;
    return getStoredProducts();
  } catch {
    return getStoredProducts();
  }
}

export async function saveProductAction(product: DemoProduct): Promise<DemoProduct[]> {
  // 1. Sync to Supabase cloud
  try {
    const supabase = createAdminClient();
    await (supabase.from("products") as any).upsert({
      title: product.title,
      slug: product.slug,
      sku: product.sku,
      base_price_fils: product.base_price_fils,
      sale_price_fils: product.sale_price_fils || null,
      stock_quantity: product.stock_quantity,
      short_description: product.short_description || "",
      description: product.description || "",
      is_published: true,
      warranty_type: product.warranty_type || "Official UAE Distributor Warranty",
      warranty_months: product.warranty_months || 12,
    });
  } catch (err) {
    console.warn("Supabase product upsert note:", err);
  }

  // 2. Also keep local store in sync
  const updated = saveStoredProduct(product);

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/catalogue");
  revalidatePath("/");
  return updated;
}

export async function deleteProductAction(id: string): Promise<DemoProduct[]> {
  // 1. Delete from Supabase
  try {
    const supabase = createAdminClient();
    await supabase.from("products").delete().eq("id", id);
    await supabase.from("products").delete().eq("sku", id);
  } catch (err) {
    console.warn("Supabase product delete note:", err);
  }

  // 2. Delete from local store
  const updated = deleteStoredProduct(id);

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/catalogue");
  revalidatePath("/");
  return updated;
}
