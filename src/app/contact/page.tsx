import * as React from "react";
import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | MKN Electronics Dubai",
  description: "Get in touch with MKN Electronics Dubai customer service and visit our Al Quoz fulfillment center.",
};

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
          Customer Support
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
          Contact MKN Dubai
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Our Dubai-based tech advisory and customer care team is available 6 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
            <h3 className="font-heading font-bold text-base text-foreground">
              Direct Contact Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Showroom & Distribution Warehouse</p>
                  <p className="text-muted-foreground">Showroom 4, Al Quoz Industrial Area 1, P.O. Box 48291, Dubai, UAE</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Phone & WhatsApp Hotline</p>
                  <p className="text-muted-foreground font-mono">+971 4 398 2211 / +971 50 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Email Support</p>
                  <p className="text-muted-foreground">support@mkn-dubai.ae / orders@mkn-dubai.ae</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Working Hours (Gulf Standard Time)</p>
                  <p className="text-muted-foreground">Saturday – Thursday: 9:00 AM – 8:00 PM GST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 text-xs text-muted-foreground">
            Commercial License: <strong>1048291</strong> • Tax Registration Number: <strong>100482918200003</strong>
          </div>
        </div>

        {/* Contact Message Form */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <h3 className="font-heading font-bold text-base text-foreground">
            Send an Inquiry
          </h3>
          <form className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="Full Name"
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.ae"
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">UAE Phone</label>
              <input
                type="tel"
                placeholder="+971 50 123 4567"
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">Message</label>
              <textarea
                rows={4}
                required
                placeholder="How can our tech team assist you?"
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="button"
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-md shadow-cyan-500/20 transition-colors"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

