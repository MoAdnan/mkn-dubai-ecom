"use server";

import { revalidatePath } from "next/cache";
import {
  getStoredProducts,
  saveStoredProduct,
  deleteStoredProduct,
} from "@/lib/services/persistent-store";
import type { DemoProduct } from "@/lib/products-data";

export async function getAdminProductsAction(): Promise<DemoProduct[]> {
  return getStoredProducts();
}

export async function saveProductAction(product: DemoProduct): Promise<DemoProduct[]> {
  const updated = saveStoredProduct(product);
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/catalogue");
  revalidatePath("/");
  return updated;
}

export async function deleteProductAction(id: string): Promise<DemoProduct[]> {
  const updated = deleteStoredProduct(id);
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/catalogue");
  revalidatePath("/");
  return updated;
}

