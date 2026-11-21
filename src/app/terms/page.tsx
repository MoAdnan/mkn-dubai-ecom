import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | MKN Electronics Dubai",
  description: "Terms and conditions governing orders, payments, warranties, and deliveries in the UAE.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
          Legal Agreement
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Governed by the laws of the Emirate of Dubai and applicable federal laws of the United Arab Emirates.
        </p>
      </div>

      <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">1. Introduction</h3>
          <p>
            These Terms govern your use of the website operated by MKN Electronics L.L.C., a limited liability company incorporated in Dubai, UAE under Commercial License No. 1048291.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">2. Pricing & Currency</h3>
          <p>
            All prices are quoted and processed in United Arab Emirates Dirhams (AED) and include the statutory 5% Value Added Tax (VAT) in accordance with UAE federal tax regulations.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">3. Governing Law & Dispute Resolution</h3>
          <p>
            Any dispute arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of the Emirate of Dubai, UAE.
          </p>
        </div>
      </div>
    </main>
  );
}

