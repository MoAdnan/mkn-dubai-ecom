export type UserRole = "customer" | "staff" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  companyName?: string;
  trn?: string;
  emirate: string;
  isPhoneVerified?: boolean;
}

export const PRESET_USERS: Record<UserRole, AuthUser> = {
  admin: {
    id: "usr-admin-01",
    name: "MKN Executive Admin",
    email: "admin@mknelectronics.ae",
    phone: "+971 4 398 2211",
    role: "admin",
    companyName: "MKN Electronics L.L.C.",
    trn: "100482918200003",
    emirate: "Dubai",
  },
  staff: {
    id: "usr-staff-01",
    name: "Tariq Mansoor (Operations Staff)",
    email: "staff@mknelectronics.ae",
    phone: "+971 52 443 8921",
    role: "staff",
    companyName: "MKN Electronics Fulfillment Center",
    emirate: "Dubai",
  },
  customer: {
    id: "usr-cust-01",
    name: "Adnan Al-Hashimi",
    email: "adnan@example.ae",
    phone: "+971 50 123 4567",
    role: "customer",
    companyName: "Al-Hashimi Ventures LLC",
    trn: "100482918200003",
    emirate: "Dubai",
  },
};

export const AUTH_COOKIE_NAME = "mkn_auth_session";

export function findUserByEmail(email: string): AuthUser | undefined {
  const normalized = email.toLowerCase().trim();
  if (normalized.includes("admin")) return PRESET_USERS.admin;
  if (normalized.includes("staff")) return PRESET_USERS.staff;
  if (normalized === PRESET_USERS.customer.email.toLowerCase()) return PRESET_USERS.customer;
  
  // Generic fallback if user typed their own email
  return {
    id: `usr-${Date.now()}`,
    name: email.split("@")[0].replace(/[^a-zA-Z]/g, " ").trim() || "Customer",
    email: normalized,
    phone: "+971 50 000 0000",
    role: "customer",
    emirate: "Dubai",
  };
}

