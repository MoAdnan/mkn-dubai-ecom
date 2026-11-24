"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Eye,
  EyeOff,
  Phone,
  Smartphone,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import {
  loginAction,
  socialLoginAction,
  sendPhoneOtpAction,
  verifyPhoneOtpAndAuthAction,
} from "@/app/actions/auth";

function GoogleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function AppleLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 170 170" fill="currentColor">
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.42-6.3-9.68-11.22-20.59-14.74-32.72-3.52-12.13-5.28-23.77-5.28-34.92 0-14.74 3.82-26.68 11.45-35.81 7.63-9.13 17.07-13.78 28.32-13.95 4.8 0 10.15 1.25 16.05 3.75 5.9 2.5 9.77 3.82 11.61 3.96 1.48-.14 5.61-1.57 12.39-4.29 6.78-2.72 12.44-3.87 16.98-3.46 12.56.88 22.39 5.56 29.49 14.04-10.96 6.64-16.32 15.75-16.08 27.33.24 9.07 3.74 16.74 10.5 23 6.76 6.26 14.88 9.94 24.36 11.04-2.12 6.55-4.66 13.06-7.62 19.53zM119.22 31.84c0-7.39 2.66-14.37 7.98-20.94 5.32-6.57 11.96-10.42 19.92-11.55.14 1.13.21 2.12.21 2.97 0 7.4-2.73 14.51-8.19 21.33-5.46 6.82-12.17 10.74-20.13 11.75-.28-1.13-.42-2.12-.42-2.97z" />
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const errorParam = searchParams.get("error");

  const [tab, setTab] = React.useState<"phone" | "email">("phone");

  // Phone OTP States
  const [phone, setPhone] = React.useState("");
  const [formattedPhone, setFormattedPhone] = React.useState("");
  const [otpStep, setOtpStep] = React.useState<"enter_phone" | "enter_otp">("enter_phone");
  const [otpCode, setOtpCode] = React.useState("");
  const [resendTimer, setResendTimer] = React.useState(0);

  // Email States
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(
    errorParam === "admin_required"
      ? "Executive Admin or Operations Staff login required to access the requested portal."
      : null
  );

  React.useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone.trim()) {
      setError("Please enter your UAE mobile number.");
      return;
    }

    setLoading(true);
    try {
      const res = await sendPhoneOtpAction(phone);
      if (!res.success) {
        setError(res.error || "Failed to send verification code.");
        return;
      }
      setFormattedPhone(res.formattedPhone || phone);
      setOtpStep("enter_otp");
      setResendTimer(60);
    } catch (err: any) {
      setError(err?.message || "Failed to send SMS OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otpCode.trim().length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyPhoneOtpAndAuthAction({
        phone: formattedPhone || phone,
        otp: otpCode.trim(),
      });

      if (!res.success) {
        setError(res.error || "Verification failed. Please check the code.");
        return;
      }

      router.push(redirectUrl && !redirectUrl.startsWith("/admin") ? redirectUrl : "/account");
    } catch (err: any) {
      setError(err?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginAction(email, password);
      if (!res.success) {
        setError(res.error || "Authentication failed. Please check your credentials.");
        return;
      }

      if (res.user?.role === "admin" || res.user?.role === "staff") {
        router.push(redirectUrl || "/admin");
      } else {
        router.push(redirectUrl && !redirectUrl.startsWith("/admin") ? redirectUrl : "/account");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setLoading(true);
    setError(null);

    try {
      await socialLoginAction(provider);
      router.push(redirectUrl && !redirectUrl.startsWith("/admin") ? redirectUrl : "/account");
    } catch (err: any) {
      setError(err?.message || `Failed to sign in with ${provider}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-2xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-[1px] mx-auto shadow-md shadow-cyan-500/20">
          <div className="w-full h-full bg-background rounded-[15px] flex items-center justify-center font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-violet-400 text-base">
            MK
          </div>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Sign In to Your MKN Account
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Instant authentication with UAE Mobile OTP or Google Sign-In
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1-Tap Social Authentication (Google & Apple) */}
      <div className="space-y-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialLogin("google")}
          className="w-full h-11 px-4 rounded-xl border border-border/80 hover:border-foreground/30 bg-background hover:bg-muted/40 font-medium text-xs sm:text-sm text-foreground flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
        >
          <GoogleLogo className="w-4 h-4" />
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialLogin("apple")}
          className="w-full h-11 px-4 rounded-xl border border-border/80 hover:border-foreground/30 bg-background hover:bg-muted/40 font-medium text-xs sm:text-sm text-foreground flex items-center justify-center gap-3 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
        >
          <AppleLogo className="w-4 h-4" />
          <span>Continue with Apple</span>
        </button>
      </div>

      {/* Tab Switcher: Mobile Phone OTP vs Email */}
      <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-muted/50 border border-border/70 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setTab("phone");
            setError(null);
          }}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
            tab === "phone"
              ? "bg-card text-cyan-400 shadow-sm border border-cyan-500/30 font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile Phone OTP</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setTab("email");
            setError(null);
          }}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
            tab === "email"
              ? "bg-card text-cyan-400 shadow-sm border border-cyan-500/30 font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email & Password</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: UAE MOBILE PHONE OTP SIGN IN (NOON / AMAZON.AE STYLE)  */}
      {/* ------------------------------------------------------------- */}
      {tab === "phone" && (
        <div className="space-y-4">
          {otpStep === "enter_phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  UAE Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-muted/60 border border-border/80 font-mono text-xs text-foreground font-semibold flex-shrink-0">
                    <span>🇦🇪</span>
                    <span>+971</span>
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      placeholder="50 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/30 border border-border/80 text-xs font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  We will send a 6-digit SMS OTP code to authenticate your real account.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Send SMS Code (OTP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-cyan-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verification Code Sent via SMS</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  A 6-digit security verification code has been dispatched via SMS to your mobile phone at{" "}
                  <strong className="font-mono text-foreground">{formattedPhone}</strong>. Please check your SMS inbox and enter the code below.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-foreground block">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setOtpStep("enter_phone")}
                    className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                  >
                    Change Phone ({formattedPhone})
                  </button>
                </div>

                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500 text-center font-mono text-xl tracking-[0.5em] font-black text-foreground"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-muted-foreground">Didn&apos;t receive code?</span>
                {resendTimer > 0 ? (
                  <span className="text-muted-foreground font-mono text-[11px]">
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="text-cyan-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Code & Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: EMAIL & PASSWORD SIGN IN                                */}
      {/* ------------------------------------------------------------- */}
      {tab === "email" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="name@example.ae"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/30 border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Password</label>
              <Link href="/contact" className="text-[11px] text-cyan-400 hover:underline">
                Forgot password?
              </Link>
            </div>
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
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In with Password</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* New Account Link */}
      <div className="text-center text-xs text-muted-foreground">
        Don&apos;t have an account yet?{" "}
        <Link href="/account/register" className="text-cyan-400 font-semibold hover:underline">
          Create an account
        </Link>
      </div>

      {/* UAE Trust Strip */}
      <div className="pt-4 border-t border-border/40 grid grid-cols-3 gap-2 text-[10px] text-muted-foreground text-center">
        <div>🔒 256-Bit SSL</div>
        <div>🇦🇪 FTA VAT Registered</div>
        <div>🛡️ Official UAE Warranty</div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <Suspense
        fallback={
          <div className="p-12 rounded-3xl border border-border/80 bg-card text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            <p className="text-xs text-muted-foreground">Loading MKN Secure Authentication...</p>
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </main>
  );
}
