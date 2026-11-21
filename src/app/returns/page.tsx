import * as React from "react";
import type { Metadata } from "next";
import { RotateCcw, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Refund Policy | MKN Electronics Dubai",
  description: "7-day return guidelines and refund processing for electronics in the UAE.",
};

export default function ReturnsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
          Customer Assurance
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
          Returns & Refund Policy
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Simple, transparent return guidelines in accordance with UAE Consumer Protection Law.
        </p>
      </div>

      <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">
            1. 7-Day Unopened Return Window
          </h3>
          <p>
            You may return any electronics purchase within 7 days of delivery, provided the item is brand new, unopened, with all original factory seals, accessories, and promotional gifts intact.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">
            2. Defective Items (Dead on Arrival)
          </h3>
          <p>
            If a brand-new device exhibits a hardware failure upon initial unboxing within 48 hours, contact us immediately. Following verification by our technicians or the manufacturer service center, we will issue a direct replacement or full refund.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">
            3. Tax Credit Notes & Refund Processing
          </h3>
          <p>
            In compliance with UAE Federal Tax Authority rules, when an invoice is refunded, an official <strong>Credit Note</strong> is generated referencing the original Tax Invoice number. Card payments are refunded to the original card within 3-5 business days.
          </p>
        </div>
      </div>
    </main>
  );
}

