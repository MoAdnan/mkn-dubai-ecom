"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  Building2,
  MapPin,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import {
  registerUserAction,
  sendPhoneOtpAction,
  verifyPhoneOtpAndAuthAction,
} from "@/app/actions/auth";

type RegisterMode = "phone_otp" | "email";

export default function RegisterPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<RegisterMode>("email");

  // Common Fields
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [emirate, setEmirate] = React.useState("Dubai");
  const [isB2B, setIsB2B] = React.useState(false);
  const [companyName, setCompanyName] = React.useState("");
  const [trn, setTrn] = React.useState("");

  // Email Mode
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // OTP Mode
  const [otpStep, setOtpStep] = React.useState<"enter_phone" | "enter_otp">("enter_phone");
  const [otpCode, setOtpCode] = React.useState("");
  const [formattedPhone, setFormattedPhone] = React.useState("");
  const [resendTimer, setResendTimer] = React.useState(0);

  // States
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Countdown timer for OTP resend
  React.useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Step 1: Request Phone OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your full legal name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your UAE mobile phone number.");
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
      setError(err?.message || "Failed to send SMS verification code.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Phone OTP and Create/Sync Account in Supabase
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpCode.trim().length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyPhoneOtpAndAuthAction({
        phone: formattedPhone || phone,
        otp: otpCode.trim(),
        fullName,
        emirate,
        isB2B,
        companyName,
        trn,
      });

      if (!res.success) {
        setError(res.error || "Verification failed. Please check the code.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/account");
      }, 1200);
    } catch (err: any) {
      setError(err?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Email Registration Flow
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await registerUserAction({
        fullName,
        email,
        phone,
        emirate,
        password,
        isB2B,
        companyName,
        trn,
      });

      if (!res.success) {
        setError(res.error || "Failed to register account.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/account");
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during account creation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-14">
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-[1px] mx-auto shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-background rounded-[15px] flex items-center justify-center font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-violet-400 text-base">
              MK
            </div>
          </div>
          <h1 className="font-heading text-2xl font-black text-foreground">
            Create MKN Dubai Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Register with your email and password for real-time order tracking and official FTA tax invoices.
          </p>
        </div>

        {/* Registration Method Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-muted/50 border border-border/70 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode("email");
              setError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === "email"
                ? "bg-card text-cyan-400 shadow-sm border border-cyan-500/30 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email & Password</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("phone_otp");
              setError(null);
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              mode === "phone_otp"
                ? "bg-card text-cyan-400 shadow-sm border border-cyan-500/30 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Phone OTP</span>
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {success && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-bold block">Real User Verified!</span>
              <span>Account created in Supabase database. Redirecting to your account...</span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 1: PHONE NUMBER + REAL USER OTP (UAE STANDARD)          */}
        {/* ------------------------------------------------------------- */}
        {mode === "phone_otp" && otpStep === "enter_phone" && (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Adnan Al-Hashimi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                UAE Mobile Phone Number *
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500 text-xs font-mono"
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                We will send a 6-digit OTP to verify you are a genuine human user.
              </p>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                Primary UAE Emirate *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={emirate}
                  onChange={(e) => setEmirate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500 text-xs cursor-pointer"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                  <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                  <option value="Umm Al Quwain">Umm Al Quwain</option>
                  <option value="Fujairah">Fujairah</option>
                </select>
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
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Verification Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Send SMS Verification Code (OTP)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 1 STEP 2: ENTER OTP CODE                                  */}
        {/* ------------------------------------------------------------- */}
        {mode === "phone_otp" && otpStep === "enter_otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verification Code Dispatched via SMS</span>
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                A 6-digit security verification code has been dispatched via SMS to your mobile phone at{" "}
                <strong className="font-mono text-foreground font-bold">{formattedPhone}</strong>.
                Please check your phone&apos;s SMS inbox and enter the code below.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-foreground block">
                  6-Digit Verification Code *
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
              <p className="text-[11px] text-muted-foreground mt-1.5 text-center">
                Enter the 6-digit code delivered to{" "}
                <span className="font-mono font-bold text-foreground">{formattedPhone}</span>
              </p>
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
              disabled={loading || success || otpCode.length !== 6}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Real User & Creating Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Real User & Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* MODE 2: EMAIL & PASSWORD REGISTRATION                         */}
        {/* ------------------------------------------------------------- */}
        {mode === "email" && (
          <form onSubmit={handleEmailRegister} className="space-y-4 text-xs">
            <div>
              <label className="font-medium text-foreground block mb-1">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Adnan Al-Hashimi"
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
                Primary UAE Emirate *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={emirate}
                  onChange={(e) => setEmirate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-muted/40 border border-border/80 focus:outline-none focus:border-cyan-500 text-xs cursor-pointer"
                >
                  <option value="Dubai">Dubai</option>
                  <option value="Abu Dhabi">Abu Dhabi</option>
                  <option value="Sharjah">Sharjah</option>
                  <option value="Ajman">Ajman</option>
                  <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                  <option value="Umm Al Quwain">Umm Al Quwain</option>
                  <option value="Fujairah">Fujairah</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-medium text-foreground block mb-1">
                Password (min 6 characters) *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••••••"
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
              disabled={loading || success}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account in Supabase...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-border/40 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/account/login" className="text-cyan-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
