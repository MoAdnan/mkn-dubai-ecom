import * as React from "react";
import type { Metadata } from "next";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Building2,
} from "lucide-react";
import { ContactInquiryForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact & WhatsApp Support | MKN Electronics Dubai",
  description:
    "Chat with MKN Electronics Dubai on WhatsApp (+971 56 103 6858) or email support@mkn-dubai.ae for instant product availability and same-day delivery inquiries.",
};

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ContactPage() {
  const whatsappUrl =
    "https://wa.me/971561036858?text=Hello%20MKN%20Dubai%2C%20I%20have%20an%20inquiry%20regarding%20products%20and%20orders.";

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live UAE Customer Support</span>
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Get in Touch with MKN Dubai
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Need quick assistance, product advice, or have a delivery question? Connect directly with our Dubai operations team on WhatsApp or email.
        </p>
      </div>

      {/* Featured Primary WhatsApp Card (High Conversion UAE Standard) */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-card to-background p-6 sm:p-8 shadow-xl shadow-emerald-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md shadow-[#25D366]/30">
              <WhatsAppIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="font-heading font-black text-lg sm:text-xl text-foreground block">
                Instant WhatsApp Concierge
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Fastest Reply: Typically under 15 minutes</span>
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Chat directly with our tech specialists for real-time stock availability, same-day delivery scheduling in Dubai & Sharjah, order tracking, and cash on delivery inquiries.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#25D366]/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current" />
            <span>Chat on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <a
            href="tel:+971561036858"
            className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl border border-border/80 hover:border-foreground/30 bg-card font-semibold text-xs text-foreground transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4 text-violet-400" />
            <span>Call +971 56 103 6858</span>
          </a>
        </div>
      </div>

      {/* 2-Column Grid: Contact Information & Message Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Direct Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-5">
            <h3 className="font-heading font-bold text-base text-foreground">
              Official Communication Channels
            </h3>

            <div className="space-y-4 text-xs">
              {/* WhatsApp & Phone */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">WhatsApp & Phone Hotline</p>
                  <a
                    href="tel:+971561036858"
                    className="font-mono text-cyan-400 hover:underline block mt-0.5"
                  >
                    +971 56 103 6858
                  </a>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Available on WhatsApp for instant text & voice queries
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email Support (Invoicing & B2B)</p>
                  <a
                    href="mailto:support@mkn-dubai.ae"
                    className="font-mono text-foreground hover:text-cyan-400 transition-colors block mt-0.5"
                  >
                    support@mkn-dubai.ae
                  </a>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    For tax invoices, corporate inquiries, and warranties
                  </p>
                </div>
              </div>

              {/* Showroom & Warehouse Location */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Showroom & Fulfillment Center</p>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">
                    Al Quoz Industrial Area 1, P.O. Box 48291, Dubai, United Arab Emirates
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Working Hours (GST)</p>
                  <p className="text-muted-foreground mt-0.5">
                    Saturday – Thursday: 9:00 AM – 8:00 PM GST
                  </p>
                  <p className="text-[11px] text-muted-foreground">Friday: Dispatch only</p>
                </div>
              </div>
            </div>
          </div>

          {/* UAE Regulatory & Registration Badge */}
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>MKN Electronics L.L.C.</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Commercial License No. <strong>1048291</strong> • Tax Registration Number (TRN):{" "}
              <strong className="font-mono text-foreground">100482918200003</strong>
            </p>
          </div>
        </div>

        {/* Right Column: Contact Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-4">
            <div>
              <h3 className="font-heading font-bold text-base text-foreground">
                Send an Online Inquiry
              </h3>
              <p className="text-xs text-muted-foreground">
                Prefer email? Submit your message and our team will get back to you within 2 business hours.
              </p>
            </div>

            <ContactInquiryForm />
          </div>
        </div>
      </div>
    </main>
  );
}
