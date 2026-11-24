"use client";

import * as React from "react";
import { Users, Search, Ban, CheckCircle2, ShieldCheck, Mail, Phone, Loader2, RefreshCw } from "lucide-react";
import { formatAED } from "@/lib/utils";
import { getAdminCustomersAction, type CustomerSummary } from "@/app/actions/orders";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<CustomerSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const loadCustomers = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminCustomersAction();
      setCustomers(data);
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const toggleBlock = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isBlocked: !c.isBlocked } : c))
    );
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.emirate.toLowerCase().includes(search.toLowerCase())
  );

  const totalRegistered = customers.length;
  const activeCount = customers.filter((c) => !c.isBlocked).length;
  const b2bCount = customers.filter((c) => c.isB2B).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black text-foreground">
            Customer Management
          </h1>
          <p className="text-xs text-muted-foreground">
            View customer purchase history, verified corporate TRNs, and control account access.
          </p>
        </div>
        <button
          onClick={loadCustomers}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 text-xs font-semibold hover:bg-muted/40 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/80">
          <span className="text-xs text-muted-foreground">Total Customers</span>
          <p className="text-xl font-heading font-black text-foreground mt-1">
            {totalRegistered}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80">
          <span className="text-xs text-muted-foreground">Active Shoppers</span>
          <p className="text-xl font-heading font-black text-emerald-400 mt-1">
            {activeCount}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80">
          <span className="text-xs text-muted-foreground">Corporate / B2B Profiles</span>
          <p className="text-xl font-heading font-black text-cyan-400 mt-1">
            {b2bCount}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card border border-border/80 p-3 rounded-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers by name, email, phone, or emirate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/40 border border-border/70 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Loading registered customer records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No customers matching your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground bg-muted/30">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Emirate</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Total Spent (AED)</th>
                  <th className="py-3 px-4">Tax Profile</th>
                  <th className="py-3 px-4 text-right">Status / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20">
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-foreground block">{c.name}</span>
                      <span className="text-[11px] text-muted-foreground">{c.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                      {c.phone}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{c.emirate}, UAE</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {c.ordersCount} orders
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-cyan-400">
                      {formatAED(c.totalSpentFils)}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.isB2B ? (
                        <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 font-mono text-[10px] font-bold">
                          B2B TRN: {c.trn ? `${c.trn.slice(0, 6)}...` : "Registered"}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]">
                          B2C Retail
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleBlock(c.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          c.isBlocked
                            ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                            : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        }`}
                      >
                        {c.isBlocked ? "Unblock Account" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
