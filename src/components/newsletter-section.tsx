"use client";

import * as React from "react";
import { Send, Sparkles, Check, Copy } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
  };

  const copyCoupon = () => {
    navigator.clipboard.writeText("WELCOME10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-cyan-950/40 via-card to-violet-950/40 border border-cyan-500/30 p-8 sm:p-12 lg:p-16 text-center">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exclusive Dubai Tech Club</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground">
            Get AED 100 Off Your First Order
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Subscribe for VIP launch alerts, Dubai flash deals, and technology insights.
            No spam, cancel anytime.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl bg-background/80 border border-border/80 focus:outline-none focus:border-cyan-500 text-sm placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="pt-4 max-w-md mx-auto p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-left">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-1">
                <Check className="w-4 h-4" />
                <span>You&apos;re on the VIP list!</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Use your welcome coupon during checkout for instant savings:
              </p>
              <div className="flex items-center justify-between bg-background px-3 py-2 rounded-xl border border-border/80">
                <span className="font-mono font-bold text-sm text-foreground">WELCOME10</span>
                <button
                  type="button"
                  onClick={copyCoupon}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

