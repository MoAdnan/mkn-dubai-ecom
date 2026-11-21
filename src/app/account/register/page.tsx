"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle, Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isB2B, setIsB2B] = React.useState(false);
  const [companyName, setCompanyName] = React.useState("");
  const [trn, setTrn] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            company_name: isB2B ? companyName : null,
            trn: isB2B ? trn : null,
          },
        },
      });

      if (authError) {
        console.warn("Auth note:", authError.message);
      }

      router.push("/account");
    } catch (err: any) {
      router.push("/account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-2xl font-black text-foreground">
            Create an Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Join MKN Dubai for express checkout, order tracking, and tax invoices
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-foreground block mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                placeholder="Adnan Al-Hashimi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-foreground block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="name@example.ae"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-foreground block mb-1">
              UAE Mobile Phone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                required
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-foreground block mb-1">
              Password (min 8 characters) *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500 text-xs font-mono"
              />
            </div>
          </div>

          {/* B2B TRN Toggle */}
          <div className="pt-2 border-t border-border/40">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={isB2B}
                onChange={(e) => setIsB2B(e.target.checked)}
                className="rounded border-border text-cyan-500"
              />
              <span>Register as a UAE Corporate / B2B Account</span>
            </label>

            {isB2B && (
              <div className="space-y-3 mt-3 p-3 bg-muted/30 rounded-xl border border-border/40">
                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Company Registered Name
                  </label>
                  <input
                    type="text"
                    placeholder="Tech Solutions L.L.C."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-background border border-border/80 text-xs"
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Federal Tax Authority TRN (15 Digits)
                  </label>
                  <input
                    type="text"
                    placeholder="100XXXXXXXXXXXX"
                    value={trn}
                    onChange={(e) => setTrn(e.target.value)}
                    className="w-full p-2 rounded-lg bg-background border border-border/80 text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Already registered?{" "}
          <Link href="/account/login" className="text-cyan-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}

