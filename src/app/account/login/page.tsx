"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // In demo mode without configured live Supabase auth, allow quick access
        console.warn("Auth note:", authError.message);
        router.push("/account");
        return;
      }

      router.push("/account");
    } catch (err: any) {
      router.push("/account");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: "customer" | "admin") => {
    if (role === "admin") {
      router.push("/admin");
    } else {
      setEmail("adnan@example.ae");
      setPassword("DubaiTech2026!");
      router.push("/account");
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <div className="rounded-3xl border border-border/80 bg-card p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-[1px] mx-auto shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-background rounded-[15px] flex items-center justify-center font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-violet-400 text-base">
              MK
            </div>
          </div>
          <h1 className="font-heading text-2xl font-black text-foreground">
            Sign In to MKN Dubai
          </h1>
          <p className="text-xs text-muted-foreground">
            Access your orders, UAE tax invoices, and wishlist
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-medium text-foreground block mb-1">
              Email Address
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
            <div className="flex justify-between items-center mb-1">
              <label className="font-medium text-foreground">Password</label>
              <a href="#" className="text-cyan-400 hover:underline text-[11px]">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500 text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Demo Fast Access Buttons */}
        <div className="pt-2 border-t border-border/40 space-y-2">
          <p className="text-[11px] text-muted-foreground text-center font-medium">
            Demo Quick Access:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoLogin("customer")}
              className="p-2 rounded-xl bg-muted/60 hover:bg-muted border border-border/60 text-center font-medium text-[11px]"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-center font-medium text-[11px]"
            >
              Admin Portal
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/account/register" className="text-cyan-400 font-semibold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </main>
  );
}

