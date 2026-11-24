"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Heart,
  ChevronRight,
  LogOut,
  Building2,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  Edit3,
  Phone,
  Save,
  X,
} from "lucide-react";
import { formatAED } from "@/lib/utils";
import {
  loginAction,
  socialLoginAction,
  logoutAction,
  updateUserProfileAction,
} from "@/app/actions/auth";
import type { AuthUser } from "@/lib/services/auth-service";
import type { StoredOrder } from "@/lib/services/persistent-store";

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

interface AccountClientProps {
  initialUser: AuthUser | null;
  initialOrders: StoredOrder[];
}

export function AccountClient({ initialUser, initialOrders }: AccountClientProps) {
  const router = useRouter();
  const [user, setUser] = React.useState<AuthUser | null>(initialUser);
  const [loading, setLoading] = React.useState(false);

  // Form states for guest login
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  // Profile Edit States
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(initialUser?.name || "");
  const [editPhone, setEditPhone] = React.useState(initialUser?.phone || "");
  const [editEmirate, setEditEmirate] = React.useState(initialUser?.emirate || "Dubai");
  const [editCompanyName, setEditCompanyName] = React.useState(initialUser?.companyName || "");
  const [editTrn, setEditTrn] = React.useState(initialUser?.trn || "");
  const [editNewPassword, setEditNewPassword] = React.useState("");
  const [updateSuccess, setUpdateSuccess] = React.useState(false);
  const [updateError, setUpdateError] = React.useState<string | null>(null);
  const [updating, setUpdating] = React.useState(false);

  React.useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      setEditName(initialUser.name);
      setEditPhone(initialUser.phone);
      setEditEmirate(initialUser.emirate || "Dubai");
      setEditCompanyName(initialUser.companyName || "");
      setEditTrn(initialUser.trn || "");
    }
  }, [initialUser]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);

    try {
      const res = await loginAction(email, password);
      if (!res.success) {
        setLoginError(res.error || "Authentication failed. Please check your credentials.");
        return;
      }
      setUser(res.user || null);
      router.refresh();
    } catch (err: any) {
      setLoginError(err?.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setLoading(true);
    setLoginError(null);

    try {
      const res = await socialLoginAction(provider);
      setUser(res.user);
      router.refresh();
    } catch (err: any) {
      setLoginError(err?.message || `Failed to sign in with ${provider}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutAction();
      setUser(null);
      router.push("/account");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(false);
    setUpdating(true);

    try {
      const res = await updateUserProfileAction({
        name: editName,
        phone: editPhone,
        emirate: editEmirate,
        companyName: editCompanyName,
        trn: editTrn,
        newPassword: editNewPassword.trim() ? editNewPassword.trim() : undefined,
      });

      if (!res.success) {
        setUpdateError(res.error || "Failed to update profile.");
        return;
      }

      if (res.user) {
        setUser(res.user);
      }
      setUpdateSuccess(true);
      setIsEditing(false);
      setEditNewPassword("");
      router.refresh();

      setTimeout(() => {
        setUpdateSuccess(false);
      }, 5000);
    } catch (err: any) {
      setUpdateError(err?.message || "Failed to update profile in database.");
    } finally {
      setUpdating(false);
    }
  };

  // -------------------------------------------------------------
  // GUEST STATE: Clean, Professional E-Commerce Sign-In
  // -------------------------------------------------------------
  if (!user) {
    return (
      <main className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
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
              Fast, secure checkout across all UAE Emirates and real-time order tracking
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
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

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-border/60 w-full" />
            <span className="bg-card px-3 text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
              or continue with email
            </span>
            <div className="border-t border-border/60 w-full" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                <Link
                  href="/contact"
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-muted/30 border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
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
                  <span>Sign In with MKN Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* New Account Link */}
          <div className="text-center text-xs text-muted-foreground">
            Don&apos;t have an account yet?{" "}
            <Link href="/account/register" className="text-cyan-400 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED STATE: Live Customer Account View
  // -------------------------------------------------------------
  const isAdmin = user.role === "admin";
  const isStaff = user.role === "staff";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-foreground">
              My Account
            </h1>
            <span
              className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                isAdmin
                  ? "bg-violet-500/10 text-violet-400 border-violet-500/25"
                  : isStaff
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                  : "bg-cyan-500/10 text-cyan-400 border-cyan-500/25"
              }`}
            >
              {isAdmin
                ? "👑 EXECUTIVE ADMIN"
                : isStaff
                ? "💼 OPERATIONS STAFF"
                : "🛒 VERIFIED CUSTOMER"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your personal profile, UAE delivery addresses, order history, and FTA tax invoices.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {updateSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <div>
            <span className="font-bold block">Account Updated!</span>
            <span>Your name, mobile phone, and profile details have been successfully synced to the database.</span>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {updateError && (
        <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{updateError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation Card */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold text-lg font-heading ${
                  isAdmin
                    ? "bg-violet-500/15 border-violet-500/30 text-violet-400"
                    : isStaff
                    ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                    : "bg-cyan-500/15 border-cyan-500/30 text-cyan-400"
                }`}
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">{user.name}</h3>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 space-y-1 text-xs">
              <Link
                href="/account"
                className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>Profile Overview</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/account/orders"
                className="flex items-center justify-between p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>Orders & Tax Invoices</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/account/addresses"
                className="flex items-center justify-between p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4" />
                  <span>Saved UAE Addresses</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/account/wishlist"
                className="flex items-center justify-between p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span>My Wishlist</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              {/* Private Admin Portal Link (Only for authorized Staff/Admin) */}
              {(isAdmin || isStaff) && (
                <Link
                  href="/admin"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-foreground font-semibold border border-cyan-500/25 mt-2"
                >
                  <div className="flex items-center gap-2.5 text-cyan-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Internal Admin Console</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                </Link>
              )}

              {/* Sign Out Button */}
              <button
                type="button"
                disabled={loading}
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left mt-2"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Card */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-base text-foreground">
                  Account Credentials & Profile
                </h2>
                <p className="text-xs text-muted-foreground">
                  Stored securely in the Supabase database
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 hover:border-cyan-500/40 text-xs font-semibold text-foreground hover:text-cyan-400 transition-all cursor-pointer"
              >
                {isEditing ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile & Phone</span>
                  </>
                )}
              </button>
            </div>

            {/* Profile Editing Form */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-medium text-foreground block mb-1">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-medium text-foreground block mb-1">
                      Mobile Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        required
                        placeholder="+971 50 123 4567"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
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
                        value={editEmirate}
                        onChange={(e) => setEditEmirate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
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
                      New Password (leave empty to keep current)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={editNewPassword}
                        onChange={(e) => setEditNewPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-medium text-foreground block mb-1">
                      Company Name (B2B Accounts)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Al-Hashimi Ventures LLC"
                      value={editCompanyName}
                      onChange={(e) => setEditCompanyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-foreground block mb-1">
                      FTA Tax Registration Number (TRN)
                    </label>
                    <input
                      type="text"
                      placeholder="100XXXXXXXXXXXX"
                      value={editTrn}
                      onChange={(e) => setEditTrn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating Database...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes to Database</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl border border-border/80 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* Display View */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <span className="text-muted-foreground block text-[11px]">Full Name</span>
                  <span className="font-semibold text-foreground text-sm">{user.name}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <span className="text-muted-foreground block text-[11px]">Email Address</span>
                  <span className="font-semibold text-foreground font-mono">{user.email}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground block text-[11px]">Mobile Phone</span>
                    {user.isPhoneVerified && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Real User</span>
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-foreground font-mono">{user.phone}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                  <span className="text-muted-foreground block text-[11px]">Primary Emirate</span>
                  <span className="font-semibold text-foreground">{user.emirate || "Dubai"}, UAE</span>
                </div>
              </div>
            )}

            {/* Corporate / B2B Details */}
            {user.companyName && !isEditing && (
              <div className="pt-4 border-t border-border/40">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground mb-3">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>UAE Corporate / Tax Registration Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                    <span className="text-muted-foreground block text-[11px]">Company Name</span>
                    <span className="font-semibold text-foreground">{user.companyName}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50">
                    <span className="text-muted-foreground block text-[11px]">
                      Federal Tax Authority TRN
                    </span>
                    <span className="font-mono font-bold text-cyan-400">
                      {user.trn || "100482918200003"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Orders Preview */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-base text-foreground">
                  Your Orders & Tax Invoices
                </h2>
                <p className="text-xs text-muted-foreground">
                  Real-time orders for {user.email}
                </p>
              </div>
              <Link
                href="/account/orders"
                className="text-xs text-cyan-400 font-semibold hover:underline"
              >
                View all orders →
              </Link>
            </div>

            {initialOrders.length > 0 ? (
              <div className="rounded-xl border border-border/60 divide-y divide-border/40 text-xs">
                {initialOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.orderNumber}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-foreground">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${
                            order.orderStatus === "delivered"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : order.orderStatus === "processing" || order.orderStatus === "shipped"
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        {order.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")} •{" "}
                        {order.emirate}, UAE
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-mono font-bold text-foreground">
                        {formatAED(order.totalFils)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Tax Invoice #{order.invoiceNumber}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-border/70 text-center space-y-3">
                <Package className="w-8 h-8 text-muted-foreground mx-auto" />
                <div>
                  <p className="font-semibold text-xs text-foreground">No orders placed yet</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    When you place an order, it will appear here with live tracking and VAT invoices.
                  </p>
                </div>
                <Link
                  href="/catalogue"
                  className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-semibold hover:opacity-95 transition-opacity"
                >
                  Browse Catalogue →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
