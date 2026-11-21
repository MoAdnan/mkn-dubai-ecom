"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Menu,
  X,
  Bell,
  Search,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const ADMIN_NAV = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories & Brands", href: "/admin/categories", icon: Layers },
  { name: "Orders & Shipping", href: "/admin/orders", icon: ShoppingBag },
  { name: "Tax Invoices", href: "/admin/invoices", icon: FileText },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Coupons & Promos", href: "/admin/coupons", icon: Tag },
  { name: "Reviews Moderation", href: "/admin/reviews", icon: Star },
  { name: "Store Settings & Tax", href: "/admin/settings", icon: Settings },
  { name: "Audit Trail", href: "/admin/audit-log", icon: ClipboardList },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

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
        <ThemeToggle />
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

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 text-xs">
          {ADMIN_NAV.map((item) => {
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

        {/* Footer / Storefront link */}
        <div className="p-4 border-t border-border/50 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-cyan-400 hover:bg-muted/40 transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>View Public Storefront →</span>
          </Link>

          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Logged in as:</p>
              <p className="text-[10px]">admin@mkn-dubai.ae</p>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono text-[9px] font-bold">
              ADMIN
            </span>
          </div>
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
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Child Pages */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

