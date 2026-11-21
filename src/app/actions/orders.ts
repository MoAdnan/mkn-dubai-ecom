"use server";

import { revalidatePath } from "next/cache";
import {
  getStoredOrders,
  updateStoredOrderStatus,
  getStoredInvoices,
  type StoredOrder,
  type StoredInvoice,
} from "@/lib/services/persistent-store";

export async function getAdminOrdersAction(): Promise<StoredOrder[]> {
  return getStoredOrders();
}

export async function updateOrderStatusAction(
  orderId: string,
  status: StoredOrder["orderStatus"],
  trackingNumber?: string
): Promise<StoredOrder[]> {
  const updated = updateStoredOrderStatus(orderId, status, trackingNumber);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/account/orders");
  return updated;
}

export async function getAdminInvoicesAction(): Promise<StoredInvoice[]> {
  return getStoredInvoices();
}

export async function getCustomerOrdersAction(email?: string): Promise<StoredOrder[]> {
  const all = getStoredOrders();
  if (!email) return all;
  const filtered = all.filter((o) => o.email.toLowerCase() === email.toLowerCase());
  return filtered.length > 0 ? filtered : all;
}

