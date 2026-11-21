import * as React from "react";
import type { Metadata } from "next";
import { ShieldCheck, Award, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "UAE Warranty Policy | MKN Electronics Dubai",
  description: "Official manufacturer warranty coverage details for electronics sold in the UAE.",
};

export default function WarrantyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
          Authenticity & Coverage
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
          Official UAE Warranty
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Genuine products approved by the Telecommunications and Digital Government Regulatory Authority (TDRA).
        </p>
      </div>

      <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">
            1. Authorized Regional Service Centers
          </h3>
          <p>
            Every product purchased from MKN Dubai comes with official UAE manufacturer warranty (minimum 12 months, up to 24 months for select laptops and TVs). You can service your device at official centers across the UAE:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-foreground">
            <li><strong>Apple:</strong> Apple Store Dubai Mall, Mall of the Emirates, Yas Mall, and authorized service providers (Sharaf DG, Virgin).</li>
            <li><strong>Samsung:</strong> Official Samsung Brand Stores & Service Centers across Dubai, Abu Dhabi, and Sharjah.</li>
            <li><strong>Sony:</strong> Sony Authorized Middle East Service Center.</li>
            <li><strong>ASUS ROG:</strong> ASUS Middle East Service Center.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-foreground">
            2. Warranty Verification
          </h3>
          <p>
            The serial number on your device and matching Tax Invoice serve as full proof of purchase. Serial numbers are pre-registered with official distributor databases prior to fulfillment.
          </p>
        </div>
      </div>
    </main>
  );
}

