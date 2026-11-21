"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Zap,
  Phone,
  MapPin,
  ShieldAlert,
  Percent,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  SlidersHorizontal,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartDrawer } from "@/components/cart-drawer";

const CATEGORIES = [
  { name: "All Catalogue", href: "/catalogue", icon: SlidersHorizontal },
  { name: "Smartphones", href: "/catalogue?category=smartphones", icon: Smartphone },
  { name: "Laptops & Computing", href: "/catalogue?category=laptops", icon: Laptop },
  { name: "Audio & Hi-Fi", href: "/catalogue?category=audio", icon: Headphones },
  { name: "Wearables", href: "/catalogue?category=wearables", icon: Watch },
  { name: "Dubai Deals", href: "/catalogue?deals=true", icon: Percent, highlight: true },
];

export function Navbar() {
  const router = useRouter();
  const { totalCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogue?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? "bg-background/85 backdrop-blur-md border-b border-border/80 shadow-lg shadow-black/5"
            : "bg-background border-b border-border/40"
        }`}
      >
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-cyan-950 via-background to-violet-950/60 border-b border-border/40 text-[12px] py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-cyan-400">
                <Zap className="w-3.5 h-3.5 fill-cyan-400 animate-pulse" />
                <span>Express Same-Day Delivery across Dubai & Sharjah</span>
              </span>
              <span className="hidden md:inline text-muted-foreground/40">|</span>
              <span className="hidden md:inline text-muted-foreground">
                Free Delivery on orders above <strong className="text-foreground">AED 250</strong>
              </span>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="hidden lg:flex items-center gap-1 text-[11px]">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>Al Quoz Industrial 1, Dubai, UAE</span>
              </span>
              <a
                href="tel:+97143982211"
                className="hidden sm:flex items-center gap-1 text-[11px] hover:text-cyan-400 transition-colors"
              >
                <Phone className="w-3 h-3 text-violet-400" />
                <span>+971 4 398 2211</span>
              </a>
              <span className="font-mono text-cyan-400 font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-[10px] border border-cyan-500/20">
                AED (د.إ)
              </span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-[1px] shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                <div className="w-full h-full bg-background rounded-[11px] flex items-center justify-center">
                  <span className="font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-violet-400 text-lg">
                    MK
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-black tracking-tight text-lg sm:text-xl leading-tight text-foreground flex items-center gap-1">
                  MKN <span className="text-cyan-400 font-normal">ELECTRONICS</span>
                </span>
                <span className="text-[10px] tracking-wider text-muted-foreground uppercase font-medium">
                  Dubai • United Arab Emirates
                </span>
              </div>
            </Link>

            {/* Live Search bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-md relative items-center mx-4"
            >
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search iPhone, MacBook, Sony OLED, AirPods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 text-sm bg-muted/40 border border-border/80 rounded-full focus:bg-background focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-muted-foreground/70"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 text-xs font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Actions: Theme, Wishlist, Account, Cart */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <ThemeToggle />

              <Link
                href="/account/wishlist"
                className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border border-border/60 hover:border-border hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-all"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
              </Link>

              <Link
                href="/account"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 hover:border-cyan-500/40 hover:bg-accent/40 text-sm font-medium text-foreground transition-all"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span className="hidden xl:inline text-xs">Account</span>
              </Link>

              {/* Cart Drawer Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/15 to-violet-500/15 hover:from-cyan-500/25 hover:to-violet-500/25 border border-cyan-500/30 text-foreground transition-all"
                aria-label={`Open Cart with ${totalCount} items`}
              >
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline text-xs font-semibold">Cart</span>
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-black text-[11px] font-bold flex items-center justify-center">
                  {totalCount}
                </span>
              </button>
            </div>
          </div>

          {/* Category Navigation Bar (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 py-2.5 border-t border-border/40 text-sm overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    cat.highlight
                      ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <Link
                href="/admin"
                className="text-[11px] font-mono px-2 py-0.5 rounded border border-border/60 hover:border-cyan-500/40 text-muted-foreground hover:text-cyan-400 transition-colors"
              >
                Admin Portal →
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-muted/60 border border-border/80 rounded-xl focus:outline-none focus:border-cyan-500"
              />
            </form>

            <div className="space-y-1">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/40"
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{cat.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-border/40 grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg border border-border/60 text-center font-medium hover:bg-accent/30"
              >
                My Account
              </Link>
              <Link
                href="/account/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg border border-border/60 text-center font-medium hover:bg-accent/30"
              >
                Track Orders
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="col-span-2 p-2 rounded-lg bg-muted text-center font-mono text-[11px] text-muted-foreground"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}

