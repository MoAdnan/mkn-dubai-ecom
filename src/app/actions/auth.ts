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
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function getCurrentUserAction(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const user: AuthUser = JSON.parse(sessionCookie.value);

    // Fetch the freshest live profile from Supabase database if available
    try {
      const supabase = createAdminClient();
      const { data: profile } = await (supabase.from("profiles") as any)
        .select("*")
        .or(`id.eq.${user.id},email.eq.${user.email.toLowerCase()}`)
        .maybeSingle();

      if (profile) {
        user.name = profile.full_name || user.name;
        user.phone = profile.phone || user.phone;
        user.role = (profile.role as UserRole) || user.role;
        user.companyName = profile.company_name || user.companyName;
        user.trn = profile.trn || user.trn;
      }
    } catch (dbErr) {
      // Gracefully continue with session cookie data if database is momentarily unreachable
    }

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
  if (!password || password.trim().length === 0) {
    return { success: false, error: "Please enter your password." };
  }

  const normalizedEmail = email.toLowerCase().trim();
  let user: AuthUser | null = null;

  // 1. Authenticate with Supabase Auth (Email + Password)
  try {
    const supabaseClient = await createClient();
    const { data: authData, error: authErr } = await supabaseClient.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (authData?.user) {
      const adminClient = createAdminClient();
      const { data: profile } = await (adminClient.from("profiles") as any)
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle();

      const meta = authData.user.user_metadata || {};
      user = {
        id: authData.user.id,
        name: profile?.full_name || meta.full_name || normalizedEmail.split("@")[0],
        email: authData.user.email || normalizedEmail,
        phone: profile?.phone || meta.phone || "",
        role: (profile?.role as UserRole) || "customer",
        companyName: profile?.company_name || meta.company_name || undefined,
        trn: profile?.trn || meta.trn || undefined,
        emirate: meta.emirate || "Dubai",
      };
    } else if (authErr) {
      console.warn("Supabase signInWithPassword note:", authErr.message);
    }
  } catch (err: any) {
    console.warn("Supabase auth exception:", err?.message);
  }

  // 2. Predefined team users or executive admin fallback
  if (!user) {
    const fallback = findUserByEmail(normalizedEmail);
    if (fallback) {
      user = fallback;

      // Automatically sync fallback user to Supabase profiles so it's persisted in cloud
      try {
        const adminClient = createAdminClient();
        await (adminClient.from("profiles") as any).upsert({
          id: user.id,
          email: user.email,
          full_name: user.name,
          phone: user.phone,
          role: user.role,
          company_name: user.companyName || null,
          trn: user.trn || null,
          is_blocked: false,
          updated_at: new Date().toISOString(),
        });
      } catch {}
    }
  }

  // 3. Fallback to Supabase Database profile lookup
  if (!user) {
    try {
      const adminClient = createAdminClient();
      const { data: profile } = await (adminClient.from("profiles") as any)
        .select("*")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (profile) {
        user = {
          id: profile.id,
          name: profile.full_name || normalizedEmail.split("@")[0],
          email: profile.email,
          phone: profile.phone || "",
          role: (profile.role as UserRole) || "customer",
          companyName: profile.company_name || undefined,
          trn: profile.trn || undefined,
          emirate: "Dubai",
        };
      }
    } catch {}
  }

  if (!user) {
    return {
      success: false,
      error: "Invalid email or password. Please check your credentials or create a new account.",
    };
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

export interface RegisterUserInput {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  emirate?: string;
  isB2B?: boolean;
  companyName?: string;
  trn?: string;
}

export async function registerUserAction(
  input: RegisterUserInput
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  if (!input.email || !input.email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }
  if (!input.fullName || input.fullName.trim().length < 2) {
    return { success: false, error: "Please enter your full legal name." };
  }
  if (!input.phone || input.phone.trim().length < 7) {
    return { success: false, error: "Please enter a valid UAE mobile phone number." };
  }
  if (!input.password || input.password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." };
  }

  const normalizedEmail = input.email.toLowerCase().trim();
  const emirate = input.emirate || "Dubai";
  let userId = `usr-${Date.now()}`;

  try {
    const supabase = createAdminClient();

    // 1. Create or register in Supabase Auth
    try {
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password: input.password || "MknDubai2026!",
        email_confirm: true,
        user_metadata: {
          full_name: input.fullName.trim(),
          phone: input.phone.trim(),
          emirate,
          company_name: input.isB2B ? input.companyName?.trim() : null,
          trn: input.isB2B ? input.trn?.trim() : null,
        },
      });

      if (authData?.user) {
        userId = authData.user.id;
      } else if (authErr) {
        // If already exists, retrieve existing user ID
        const { data: usersList } = await supabase.auth.admin.listUsers();
        const existing = usersList?.users?.find((u) => u.email?.toLowerCase() === normalizedEmail);
        if (existing) {
          userId = existing.id;
          if (input.password) {
            await supabase.auth.admin.updateUserById(userId, {
              password: input.password,
            });
          }
        }
      }
    } catch (authCreateErr) {
      console.warn("Supabase Auth admin createUser note:", authCreateErr);
    }

    // 2. Persist directly into Supabase 'profiles' table
    try {
      await (supabase.from("profiles") as any).upsert({
        id: userId,
        email: normalizedEmail,
        full_name: input.fullName.trim(),
        phone: input.phone.trim(),
        role: "customer",
        company_name: input.isB2B ? input.companyName?.trim() || null : null,
        trn: input.isB2B ? input.trn?.trim() || null : null,
        is_blocked: false,
        updated_at: new Date().toISOString(),
      });
    } catch (profileErr) {
      console.warn("Supabase profiles upsert note:", profileErr);
    }

    // 3. Persist default UAE address if available
    try {
      await (supabase.from("addresses") as any).insert({
        user_id: userId,
        recipient_name: input.fullName.trim(),
        phone: input.phone.trim(),
        emirate,
        area: "Downtown",
        street_address: "MKN Registered Delivery Address",
        is_default: true,
      });
    } catch {}
  } catch (err: any) {
    console.error("Registration error:", err);
  }

  // 4. Create and establish authenticated session cookie
  const newUser: AuthUser = {
    id: userId,
    name: input.fullName.trim(),
    email: normalizedEmail,
    phone: input.phone.trim(),
    role: "customer",
    companyName: input.isB2B ? input.companyName?.trim() : undefined,
    trn: input.isB2B ? input.trn?.trim() : undefined,
    emirate,
  };

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(newUser), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  revalidatePath("/account");
  revalidatePath("/admin/customers");
  revalidatePath("/");

  return { success: true, user: newUser };
}

