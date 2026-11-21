"use client";

import * as React from "react";
import Link from "next/link";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  FileText,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { formatAED } from "@/lib/utils";
import { DEMO_PRODUCTS } from "@/lib/products-data";

export default function AdminDashboardPage() {
  const lowStockItems = DEMO_PRODUCTS.filter((p) => p.stock_quantity <= 15);

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
            Merchant Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time business performance, UAE tax reporting, and inventory metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/10"
          >
            + Add New Product
          </Link>
          <Link
            href="/admin/invoices"
            className="px-4 py-2 rounded-xl bg-card border border-border/80 hover:bg-accent text-xs font-semibold"
          >
            Export VAT Report
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Revenue */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Gross Revenue (30 Days)</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-foreground">
            {formatAED(18449000)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last month</span>
          </div>
        </div>

        {/* Orders */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Orders</span>
            <span className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-foreground">
            142
          </div>
          <p className="text-xs text-muted-foreground">Avg. Order Value: {formatAED(129900)}</p>
        </div>

        {/* VAT Collected */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>UAE 5% VAT Accrued</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-foreground">
            {formatAED(878524)}
          </div>
          <p className="text-xs text-emerald-400 font-medium">FTA Return Due: 28 Dec 2026</p>
        </div>

        {/* Active Inventory */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active SKUs</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="font-heading font-black text-2xl sm:text-3xl text-foreground">
            68
          </div>
          <p className="text-xs text-amber-400 font-medium">
            {lowStockItems.length} products with low stock
          </p>
        </div>
      </div>

      {/* Low Stock Alerts Strip */}
      {lowStockItems.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span>Low Stock Replenishment Alerts (Dubai Central Warehouse)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {lowStockItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-foreground line-clamp-1">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground">SKU: {item.sku}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold font-mono text-xs">
                  {item.stock_quantity} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two-Column Grid: Recent Orders + Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-foreground">
              Recent Store Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-cyan-400 font-semibold hover:underline"
            >
              Manage all orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="py-2.5 px-3">Order Ref</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Emirate</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Gross Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-foreground">
                    MKN-2026-98214
                  </td>
                  <td className="py-3 px-3">Adnan Al-Hashimi</td>
                  <td className="py-3 px-3">Dubai</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                      Delivered
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cyan-400 font-bold">
                    {formatAED(469900)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-foreground">
                    MKN-2026-87140
                  </td>
                  <td className="py-3 px-3">Sarah Al-Mansoori</td>
                  <td className="py-3 px-3">Abu Dhabi</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">
                      Processing
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cyan-400 font-bold">
                    {formatAED(1249900)}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-mono font-bold text-foreground">
                    MKN-2026-76431
                  </td>
                  <td className="py-3 px-3">Rashid Khalifa (B2B)</td>
                  <td className="py-3 px-3">Sharjah</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-[10px] font-bold">
                      Paid (Full Tax Inv)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-cyan-400 font-bold">
                    {formatAED(999900)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick UAE Compliance & Settings Card */}
        <div className="lg:col-span-4 rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <h2 className="font-heading font-bold text-base text-foreground">
            UAE Tax & Legal Configuration
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
              <span className="text-[11px] text-muted-foreground block">Federal Tax Authority TRN</span>
              <span className="font-mono font-bold text-foreground">100482918200003</span>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
              <span className="text-[11px] text-muted-foreground block">Dubai Commercial License</span>
              <span className="font-mono font-bold text-foreground">1048291 (DED Approved)</span>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
              <span className="text-[11px] text-muted-foreground block">Standard VAT Rate</span>
              <span className="font-bold text-cyan-400">5.00% (Configurable)</span>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
              <span className="text-[11px] text-muted-foreground block">Invoice Numbering Sequence</span>
              <span className="font-mono font-bold text-emerald-400">INV-2026-XXXXX (Gapless)</span>
            </div>
          </div>

          <Link
            href="/admin/settings"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/80 hover:bg-muted font-semibold text-xs transition-colors"
          >
            <span>Modify Store Settings</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

