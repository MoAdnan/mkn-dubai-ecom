import * as React from "react";
import type { Metadata } from "next";
import { Truck, Clock, ShieldCheck, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Delivery & Shipping Information | MKN Electronics Dubai",
  description: "Shipping timelines and rates across Dubai, Abu Dhabi, Sharjah, and Northern Emirates.",
};

export default function DeliveryPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
          Emirates Logistics
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
          Delivery & Shipping Policy
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Express same-day and next-day distribution across all 7 United Arab Emirates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-foreground">
            Same-Day Express Delivery
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Available across <strong>Dubai & Sharjah</strong> for orders placed before 4:00 PM GST. Delivered within 4 hours by dedicated temperature-controlled electronics couriers.
          </p>
          <p className="font-mono text-cyan-400 font-bold text-xs">Fee: AED 35.00</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-foreground">
            Standard UAE Delivery
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Delivered within 1 to 2 business days across all 7 Emirates: Abu Dhabi, Dubai, Sharjah, Ajman, Ras Al Khaimah, Umm Al Quwain, and Fujairah.
          </p>
          <p className="font-mono text-foreground font-bold text-xs">
            FREE on orders above AED 250 (Otherwise AED 20.00)
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-muted/20 p-6 space-y-4 text-xs">
        <h3 className="font-heading font-bold text-sm text-foreground">
          Delivery Verification & Security
        </h3>
        <ul className="space-y-2 text-muted-foreground list-disc pl-4 leading-relaxed">
          <li>High-value gadgets (above AED 2,000) require an SMS One-Time Passcode (OTP) verification upon delivery.</li>
          <li>For Cash on Delivery orders, courier accepts cash (exact change appreciated) or contactless card tap on mobile POS terminal.</li>
          <li>Real-time GPS tracking link sent via SMS once shipment departs Al Quoz fulfillment warehouse.</li>
        </ul>
      </div>
    </main>
  );
}

