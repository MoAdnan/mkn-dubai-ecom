"use client";

import * as React from "react";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactInquiryForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [subject, setSubject] = React.useState("general");
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3 animate-in fade-in">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="font-heading font-bold text-foreground text-sm">
          Inquiry Received Successfully!
        </h4>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Thank you <strong className="text-foreground">{name}</strong>. Our Dubai operations team has received your inquiry and will contact you at{" "}
          <strong className="text-foreground">{email}</strong> within 2 business hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setMessage("");
          }}
          className="mt-2 text-xs text-cyan-400 hover:underline font-semibold"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-medium text-foreground block mb-1">Your Full Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mohammed Al-Hashimi"
            className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="font-medium text-foreground block mb-1">Email Address *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.ae"
            className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-medium text-foreground block mb-1">UAE Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s-]/g, ""))}
            placeholder="+971 50 000 0000"
            className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="font-medium text-foreground block mb-1">Inquiry Subject</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="general">Product Availability & Pricing</option>
            <option value="delivery">Same-Day Express Delivery</option>
            <option value="orders">Existing Order Tracking</option>
            <option value="b2b">Corporate / B2B Quotation</option>
            <option value="warranty">Warranty & Repairs</option>
          </select>
        </div>
      </div>

      <div>
        <label className="font-medium text-foreground block mb-1">Your Message *</label>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please tell us which products or questions you have..."
          className="w-full p-3 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer shadow-lg shadow-primary/20"
      >
        <Send className="w-3.5 h-3.5" />
        <span>Submit Inquiry to MKN Dubai</span>
      </button>
    </form>
  );
}
