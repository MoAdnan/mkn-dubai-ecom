"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  Heart,
  FileText,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Building2,
  Clock,
} from "lucide-react";
import { formatAED } from "@/lib/utils";

export default function AccountPage() {
  const [userProfile, setUserProfile] = React.useState({
    name: "Adnan Al-Hashimi",
    email: "adnan@example.ae",
    phone: "+971 50 123 4567",
    companyName: "Al-Hashimi Ventures LLC",
    trn: "100482918200003",
    emirate: "Dubai",
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
          My Account
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Manage your profile, UAE delivery addresses, order history, and FTA tax invoices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation Card */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg font-heading">
                {userProfile.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">{userProfile.name}</h3>
                <p className="text-xs text-muted-foreground">{userProfile.email}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 space-y-1 text-xs">
              <Link
                href="/account"
                className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>Profile Overview</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/account/orders"
                className="flex items-center justify-between p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>Orders & Tax Invoices</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/account/addresses"
                className="flex items-center justify-between p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>Saved UAE Addresses</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/account/wishlist"
                className="flex items-center justify-between p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span>My Wishlist</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
            <h2 className="font-heading font-bold text-base text-foreground">
              Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                <span className="text-muted-foreground block text-[11px]">Full Name</span>
                <span className="font-semibold text-foreground">{userProfile.name}</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                <span className="text-muted-foreground block text-[11px]">Email Address</span>
                <span className="font-semibold text-foreground">{userProfile.email}</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                <span className="text-muted-foreground block text-[11px]">Phone</span>
                <span className="font-semibold text-foreground">{userProfile.phone}</span>
              </div>

              <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                <span className="text-muted-foreground block text-[11px]">Primary Emirate</span>
                <span className="font-semibold text-foreground">{userProfile.emirate}, UAE</span>
              </div>
            </div>

            {/* Corporate Details */}
            <div className="pt-4 border-t border-border/40">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-3">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>UAE Corporate / Tax Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                  <span className="text-muted-foreground block text-[11px]">Company Name</span>
                  <span className="font-semibold text-foreground">{userProfile.companyName}</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                  <span className="text-muted-foreground block text-[11px]">Federal Tax Authority TRN</span>
                  <span className="font-mono font-bold text-cyan-400">{userProfile.trn}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders Preview */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-base text-foreground">
                Recent Orders
              </h2>
              <Link
                href="/account/orders"
                className="text-xs text-cyan-400 font-semibold hover:underline"
              >
                View all orders →
              </Link>
            </div>

            <div className="rounded-xl border border-border/60 divide-y divide-border/40 text-xs">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-foreground">MKN-2026-98214</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                      Delivered
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Apple iPhone 16 Pro Max 256GB • Delivered in Downtown Dubai
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-foreground">{formatAED(469900)}</p>
                  <p className="text-[10px] text-muted-foreground">Tax Invoice #INV-2026-98214</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

