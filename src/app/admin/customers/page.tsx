"use client";

import * as React from "react";
import { Users, Search, Ban, CheckCircle2, ShieldCheck, Mail, Phone } from "lucide-react";
import { formatAED } from "@/lib/utils";

const MOCK_CUSTOMERS = [
  {
    id: "cust-1",
    name: "Adnan Al-Hashimi",
    email: "adnan@example.ae",
    phone: "+971 50 123 4567",
    emirate: "Dubai",
    ordersCount: 4,
    totalSpentFils: 1849900,
    isB2B: true,
    trn: "100482918200003",
    isBlocked: false,
  },
  {
    id: "cust-2",
    name: "Sarah Al-Mansoori",
    email: "sarah@example.ae",
    phone: "+971 52 987 6543",
    emirate: "Abu Dhabi",
    ordersCount: 2,
    totalSpentFils: 1249900,
    isB2B: false,
    trn: null,
    isBlocked: false,
  },
  {
    id: "cust-3",
    name: "Rashid Khalifa",
    email: "procurement@techcorp.ae",
    phone: "+971 4 234 5678",
    emirate: "Sharjah",
    ordersCount: 7,
    totalSpentFils: 4299000,
    isB2B: true,
    trn: "100889218200003",
    isBlocked: false,
  },
];

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState(MOCK_CUSTOMERS);
  const [search, setSearch] = React.useState("");

  const toggleBlock = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isBlocked: !c.isBlocked } : c))
    );
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-black text-foreground">
          Customer Management
        </h1>
        <p className="text-xs text-muted-foreground">
          View customer purchase history, verified corporate TRNs, and account access.
        </p>
      </div>

      <div className="bg-card border border-border/80 p-3 rounded-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/40 border border-border/70 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground bg-muted/30">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Emirate</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent (AED)</th>
                <th className="py-3 px-4">Tax Profile</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/20">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-foreground block">{c.name}</span>
                    <span className="text-[11px] text-muted-foreground">{c.email}</span>
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
                        B2B TRN: {c.trn?.slice(0, 7)}...
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
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
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
      </div>
    </div>
  );
}

