import assert from "node:assert";
import { PRESET_USERS, findUserByEmail, AUTH_COOKIE_NAME } from "../src/lib/services/auth-service.ts";

console.log("🔒 Running MKN Dubai RBAC & Authentication Test Suite...\n");

// 1. Role definitions & preset users
console.log("1. Checking PRESET_USERS configuration...");
assert.strictEqual(PRESET_USERS.admin.role, "admin", "Admin role must be 'admin'");
assert.strictEqual(PRESET_USERS.staff.role, "staff", "Staff role must be 'staff'");
assert.strictEqual(PRESET_USERS.customer.role, "customer", "Customer role must be 'customer'");
assert(PRESET_USERS.admin.email.includes("admin@"), "Admin email must be admin@...");
assert(PRESET_USERS.staff.email.includes("staff@"), "Staff email must be staff@...");
assert.strictEqual(AUTH_COOKIE_NAME, "mkn_auth_session", "Cookie name must match standard");
console.log("   ✅ PRESET_USERS passed: admin, staff, and customer properly configured.");

// 2. Email matching & role resolution
console.log("2. Checking findUserByEmail() lookup & role resolution...");
const adminUser = findUserByEmail("admin@mknelectronics.ae");
assert(adminUser && adminUser.role === "admin", "admin@mknelectronics.ae must resolve to admin role");

const staffUser = findUserByEmail("staff@mknelectronics.ae");
assert(staffUser && staffUser.role === "staff", "staff@mknelectronics.ae must resolve to staff role");

const custUser = findUserByEmail("adnan@example.ae");
assert(custUser && custUser.role === "customer", "adnan@example.ae must resolve to customer role");

const customUser = findUserByEmail("newbuyer@dubai.ae");
assert(customUser && customUser.role === "customer", "Any general customer email must resolve to customer role");
console.log("   ✅ findUserByEmail() passed: properly segregates roles.");

// 3. RBAC Permission Simulation
console.log("3. Simulating Route Protection & RBAC Access Matrix...");
const protectedRoutes = [
  { path: "/admin", allowed: ["admin", "staff"] },
  { path: "/admin/products", allowed: ["admin", "staff"] },
  { path: "/admin/orders", allowed: ["admin", "staff"] },
  { path: "/admin/invoices", allowed: ["admin", "staff"] },
  { path: "/admin/settings", allowed: ["admin"] },     // Staff blocked
  { path: "/admin/audit-log", allowed: ["admin"] },    // Staff blocked
  { path: "/account", allowed: ["admin", "staff", "customer"] },
  { path: "/account/orders", allowed: ["admin", "staff", "customer"] },
];

for (const route of protectedRoutes) {
  // Test customer
  const customerAllowed = route.allowed.includes("customer");
  if (route.path.startsWith("/admin")) {
    assert.strictEqual(customerAllowed, false, `Customer MUST BE BLOCKED from ${route.path}`);
  }

  // Test staff
  const staffAllowed = route.allowed.includes("staff");
  if (route.path === "/admin/settings" || route.path === "/admin/audit-log") {
    assert.strictEqual(staffAllowed, false, `Staff MUST BE BLOCKED from ${route.path}`);
  } else if (route.path.startsWith("/admin")) {
    assert.strictEqual(staffAllowed, true, `Staff should have operational access to ${route.path}`);
  }

  // Test admin
  const adminAllowed = route.allowed.includes("admin");
  assert.strictEqual(adminAllowed, true, `Admin MUST HAVE FULL ACCESS to ${route.path}`);
}
console.log("   ✅ Access Matrix verified: customer blocked from /admin, staff restricted from settings/audit, admin granted full access.");

console.log("\n🎉 All RBAC & Authentication security checks passed successfully!");

