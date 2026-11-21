"use client";

import * as React from "react";
import { ClipboardList, ShieldCheck, Clock, User } from "lucide-react";

const MOCK_AUDIT_LOGS = [
  {
    id: "aud-1",
    user: "admin@mkn-dubai.ae",
    action: "UPDATE_ORDER_STATUS",
    entity: "Order MKN-2026-98214 -> Delivered",
    ip: "185.12.94.10 (Dubai, UAE)",
    timestamp: "21 Nov 2026, 04:12 PM GST",
  },
  {
    id: "aud-2",
    user: "system_job",
    action: "GENERATE_GAPLESS_INVOICE",
    entity: "Tax Invoice INV-2026-98214 issued for Order MKN-2026-98214",
    ip: "Internal Trigger (Postgres Transaction)",
    timestamp: "21 Nov 2026, 03:45 PM GST",
  },
  {
    id: "aud-3",
    user: "staff@mkn-dubai.ae",
    action: "INVENTORY_ADJUSTMENT",
    entity: "SKU MKN-APL-IP16PM-256 stock decremented (-1)",
    ip: "185.12.94.10 (Dubai, UAE)",
    timestamp: "21 Nov 2026, 03:45 PM GST",
  },
  {
    id: "aud-4",
    user: "admin@mkn-dubai.ae",
    action: "COUPON_CREATED",
    entity: "Promo code TECHVIP created with 15% discount",
    ip: "185.12.94.10 (Dubai, UAE)",
    timestamp: "20 Nov 2026, 11:20 AM GST",
  },
];

export default function AdminAuditLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-black text-foreground">
          System Audit Trail
        </h1>
        <p className="text-xs text-muted-foreground">
          Immutable log of administrative updates, stock adjustments, and tax invoice generation events.
        </p>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground bg-muted/30">
                <th className="py-3 px-4">Timestamp (GST)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Origin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {MOCK_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20">
                  <td className="py-3.5 px-4 font-mono text-muted-foreground">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-foreground font-semibold">
                    {log.user}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-foreground">{log.entity}</td>
                  <td className="py-3.5 px-4 text-right text-muted-foreground font-mono text-[11px]">
                    {log.ip}
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

