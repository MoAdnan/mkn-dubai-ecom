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
} from "lucide-react";
import { formatAED } from "@/lib/utils";
import { generateTaxInvoicePDF } from "@/lib/invoice/generate-pdf";
import type { StoredOrder } from "@/lib/services/persistent-store";

interface CustomerOrdersClientProps {
  initialOrders: StoredOrder[];
}

export function CustomerOrdersClient({ initialOrders }: CustomerOrdersClientProps) {
  const [orders, setOrders] = React.useState<StoredOrder[]>(initialOrders);

  React.useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const downloadInvoice = (order: StoredOrder) => {
    const doc = generateTaxInvoicePDF({
      invoiceNumber: order.invoiceNumber,
      orderNumber: order.orderNumber,
      invoiceType: order.isB2B ? "full" : "simplified",
      issueDate: order.date,
      supplyDate: order.date,
      supplier: {
        name: "MKN Electronics L.L.C.",
        address: "Al Quoz Industrial 1, P.O. Box 48291, Dubai, UAE",
        trn: "100482918200003",
        license: "1048291",
      },
      customer: {
        name: order.customer,
        email: order.email,
        phone: order.phone,
        address: order.address,
        emirate: order.emirate,
        trn: order.customerTRN || undefined,
      },
      lines: order.items.map((it) => {
        const itemVat = Math.round(it.priceFils - it.priceFils / 1.05);
        return {
          title: it.title,
          sku: it.sku || "MKN-SKU",
          quantity: it.quantity,
          unitPriceFils: it.priceFils,
          taxableFils: it.priceFils - itemVat,
          vatFils: itemVat,
          totalFils: it.priceFils * it.quantity,
        };
      }),
      subtotalFils: order.subtotalFils,
      discountFils: order.discountFils,
      shippingFils: order.shippingFils,
      vatFils: order.vatFils,
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
          My Orders & Tax Invoices ({orders.length})
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Review your purchase history and download official UAE Federal Tax Authority VAT invoices.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-4">
          <Package className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="font-heading text-lg font-bold">No orders found</h2>
          <p className="text-xs text-muted-foreground">
            You haven&apos;t placed any electronics orders yet.
          </p>
          <Link
            href="/catalogue"
            className="inline-block px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
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
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-semibold capitalize">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Placed on {order.date} • Delivering to {order.emirate}, UAE
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
                  {order.trackingNumber && (
                    <span className="ml-3 text-cyan-400 font-mono">
                      Tracking: {order.trackingNumber}
                    </span>
                  )}
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
      )}
    </main>
  );
}

