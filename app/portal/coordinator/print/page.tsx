"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { OfficialVceHeader } from "@/components/print/OfficialVceHeader";
import { Printer, ArrowLeft, RefreshCw, CheckCircle, Clock } from "lucide-react";

interface RegistrationItem {
  id: string;
  regCode: string;
  fullName: string;
  rollNumber: string;
  department: string;
  yearOfStudy: string;
  college: string;
  phone: string;
  email: string;
  paymentMode: string;
  paymentAmount: number;
  paymentStatus: string;
  utrNumber: string | null;
  attendanceStatus: string;
  attendedAt: string | null;
  isTeam: boolean;
  teamName: string | null;
}

interface EventContext {
  id: string;
  title: string;
  venue: string;
  day: string;
  category: string;
  entryFee: number;
}

function PrintRosterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventParam = searchParams.get("event") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventData, setEventData] = useState<EventContext | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [filterMode, setFilterMode] = useState<"ALL" | "PAID_ONLY" | "PRESENT_ONLY">("ALL");
  const [coordinatorName, setCoordinatorName] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // First get current session context
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();

      if (!meData.authenticated) {
        router.push("/portal/login");
        return;
      }

      setCoordinatorName(meData.user.name);

      const targetEvent = eventParam || meData.assignedEvent?.id || "";
      const regUrl = targetEvent
        ? `/api/registrations?eventId=${encodeURIComponent(targetEvent)}`
        : "/api/registrations";

      const regRes = await fetch(regUrl);
      const regData = await regRes.json();

      if (!regRes.ok) {
        throw new Error(regData.error || "Failed to load registrations.");
      }

      setRegistrations(regData.registrations || []);

      if (meData.assignedEvent) {
        setEventData(meData.assignedEvent);
      } else if (regData.event) {
        setEventData(regData.event);
      } else {
        setEventData({
          id: targetEvent || "general",
          title: "Festronix 2026 Master Roster",
          venue: "Campus Wide",
          day: "Dec 1 & 2, 2026",
          category: "Technical Fest",
          entryFee: 0,
        });
      }
    } catch (err: any) {
      setError(err.message || "Unable to fetch roster data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventParam]);

  const filteredRegistrations = registrations.filter((reg) => {
    if (filterMode === "PAID_ONLY") {
      return reg.paymentStatus === "VERIFIED" || reg.paymentStatus === "CASH_PAID";
    }
    if (filterMode === "PRESENT_ONLY") {
      return reg.attendanceStatus === "PRESENT";
    }
    return true;
  });

  const presentCount = registrations.filter((r) => r.attendanceStatus === "PRESENT").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-slate-800">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mb-3" />
        <p className="font-mono text-sm font-semibold">Generating Official VCE Roster Sheet...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="bg-white p-6 rounded-xl border border-red-200 shadow max-w-md text-center">
          <p className="text-red-600 font-bold mb-3">{error}</p>
          <Link
            href="/portal/coordinator"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 print:bg-white text-slate-900 py-6 px-4 print:p-0">
      {/* ── Screen-Only Control Toolbar ── */}
      <div className="max-w-[1100px] mx-auto mb-6 bg-slate-900 text-white rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/portal/coordinator"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <span className="h-4 w-px bg-slate-700" />
          <span className="font-mono text-xs text-indigo-400 font-semibold">
            {eventData?.title} ({eventData?.venue})
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Selector */}
          <div className="flex rounded-lg bg-slate-800 p-1 text-xs font-mono">
            <button
              onClick={() => setFilterMode("ALL")}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterMode === "ALL" ? "bg-indigo-600 text-white font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              All ({registrations.length})
            </button>
            <button
              onClick={() => setFilterMode("PAID_ONLY")}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterMode === "PAID_ONLY" ? "bg-emerald-600 text-white font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              Paid Only
            </button>
            <button
              onClick={() => setFilterMode("PRESENT_ONLY")}
              className={`px-3 py-1 rounded-md transition-colors ${
                filterMode === "PRESENT_ONLY" ? "bg-cyan-600 text-white font-bold" : "text-slate-300 hover:text-white"
              }`}
            >
              Present ({presentCount})
            </button>
          </div>

          {/* Trigger Print Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold font-sans shadow transition-colors"
          >
            <Printer className="h-4 w-4 text-indigo-600" /> Print Official Sheet
          </button>
        </div>
      </div>

      {/* ── Printable Paper Document Container ── */}
      <div className="max-w-[1100px] mx-auto bg-white p-8 print:p-4 rounded-xl shadow-2xl print:shadow-none print:w-full border border-slate-300 print:border-none">
        {/* Official VCE Crest and Institutional Header */}
        <OfficialVceHeader
          title={`ARENA DELEGATE ROSTER & ATTENDANCE RECORD — ${eventData?.title.toUpperCase()}`}
          subtitle={`Schedule: ${eventData?.day} · Venue: ${eventData?.venue} · Category: ${eventData?.category}`}
          venueRoom={eventData?.venue}
          coordinatorName={coordinatorName}
          festDay={eventData?.day}
          totalCount={registrations.length}
          presentCount={presentCount}
        />

        {/* Printable Table */}
        <div className="w-full overflow-x-auto mt-4">
          <table className="w-full border-collapse border border-slate-400 text-[10.5px]">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-bold border-b-2 border-slate-400">
                <th className="border border-slate-300 px-2 py-1.5 text-center w-10">S.No</th>
                <th className="border border-slate-300 px-2 py-1.5 text-left w-24">Reg Code</th>
                <th className="border border-slate-300 px-2 py-1.5 text-left">Student Name</th>
                <th className="border border-slate-300 px-2 py-1.5 text-left w-24">Roll Number</th>
                <th className="border border-slate-300 px-2 py-1.5 text-left w-36">College / Inst</th>
                <th className="border border-slate-300 px-2 py-1.5 text-left w-28">Dept & Year</th>
                <th className="border border-slate-300 px-2 py-1.5 text-center w-24">Payment Status</th>
                <th className="border border-slate-300 px-2 py-1.5 text-center w-20">Attendance</th>
                <th className="border border-slate-300 px-2 py-1.5 text-center w-24">Student Sign</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="border border-slate-300 p-8 text-center text-slate-500 font-mono text-xs">
                    No delegate registrations found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((reg, idx) => (
                  <tr
                    key={reg.id}
                    className={`border-b border-slate-300 ${idx % 2 === 1 ? "bg-slate-50/70" : "bg-white"}`}
                  >
                    <td className="border border-slate-300 px-2 py-1.5 text-center font-mono font-medium">
                      {idx + 1}
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 font-mono font-bold text-slate-900">
                      {reg.regCode}
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5">
                      <div className="font-bold text-slate-900">{reg.fullName}</div>
                      {reg.isTeam && reg.teamName && (
                        <div className="text-[9.5px] text-indigo-700 font-mono">
                          Team: {reg.teamName}
                        </div>
                      )}
                      <div className="text-[9px] text-slate-500 font-mono print:hidden">
                        {reg.phone}
                      </div>
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 font-mono font-semibold text-slate-800">
                      {reg.rollNumber}
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 text-slate-700 leading-tight">
                      {reg.college}
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 text-slate-700 leading-tight">
                      <div>{reg.department}</div>
                      <div className="text-[9.5px] text-slate-500">{reg.yearOfStudy}</div>
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          reg.paymentStatus === "VERIFIED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : reg.paymentStatus === "CASH_PAID"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : reg.paymentStatus === "PENDING_VERIFICATION"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                        }`}
                      >
                        {reg.paymentStatus === "CASH_PAID" ? "CASH" : reg.paymentStatus.replace("_", " ")}
                      </span>
                      {reg.utrNumber && (
                        <div className="text-[8.5px] text-slate-500 font-mono mt-0.5">
                          UTR: {reg.utrNumber.slice(-4)}
                        </div>
                      )}
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 text-center font-mono">
                      {reg.attendanceStatus === "PRESENT" ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                          <CheckCircle className="h-3.5 w-3.5 inline" /> PRESENT
                        </span>
                      ) : (
                        <span className="inline-block w-4 h-4 border-2 border-slate-400 rounded-sm" />
                      )}
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 text-center">
                      {/* Blank area for physical signature on printed sheet */}
                      <div className="h-6" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Institutional Verification & Signatures Block ── */}
        <div className="mt-12 pt-6 border-t-2 border-slate-400 text-slate-900 grid grid-cols-3 gap-6 text-center text-xs break-inside-avoid">
          <div>
            <div className="h-10" />
            <div className="border-t border-slate-400 pt-1 font-bold">
              Student Event Coordinator
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {coordinatorName || "Authorized Signatory"}
            </div>
          </div>

          <div>
            <div className="h-10" />
            <div className="border-t border-slate-400 pt-1 font-bold">
              Faculty Arena In-Charge
            </div>
            <div className="text-[10px] text-slate-500">
              Department of Engineering
            </div>
          </div>

          <div>
            <div className="h-10" />
            <div className="border-t border-slate-400 pt-1 font-bold">
              Dean / Convener, SAC
            </div>
            <div className="text-[10px] text-slate-500">
              Student Affairs Cell, VCE
            </div>
          </div>
        </div>

        {/* Footer Audit Stamp */}
        <div className="mt-8 text-center text-[9px] text-slate-500 font-mono border-t border-slate-200 pt-2">
          Festronix 2026 · Vardhaman College of Engineering (Autonomous) · Generated via Official SAC Event Engine
        </div>
      </div>
    </div>
  );
}

export default function CoordinatorPrintPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
          <p className="font-mono text-sm">Loading print document...</p>
        </div>
      }
    >
      <PrintRosterContent />
    </Suspense>
  );
}
