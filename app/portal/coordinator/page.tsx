"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  QrCode,
  UserPlus,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  MapPin,
  Calendar,
  LogOut,
  RefreshCw,
  Check,
  X,
  CreditCard,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface RegistrationItem {
  id: string;
  regCode: string;
  fullName: string;
  rollNumber: string;
  phone: string;
  email: string;
  college: string;
  department: string;
  yearOfStudy: string;
  isTeam: boolean;
  teamName: string | null;
  registrationMode: string;
  paymentMode: string;
  paymentAmount: number;
  paymentStatus: string;
  utrNumber: string | null;
  attendanceStatus: string;
  attendedAt: string | null;
  createdAt: string;
}

interface EventContext {
  id: string;
  title: string;
  venue: string;
  day: string;
  category: string;
  entryFee: number;
}

interface UserContext {
  userId: string;
  username: string;
  name: string;
  role: string;
  assignedVenue?: string;
}

export default function CoordinatorDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserContext | null>(null);
  const [eventData, setEventData] = useState<EventContext | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [attendanceFilter, setAttendanceFilter] = useState("ALL");

  // Spot Registration Modal
  const [showSpotModal, setShowSpotModal] = useState(false);
  const [spotSubmitting, setSpotSubmitting] = useState(false);
  const [spotError, setSpotError] = useState<string | null>(null);
  const [spotSuccess, setSpotSuccess] = useState<string | null>(null);
  const [spotForm, setSpotForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "Vardhaman College of Engineering",
    rollNumber: "",
    department: "Computer Science & Engineering (CSE)",
    yearOfStudy: "3rd Year",
    isTeam: false,
    teamName: "",
    paymentMode: "CASH", // "CASH" | "UPI_QR"
    utrNumber: "",
  });

  // Action status loading states
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch Session & Registrations
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();

      if (!meData.authenticated) {
        router.push("/portal/login");
        return;
      }

      setUser(meData.user);

      if (meData.user.role === "ADMIN" && !meData.assignedEvent) {
        // SAC Super Admin can view all or navigate to admin dashboard
        setEventData({
          id: "all",
          title: "Pan-Fest SAC Master View",
          venue: "Campus Wide",
          day: "Dec 1 & 2, 2026",
          category: "Technical Fest",
          entryFee: 0,
        });
      } else if (meData.assignedEvent) {
        setEventData(meData.assignedEvent);
      }

      // Fetch registrations for assigned event
      const targetParam = meData.assignedEvent?.id ? `?eventId=${meData.assignedEvent.id}` : "";
      const regRes = await fetch(`/api/registrations${targetParam}`);
      const regData = await regRes.json();

      if (!regRes.ok) {
        throw new Error(regData.error || "Failed to fetch registrations.");
      }

      setRegistrations(regData.registrations || []);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal/login");
  };

  // One-click Attendance Toggle
  const handleToggleAttendance = async (reg: RegistrationItem) => {
    const newStatus = reg.attendanceStatus === "PRESENT" ? "ABSENT" : "PRESENT";
    setUpdatingId(reg.id);

    try {
      const res = await fetch("/api/attendance/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: reg.id,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update attendance.");
        return;
      }

      // Update state locally
      setRegistrations((prev) =>
        prev.map((item) =>
          item.id === reg.id
            ? {
                ...item,
                attendanceStatus: newStatus,
                attendedAt: newStatus === "PRESENT" ? new Date().toISOString() : null,
              }
            : item
        )
      );
    } catch {
      alert("Network error updating attendance.");
    } finally {
      setUpdatingId(null);
    }
  };

  // One-click Payment Approval
  const handleApprovePayment = async (reg: RegistrationItem, newStatus: "VERIFIED" | "CASH_PAID" | "REJECTED") => {
    setUpdatingId(reg.id);
    try {
      const res = await fetch("/api/payments/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: reg.id,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to approve payment.");
        return;
      }

      setRegistrations((prev) =>
        prev.map((item) =>
          item.id === reg.id
            ? {
                ...item,
                paymentStatus: newStatus,
              }
            : item
        )
      );
    } catch {
      alert("Network error updating payment status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Spot Registration Submit
  const handleSpotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSpotError(null);
    setSpotSuccess(null);
    setSpotSubmitting(true);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: eventData?.id,
          fullName: spotForm.fullName,
          email: spotForm.email,
          phone: spotForm.phone,
          college: spotForm.college,
          rollNumber: spotForm.rollNumber,
          department: spotForm.department,
          yearOfStudy: spotForm.yearOfStudy,
          isTeam: spotForm.isTeam,
          teamName: spotForm.isTeam ? spotForm.teamName : undefined,
          isSpotRegistration: true,
          paymentMode: spotForm.paymentMode,
          utrNumber: spotForm.paymentMode === "UPI_QR" ? spotForm.utrNumber : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSpotError(data.error || "Spot registration failed.");
        setSpotSubmitting(false);
        return;
      }

      setSpotSuccess(`Registration created successfully! Pass Code: ${data.registration.regCode}`);
      // Prepend to registrations list
      setRegistrations((prev) => [
        {
          id: data.registration.id,
          regCode: data.registration.regCode,
          fullName: data.registration.fullName,
          rollNumber: data.registration.rollNumber,
          phone: spotForm.phone,
          email: spotForm.email,
          college: data.registration.college,
          department: data.registration.department,
          yearOfStudy: data.registration.yearOfStudy,
          isTeam: data.registration.isTeam,
          teamName: data.registration.teamName,
          registrationMode: "OFFLINE_SPOT",
          paymentMode: spotForm.paymentMode,
          paymentAmount: data.registration.paymentAmount,
          paymentStatus: data.registration.paymentStatus,
          utrNumber: spotForm.utrNumber || null,
          attendanceStatus: "ABSENT",
          attendedAt: null,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      // Reset form
      setSpotForm({
        fullName: "",
        email: "",
        phone: "",
        college: "Vardhaman College of Engineering",
        rollNumber: "",
        department: "Computer Science & Engineering (CSE)",
        yearOfStudy: "3rd Year",
        isTeam: false,
        teamName: "",
        paymentMode: "CASH",
        utrNumber: "",
      });

      setTimeout(() => {
        setShowSpotModal(false);
        setSpotSuccess(null);
      }, 1800);
    } catch {
      setSpotError("Network error logging spot registration.");
    } finally {
      setSpotSubmitting(false);
    }
  };

  // Metrics Calculations
  const totalRegistered = registrations.length;
  const presentCount = registrations.filter((r) => r.attendanceStatus === "PRESENT").length;
  const attendanceRate = totalRegistered > 0 ? Math.round((presentCount / totalRegistered) * 100) : 0;
  const pendingPayments = registrations.filter((r) => r.paymentStatus === "PENDING_VERIFICATION").length;
  const spotCashCollected = registrations
    .filter((r) => r.paymentStatus === "CASH_PAID")
    .reduce((acc, curr) => acc + (curr.paymentAmount || 0), 0);

  // Filtered registrations
  const filteredList = registrations.filter((reg) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      reg.fullName.toLowerCase().includes(q) ||
      reg.rollNumber.toLowerCase().includes(q) ||
      reg.regCode.toLowerCase().includes(q) ||
      reg.phone.includes(q) ||
      (reg.teamName && reg.teamName.toLowerCase().includes(q));

    const matchesPayment =
      paymentFilter === "ALL" ||
      (paymentFilter === "PAID" && (reg.paymentStatus === "VERIFIED" || reg.paymentStatus === "CASH_PAID")) ||
      (paymentFilter === "PENDING" && reg.paymentStatus === "PENDING_VERIFICATION") ||
      reg.paymentStatus === paymentFilter;

    const matchesAttendance =
      attendanceFilter === "ALL" || reg.attendanceStatus === attendanceFilter;

    return matchesSearch && matchesPayment && matchesAttendance;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080C] text-white flex flex-col items-center justify-center p-6">
        <RefreshCw className="h-8 w-8 animate-spin text-[#12A4C4] mb-3" />
        <p className="font-mono text-sm text-[#A3A9B8]">Loading Coordinator Arena Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080C] text-[#EEF0F5] pt-24 pb-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
      
      {/* ── Top Header Strip ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#12A4C4]/15 border border-[#12A4C4]/30 px-3 py-0.5 font-mono text-[11px] text-[#12A4C4] font-bold uppercase">
              <ShieldCheck className="h-3 w-3" />
              Event Operations Coordinator
            </span>
            <span className="font-mono text-xs text-[#7A8296]">
              Logged in as <strong className="text-white">{user?.name}</strong> ({user?.username})
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            {eventData?.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono">
            <span className="inline-flex items-center gap-1 text-[#00FF9D]">
              <MapPin className="h-3.5 w-3.5" /> Venue: {eventData?.venue}
            </span>
            <span className="text-white/20">|</span>
            <span className="inline-flex items-center gap-1 text-[#818CF8]">
              <Calendar className="h-3.5 w-3.5" /> {eventData?.day} · Dec 1 & 2, 2026
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[#A3A9B8]">
              Entry Fee: ₹{eventData?.entryFee}
            </span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {user?.role === "ADMIN" && (
            <Link
              href="/portal/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5145CD]/20 border border-[#5145CD]/40 text-[#818CF8] hover:bg-[#5145CD]/30 text-xs font-mono font-bold transition-all"
            >
              SAC Master View
            </Link>
          )}

          <button
            onClick={loadDashboardData}
            title="Refresh Roster"
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

      {/* ── Key Operational Metrics Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Registered */}
        <div className="rounded-2xl border border-white/10 bg-[#0B0E17]/90 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-[#7A8296] mb-2">
            <span className="font-mono text-xs uppercase tracking-wider">Total Enrolled</span>
            <Users className="h-4 w-4 text-[#12A4C4]" />
          </div>
          <div className="font-display text-3xl font-black text-white">
            {totalRegistered}
          </div>
          <span className="font-mono text-[11px] text-[#A3A9B8] mt-1 block">
            Max Cap: 150 Delegates
          </span>
        </div>

        {/* Admitted / Attendance Rate */}
        <div className="rounded-2xl border border-[#00FF9D]/20 bg-[#0B0E17]/90 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-[#7A8296] mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#00FF9D]">Admitted</span>
            <CheckCircle2 className="h-4 w-4 text-[#00FF9D]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-black text-[#00FF9D]">
              {presentCount}
            </span>
            <span className="font-mono text-sm text-[#00FF9D]/80 font-bold">
              ({attendanceRate}%)
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#7A8296] mt-1 block">
            {totalRegistered - presentCount} Remaining to Check-In
          </span>
        </div>

        {/* Pending Payment Verification */}
        <div className="rounded-2xl border border-white/10 bg-[#0B0E17]/90 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-[#7A8296] mb-2">
            <span className="font-mono text-xs uppercase tracking-wider">Pending UTRs</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="font-display text-3xl font-black text-amber-400">
            {pendingPayments}
          </div>
          <span className="font-mono text-[11px] text-[#7A8296] mt-1 block">
            Awaiting Verification
          </span>
        </div>

        {/* Spot Cash Collected */}
        <div className="rounded-2xl border border-white/10 bg-[#0B0E17]/90 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-[#7A8296] mb-2">
            <span className="font-mono text-xs uppercase tracking-wider">Spot Cash</span>
            <DollarSign className="h-4 w-4 text-[#22D3EE]" />
          </div>
          <div className="font-display text-3xl font-black text-[#22D3EE]">
            ₹{spotCashCollected}
          </div>
          <span className="font-mono text-[11px] text-[#7A8296] mt-1 block">
            Collected at Venue Desk
          </span>
        </div>
      </div>

      {/* ── Quick Action Command Bar ── */}
      <div className="rounded-2xl border border-[#12A4C4]/30 bg-gradient-to-r from-[#0E1524] via-[#10192E] to-[#0E1524] p-4 sm:p-5 mb-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-[#00FF9D] font-bold uppercase tracking-wider block">
            Arena Entrance Operations
          </span>
          <div className="font-display text-lg font-bold text-white mt-0.5">
            Real-Time Gate & Delegate Management
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Action 1: Launch Camera QR Scanner */}
          <Link
            href="/portal/coordinator/scan"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#12A4C4] to-[#00FF9D] text-[#06080C] font-sans text-xs sm:text-sm font-bold shadow-lg hover:opacity-95 transition-all"
          >
            <QrCode className="h-4 w-4" />
            <span>Open Camera QR Scanner</span>
          </Link>

          {/* Action 2: New Spot Registration */}
          <button
            onClick={() => setShowSpotModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D253A] border border-white/15 hover:bg-[#26324D] text-white font-sans text-xs sm:text-sm font-semibold transition-all"
          >
            <UserPlus className="h-4 w-4 text-[#12A4C4]" />
            <span>On-Spot Registration</span>
          </button>

          {/* Action 3: Print Roster */}
          <Link
            href="/portal/coordinator/print"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141928] border border-white/10 hover:bg-[#1C2337] text-[#EEF0F5] font-sans text-xs sm:text-sm font-medium transition-all"
          >
            <Printer className="h-4 w-4 text-[#818CF8]" />
            <span>Print Official VCE Sheet</span>
          </Link>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7A8296]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, or reg code..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/10 bg-[#0B0E17] text-xs text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap font-mono text-xs">
          <div className="flex items-center gap-1.5 text-[#7A8296]">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-[#0B0E17] px-3 text-xs text-white focus:outline-none focus:border-[#12A4C4]"
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">Confirmed / Paid</option>
            <option value="PENDING">Pending UTR</option>
            <option value="CASH_PAID">Spot Cash Only</option>
            <option value="VERIFIED">Online Verified</option>
          </select>

          <select
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-[#0B0E17] px-3 text-xs text-white focus:outline-none focus:border-[#12A4C4]"
          >
            <option value="ALL">All Attendance</option>
            <option value="PRESENT">Present Admitted</option>
            <option value="ABSENT">Absent Pending</option>
          </select>
        </div>
      </div>

      {/* ── Registered Delegates Master Table ── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B0E17]/95 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#121624] text-[#A3A9B8] font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">Delegate Details</th>
                <th className="py-3.5 px-4">Roll & Inst</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-center">Attendance</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7A8296] font-mono text-xs">
                    No delegates found matching current search or filters.
                  </td>
                </tr>
              ) : (
                filteredList.map((reg, idx) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center font-mono text-[#7A8296]">
                      {idx + 1}
                    </td>

                    {/* Delegate Name & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{reg.fullName}</div>
                      <div className="font-mono text-[11px] text-[#12A4C4]">
                        {reg.regCode}
                      </div>
                      {reg.isTeam && reg.teamName && (
                        <div className="text-[10px] text-[#00FF9D] font-mono mt-0.5">
                          Team: {reg.teamName}
                        </div>
                      )}
                      <div className="text-[10px] text-[#7A8296] font-mono">
                        {reg.phone}
                      </div>
                    </td>

                    {/* Roll Number & College */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-semibold text-[#22D3EE]">
                        {reg.rollNumber}
                      </div>
                      <div className="text-[11px] text-[#A3A9B8] max-w-[200px] truncate" title={reg.college}>
                        {reg.college}
                      </div>
                      <div className="text-[10px] text-[#7A8296]">
                        {reg.department} · {reg.yearOfStudy}
                      </div>
                    </td>

                    {/* Registration Mode */}
                    <td className="py-3.5 px-4 font-mono text-[10px]">
                      {reg.registrationMode === "OFFLINE_SPOT" ? (
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[#00FF9D] font-bold">
                          SPOT DESK
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-400">
                          ONLINE
                        </span>
                      )}
                    </td>

                    {/* Payment Status & Action */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {reg.paymentStatus === "VERIFIED" ? (
                          <span className="inline-flex items-center gap-1 rounded bg-[#10B981]/15 border border-[#10B981]/30 px-2 py-0.5 font-mono text-[10px] text-[#00FF9D] font-bold">
                            <CheckCircle2 className="h-3 w-3" /> VERIFIED (₹{reg.paymentAmount})
                          </span>
                        ) : reg.paymentStatus === "CASH_PAID" ? (
                          <span className="inline-flex items-center gap-1 rounded bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 font-mono text-[10px] text-cyan-300 font-bold">
                            <CheckCircle2 className="h-3 w-3" /> CASH PAID (₹{reg.paymentAmount})
                          </span>
                        ) : reg.paymentStatus === "PENDING_VERIFICATION" ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 font-mono text-[10px] text-amber-300 font-bold">
                              <Clock className="h-3 w-3" /> PENDING UTR
                            </span>
                            {reg.utrNumber && (
                              <div className="font-mono text-[10px] text-white">
                                UTR: <strong>{reg.utrNumber}</strong>
                              </div>
                            )}
                            <button
                              disabled={updatingId === reg.id}
                              onClick={() => handleApprovePayment(reg, "VERIFIED")}
                              className="px-2 py-0.5 rounded bg-[#10B981] hover:bg-[#10B981]/80 text-[#06080C] font-mono text-[10px] font-bold transition-colors"
                            >
                              Approve UTR
                            </button>
                          </div>
                        ) : (
                          <span className="inline-block rounded bg-red-500/15 border border-red-500/30 px-2 py-0.5 font-mono text-[10px] text-red-400 font-bold">
                            UNPAID
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Attendance Status */}
                    <td className="py-3.5 px-4 text-center">
                      {reg.attendanceStatus === "PRESENT" ? (
                        <div className="inline-flex flex-col items-center">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 px-2.5 py-1 font-mono text-[11px] text-[#00FF9D] font-bold">
                            <Check className="h-3.5 w-3.5" /> PRESENT
                          </span>
                          {reg.attendedAt && (
                            <span className="text-[9px] text-[#7A8296] font-mono mt-0.5">
                              {new Date(reg.attendedAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-block rounded-full bg-white/5 border border-white/10 px-2.5 py-1 font-mono text-[11px] text-[#7A8296]">
                          ABSENT
                        </span>
                      )}
                    </td>

                    {/* Actions: Toggle Attendance */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        disabled={updatingId === reg.id}
                        onClick={() => handleToggleAttendance(reg)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all ${
                          reg.attendanceStatus === "PRESENT"
                            ? "bg-white/10 text-[#EEF0F5] hover:bg-red-950/30 hover:text-red-400 hover:border-red-500/30 border border-white/10"
                            : "bg-[#00FF9D]/20 border border-[#00FF9D]/40 text-[#00FF9D] hover:bg-[#00FF9D]/30"
                        }`}
                      >
                        {updatingId === reg.id ? (
                          "Updating..."
                        ) : reg.attendanceStatus === "PRESENT" ? (
                          "Mark Absent"
                        ) : (
                          "Mark Present"
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SPOT REGISTRATION MODAL                                            */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {showSpotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-[#0D121D] p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <button
              onClick={() => setShowSpotModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#7A8296] hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <UserPlus className="h-5 w-5 text-[#12A4C4]" />
              <span className="font-mono text-xs text-[#12A4C4] uppercase font-bold tracking-wider">
                On-Spot Registration Desk
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold text-white">
              Walk-In Delegate Registration
            </h2>
            <p className="text-xs text-[#A3A9B8] mt-1 mb-6">
              Arena: <strong className="text-white">{eventData?.title}</strong> ({eventData?.venue}) · Fee: ₹{eventData?.entryFee}
            </p>

            {spotError && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{spotError}</span>
              </div>
            )}

            {spotSuccess && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{spotSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSpotSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-[#A3A9B8] block mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={spotForm.fullName}
                    onChange={(e) => setSpotForm({ ...spotForm, fullName: e.target.value })}
                    placeholder="e.g. Ananya Rao"
                    className="w-full h-11 rounded-xl border border-white/10 bg-[#141A28] px-3.5 text-xs text-white focus:border-[#12A4C4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#A3A9B8] block mb-1">
                    Student Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={spotForm.rollNumber}
                    onChange={(e) => setSpotForm({ ...spotForm, rollNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. 23881A05XX"
                    className="w-full h-11 rounded-xl border border-white/10 bg-[#141A28] px-3.5 text-xs text-white focus:border-[#12A4C4] focus:outline-none font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-[#A3A9B8] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={spotForm.email}
                    onChange={(e) => setSpotForm({ ...spotForm, email: e.target.value })}
                    placeholder="student@college.edu"
                    className="w-full h-11 rounded-xl border border-white/10 bg-[#141A28] px-3.5 text-xs text-white focus:border-[#12A4C4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#A3A9B8] block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={spotForm.phone}
                    onChange={(e) => setSpotForm({ ...spotForm, phone: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full h-11 rounded-xl border border-white/10 bg-[#141A28] px-3.5 text-xs text-white focus:border-[#12A4C4] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-[#A3A9B8] block mb-1">
                    College / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    value={spotForm.college}
                    onChange={(e) => setSpotForm({ ...spotForm, college: e.target.value })}
                    className="w-full h-11 rounded-xl border border-white/10 bg-[#141A28] px-3.5 text-xs text-white focus:border-[#12A4C4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#A3A9B8] block mb-1">
                    Year of Study *
                  </label>
                  <select
                    value={spotForm.yearOfStudy}
                    onChange={(e) => setSpotForm({ ...spotForm, yearOfStudy: e.target.value })}
                    className="w-full h-11 rounded-xl border border-white/10 bg-[#141A28] px-3 text-xs text-white focus:border-[#12A4C4] focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2 border-t border-white/10">
                <label className="font-mono text-xs text-[#A3A9B8] block mb-2 font-bold">
                  Payment Collection Method (₹{eventData?.entryFee}):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    spotForm.paymentMode === "CASH"
                      ? "border-[#00FF9D] bg-[#00FF9D]/10 text-white"
                      : "border-white/10 bg-[#141A28] text-[#7A8296]"
                  }`}>
                    <input
                      type="radio"
                      name="spotPayment"
                      value="CASH"
                      checked={spotForm.paymentMode === "CASH"}
                      onChange={() => setSpotForm({ ...spotForm, paymentMode: "CASH" })}
                      className="sr-only"
                    />
                    <DollarSign className="h-4 w-4 text-[#00FF9D]" />
                    <span className="font-mono text-xs font-bold">Cash Received (Desk)</span>
                  </label>

                  <label className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    spotForm.paymentMode === "UPI_QR"
                      ? "border-[#12A4C4] bg-[#12A4C4]/10 text-white"
                      : "border-white/10 bg-[#141A28] text-[#7A8296]"
                  }`}>
                    <input
                      type="radio"
                      name="spotPayment"
                      value="UPI_QR"
                      checked={spotForm.paymentMode === "UPI_QR"}
                      onChange={() => setSpotForm({ ...spotForm, paymentMode: "UPI_QR" })}
                      className="sr-only"
                    />
                    <CreditCard className="h-4 w-4 text-[#12A4C4]" />
                    <span className="font-mono text-xs font-bold">On-Spot UPI / UTR</span>
                  </label>
                </div>

                {spotForm.paymentMode === "UPI_QR" && (
                  <div className="mt-3">
                    <input
                      type="text"
                      maxLength={12}
                      value={spotForm.utrNumber}
                      onChange={(e) => setSpotForm({ ...spotForm, utrNumber: e.target.value.replace(/\D/g, "") })}
                      placeholder="Enter 12-digit UPI UTR Number"
                      className="w-full h-11 rounded-xl border border-white/10 bg-[#141A28] px-3.5 text-xs text-white focus:border-[#12A4C4] focus:outline-none font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSpotModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#A3A9B8] font-mono transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={spotSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#12A4C4] to-[#00FF9D] text-[#06080C] font-sans text-xs font-bold shadow-lg hover:opacity-95 disabled:opacity-40 transition-all"
                >
                  {spotSubmitting ? "Registering..." : "Confirm Spot Registration"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
