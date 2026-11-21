"use client";

import * as React from "react";
import { Tag, Plus, Trash2, Calendar, Check, AlertCircle } from "lucide-react";
import { formatAED, aedToFils } from "@/lib/utils";

const INITIAL_COUPONS = [
  {
    id: "cp-1",
    code: "WELCOME10",
    description: "10% off for first order over AED 500",
    type: "percentage" as const,
    value: 10,
    minSpendFils: 50000,
    timesUsed: 142,
    isActive: true,
  },
  {
    id: "cp-2",
    code: "DUBAI50",
    description: "AED 50 discount on orders over AED 400",
    type: "fixed" as const,
    value: 5000,
    minSpendFils: 40000,
    timesUsed: 89,
    isActive: true,
  },
  {
    id: "cp-3",
    code: "TECHVIP",
    description: "15% VIP discount on pro laptops and audio over AED 2,000",
    type: "percentage" as const,
    value: 15,
    minSpendFils: 200000,
    timesUsed: 37,
    isActive: true,
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState(INITIAL_COUPONS);
  const [code, setCode] = React.useState("");
  const [discountType, setDiscountType] = React.useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = React.useState(10);
  const [minSpendAED, setMinSpendAED] = React.useState(500);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon = {
      id: `cp-${Date.now()}`,
      code: code.trim().toUpperCase(),
      description: `${discountType === "percentage" ? `${discountValue}%` : `AED ${discountValue}`} discount above AED ${minSpendAED}`,
      type: discountType,
      value: discountType === "percentage" ? discountValue : aedToFils(discountValue),
      minSpendFils: aedToFils(minSpendAED),
      timesUsed: 0,
      isActive: true,
    };

    setCoupons((prev) => [newCoupon, ...prev]);
    setCode("");
  };

  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-black text-foreground">
          Coupons & Promotions
        </h1>
        <p className="text-xs text-muted-foreground">
          Create promotional vouchers, configure minimum order values and manage active discounts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Creator Form */}
        <div className="lg:col-span-4 rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
            <Tag className="w-4 h-4 text-cyan-400" />
            <span>Create Promo Code</span>
          </h2>

          <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. DUBAI2026"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 uppercase font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (AED)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">
                Discount Value ({discountType === "percentage" ? "%" : "AED"})
              </label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 font-mono text-xs"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Min Spend (AED)</label>
              <input
                type="number"
                required
                value={minSpendAED}
                onChange={(e) => setMinSpendAED(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/20"
            >
              Create Voucher
            </button>
          </form>
        </div>

        {/* Existing Coupons Table */}
        <div className="lg:col-span-8 rounded-2xl border border-border/80 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground bg-muted/30">
                  <th className="py-3 px-4">Coupon</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min Spend</th>
                  <th className="py-3 px-4">Usage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {c.code}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">
                      {c.type === "percentage" ? `${c.value}%` : formatAED(c.value)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {formatAED(c.minSpendFils)}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{c.timesUsed} orders</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.isActive
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {c.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleCoupon(c.id)}
                        className="px-2.5 py-1 rounded-lg border border-border/60 hover:bg-muted text-[11px]"
                      >
                        {c.isActive ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

