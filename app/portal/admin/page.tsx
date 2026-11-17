"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  DollarSign,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  ChevronRight,
  MapPin,
  Calendar,
  Check,
  X,
  KeyRound,
  ExternalLink,
  Award,
} from "lucide-react";

interface AdminEventSummary {
  id: string;
  slug: string;
  title: string;
  venue: string;
  category: string;
  day: string;
  entryFee: number;
  coordinatorUsername: string;
  coordinatorName: string;
  coordinatorPhone: string;
  registrationsCount: number;
  presentCount: number;
  revenue: number;
}

interface PendingUtrItem {
  id: string;
  regCode: string;
  fullName: string;
  rollNumber: string;
  phone: string;
  college: string;
  paymentAmount: number;
  utrNumber: string | null;
  createdAt: string;
  event: {
    title: string;
    venue: string;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState({
    totalFestRegistrations: 0,
    totalFestRevenue: 0,
    totalFestPresent: 0,
    globalAttendanceRate: 0,
    pendingUtrCount: 0,
    totalArenas: 52,
  });

  const [events, setEvents] = useState<AdminEventSummary[]>([]);
  const [pendingUtrs, setPendingUtrs] = useState<PendingUtrItem[]>([]);

  // Search & Filter state for 52 arenas
  const [searchArena, setSearchArena] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [actionProcessingId, setActionProcessingId] = useState<string | null>(null);

  // Coordinator credentials modal
  const [showCredsModal, setShowCredsModal] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Check session
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();

      if (!meData.authenticated) {
        router.push("/portal/login");
        return;
      }

      if (meData.user.role !== "ADMIN") {
        router.push("/portal/coordinator");
        return;
      }

      // Fetch admin stats
      const statsRes = await fetch("/api/admin/stats");
      const statsData = await statsRes.json();

      if (!statsRes.ok) {
        throw new Error(statsData.error || "Failed to load admin stats.");
      }

      setMetrics(statsData.metrics);
      setEvents(statsData.events || []);
      setPendingUtrs(statsData.pendingUtrs || []);
    } catch (err: any) {
      setError(err.message || "Failed to load super admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal/login");
  };

