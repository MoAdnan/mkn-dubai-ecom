"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  FileText,
  Download,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { formatAED, filsToAED } from "@/lib/utils";
import { generateTaxInvoicePDF } from "@/lib/invoice/generate-pdf";

function OrderConfirmationContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const orderNumber = (params?.orderNumber as string) || "MKN-2026-98214";
  const invoiceNumber = searchParams.get("invoice") || "INV-2026-98214";
  const totalFils = Number(searchParams.get("total")) || 469900;
  const paymentMethod = searchParams.get("method") || "card_stripe";

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

  const handleDownloadInvoice = () => {
    const vatFils = Math.round(totalFils - totalFils / 1.05);
    const doc = generateTaxInvoicePDF({
      invoiceNumber,
      orderNumber,
      invoiceType: "simplified",
      issueDate: "21 Nov 2026",
      supplyDate: "21 Nov 2026",
      supplier: {
        name: "MKN Electronics L.L.C.",
        address: "Al Quoz Industrial 1, P.O. Box 48291, Dubai, UAE",
        trn: "100482918200003",
        license: "1048291",
      },
      customer: {
        name: "Valued Customer",
        email: "customer@example.ae",
        phone: "+971 50 123 4567",
        address: "Sheikh Mohammed bin Rashid Blvd, Downtown Dubai",
        emirate: "Dubai",
      },
      lines: [
        {
          title: "Flagship Electronics Device",
          sku: "MKN-ECOM-001",
          quantity: 1,
          unitPriceFils: totalFils,
          taxableFils: totalFils - vatFils,
          vatFils: vatFils,
          totalFils: totalFils,
        },
      ],
      subtotalFils: totalFils,
      discountFils: 0,
      shippingFils: 0,
      vatFils: vatFils,
      totalFils: totalFils,
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
          Your electronics order has been confirmed and routed to our Dubai Fulfillment Warehouse.
        </p>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-border/40 text-xs">
        <div className="space-y-1">
          <span className="text-muted-foreground block">Order Number</span>
          <span className="font-mono font-bold text-foreground text-sm">{orderNumber}</span>
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
            Our courier will send an SMS with real-time tracking link prior to delivery.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official UAE Warranty Registered</span>
          </div>
          <p className="text-muted-foreground">
            Your device serial number has been registered with the official brand service centers in UAE.
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

export default function OrderConfirmationPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Suspense
        fallback={
          <div className="py-20 text-center text-muted-foreground animate-pulse">
            Loading order details...
          </div>
        }
      >
        <OrderConfirmationContent />
      </Suspense>
    </main>
  );
}
