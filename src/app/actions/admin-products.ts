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
    const { data: upserted, error: prodErr } = await (supabase.from("products") as any)
      .upsert(
        {
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
        },
        { onConflict: "sku" }
      )
      .select("id")
      .single();

    if (prodErr) {
      console.warn("Supabase product upsert note:", prodErr);
    }

    const prodId = upserted?.id;
    if (prodId && product.images && product.images.length > 0) {
      // Clean previous images for this product
      await supabase.from("product_images").delete().eq("product_id", prodId);

      // Insert new images with URLs
      const rows = product.images
        .filter((img) => img.url && img.url.trim())
        .map((img, idx) => ({
          product_id: prodId,
          image_url: img.url.trim(),
          alt_text: img.alt || product.title,
          is_primary: idx === 0,
          display_order: idx,
        }));

      if (rows.length > 0) {
        const { error: imgErr } = await (supabase.from("product_images") as any).insert(rows);
        if (imgErr) {
          console.warn("Supabase product_images insert note:", imgErr);
        }
      }
    }
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

/**
 * Uploads a product image directly to Supabase Storage ('products' bucket)
 * and returns the permanent CDN public URL.
 */
export async function uploadProductImageAction(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No image file provided" };
    }

    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Only image files (JPEG, PNG, WebP, GIF, AVIF) are allowed",
      };
    }

    // Limit to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { success: false, error: "Image size exceeds 10MB limit" };
    }

    const supabase = createAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const cleanFileName = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const storagePath = `catalog/${cleanFileName}`;

    const { error } = await supabase.storage.from("products").upload(storagePath, buffer, {
      contentType: file.type,
      upsert: true,
    });

    if (error) {
      console.error("Supabase Storage upload error:", error);
      return { success: false, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(storagePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (err: any) {
    console.error("Upload server action error:", err);
    return {
      success: false,
      error: err?.message || "Failed to upload image to Supabase Storage",
    };
  }
}