  // 1-Click Approve Pending UTR
  const handleApproveUtr = async (regId: string, status: "VERIFIED" | "REJECTED") => {
    setActionProcessingId(regId);
    try {
      const res = await fetch("/api/payments/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: regId,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update payment status.");
        return;
      }

      // Remove from pending list
      setPendingUtrs((prev) => prev.filter((item) => item.id !== regId));
      setMetrics((prev) => ({
        ...prev,
        pendingUtrCount: Math.max(0, prev.pendingUtrCount - 1),
      }));
    } catch {
      alert("Network error processing payment approval.");
    } finally {
      setActionProcessingId(null);
    }
  };

  // Master CSV Export of All Fest Registrations
  const handleExportCsv = async () => {
    try {
      const res = await fetch("/api/registrations");
      const data = await res.json();
      if (!data.registrations) {
        alert("No registrations available to export.");
        return;
      }

      const rows = [
        [
          "Registration Code",
          "Arena Title",
          "Venue Room",
          "Delegate Name",
          "Roll Number",
          "College",
          "Department",
          "Year",
          "Phone",
          "Email",
          "Team Name",
          "Registration Mode",
          "Payment Mode",
          "Fee Amount",
          "Payment Status",
          "UTR Number",
          "Attendance Status",
          "Check-In Time",
        ],
        ...data.registrations.map((r: any) => [
          r.regCode,
          r.event?.title || "",
          r.event?.venue || "",
          `"${r.fullName}"`,
          r.rollNumber,
          `"${r.college}"`,
          `"${r.department}"`,
          r.yearOfStudy,
          r.phone,
          r.email,
          r.teamName ? `"${r.teamName}"` : "",
          r.registrationMode,
          r.paymentMode,
          r.paymentAmount,
          r.paymentStatus,
          r.utrNumber || "",
          r.attendanceStatus,
          r.attendedAt ? new Date(r.attendedAt).toLocaleString("en-IN") : "",
        ]),
      ];

      const csvContent =
        "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `festronix_2026_master_delegates_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("Error generating CSV export.");
    }
  };

  // Filtered Arenas List
  const categories = Array.from(new Set(events.map((e) => e.category)));
  const filteredArenas = events.filter((evt) => {
    const q = searchArena.toLowerCase();
    const matchesSearch =
      !q ||
      evt.title.toLowerCase().includes(q) ||
      evt.venue.toLowerCase().includes(q) ||
      evt.category.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategory === "ALL" || evt.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080C] text-white flex flex-col items-center justify-center p-6">
        <RefreshCw className="h-8 w-8 animate-spin text-[#12A4C4] mb-3" />
        <p className="font-mono text-sm text-[#A3A9B8]">Loading SAC Super Admin Operations Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080C] text-[#EEF0F5] pt-24 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
      {/* ── Top Super Admin Header Strip ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5145CD]/20 border border-[#5145CD]/40 px-3 py-0.5 font-mono text-[11px] text-[#818CF8] font-bold uppercase">
              <ShieldCheck className="h-3 w-3" />
              SAC Super Admin Portal
            </span>
            <span className="font-mono text-xs text-[#7A8296]">
              Master Operating Console · Vardhaman College of Engineering
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            Festronix 2026 Command Center
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#A3A9B8]">
            Pan-fest operations across 52 arenas · Dec 1 & 2, 2026
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowCredsModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141928] border border-white/15 hover:bg-[#1D253A] text-xs font-mono text-white transition-colors"
          >
            <KeyRound className="h-4 w-4 text-[#12A4C4]" />
            <span>Coordinator Logins</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#12A4C4] to-[#00FF9D] text-[#06080C] text-xs font-sans font-bold shadow-lg hover:opacity-95 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Export Master CSV</span>
          </button>

          <button
            onClick={loadAdminData}
            title="Refresh Pan-Fest Data"
            className="p-2.5 rounded-xl bg-[#141928] border border-white/10 hover:bg-[#1D253A] text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141928] border border-white/10 hover:bg-red-950/30 hover:border-red-500/30 text-[#A3A9B8] hover:text-red-400 text-xs font-mono transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── Key Pan-Fest Metrics ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Fest Registrations */}
        <div className="rounded-2xl border border-white/10 bg-[#0B0E17]/90 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-[#7A8296] mb-2">
            <span className="font-mono text-xs uppercase tracking-wider">Pan-Fest Delegates</span>
            <Users className="h-4 w-4 text-[#12A4C4]" />
          </div>
          <div className="font-display text-3xl font-black text-white">
            {metrics.totalFestRegistrations}
          </div>
          <span className="font-mono text-[11px] text-[#A3A9B8] mt-1 block">
            Across 52 Arenas
          </span>
        </div>

        {/* Gross Revenue Collected */}
        <div className="rounded-2xl border border-[#00FF9D]/20 bg-[#0B0E17]/90 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-[#7A8296] mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#00FF9D]">Gross Revenue</span>
            <DollarSign className="h-4 w-4 text-[#00FF9D]" />
          </div>
          <div className="font-display text-3xl font-black text-[#00FF9D]">
            ₹{metrics.totalFestRevenue.toLocaleString("en-IN")}
          </div>
          <span className="font-mono text-[11px] text-[#7A8296] mt-1 block">
            UPI QR + Spot Cash
          </span>
        </div>

        {/* Pan-Fest Attendance Rate */}
        <div className="rounded-2xl border border-white/10 bg-[#0B0E17]/90 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-[#7A8296] mb-2">
            <span className="font-mono text-xs uppercase tracking-wider">Campus Attendance</span>
            <CheckCircle2 className="h-4 w-4 text-[#22D3EE]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-black text-[#22D3EE]">
              {metrics.totalFestPresent}
            </span>
            <span className="font-mono text-sm text-[#22D3EE]/80 font-bold">
              ({metrics.globalAttendanceRate}%)
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#7A8296] mt-1 block">
            Admitted via QR Scans
          </span>
        </div>

        {/* Pending UTR Queue */}
        <div className="rounded-2xl border border-amber-500/20 bg-[#0B0E17]/90 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-[#7A8296] mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400">Pending UTR Queue</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="font-display text-3xl font-black text-amber-400">
            {metrics.pendingUtrCount}
          </div>
          <span className="font-mono text-[11px] text-[#7A8296] mt-1 block">
            Requires SAC Verification
          </span>
        </div>
      </div>

      {/* ── SECTION 1: GLOBAL PENDING PAYMENT VERIFICATION QUEUE ── */}
      {pendingUtrs.length > 0 && (
        <div className="mb-10 rounded-2xl border border-amber-500/30 bg-[#0F1420] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              <h2 className="font-display text-lg font-bold text-white">
                Global UTR Payment Reconciliation Queue ({pendingUtrs.length})
              </h2>
            </div>
            <span className="font-mono text-xs text-amber-300">
              One-click instant approval dispatches Official QR Pass via Email
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#A3A9B8] font-mono border-b border-white/10 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Reg Code</th>
                  <th className="py-2.5 px-3">Delegate</th>
                  <th className="py-2.5 px-3">Target Arena</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">12-Digit UTR</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {pendingUtrs.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-mono font-bold text-[#12A4C4]">
                      {item.regCode}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{item.fullName}</div>
                      <div className="text-[10px] text-[#7A8296] font-mono">
                        {item.rollNumber} · {item.phone}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-white font-medium">{item.event.title}</div>
                      <div className="text-[10px] text-[#00FF9D] font-mono">
                        {item.event.venue}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">
                      ₹{item.paymentAmount}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-300 tracking-wider">
                      {item.utrNumber || "N/A"}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={actionProcessingId === item.id}
                          onClick={() => handleApproveUtr(item.id, "VERIFIED")}
                          className="px-3 py-1 rounded-lg bg-[#10B981] hover:bg-[#10B981]/80 text-[#06080C] font-mono text-[11px] font-bold transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          disabled={actionProcessingId === item.id}
                          onClick={() => handleApproveUtr(item.id, "REJECTED")}
                          className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-mono text-[11px] transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SECTION 2: ALL 52 ARENAS LEADERBOARD & DIRECTORY ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-white">
            52-Arena Directory & Live Occupancy
          </h2>
          <p className="text-xs text-[#A3A9B8]">
            Monitor registrations, check-in percentages, and coordinator accounts per room.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#7A8296]" />
            <input
              type="text"
              value={searchArena}
              onChange={(e) => setSearchArena(e.target.value)}
              placeholder="Search arena or room..."
              className="h-10 pl-9 pr-3 rounded-xl border border-white/10 bg-[#0B0E17] text-xs text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 rounded-xl border border-white/10 bg-[#0B0E17] px-3 text-xs text-white focus:outline-none focus:border-[#12A4C4]"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0B0E17]/95 overflow-hidden shadow-xl mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#121624] text-[#A3A9B8] font-mono uppercase text-[11px]">
                <th className="py-3 px-4 w-10 text-center">#</th>
                <th className="py-3 px-4">Competition Arena</th>
                <th className="py-3 px-4">Venue Room</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Enrolled</th>
                <th className="py-3 px-4 text-center">Admitted</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredArenas.map((evt, idx) => (
                <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 text-center font-mono text-[#7A8296]">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-white text-sm">{evt.title}</div>
                    <div className="text-[10px] text-[#818CF8] font-mono">
                      {evt.day} · Fee: ₹{evt.entryFee}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-mono text-[#00FF9D] font-bold">
                      <MapPin className="h-3 w-3" /> {evt.venue}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#A3A9B8] text-[11px]">
                    {evt.category}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-white">
                    {evt.registrationsCount}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="text-[#00FF9D] font-bold">
                      {evt.presentCount}
                    </span>
                    <span className="text-[#7A8296] text-[10px] ml-1">
                      ({evt.registrationsCount > 0 ? Math.round((evt.presentCount / evt.registrationsCount) * 100) : 0}%)
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#00FF9D]">
                    ₹{evt.revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/portal/coordinator/print?event=${evt.id}`}
                        title="Print Official VCE Sheet"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* COORDINATOR CREDENTIALS DIRECTORY MODAL                            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {showCredsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#0D121D] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[85vh]">
            <button
              onClick={() => setShowCredsModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#7A8296] hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="h-5 w-5 text-[#12A4C4]" />
              <span className="font-mono text-xs text-[#12A4C4] uppercase font-bold tracking-wider">
                Authorized Credentials Directory
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold text-white">
              Event Coordinator Access Directory
            </h2>
            <p className="text-xs text-[#A3A9B8] mt-1 mb-6">
              All 52 event coordinators log in at <code>/portal/login</code> with scoped role-based access strictly restricted to their venue room.
            </p>

            <div className="p-3 mb-4 rounded-xl bg-[#12A4C4]/10 border border-[#12A4C4]/20 text-xs font-mono text-[#22D3EE]">
              Default Seed Password for all Coordinators: <strong>Coord@Festronix2026</strong>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[#7A8296] font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">Arena</th>
                    <th className="py-2.5 px-3">Venue Room</th>
                    <th className="py-2.5 px-3">Coordinator Username</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3 font-sans font-bold text-white">
                        {evt.title}
                      </td>
                      <td className="py-2.5 px-3 text-[#00FF9D]">
                        {evt.venue}
                      </td>
                      <td className="py-2.5 px-3 text-[#12A4C4]">
                        {evt.coordinatorUsername}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
