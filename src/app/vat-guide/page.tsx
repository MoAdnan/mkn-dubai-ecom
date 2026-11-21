import * as React from "react";
import type { Metadata } from "next";
import { FileText, Building2, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "UAE Tax & Invoicing Guide | MKN Electronics Dubai",
  description: "Explanation of UAE FTA 5% VAT requirements, simplified and full tax invoices, and legal compliance.",
};

export default function VatGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
          FTA Compliance Guide
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
          UAE VAT & Tax Invoicing
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          How MKN Electronics complies with UAE Federal Decree-Law No. (8) of 2017 on Value Added Tax.
        </p>
      </div>

      <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">
            1. Registered Taxable Person Details
          </h3>
          <ul className="space-y-1 font-mono text-foreground">
            <li>Legal Entity: MKN Electronics L.L.C.</li>
            <li>Commercial License No: 1048291</li>
            <li>Tax Registration Number (TRN): 100482918200003</li>
            <li>Tax Period: Quarterly (Calendar Quarter)</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">
            2. Simplified vs Full Tax Invoice
          </h3>
          <p>
            Under Article 59 of Executive Regulation of Federal Decree-Law No. (8) of 2017:
          </p>
          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong>Simplified Tax Invoice:</strong> Issued for B2C retail orders up to AED 10,000 where the recipient is not registered for Tax. Shows supplier name, TRN, sequential invoice number, supply date, description of goods, total consideration, and VAT amount charged.
            </li>
            <li>
              <strong>Full Tax Invoice:</strong> Issued for all B2B transactions or orders exceeding AED 10,000. Includes customer registered legal name, address, customer TRN, unit prices, taxable amounts, and line-by-line VAT breakdown.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">
            3. Gapless Sequential Numbering & 5-Year Retention
          </h3>
          <p>
            All invoice numbers are generated via an atomic database sequence (`INV-YYYY-XXXXX`) inside a Postgres transaction, guaranteeing no gaps in sequence. Tax invoices are immutable and stored in audited archives for a mandatory retention period of at least five (5) years.
          </p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">
            4. Future Readiness for UAE E-Invoicing (PINT AE / Peppol)
          </h3>
          <p>
            Our database model separates invoice headers and line items (`invoices` and `invoice_lines`), matching the standardized schema required for upcoming UAE Federal Tax Authority Phase 2 E-Invoicing (PINT AE format).
          </p>
        </div>
      </div>
    </main>
  );
}