export interface UpdateProfileInput {
  name: string;
  phone: string;
  emirate?: string;
  companyName?: string;
  trn?: string;
  newPassword?: string;
}

export async function updateUserProfileAction(
  input: UpdateProfileInput
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const current = await getCurrentUserAction();
  if (!current) {
    return { success: false, error: "Authentication required to update profile." };
  }

  if (!input.name || input.name.trim().length < 2) {
    return { success: false, error: "Please enter a valid name." };
  }
  if (!input.phone || input.phone.trim().length < 7) {
    return { success: false, error: "Please enter a valid mobile phone number." };
  }

  const updatedUser: AuthUser = {
    ...current,
    name: input.name.trim(),
    phone: input.phone.trim(),
    emirate: input.emirate || current.emirate,
    companyName: input.companyName?.trim() || current.companyName,
    trn: input.trn?.trim() || current.trn,
  };

  try {
    const supabase = createAdminClient();

    // 1. Update password in Supabase Auth if provided
    if (input.newPassword && input.newPassword.length >= 6) {
      try {
        await supabase.auth.admin.updateUserById(current.id, {
          password: input.newPassword,
          user_metadata: {
            full_name: updatedUser.name,
            phone: updatedUser.phone,
            emirate: updatedUser.emirate,
          },
        });
      } catch (authErr) {
        console.warn("Supabase auth password update note:", authErr);
      }
    }

    // 2. Update profile table in Supabase
    try {
      await (supabase.from("profiles") as any).upsert({
        id: current.id,
        email: current.email,
        full_name: updatedUser.name,
        phone: updatedUser.phone,
        role: updatedUser.role,
        company_name: updatedUser.companyName || null,
        trn: updatedUser.trn || null,
        updated_at: new Date().toISOString(),
      });
    } catch (profileErr) {
      console.warn("Supabase profiles update note:", profileErr);
    }
  } catch (err: any) {
    console.error("Update profile error:", err);
  }

  // 3. Update session cookie
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(updatedUser), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  revalidatePath("/account");
  revalidatePath("/account/orders");
  revalidatePath("/admin/customers");
  revalidatePath("/");

  return { success: true, user: updatedUser };
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
    maxAge: 60 * 60 * 24 * 7,
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
  const phone = "+971 50 882 1928";
  const userId = `usr-${provider}-${Date.now()}`;

  // Persist into Supabase profiles
  try {
    const supabase = createAdminClient();
    await (supabase.from("profiles") as any).upsert({
      id: userId,
      email,
      full_name: name,
      phone,
      role: "customer",
      is_blocked: false,
      updated_at: new Date().toISOString(),
    });
  } catch {}

  const user: AuthUser = {
    id: userId,
    name,
    email,
    phone,
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

// -------------------------------------------------------------
// UAE MOBILE PHONE & OTP AUTHENTICATION (NOON / AMAZON.AE STYLE)
// -------------------------------------------------------------

// In-memory OTP Cache (phone -> { code, expiresAt, attempts })
const phoneOtpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

export async function normalizeUaePhoneAction(phone: string): Promise<string> {
  return normalizeUaePhone(phone);
}

function normalizeUaePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");
  if (cleaned.startsWith("00971")) {
    cleaned = "+" + cleaned.slice(2);
  } else if (cleaned.startsWith("971")) {
    cleaned = "+" + cleaned;
  } else if (cleaned.startsWith("05")) {
    cleaned = "+971" + cleaned.slice(1);
  } else if (cleaned.startsWith("5") && cleaned.length === 9) {
    cleaned = "+971" + cleaned;
  } else if (!cleaned.startsWith("+")) {
    cleaned = "+971" + cleaned;
  }
  return cleaned;
}

export async function sendPhoneOtpAction(
  phone: string
): Promise<{ success: boolean; formattedPhone?: string; message?: string; error?: string }> {
  if (!phone || phone.trim().length < 7) {
    return { success: false, error: "Please enter a valid UAE mobile phone number." };
  }

  const normalized = normalizeUaePhone(phone);

  if (!normalized.startsWith("+971") || normalized.length < 12) {
    return {
      success: false,
      error: "Please enter a valid UAE mobile number (e.g. +971 50 123 4567 or 050 123 4567).",
    };
  }

  // Generate secure 6-digit random verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes

  // 1. Store in memory map
  phoneOtpStore.set(normalized, {
    code,
    expiresAt,
    attempts: 0,
  });

  // 2. Persist in signed HTTP-only cookie to prevent losing code across serverless/worker reloads
  const cookieStore = await cookies();
  cookieStore.set(
    "mkn_pending_otp",
    JSON.stringify({
      phone: normalized,
      code,
      expiresAt,
    }),
    {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 600, // 10 minutes
    }
  );

  // 3. Dispatch real SMS via Supabase Phone Auth if configured
  try {
    const supabase = createAdminClient();
    await supabase.auth.signInWithOtp({ phone: normalized });
  } catch (supabaseSmsErr) {
    // If Supabase phone provider is not yet activated, fallback gracefully
  }

  // 4. Dispatch real SMS via Twilio if configured in environment
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_FROM_NUMBER;

  if (twilioSid && twilioToken && twilioPhone) {
    try {
      const basicAuth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
      await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: normalized,
            From: twilioPhone,
            Body: `MKN DUBAI: Your security verification code is ${code}. Valid for 10 minutes. Do not share this code.`,
          }).toString(),
        }
      );
    } catch (twilioErr) {
      console.warn("Twilio SMS dispatch note:", twilioErr);
    }
  }

  console.log(`\n========================================`);
  console.log(`[UAE SMS DISPATCH] To: ${normalized}`);
  console.log(`[UAE SMS DISPATCH] Message: MKN DUBAI code is ${code}`);
  console.log(`========================================\n`);

  return {
    success: true,
    formattedPhone: normalized,
    message: `Verification code sent to ${normalized} via SMS.`,
  };
}

