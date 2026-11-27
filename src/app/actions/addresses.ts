"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUserAction } from "@/app/actions/auth";
import { createAdminClient } from "@/lib/supabase/server";

export interface UserAddress {
  id: string;
  recipientName: string;
  phone: string;
  emirate: string;
  area: string;
  streetAddress: string;
  buildingName?: string;
  apartmentNumber?: string;
  landmark?: string;
  isDefault: boolean;
  createdAt?: string;
}

// In-memory fallback if Supabase table is unreachable
let localAddresses: Record<string, UserAddress[]> = {};

export async function getUserAddressesAction(): Promise<UserAddress[]> {
  const user = await getCurrentUserAction();
  if (!user) return [];

  try {
    const supabase = createAdminClient();
    const { data, error } = await (supabase.from("addresses") as any)
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((a: any) => ({
        id: a.id,
        recipientName: a.recipient_name,
        phone: a.phone,
        emirate: a.emirate,
        area: a.area,
        streetAddress: a.street_address,
        buildingName: a.building_name || undefined,
        apartmentNumber: a.apartment_number || undefined,
        landmark: a.landmark || undefined,
        isDefault: Boolean(a.is_default),
        createdAt: a.created_at,
      }));
    }
  } catch (err) {
    console.warn("Supabase addresses fetch note:", err);
  }

  return localAddresses[user.id] || [];
}

export async function saveUserAddressAction(
  address: Omit<UserAddress, "id"> & { id?: string }
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUserAction();
  if (!user) {
    return { success: false, error: "Authentication required." };
  }

  const addrId = address.id || `addr-${Date.now()}`;

  try {
    const supabase = createAdminClient();

    // If this address is set as default, remove default from others
    if (address.isDefault) {
      await (supabase.from("addresses") as any)
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    await (supabase.from("addresses") as any).upsert({
      id: addrId,
      user_id: user.id,
      recipient_name: address.recipientName,
      phone: address.phone,
      emirate: address.emirate,
      area: address.area,
      street_address: address.streetAddress,
      building_name: address.buildingName || null,
      apartment_number: address.apartmentNumber || null,
      landmark: address.landmark || null,
      is_default: address.isDefault,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Supabase address save note:", err);
  }

  // Also update local fallback cache
  const list = localAddresses[user.id] || [];
  if (address.isDefault) {
    list.forEach((a) => (a.isDefault = false));
  }
  const existingIndex = list.findIndex((a) => a.id === addrId);
  const newAddr: UserAddress = {
    ...address,
    id: addrId,
  };
  if (existingIndex >= 0) {
    list[existingIndex] = newAddr;
  } else {
    list.unshift(newAddr);
  }
  localAddresses[user.id] = list;

  revalidatePath("/account/addresses");
  revalidatePath("/account");
  return { success: true };
}

export async function deleteUserAddressAction(
  addressId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUserAction();
  if (!user) return { success: false, error: "Authentication required." };

  try {
    const supabase = createAdminClient();
    await (supabase.from("addresses") as any)
      .delete()
      .eq("id", addressId)
      .eq("user_id", user.id);
  } catch {}

  if (localAddresses[user.id]) {
    localAddresses[user.id] = localAddresses[user.id].filter((a) => a.id !== addressId);
  }

  revalidatePath("/account/addresses");
  return { success: true };
}

