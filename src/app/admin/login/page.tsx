"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  Sparkles,
  Briefcase,
  KeyRound,
  Eye,
  EyeOff,
  Store,
} from "lucide-react";
import { loginAction, fastLoginAction } from "@/app/actions/auth";
import type { UserRole } from "@/lib/services/auth-service";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAction(email, password);
      if (!res.success) {
        setError(res.error || "Invalid administrator credentials.");
        return;
      }

      if (res.user?.role !== "admin" && res.user?.role !== "staff") {
        setError("Access Denied: Your account does not have administrative privileges.");
        return;
      }

      router.push(redirectUrl);
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const handleFastLogin = async (role: "admin" | "staff") => {
    setLoading(true);
    setError(null);

    try {
      const res = await fastLoginAction(role);
      router.push(role === "admin" ? redirectUrl : "/admin/orders");
    } catch (err: any) {
      setError(err?.message || "Fast login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-2xl space-y-6">
      {/* Internal Security Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/10">
          <KeyRound className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            INTERNAL STORE GOVERNANCE
          </span>
          <h1 className="font-heading text-xl sm:text-2xl font-black text-foreground">
            MKN Dubai Admin Console
          </h1>
          <p className="text-xs text-muted-foreground">
            Restricted access portal for authorized store executives and operations staff
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1-Click Role Access (For Internal Development & Testing) */}
      <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-foreground">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Authorized Team Access:</span>
          </span>
          <span className="text-[10px] font-mono text-cyan-400">INSTANT</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleFastLogin("admin")}
            className="p-3 rounded-xl bg-card border border-border hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-foreground group-hover:text-violet-400">
                👑 Executive Admin
              </span>
              <span className="text-[9px] font-mono px-1 rounded bg-violet-500/10 text-violet-400">
                FULL
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground truncate">admin@mknelectronics.ae</p>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleFastLogin("staff")}
            className="p-3 rounded-xl bg-card border border-border hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-foreground group-hover:text-amber-400">
                💼 Operations Staff
              </span>
              <span className="text-[9px] font-mono px-1 rounded bg-amber-500/10 text-amber-400">
                OPS
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground truncate">staff@mknelectronics.ae</p>
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-border/60 w-full" />
        <span className="bg-card px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
          or sign in with password
        </span>
        <div className="border-t border-border/60 w-full" />
      </div>

      {/* Direct Credentials Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Employee / Admin Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              required
              placeholder="admin@mknelectronics.ae"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Security Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-muted/30 border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs tracking-wide shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Authenticate into Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-cyan-400 transition-colors"
        >
          <Store className="w-3.5 h-3.5" />
          <span>← Return to Public Storefront</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-center p-8 text-xs text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400 mx-auto mb-2" />
            <span>Loading MKN Internal Portal...</span>
          </div>
        }
      >
        <AdminLoginContent />
      </Suspense>
    </div>
  );
}

