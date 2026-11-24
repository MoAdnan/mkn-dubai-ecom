"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserAction } from "@/app/actions/auth";
import {
  getStoredOrders,
  getStoredOrderByNumber,
  updateStoredOrderStatus,
  getStoredInvoices,
  type StoredOrder,
  type StoredInvoice,
} from "@/lib/services/persistent-store";

export async function getAdminOrdersAction(): Promise<StoredOrder[]> {
  return getStoredOrders();
}

export async function getOrderByNumberAction(
  orderNumber: string
): Promise<StoredOrder | null> {
  const order = getStoredOrderByNumber(orderNumber);
  return order || null;
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
  let targetEmail = email;
  if (!targetEmail) {
    const user = await getCurrentUserAction();
    if (!user) return [];
    if (user.role === "admin" || user.role === "staff") {
      return getStoredOrders();
    }
    targetEmail = user.email;
  }

  const all = getStoredOrders();
  const filtered = all.filter((o) => o.email.toLowerCase() === targetEmail.toLowerCase());
  return filtered;
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  emirate: string;
  ordersCount: number;
  totalSpentFils: number;
  isB2B: boolean;
  trn: string | null;
  isBlocked: boolean;
  lastOrderDate?: string;
}

export async function getAdminCustomersAction(): Promise<CustomerSummary[]> {
  const orders = getStoredOrders();
  const customerMap = new Map<string, CustomerSummary>();

  // Baseline verified registered user
  customerMap.set("adnan@example.ae", {
    id: "cust-adnan",
    name: "Adnan Al-Hashimi",
    email: "adnan@example.ae",
    phone: "+971 50 123 4567",
    emirate: "Dubai",
    ordersCount: 0,
    totalSpentFils: 0,
    isB2B: true,
    trn: "100482918200003",
    isBlocked: false,
  });

  customerMap.set("sarah@example.ae", {
    id: "cust-sarah",
    name: "Sarah Al-Mansoori",
    email: "sarah@example.ae",
    phone: "+971 52 987 6543",
    emirate: "Abu Dhabi",
    ordersCount: 0,
    totalSpentFils: 0,
    isB2B: false,
    trn: null,
    isBlocked: false,
  });

  // Aggregate dynamically from real orders in persistent store
  for (const order of orders) {
    const key = order.email.toLowerCase().trim();
    const existing = customerMap.get(key);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpentFils += order.totalFils;
      existing.lastOrderDate = order.date;
      if (order.customerTRN) {
        existing.isB2B = true;
        existing.trn = order.customerTRN;
      }
    } else {
      customerMap.set(key, {
        id: `cust-${order.id}`,
        name: order.customer,
        email: order.email,
        phone: order.phone,
        emirate: order.emirate,
        ordersCount: 1,
        totalSpentFils: order.totalFils,
        isB2B: Boolean(order.isB2B || order.customerTRN),
        trn: order.customerTRN || null,
        isBlocked: false,
        lastOrderDate: order.date,
      });
    }
  }

  return Array.from(customerMap.values());
}

