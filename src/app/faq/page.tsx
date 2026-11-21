import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | MKN Electronics Dubai",
  description: "Answers to common questions about UAE delivery, warranty, tax invoices, and payments.",
};

const FAQS = [
  {
    q: "Are all electronics sold by MKN Dubai 100% genuine with UAE warranty?",
    a: "Yes, 100%. We source exclusively from authorized UAE brand distributors (Apple UAE, Samsung Gulf, Sony Middle East, ASUS Middle East). All products carry official TDRA approval and manufacturer warranty valid at authorized service centers across the UAE.",
  },
  {
    q: "How does Same-Day Express Delivery in Dubai work?",
    a: "Orders placed before 4:00 PM GST for Dubai and Sharjah addresses are dispatched directly from our Al Quoz fulfillment warehouse and delivered within 4 hours. Standard delivery across other Emirates takes 1 to 2 business days.",
  },
  {
    q: "Do your prices include the 5% UAE VAT?",
    a: "Yes. In accordance with UAE Federal Tax Authority (FTA) retail regulations, all prices displayed on our website are inclusive of 5% VAT. A sequential, FTA-compliant Tax Invoice is generated automatically upon order payment.",
  },
  {
    q: "Can I receive a Full Tax Invoice with my company's TRN for B2B procurement?",
    a: "Absolutely. During checkout, toggle the 'Corporate / B2B Order' checkbox and input your company name and 15-digit UAE TRN. Our system will automatically produce a Full Tax Invoice showing both supplier and buyer TRN for your VAT tax return filing.",
  },
  {
    q: "What payment methods are supported?",
    a: "We accept Visa, Mastercard, Apple Pay via our 256-bit SSL encrypted Stripe gateway, as well as Cash on Delivery (COD) across all seven Emirates.",
  },
  {
    q: "What is your return policy for electronics?",
    a: "We offer a 7-day return policy for unopened, factory-sealed electronics. In the rare case of an out-of-the-box hardware defect, items are eligible for immediate replacement under the official UAE manufacturer warranty.",
  },
];

export default function FAQPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
          Help Center
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Everything you need to know about purchasing electronics with MKN Dubai.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border/80 bg-card p-5 space-y-2"
          >
            <h3 className="font-heading font-bold text-sm sm:text-base text-foreground">
              {faq.q}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

