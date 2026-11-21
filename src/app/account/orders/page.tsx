"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  FileText,
  Download,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { formatAED, filsToAED } from "@/lib/utils";
import { generateTaxInvoicePDF } from "@/lib/invoice/generate-pdf";

const MOCK_CUSTOMER_ORDERS = [
  {
    id: "ord-1",
    orderNumber: "MKN-2026-98214",
    invoiceNumber: "INV-2026-98214",
    date: "21 Nov 2026",
    status: "delivered",
    emirate: "Dubai",
    totalFils: 469900,
    items: [
      {
        title: "Apple iPhone 16 Pro Max 256GB Desert Titanium",
        sku: "MKN-APL-IP16PM-256",
        quantity: 1,
        priceFils: 469900,
      },
    ],
  },
  {
    id: "ord-2",
    orderNumber: "MKN-2026-87140",
    invoiceNumber: "INV-2026-87140",
    date: "14 Nov 2026",
    status: "delivered",
    emirate: "Dubai",
    totalFils: 114900,
    items: [
      {
        title: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones Black",
        sku: "MKN-SNY-WH1000XM5-BLK",
        quantity: 1,
        priceFils: 114900,
      },
    ],
  },
];

export default function CustomerOrdersPage() {
  const downloadInvoice = (order: typeof MOCK_CUSTOMER_ORDERS[0]) => {
    const vatFils = Math.round(order.totalFils - order.totalFils / 1.05);

    const doc = generateTaxInvoicePDF({
      invoiceNumber: order.invoiceNumber,
      orderNumber: order.orderNumber,
      invoiceType: "simplified",
      issueDate: order.date,
      supplyDate: order.date,
      supplier: {
        name: "MKN Electronics L.L.C.",
        address: "Al Quoz Industrial 1, P.O. Box 48291, Dubai, UAE",
        trn: "100482918200003",
        license: "1048291",
      },
      customer: {
        name: "Adnan Al-Hashimi",
        email: "adnan@example.ae",
        phone: "+971 50 123 4567",
        address: "Sheikh Mohammed bin Rashid Blvd, Downtown Dubai",
        emirate: order.emirate,
      },
      lines: order.items.map((i) => ({
        title: i.title,
        sku: i.sku,
        quantity: i.quantity,
        unitPriceFils: i.priceFils,
        taxableFils: i.priceFils - Math.round(i.priceFils - i.priceFils / 1.05),
        vatFils: Math.round(i.priceFils - i.priceFils / 1.05),
        totalFils: i.priceFils * i.quantity,
      })),
      subtotalFils: order.totalFils,
      discountFils: 0,
      shippingFils: 0,
      vatFils: vatFils,
      totalFils: order.totalFils,
    });

    doc.save(`${order.invoiceNumber}.pdf`);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link
          href="/account"
          className="text-xs text-muted-foreground hover:text-cyan-400 flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account Overview</span>
        </Link>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
          My Orders & Tax Invoices
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Review your purchase history and download official UAE Federal Tax Authority VAT invoices.
        </p>
      </div>

      <div className="space-y-4">
        {MOCK_CUSTOMER_ORDERS.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-foreground text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold capitalize">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Placed on {order.date} • Delivered to {order.emirate}, UAE
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="font-mono font-black text-base text-foreground block">
                  {formatAED(order.totalFils)}
                </span>
                <span className="text-[10px] text-muted-foreground">Incl. 5% UAE VAT</span>
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-2 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-foreground font-medium">
                    {item.title} <strong className="text-muted-foreground">x{item.quantity}</strong>
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {formatAED(item.priceFils * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Invoicing & Tracking Action Bar */}
            <div className="pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Invoice: <strong className="text-foreground font-mono">{order.invoiceNumber}</strong></span>
              </div>

              <button
                type="button"
                onClick={() => downloadInvoice(order)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-muted/60 hover:bg-cyan-500 hover:text-black border border-border/80 font-semibold text-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Tax Invoice (PDF)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

