"use client";

import * as React from "react";
import { Settings, Save, CheckCircle2, ShieldCheck, Building2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = React.useState("MKN Electronics L.L.C.");
  const [tagline, setTagline] = React.useState("Dubai's Premier Flagship Electronics Destination");
  const [licenseNumber, setLicenseNumber] = React.useState("1048291");
  const [trn, setTrn] = React.useState("100482918200003");
  const [vatRate, setVatRate] = React.useState(5.0);
  const [freeShippingThresholdAED, setFreeShippingThresholdAED] = React.useState(250);
  const [standardDeliveryFeeAED, setStandardDeliveryFeeAED] = React.useState(20);
  const [expressDeliveryFeeAED, setExpressDeliveryFeeAED] = React.useState(35);
  const [stripeEnabled, setStripeEnabled] = React.useState(true);
  const [codEnabled, setCodEnabled] = React.useState(true);
  const [telrEnabled, setTelrEnabled] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-black text-foreground">
          Store Settings & UAE Compliance
        </h1>
        <p className="text-xs text-muted-foreground">
          Federal Tax Authority (FTA) parameters, trade licensing, emirates delivery rates, and payment gateways.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Store and tax settings successfully saved and applied.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. Legal Entity & Tax */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <h2 className="font-heading font-bold text-sm text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>UAE Tax & Commercial Registration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1">Registered Trade Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Dubai Commercial License No.</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Tax Registration Number (TRN)</label>
              <input
                type="text"
                value={trn}
                onChange={(e) => setTrn(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">VAT Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={vatRate}
                onChange={(e) => setVatRate(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. UAE Delivery Rates */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <h2 className="font-heading font-bold text-sm text-foreground">
            UAE Shipping Configuration (AED)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold block mb-1">Free Delivery Min. Order</label>
              <input
                type="number"
                value={freeShippingThresholdAED}
                onChange={(e) => setFreeShippingThresholdAED(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Standard Delivery Fee</label>
              <input
                type="number"
                value={standardDeliveryFeeAED}
                onChange={(e) => setStandardDeliveryFeeAED(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Express Same-Day Fee</label>
              <input
                type="number"
                value={expressDeliveryFeeAED}
                onChange={(e) => setExpressDeliveryFeeAED(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Payment Gateways Toggle */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <h2 className="font-heading font-bold text-sm text-foreground">
            Enabled Payment Gateways
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60 cursor-pointer">
              <div>
                <span className="font-semibold text-foreground block">Stripe Gateway</span>
                <span className="text-[11px] text-muted-foreground">Visa, Mastercard, Apple Pay</span>
              </div>
              <input
                type="checkbox"
                checked={stripeEnabled}
                onChange={(e) => setStripeEnabled(e.target.checked)}
                className="w-4 h-4 text-cyan-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60 cursor-pointer">
              <div>
                <span className="font-semibold text-foreground block">Cash on Delivery (COD)</span>
                <span className="text-[11px] text-muted-foreground">Pay courier in cash/card on delivery</span>
              </div>
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="w-4 h-4 text-cyan-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60 cursor-pointer opacity-70">
              <div>
                <span className="font-semibold text-foreground block">Telr UAE Gateway (Modular Pluggable)</span>
                <span className="text-[11px] text-muted-foreground">Local UAE debit cards and GCC gateways</span>
              </div>
              <input
                type="checkbox"
                checked={telrEnabled}
                onChange={(e) => setTelrEnabled(e.target.checked)}
                className="w-4 h-4 text-cyan-500 rounded"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </form>
    </div>
  );
}

