"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  FileText,
  Star,
  Settings,
  ClipboardList,
  Store,
  ShieldAlert,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Sparkles,
  ArrowRight,
  Briefcase,
  User,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  getCurrentUserAction,
  fastLoginAction,
  logoutAction,
} from "@/app/actions/auth";
import type { AuthUser, UserRole } from "@/lib/services/auth-service";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const ALL_ADMIN_NAV: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, adminOnly: false },
  { name: "Products", href: "/admin/products", icon: Package, adminOnly: false },
  { name: "Categories & Brands", href: "/admin/categories", icon: Layers, adminOnly: false },
  { name: "Orders & Shipping", href: "/admin/orders", icon: ShoppingBag, adminOnly: false },
  { name: "Tax Invoices", href: "/admin/invoices", icon: FileText, adminOnly: false },
  { name: "Customers", href: "/admin/customers", icon: Users, adminOnly: false },
  { name: "Coupons & Promos", href: "/admin/coupons", icon: Tag, adminOnly: false },
  { name: "Reviews Moderation", href: "/admin/reviews", icon: Star, adminOnly: false },
  { name: "Store Settings & Tax", href: "/admin/settings", icon: Settings, adminOnly: true },
  { name: "Audit Trail", href: "/admin/audit-log", icon: ClipboardList, adminOnly: true },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [user, setUser] = React.useState<AuthUser | null | undefined>(undefined);
  const [actionLoading, setActionLoading] = React.useState(false);

  // Fetch session on mount and when route changes
  React.useEffect(() => {
    let mounted = true;
    getCurrentUserAction()
      .then((u) => {
        if (mounted) setUser(u);
      })
      .catch(() => {
        if (mounted) setUser(null);
      });

    return () => {
      mounted = false;
    };
  }, [pathname]);

  const handleFastLogin = async (role: UserRole) => {
    setActionLoading(true);
    try {
      const res = await fastLoginAction(role);
      setUser(res.user);
      router.refresh();
    } catch (err) {
      console.error("Fast login error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    setActionLoading(true);
    try {
      await logoutAction();
      setUser(null);
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // If user is accessing the dedicated admin login page, bypass layout check
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // 1. Loading state
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-foreground">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
        <h2 className="font-heading font-bold text-base text-foreground">
          Verifying MKN Dubai Security Clearance...
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Validating cryptographic session and administrative permissions
        </p>
      </div>
    );
  }

  // 2. Unauthenticated or Regular Customer Access Blocked
  if (!user || user.role === "customer") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6 text-foreground">
        <div className="max-w-md w-full rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-destructive/15 border border-destructive/30 text-destructive flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-mono text-[11px] font-bold border border-destructive/20">
              RESTRICTED PORTAL • 403 FORBIDDEN
            </span>
            <h1 className="font-heading text-xl sm:text-2xl font-black text-foreground">
              Staff or Admin Access Required
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {user ? (
                <>
                  You are currently authenticated as a standard customer (
                  <span className="font-semibold text-foreground">{user.name}</span> •{" "}
                  <span className="font-mono text-cyan-400">{user.email}</span>). Customer
                  accounts cannot access internal inventory, orders, or tax records.
                </>
              ) : (
                "You are currently unauthenticated. This system is restricted to authorized MKN Electronics Dubai Operations Staff and Executive Administrators."
              )}
            </p>
          </div>

          {/* Quick Fast Login for Instant Testing */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2.5 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Role Switcher (1-Click Authentication)</span>
            </div>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() => handleFastLogin("admin")}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-card border border-border/70 hover:border-cyan-500/50 hover:bg-cyan-500/5 text-xs transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  👑
                </div>
                <div>
                  <p className="font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                    Executive Administrator
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    admin@mknelectronics.ae • Full privileges
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              type="button"
              disabled={actionLoading}
              onClick={() => handleFastLogin("staff")}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-card border border-border/70 hover:border-amber-500/50 hover:bg-amber-500/5 text-xs transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-xs">
                  💼
                </div>
                <div>
                  <p className="font-bold text-foreground group-hover:text-amber-400 transition-colors">
                    Operations Staff
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    staff@mknelectronics.ae • Orders & Stock
                  </p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <Link
              href={`/admin/login?redirect=${encodeURIComponent(pathname)}`}
              className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold text-center hover:opacity-90 transition-opacity"
            >
              Sign In to Admin Portal →
            </Link>
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 rounded-xl border border-border/80 hover:bg-muted text-xs font-semibold text-center transition-colors"
            >
              Return to Storefront
            </Link>
          </div>

          <Link
            href="/"
            className="inline-block text-xs text-muted-foreground hover:text-cyan-400 transition-colors"
          >
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    );
  }

  // 3. User is authorized (admin or staff)
  const isStaff = user.role === "staff";
  const isAdmin = user.role === "admin";

  // Filter navigation: Staff does not see Store Settings or Audit Trail
  const visibleNav = ALL_ADMIN_NAV.filter((item) => (isStaff ? !item.adminOnly : true));

  // Check if staff navigated directly to admin-only route
  const currentNav = ALL_ADMIN_NAV.find((item) => item.href === pathname);
  const isRestrictedToStaff = isStaff && currentNav?.adminOnly;

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row text-foreground">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-border/80 bg-card">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
            aria-label="Toggle admin menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-heading font-black text-sm text-foreground">
            MKN Admin <span className="text-cyan-400 font-mono text-xs">v2.0</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              isAdmin
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
            }`}
          >
            {user.role.toUpperCase()}
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card/95 backdrop-blur-xl border-r border-border/80 flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:h-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-border/50">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-[1px]">
              <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center font-heading font-bold text-xs text-cyan-400">
                MK
              </div>
            </div>
            <div>
              <h2 className="font-heading font-black text-sm text-foreground tracking-tight">
                MKN Dubai Admin
              </h2>
              <span className="text-[10px] font-mono text-cyan-400 font-semibold bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                FTA UAE COMPLIANT
              </span>
            </div>
          </Link>
        </div>

        {/* Role Notice for Staff */}
        {isStaff && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Operations Staff Mode</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Order processing, stock & delivery management. System settings restricted.
            </p>
          </div>
        )}

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-xs">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Active User Card & Sign Out */}
        <div className="p-4 border-t border-border/50 space-y-3">
          <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-[11px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[10px]">Active Session</span>
              <span
                className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${
                  isAdmin
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {isAdmin ? "👑 ADMIN" : "💼 STAFF"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>

            {/* Quick Fast Switch / Logout buttons */}
            <div className="pt-2 border-t border-border/30 flex items-center justify-between gap-2">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleFastLogin(isAdmin ? "staff" : "admin")}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                title={`Switch session to ${isAdmin ? "staff" : "admin"}`}
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>Switch to {isAdmin ? "Staff" : "Admin"}</span>
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={handleLogout}
                className="text-[10px] text-destructive hover:underline flex items-center gap-1 font-semibold"
                title="Sign out of administration"
              >
                <LogOut className="w-2.5 h-2.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-cyan-400 hover:bg-muted/40 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>View Public Storefront →</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
        {/* Top Header */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-border/60 bg-card/60 backdrop-blur-md">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dubai Central Fulfillment: Operational</span>
            </span>
            <span>•</span>
            <span>UAE Tax Authority: TRN 100482918200003</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-foreground">Role: {user.role.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2.5 pl-3 border-l border-border/40">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  isAdmin
                    ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-400"
                    : "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                }`}
              >
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-foreground leading-tight">{user.name}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{user.role}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Child Pages or Staff Permission Restriction */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {isRestrictedToStaff ? (
            <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl border border-amber-500/30 bg-amber-500/5 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="font-heading font-black text-xl text-foreground">
                Executive Administrator Privilege Required
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The configuration section{" "}
                <span className="font-mono font-bold text-foreground">{pathname}</span> is
                restricted to Executive Administrators. Operations Staff permissions are focused on
                orders, inventory, fulfillment, and customer invoices.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/admin/orders"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity text-center"
                >
                  Return to Orders Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => handleFastLogin("admin")}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch to Admin Account</span>
                </button>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
