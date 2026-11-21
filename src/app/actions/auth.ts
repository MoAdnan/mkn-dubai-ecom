"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  PRESET_USERS,
  findUserByEmail,
  AUTH_COOKIE_NAME,
  type AuthUser,
  type UserRole,
} from "@/lib/services/auth-service";

export async function getCurrentUserAction(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const user: AuthUser = JSON.parse(sessionCookie.value);
    return user;
  } catch {
    return null;
  }
}

export async function loginAction(
  email: string,
  password?: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please provide a valid email address." };
  }

  const user = findUserByEmail(email);

  if (!user) {
    return { success: false, error: "Invalid credentials." };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(user), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  revalidatePath("/admin");
  revalidatePath("/account");
  revalidatePath("/");

  return { success: true, user };
}

export async function fastLoginAction(
  role: UserRole
): Promise<{ success: boolean; user: AuthUser }> {
  const user = PRESET_USERS[role] || PRESET_USERS.customer;

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(user), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  revalidatePath("/admin");
  revalidatePath("/account");
  revalidatePath("/");

  return { success: true, user };
}

export async function socialLoginAction(
  provider: "google" | "apple",
  payload?: { email?: string; name?: string }
): Promise<{ success: boolean; user: AuthUser }> {
  const email = payload?.email || (provider === "google" ? "customer.google@mkn-dubai.ae" : "customer.apple@mkn-dubai.ae");
  const name = payload?.name || (provider === "google" ? "Adnan (Google User)" : "Adnan (Apple ID User)");

  const user: AuthUser = {
    id: `usr-${provider}-${Date.now()}`,
    name,
    email,
    phone: "+971 50 882 1928",
    role: "customer",
    emirate: "Dubai",
  };

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(user), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  revalidatePath("/admin");
  revalidatePath("/account");
  revalidatePath("/");

  return { success: true, user };
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);

  revalidatePath("/admin");
  revalidatePath("/account");
  revalidatePath("/account/login");
  revalidatePath("/");
}