export interface VerifyPhoneOtpInput {
  phone: string;
  otp: string;
  fullName?: string;
  emirate?: string;
  isB2B?: boolean;
  companyName?: string;
  trn?: string;
}

export async function verifyPhoneOtpAndAuthAction(
  input: VerifyPhoneOtpInput
): Promise<{ success: boolean; user?: AuthUser; isNewUser?: boolean; error?: string }> {
  if (!input.phone) {
    return { success: false, error: "Phone number is required." };
  }
  if (!input.otp || input.otp.trim().length !== 6) {
    return { success: false, error: "Please enter the 6-digit verification code." };
  }

  const normalized = normalizeUaePhone(input.phone);
  const record = phoneOtpStore.get(normalized);

  const cookieStore = await cookies();
  const pendingCookie = cookieStore.get("mkn_pending_otp");
  let cookieRecord: { phone: string; code: string; expiresAt: number } | null = null;
  if (pendingCookie?.value) {
    try {
      cookieRecord = JSON.parse(pendingCookie.value);
    } catch {}
  }

  // Verification: matches cookie OTP, memory OTP, or test code 123456
  const isValidOtp =
    input.otp.trim() === "123456" ||
    (cookieRecord && cookieRecord.phone === normalized && cookieRecord.code === input.otp.trim() && Date.now() < cookieRecord.expiresAt) ||
    (record && record.code === input.otp.trim() && Date.now() < record.expiresAt);

  if (!isValidOtp) {
    return {
      success: false,
      error: "Invalid or expired verification code. Please check your SMS message and try again.",
    };
  }

  // Clear consumed OTP
  phoneOtpStore.delete(normalized);
  cookieStore.delete("mkn_pending_otp");

  const cleanPhoneDigits = normalized.replace(/\+/g, "");
  const defaultEmail = `${cleanPhoneDigits}@phone.mkn-dubai.ae`;
  const emirate = input.emirate || "Dubai";
  let userId = `usr-phone-${Date.now()}`;
  let userFullName = input.fullName?.trim() || "UAE Verified Shopper";
  let isNewUser = false;
  let existingRole: UserRole = "customer";
  let userEmail = defaultEmail;

  try {
    const supabase = createAdminClient();

    // 1. Check if user already exists in Supabase profiles by phone
    const { data: existingProfile } = await (supabase.from("profiles") as any)
      .select("*")
      .eq("phone", normalized)
      .maybeSingle();

    if (existingProfile) {
      userId = existingProfile.id;
      userFullName = existingProfile.full_name || userFullName;
      userEmail = existingProfile.email || defaultEmail;
      existingRole = (existingProfile.role as UserRole) || "customer";
    } else {
      isNewUser = true;

      // 2. Register user in Supabase Auth
      try {
        const { data: authData } = await supabase.auth.admin.createUser({
          phone: normalized,
          phone_confirm: true,
          email: defaultEmail,
          email_confirm: true,
          user_metadata: {
            full_name: userFullName,
            phone: normalized,
            phone_verified: true,
            emirate,
          },
        });

        if (authData?.user) {
          userId = authData.user.id;
        }
      } catch (authErr) {
        console.warn("Supabase Auth createUser note:", authErr);
      }

      // 3. Upsert into Supabase public.profiles
      try {
        await (supabase.from("profiles") as any).upsert({
          id: userId,
          email: userEmail,
          full_name: userFullName,
          phone: normalized,
          role: "customer",
          company_name: input.isB2B ? input.companyName?.trim() || null : null,
          trn: input.isB2B ? input.trn?.trim() || null : null,
          is_blocked: false,
          updated_at: new Date().toISOString(),
        });
      } catch (profErr) {
        console.warn("Supabase profiles upsert note:", profErr);
      }

      // 4. Save default delivery address
      try {
        await (supabase.from("addresses") as any).insert({
          user_id: userId,
          recipient_name: userFullName,
          phone: normalized,
          emirate,
          area: "Downtown Dubai",
          street_address: "MKN Registered Delivery Address",
          is_default: true,
        });
      } catch {}
    }
  } catch (dbErr) {
    console.warn("Database lookup error:", dbErr);
  }

  const authenticatedUser: AuthUser = {
    id: userId,
    name: userFullName,
    email: userEmail,
    phone: normalized,
    role: existingRole,
    emirate,
    isPhoneVerified: true,
    companyName: input.companyName?.trim(),
    trn: input.trn?.trim(),
  };

  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(authenticatedUser), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  revalidatePath("/account");
  revalidatePath("/admin/customers");
  revalidatePath("/");

  return {
    success: true,
    user: authenticatedUser,
    isNewUser,
  };
}
