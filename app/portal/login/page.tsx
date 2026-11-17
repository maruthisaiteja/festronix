"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function PortalLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Check credentials.");
        setLoading(false);
        return;
      }

      if (data.role === "ADMIN") {
        router.push("/portal/admin");
      } else {
        router.push("/portal/coordinator");
      }
    } catch {
      setError("Network or server connection error. Please try again.");
      setLoading(false);
    }
  };

  const handleQuickFill = (role: "admin" | "coord") => {
    if (role === "admin") {
      setUsername("admin_sac");
      setPassword("FestronixAdmin@2026");
    } else {
      setUsername("coord_smartathon");
      setPassword("Coord@Festronix2026");
    }
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-20 bg-[#06080C] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#5145CD]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#12A4C4]/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#12A4C4] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Public Fest Site</span>
          </Link>
        </div>

        {/* Portal Login Glass Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0B0E17]/95 backdrop-blur-2xl p-7 sm:p-9 shadow-2xl shadow-black/80">
          
          {/* Institution Header Lockup */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-11">
                <Image
                  src="/assets/logos/vce_crest.png"
                  alt="VCE Crest"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="h-5 w-px bg-white/20" />
              <div className="relative h-8 w-8 rounded-full overflow-hidden">
                <Image
                  src="/assets/logos/sac_emblem.png"
                  alt="SAC"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <span className="rounded-md bg-[#5145CD]/20 border border-[#5145CD]/40 px-2.5 py-1 font-mono text-[11px] text-[#818CF8] font-bold">
              AUTHORIZED
            </span>
          </div>

          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#12A4C4]/15 px-3 py-1 font-mono text-xs font-semibold text-[#22D3EE] mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#22D3EE]" />
              Role-Based Authentication
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
              Festronix Portal Login
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#A3A9B8] mt-1.5 leading-relaxed">
              Sign in as an Event Coordinator or SAC Administrator to manage registrations, verify UPI payments, and mark live attendance.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-xl border border-[#F43F5E]/30 bg-[#F43F5E]/10 p-3.5 flex items-start gap-2.5 text-xs text-[#FB7185]">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                Authorized Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8296]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin_sac or coord_smartathon"
                  className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] pl-10 pr-4 font-sans text-sm text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none focus:ring-2 focus:ring-[#12A4C4]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                Secret Access Key / Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8296]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter assigned password"
                  className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] pl-10 pr-11 font-sans text-sm text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none focus:ring-2 focus:ring-[#12A4C4]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A8296] hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full h-12 rounded-xl bg-white font-sans text-sm font-bold text-[#06080C] hover:bg-[#EEF0F5] hover:shadow-xl hover:shadow-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Helper for Testing & Evaluation */}
          <div className="mt-6 pt-5 border-t border-white/10 text-xs text-[#7A8296]">
            <span className="block font-mono text-[11px] mb-2 uppercase tracking-wider text-[#A3A9B8]">
              Testing Shortcuts:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("admin")}
                className="rounded-lg border border-white/10 bg-[#141926] p-2 text-left hover:border-[#5145CD]/50 hover:bg-[#1A2234] transition-all"
              >
                <span className="font-semibold text-white block">SAC Admin</span>
                <span className="font-mono text-[10px] text-[#818CF8]">admin_sac</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("coord")}
                className="rounded-lg border border-white/10 bg-[#141926] p-2 text-left hover:border-[#12A4C4]/50 hover:bg-[#1A2234] transition-all"
              >
                <span className="font-semibold text-white block">Event Coord</span>
                <span className="font-mono text-[10px] text-[#22D3EE]">coord_smartathon</span>
              </button>
            </div>
          </div>

        </div>

        {/* Security Notice */}
        <p className="mt-6 text-center font-mono text-[11px] text-[#7A8296]">
          Vardhaman College of Engineering · Student Affairs Cell 2026
        </p>

      </div>
    </div>
  );
}
