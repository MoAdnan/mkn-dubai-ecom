import * as React from "react";
import type { Metadata } from "next";
import { Building2, ShieldCheck, Truck, Award, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | MKN Electronics Dubai",
  description: "Learn more about MKN Electronics L.L.C., Dubai's premier online electronics destination.",
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-4">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
          About MKN Electronics
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
          Pioneering Electronics Retail in the UAE
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Founded in Dubai, MKN Electronics L.L.C. was built to deliver genuine flagship tech, transparent 5% FTA VAT tax compliance, and express fulfillment across all seven Emirates.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-foreground">
            Dubai Commercial Registration
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            MKN Electronics L.L.C. operates under Dubai Commercial License No. <strong>1048291</strong> with headquarters and primary fulfillment center in Al Quoz Industrial Area 1, Dubai, UAE.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-foreground">
            Federal Tax Authority (FTA) Registered
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Fully registered for UAE Value Added Tax under TRN: <strong>100482918200003</strong>. Every order receives a sequential, gapless Tax Invoice with explicit VAT line accounting.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-foreground">
            100% Genuine Distributor Stock
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We partner exclusively with authorized UAE and GCC distributors for Apple, Samsung, Sony, ASUS ROG, Bose, and LG, guaranteeing official regional service warranties.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-foreground">
            Express Emirates Fulfillment
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Same-day 4-hour delivery in Dubai and Sharjah, and guaranteed next-day dispatch to Abu Dhabi, Ajman, RAK, UAQ, and Fujairah.
          </p>
        </div>
      </div>
    </main>
  );
}

