import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MKN Electronics Dubai",
  description: "Privacy policy and data protection standards compliant with UAE Federal Personal Data Protection Law.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
          Data Protection
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Compliant with UAE Federal Decree-Law No. (45) of 2021 on Personal Data Protection (PDPL).
        </p>
      </div>

      <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">1. Information We Collect</h3>
          <p>
            We collect personal information necessary for processing transactions and delivering electronics, including customer name, email address, delivery address across Emirates, UAE phone number, and TRN for corporate accounts.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">2. Payment Security</h3>
          <p>
            Payment card credentials are encrypted and processed directly by our PCI-DSS Level 1 certified payment gateway (Stripe). MKN Electronics never stores raw credit or debit card numbers on its servers.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">3. Tax Record Retention</h3>
          <p>
            In accordance with UAE Federal Tax Authority regulations, invoice data and customer identity details associated with financial transactions are retained in secure archives for a minimum period of 5 years.
          </p>
        </div>
      </div>
    </main>
  );
}

