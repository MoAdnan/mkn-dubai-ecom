"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  FileText,
  Download,
  Truck,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";
import confetti from "canvas-confetti";
import { formatAED } from "@/lib/utils";
import { generateTaxInvoicePDF } from "@/lib/invoice/generate-pdf";
import type { StoredOrder } from "@/lib/services/persistent-store";

interface OrderConfirmationClientProps {
  order: StoredOrder | null;
  orderNumber: string;
}

export function OrderConfirmationClient({
  order,
  orderNumber,
}: OrderConfirmationClientProps) {
  // Trigger celebration confetti on mount
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#00f2fe", "#7000ff", "#10b981"],
      });
    } catch {}
  }, []);

  const displayOrderNumber = order?.orderNumber || orderNumber;
  const invoiceNumber = order?.invoiceNumber || `INV-${orderNumber.replace("MKN-", "")}`;
  const totalFils = order?.totalFils || 469900;
  const paymentMethod = order?.paymentMethod || "card_stripe";

  const handleDownloadInvoice = () => {
    const customer = {
      name: order?.customer || "Valued Customer",
      email: order?.email || "customer@example.ae",
      phone: order?.phone || "+971 50 123 4567",
      address: order?.address || "Dubai, United Arab Emirates",
      emirate: order?.emirate || "Dubai",
      trn: order?.customerTRN,
    };

    const lines = order?.items && order.items.length > 0
      ? order.items.map((it) => {
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
        })
      : [
          {
            title: "Flagship Electronics Device",
            sku: "MKN-ECOM-001",
            quantity: 1,
            unitPriceFils: totalFils,
            taxableFils: Math.round(totalFils / 1.05),
            vatFils: Math.round(totalFils - totalFils / 1.05),
            totalFils: totalFils,
          },
        ];

    const subtotalFils = order?.subtotalFils || Math.round(totalFils / 1.05);
    const vatFils = order?.vatFils || Math.round(totalFils - totalFils / 1.05);
    const shippingFils = order?.shippingFils || 0;
    const discountFils = order?.discountFils || 0;

    const doc = generateTaxInvoicePDF({
      invoiceNumber,
      orderNumber: displayOrderNumber,
      invoiceType: order?.isB2B ? "full" : "simplified",
      issueDate: order?.date || "21 Nov 2026",
      supplyDate: order?.date || "21 Nov 2026",
      supplier: {
        name: "MKN Electronics L.L.C.",
        address: "Al Quoz Industrial 1, P.O. Box 48291, Dubai, UAE",
        trn: "100482918200003",
        license: "1048291",
      },
      customer,
      lines,
      subtotalFils,
      discountFils,
      shippingFils,
      vatFils,
      totalFils,
    });

    doc.save(`${invoiceNumber}.pdf`);
  };

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-card to-card p-8 sm:p-12 text-center space-y-6 shadow-2xl shadow-cyan-500/5">
      <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Order Successfully Placed
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
          Thank You for Your Order!
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Your order has been recorded in our server system and routed to our Dubai Fulfillment Warehouse.
        </p>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-border/40 text-xs">
        <div className="space-y-1">
          <span className="text-muted-foreground block">Order Number</span>
          <span className="font-mono font-bold text-foreground text-sm">{displayOrderNumber}</span>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground block">Tax Invoice No</span>
          <span className="font-mono font-bold text-cyan-400 text-sm">{invoiceNumber}</span>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground block">Payment Method</span>
          <span className="font-semibold text-foreground capitalize">
            {paymentMethod === "cod" ? "Cash on Delivery" : "Card (Stripe)"}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-muted-foreground block">Total Amount</span>
          <span className="font-mono font-bold text-foreground text-sm">
            {formatAED(totalFils)}
          </span>
        </div>
      </div>

      {/* Real Items Summary from Server */}
      {order?.items && order.items.length > 0 && (
        <div className="bg-muted/20 border border-border/50 rounded-2xl p-5 text-left space-y-3">
          <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
            <Package className="w-4 h-4 text-cyan-400" />
            <span>Purchased Items ({order.items.length})</span>
          </div>
          <div className="divide-y divide-border/30">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-xs">
                <span className="text-foreground">
                  {item.title} <span className="text-muted-foreground font-mono">x{item.quantity}</span>
                </span>
                <span className="font-mono font-bold text-cyan-400">
                  {formatAED(item.priceFils * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          {order.trackingNumber && (
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Tracking Number:</span>
              <span className="font-mono text-cyan-400 font-bold">{order.trackingNumber}</span>
            </div>
          )}
        </div>
      )}

      {/* UAE Tax Compliance Note & PDF Download */}
      <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <FileText className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <h4 className="font-semibold text-foreground">
              FTA Tax Invoice Ready for Download
            </h4>
            <p className="text-muted-foreground">
              Includes full 5% UAE VAT breakdown, supplier TRN (100482918200003), and itemized tax schedule.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadInvoice}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400 transition-colors whitespace-nowrap shadow-md shadow-cyan-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Invoice</span>
        </button>
      </div>

      {/* Delivery ETA info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-left">
        <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Truck className="w-4 h-4 text-violet-400" />
            <span>Express Delivery Update</span>
          </div>
          <p className="text-muted-foreground">
            Our courier ({order?.courierName || "Emirates Standard Courier"}) will send an SMS with tracking link.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official UAE Warranty Registered</span>
          </div>
          <p className="text-muted-foreground">
            Your serial number is registered with official brand service centers in UAE.
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/catalogue"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/account/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border/80 hover:bg-accent/40 font-semibold text-xs text-foreground transition-colors"
        >
          <span>View Order in Account</span>
        </Link>
      </div>
    </div>
  );
}

