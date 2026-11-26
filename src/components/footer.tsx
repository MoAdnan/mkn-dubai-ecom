"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Building2,
} from "lucide-react";

export function Footer() {
  const [currentYear, setCurrentYear] = React.useState<number>(2026);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-card/70 border-t border-border/70 backdrop-blur-md text-muted-foreground mt-auto">
      {/* UAE Trust Highlights Bar */}
      <div className="border-b border-border/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-foreground font-semibold text-sm">Express UAE Delivery</h4>
              <p className="text-xs text-muted-foreground">Same-day in Dubai & Sharjah</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-foreground font-semibold text-sm">100% Genuine Warranty</h4>
              <p className="text-xs text-muted-foreground">Official UAE brand distributor stock</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-foreground font-semibold text-sm">7-Day Hassle-Free Returns</h4>
              <p className="text-xs text-muted-foreground">Easy refunds & exchanges</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-foreground font-semibold text-sm">FTA Tax Invoicing</h4>
              <p className="text-xs text-muted-foreground">5% VAT breakdown on all orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-[1px]">
                <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
                  <span className="font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-violet-400 text-sm">
                    MK
                  </span>
                </div>
              </div>
              <span className="font-heading font-black text-lg text-foreground tracking-tight">
                MKN <span className="text-cyan-400 font-normal">ELECTRONICS</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Dubai&apos;s premier online electronics retailer. Discover the latest flagship smartphones,
              pro-grade computing, audiophile gear, and smart living devices with guaranteed authenticity and official UAE service.
            </p>

            <div className="space-y-2 text-xs pt-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Showroom & Warehouse: Al Quoz Industrial Area 1, Dubai, UAE</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <a
                  href="https://wa.me/971561036858"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Phone & WhatsApp: +971 56 103 6858 (Sat - Thu, 9 AM - 8 PM GST)
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Support: support@mkn-dubai.ae</span>
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-foreground font-semibold text-sm mb-4">Shop Categories</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/catalogue?category=smartphones" className="hover:text-cyan-400 transition-colors">
                  Flagship Smartphones
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=laptops" className="hover:text-cyan-400 transition-colors">
                  Laptops & Ultrabooks
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=audio" className="hover:text-cyan-400 transition-colors">
                  Headphones & Hi-Fi
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=wearables" className="hover:text-cyan-400 transition-colors">
                  Smartwatches & Fitness
                </Link>
              </li>
              <li>
                <Link href="/catalogue?category=gaming" className="hover:text-cyan-400 transition-colors">
                  Gaming Consoles & Gear
                </Link>
              </li>
              <li>
                <Link href="/catalogue?deals=true" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  Dubai Special Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-heading text-foreground font-semibold text-sm mb-4">Customer Care</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/delivery" className="hover:text-cyan-400 transition-colors">
                  Delivery & Emirates Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-cyan-400 transition-colors">
                  Returns & Refunds Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cyan-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-cyan-400 transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact Us & Location
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About MKN Dubai
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="font-heading text-foreground font-semibold text-sm mb-4">Legal & Invoicing</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-cyan-400 transition-colors">
                  UAE Warranty Guide
                </Link>
              </li>
              <li>
                <Link href="/vat-guide" className="hover:text-cyan-400 transition-colors">
                  UAE Tax & VAT Invoicing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* UAE Regulatory & Tax Registration Block */}
        <div className="mt-12 pt-8 border-t border-border/40 grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-muted/20 p-4 rounded-2xl border border-border/30">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-medium text-foreground">
                MKN Electronics L.L.C. • Commercial License No. <strong>1048291</strong>
              </p>
              <p className="text-muted-foreground font-mono">
                Tax Registration Number (TRN): <strong className="text-foreground">100482918200003</strong>
              </p>
              <p className="text-[11px] text-muted-foreground">
                Regulated and registered under the United Arab Emirates Federal Tax Authority (FTA).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center md:justify-end gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-background border border-border/60 font-mono text-[11px]">
              Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 rounded-md bg-background border border-border/60 font-mono text-[11px]">
              Apple Pay
            </span>
            <span className="px-2.5 py-1 rounded-md bg-background border border-border/60 font-mono text-[11px]">
              Cash on Delivery (COD)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[11px]">
              5% VAT Included
            </span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground/80 gap-4">
          <p suppressHydrationWarning>© {currentYear} MKN Electronics L.L.C. All rights reserved. Made in Dubai, UAE.</p>
          <p className="flex items-center gap-1">
            <span>Official Distributor for UAE & GCC</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
