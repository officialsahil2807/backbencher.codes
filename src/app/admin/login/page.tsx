"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  Database,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/admin";

  const [activeTab, setActiveTab] = useState<"supabase" | "pin">("supabase");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [supabaseReady] = useState(() => isSupabaseConfigured());

  // Check if user is already authenticated on mount
  useEffect(() => {
    let isMounted = true;

    const checkExistingSession = async () => {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        if (data.authenticated && isMounted) {
          router.replace(nextUrl);
          return;
        }
      } catch {
        // Not authenticated
      } finally {
        if (isMounted) setCheckingSession(false);
      }
    };

    checkExistingSession();

    return () => {
      isMounted = false;
    };
  }, [router, nextUrl]);

  // Handle Supabase Email + Password Login
  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your administrator email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please provide a valid email format (e.g., admin@example.com).");
      return;
    }

    if (!password) {
      setError("Please enter your administrator password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // 1. First attempt sign in via API route which sets both Supabase session and HTTP-only admin cookies
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "supabase",
          email: trimmedEmail,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please verify credentials.");
      }

      // Also trigger browser client session if configured
      if (supabaseReady) {
        try {
          const supabase = createClient();
          await supabase.auth.signInWithPassword({
            email: trimmedEmail,
            password,
          });
        } catch {
          // Server cookie is already established
        }
      }

      setSuccess("Authentication successful! Redirecting to Admin Dashboard...");
      setTimeout(() => {
        router.push(nextUrl);
      }, 700);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle PIN Login (Backup / Local Mode)
  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!pin.trim()) {
      setError("Please enter the Security PIN.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid PIN. Authentication failed.");
      }

      setSuccess("PIN verified! Redirecting to Admin Dashboard...");
      setTimeout(() => {
        router.push(nextUrl);
      }, 700);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center text-[#A1A1AA] font-mono text-xs">
        <div className="w-5 h-5 border-2 border-[#FF7900] border-t-transparent rounded-full animate-spin mr-3" />
        Checking administrator session security...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0D] flex flex-col justify-center items-center p-4 selection:bg-[#FF7900]/30 selection:text-white">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-9 h-9 rounded-xl bg-[#FF7900] flex items-center justify-center text-[#0B0B0D] font-black text-base shadow-[0_0_20px_rgba(255,121,0,0.3)] group-hover:scale-105 transition-transform">
              &lt;&gt;
            </div>
            <span className="font-bold text-lg text-[#F5F5F5]">
              Backbencher<span className="text-[#FF7900]">.codes</span>
            </span>
          </Link>

          <div className="flex items-center justify-center gap-1.5 text-xs text-[#FF7900] font-mono uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Restricted Administrator Gateway</span>
          </div>

          <h1 className="text-2xl font-black text-[#F5F5F5] tracking-tight">
            Admin Verification
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1 max-w-xs mx-auto">
            Protected by Supabase Auth with encrypted sessions and strict route guards.
          </p>

          {/* Connection status indicator */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-[#141416] border border-[#292929]">
            <Database className="w-3 h-3 text-[#FF7900]" />
            <span className="text-[#A1A1AA]">Engine:</span>
            {supabaseReady ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                Supabase Connected
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                Local PIN Ready (Supabase Config Pending)
              </span>
            )}
          </div>
        </div>

        {/* Authentication Card */}
        <div className="bg-[#141416] border border-[#292929] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF7900] to-transparent" />

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#0B0B0D] rounded-xl border border-[#292929] mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("supabase");
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "supabase"
                  ? "bg-[#1C1C1F] text-[#FF7900] shadow-sm font-bold border border-[#FF7900]/30"
                  : "text-[#A1A1AA] hover:text-[#F5F5F5]"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Auth</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("pin");
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "pin"
                  ? "bg-[#1C1C1F] text-[#FF7900] shadow-sm font-bold border border-[#FF7900]/30"
                  : "text-[#A1A1AA] hover:text-[#F5F5F5]"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Security PIN</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-900/60 flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in slide-in-from-top-1">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-300 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{success}</div>
            </div>
          )}

          {/* Mode 1: Supabase Email & Password Form */}
          {activeTab === "supabase" && (
            <form onSubmit={handleSupabaseLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider font-mono mb-1.5"
                >
                  Admin Email Address
                </label>
                <div className="relative">
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@backbencher.codes"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0B0B0D] border border-[#292929] focus:border-[#FF7900] focus:ring-1 focus:ring-[#FF7900] rounded-xl text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#52525B]"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="admin-password"
                    className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider font-mono"
                  >
                    Password
                  </label>
                  <span className="text-[10px] text-[#71717A] font-mono">Min. 6 chars</span>
                </div>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#0B0B0D] border border-[#292929] focus:border-[#FF7900] focus:ring-1 focus:ring-[#FF7900] rounded-xl text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#52525B]"
                  />
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#F5F5F5] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-[#FF7900] hover:bg-[#FF963D] disabled:opacity-50 text-[#0B0B0D] font-extrabold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,121,0,0.2)] hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-[#0B0B0D] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In with Supabase</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Mode 2: Security PIN Form (Fallback) */}
          {activeTab === "pin" && (
            <form onSubmit={handlePinLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="pin-input"
                  className="block text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider font-mono mb-1.5"
                >
                  High-Security PIN Code
                </label>
                <div className="relative">
                  <input
                    id="pin-input"
                    type="password"
                    maxLength={12}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#0B0B0D] border border-[#292929] focus:border-[#FF7900] focus:ring-1 focus:ring-[#FF7900] rounded-xl text-center text-xl font-mono tracking-widest text-[#F5F5F5] outline-none transition-all placeholder:text-[#3F3F46]"
                  />
                  <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-[#FF7900] hover:bg-[#FF963D] disabled:opacity-50 text-[#0B0B0D] font-extrabold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,121,0,0.2)] hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-[#0B0B0D] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify PIN &amp; Unlock</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom helper card */}
          <div className="mt-6 pt-5 border-t border-[#1F1F23] text-center text-[11px] text-[#71717A] space-y-1.5">
            <p className="flex items-center justify-center gap-1.5 text-[#A1A1AA]">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7900]" />
              <span>Full Supabase Auth + HttpOnly Session Protection</span>
            </p>
            <p className="text-[10px]">
              Rate-limited to prevent brute-force attacks. 5 failed attempts locks for 15 mins.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-[#71717A] hover:text-[#A1A1AA] transition-colors"
          >
            ← Return to Backbencher.codes Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0B0D] flex items-center justify-center text-[#A1A1AA] font-mono text-xs">
          <div className="w-5 h-5 border-2 border-[#FF7900] border-t-transparent rounded-full animate-spin mr-3" />
          Loading Administrator Gateway...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
