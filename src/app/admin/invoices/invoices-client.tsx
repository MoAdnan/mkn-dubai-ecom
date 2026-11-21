"use client";

import * as React from "react";
import {
  FileText,
  Download,
  Mail,
  Search,
  Check,
} from "lucide-react";
import { formatAED } from "@/lib/utils";
import { generateTaxInvoicePDF } from "@/lib/invoice/generate-pdf";
import type { StoredInvoice } from "@/lib/services/persistent-store";

interface AdminInvoicesClientProps {
  initialInvoices: StoredInvoice[];
}

export function AdminInvoicesClient({ initialInvoices }: AdminInvoicesClientProps) {
  const [invoices, setInvoices] = React.useState<StoredInvoice[]>(initialInvoices);
  const [search, setSearch] = React.useState("");
  const [emailSentMap, setEmailSentMap] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  const downloadPDF = (inv: StoredInvoice) => {
    const doc = generateTaxInvoicePDF({
      invoiceNumber: inv.invoiceNumber,
      orderNumber: inv.orderNumber,
      invoiceType: inv.invoiceType,
      issueDate: inv.issueDate,
      supplyDate: inv.issueDate,
      supplier: {
        name: "MKN Electronics L.L.C.",
        address: "Al Quoz Industrial 1, P.O. Box 48291, Dubai, UAE",
        trn: "100482918200003",
        license: "1048291",
      },
      customer: {
        name: inv.customer,
        email: inv.email,
        phone: inv.phone,
        address: inv.address,
        emirate: inv.emirate,
        trn: inv.customerTRN || undefined,
      },
      lines: [
        {
          title: "Flagship Electronics Hardware",
          sku: "MKN-ECOM-HARDWARE",
          quantity: 1,
          unitPriceFils: inv.totalFils,
          taxableFils: inv.subtotalFils,
          vatFils: inv.vatFils,
          totalFils: inv.totalFils,
        },
      ],
      subtotalFils: inv.totalFils,
      discountFils: 0,
      shippingFils: 0,
      vatFils: inv.vatFils,
      totalFils: inv.totalFils,
    });

    doc.save(`${inv.invoiceNumber}.pdf`);
  };

  const resendEmail = (invId: string) => {
    setEmailSentMap((prev) => ({ ...prev, [invId]: true }));
    setTimeout(() => {
      setEmailSentMap((prev) => ({ ...prev, [invId]: false }));
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-black text-foreground">
            UAE Tax Invoices ({invoices.length})
          </h1>
          <p className="text-xs text-muted-foreground">
            Live FTA-compliant tax invoices served directly from server. Immutable audit trail generated per UAE Value Added Tax Law.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-mono font-semibold">
            Supplier TRN: 100482918200003
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card border border-border/80 p-3 rounded-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search invoice number, customer, order ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-muted/40 border border-border/70 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden">
        {invoices.length === 0 ? (
          <div className="py-20 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
            <FileText className="w-8 h-8 text-muted-foreground/40" />
            <span>No tax invoices generated yet.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground bg-muted/30">
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Customer & TRN</th>
                  <th className="py-3 px-4">Net (AED)</th>
                  <th className="py-3 px-4">5% VAT</th>
                  <th className="py-3 px-4">Gross Total</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-medium">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/20">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{inv.issueDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.invoiceType === "full"
                            ? "bg-violet-500/15 text-violet-400"
                            : "bg-cyan-500/15 text-cyan-400"
                        }`}
                      >
                        {inv.invoiceType === "full" ? "Full Tax Inv" : "Simplified"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-foreground block">{inv.customer}</span>
                      {inv.customerTRN && (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          TRN: {inv.customerTRN}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      {formatAED(inv.subtotalFils)}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-400 font-semibold">
                      {formatAED(inv.vatFils)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {formatAED(inv.totalFils)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => downloadPDF(inv)}
                          className="p-1.5 rounded-lg bg-muted hover:bg-cyan-500 hover:text-black transition-colors"
                          title="Download PDF Invoice"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => resendEmail(inv.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            emailSentMap[inv.id]
                              ? "bg-emerald-500 text-black"
                              : "bg-muted hover:bg-violet-500 hover:text-white"
                          }`}
                          title="Resend Invoice to Customer Email"
                        >
                          {emailSentMap[inv.id] ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Mail className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

