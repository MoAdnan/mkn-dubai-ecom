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
  logoutAction,
  updateUserProfileAction,
} from "@/app/actions/auth";
import type { AuthUser } from "@/lib/services/auth-service";
import type { StoredOrder } from "@/lib/services/persistent-store";

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

    if (!editName.trim() || editName.trim().length < 2) {
      setUpdateError("Full legal name is required (minimum 2 characters).");
      return;
    }
    if (!editPhone.trim() || editPhone.trim().length < 7 || editPhone.includes("0000")) {
      setUpdateError("A valid UAE mobile phone number is required (e.g. +971 50 123 4567). Couriers cannot dispatch orders without a working phone.");
      return;
    }

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

      {/* Missing Phone Alert (Important for Order Delivery) */}
      {(!user.phone || user.phone.includes("0000") || user.phone.trim().length < 7) && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-bold block">Mobile Phone Required for Deliveries</span>
              <span className="text-muted-foreground text-[11px]">
                Please add your real UAE mobile phone number so courier drivers can call you to complete delivery.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors flex-shrink-0 cursor-pointer w-fit"
          >
            Add Mobile Phone
          </button>
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
                  {user.phone && !user.phone.includes("0000") && user.phone.trim().length >= 7 ? (
                    <span className="font-semibold text-foreground font-mono">{user.phone}</span>
                  ) : (
                    <span className="text-amber-400 font-medium text-xs flex items-center gap-1 mt-0.5">
                      <span>⚠️ Not Provided (Required for Orders)</span>
                    </span>
                  )}
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
                      {user.trn || "Not Registered"}
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
