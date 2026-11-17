"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Camera,
  RefreshCw,
  Search,
  ShieldCheck,
  MapPin,
  Calendar,
  User,
  Hash,
} from "lucide-react";

interface ScanResult {
  status: "SUCCESS" | "ALREADY_PRESENT" | "ERROR" | "MISMATCH";
  message: string;
  registration?: {
    id: string;
    regCode: string;
    fullName: string;
    rollNumber: string;
    college: string;
    department: string;
    eventTitle: string;
    venueRoom: string;
    paymentStatus: string;
    attendedAt?: string;
  };
  details?: string;
}

export default function CoordinatorQrScannerPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [coordinatorEvent, setCoordinatorEvent] = useState<{
    id: string;
    title: string;
    venue: string;
  } | null>(null);

  const [scannerActive, setScannerActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);

  // Scanner container ref
  const html5QrCodeRef = useRef<any>(null);

  // Load auth context
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/portal/login");
          return;
        }

        if (data.assignedEvent) {
          setCoordinatorEvent(data.assignedEvent);
        } else {
          setCoordinatorEvent({
            id: "all",
            title: "Festronix 2026 Arenas",
            venue: "VCE Campus",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/portal/login");
      });
  }, [router]);

  // Initialize html5-qrcode scanner
  useEffect(() => {
    if (loading) return;

    let html5Scanner: any = null;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        html5Scanner = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5Scanner;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await html5Scanner.start(
          { facingMode: "environment" },
          config,
          onScanSuccess,
          onScanFailure
        );
        setScannerActive(true);
        setCameraError(null);
      } catch (err: any) {
        console.warn("Camera start error, falling back to camera options", err);
        setCameraError(
          "Camera access could not be initialized directly. Please ensure camera permissions are granted or use the manual code validator below."
        );
        setScannerActive(false);
      }
    };

    startScanner();

    return () => {
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop().catch(() => {});
        } catch {}
      }
    };
  }, [loading]);

  const onScanSuccess = (decodedText: string) => {
    // Prevent duplicate scans while processing
    if (isVerifying) return;
    handleVerifyQr(decodedText);
  };

  const onScanFailure = () => {
    // Normal frame without QR, ignore
  };

  // Submit scan payload to POST /api/attendance/scan
  const handleVerifyQr = async (qrPayload: string) => {
    setIsVerifying(true);
    setCameraError(null);

    try {
      const res = await fetch("/api/attendance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData: qrPayload }),
      });

      const data = await res.json();

      if (res.status === 200) {
        // Success
        setLastScanResult({
          status: "SUCCESS",
          message: data.message || "Attendance marked successfully!",
          registration: data.registration,
        });

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#00FF9D", "#12A4C4", "#22D3EE"],
        });
      } else if (res.status === 409) {
        // Duplicate check-in
        setLastScanResult({
          status: "ALREADY_PRESENT",
          message: data.message || "Delegate was already admitted earlier.",
          registration: data.registration,
          details: `Admitted at ${data.alreadyAttendedAt || "earlier"} by ${data.attendedBy || "Coordinator"}`,
        });
      } else if (res.status === 403) {
        // Venue mismatch
        setLastScanResult({
          status: "MISMATCH",
          message: data.error || "Venue Mismatch: Delegate belongs to another arena.",
          details: `Registered for: ${data.registeredEvent || "Other Event"} at ${data.registeredVenue || "Different Venue"}`,
        });
      } else {
        // Error
        setLastScanResult({
          status: "ERROR",
          message: data.error || "Invalid QR Code pass.",
        });
      }
    } catch {
      setLastScanResult({
        status: "ERROR",
        message: "Network error communicating with attendance verification engine.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleVerifyQr(manualCode.trim());
    setManualCode("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080C] text-white flex flex-col items-center justify-center p-6">
        <RefreshCw className="h-8 w-8 animate-spin text-[#12A4C4] mb-3" />
        <p className="font-mono text-sm text-[#A3A9B8]">Initializing Camera & Scanner Engine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080C] text-[#EEF0F5] pt-24 pb-20 px-4 sm:px-6 max-w-3xl mx-auto w-full">
      {/* ── Top Header Navigation ── */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <Link
          href="/portal/coordinator"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#12A4C4] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Arena Roster</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#00FF9D] font-bold">
          <MapPin className="h-3.5 w-3.5" /> {coordinatorEvent?.venue}
        </span>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#12A4C4]/30 bg-[#12A4C4]/10 px-3.5 py-1 mb-2">
          <Camera className="h-3.5 w-3.5 text-[#12A4C4]" />
          <span className="font-mono text-xs font-bold text-[#12A4C4] uppercase tracking-wider">
            Gate Attendance Scanner
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
          {coordinatorEvent?.title}
        </h1>
        <p className="text-xs text-[#A3A9B8] mt-1">
          Aim camera at the student's Official Delegate QR Pass for instant entry verification.
        </p>
      </div>

      {/* ── LIVE SCANNER VIEWFINDER ── */}
      <div className="relative rounded-3xl border-2 border-[#12A4C4]/40 bg-[#0B0E17] p-4 shadow-2xl overflow-hidden mb-6">
        <div
          id="reader"
          className="w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden bg-black aspect-square flex items-center justify-center"
        />

        {isVerifying && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
            <RefreshCw className="h-10 w-10 animate-spin text-[#00FF9D] mb-2" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#00FF9D]">
              Verifying Admission Token...
            </span>
          </div>
        )}

        {cameraError && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-center font-mono">
            {cameraError}
          </div>
        )}
      </div>

      {/* ── SCAN RESULT FEEDBACK BANNER ── */}
      {lastScanResult && (
        <div
          className={`rounded-2xl p-5 mb-6 border animate-in zoom-in-95 duration-200 ${
            lastScanResult.status === "SUCCESS"
              ? "bg-[#10B981]/15 border-[#10B981]/40 text-white"
              : lastScanResult.status === "ALREADY_PRESENT"
              ? "bg-amber-500/15 border-amber-500/40 text-amber-200"
              : lastScanResult.status === "MISMATCH"
              ? "bg-purple-500/15 border-purple-500/40 text-purple-200"
              : "bg-red-500/15 border-red-500/40 text-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {lastScanResult.status === "SUCCESS" ? (
              <CheckCircle2 className="h-7 w-7 text-[#00FF9D] flex-shrink-0 mt-0.5" />
            ) : lastScanResult.status === "ALREADY_PRESENT" ? (
              <AlertTriangle className="h-7 w-7 text-amber-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-7 w-7 text-red-400 flex-shrink-0 mt-0.5" />
            )}

            <div className="flex-1">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider block">
                {lastScanResult.status === "SUCCESS"
                  ? "ADMISSION GRANTED"
                  : lastScanResult.status === "ALREADY_PRESENT"
                  ? "WARNING: DUPLICATE ENTRY DETECTED"
                  : lastScanResult.status === "MISMATCH"
                  ? "WRONG ARENA / VENUE ROOM"
                  : "ADMISSION REJECTED"}
              </span>

              <h2 className="font-display text-lg font-bold text-white mt-0.5">
                {lastScanResult.message}
              </h2>

              {lastScanResult.details && (
                <p className="text-xs text-[#A3A9B8] mt-1 font-mono">
                  {lastScanResult.details}
                </p>
              )}

              {lastScanResult.registration && (
                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#7A8296] font-mono block">Delegate Name</span>
                    <strong className="text-white">{lastScanResult.registration.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A8296] font-mono block">Roll Number</span>
                    <strong className="text-[#22D3EE] font-mono">{lastScanResult.registration.rollNumber}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A8296] font-mono block">College</span>
                    <span className="text-white text-[11px]">{lastScanResult.registration.college}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A8296] font-mono block">Pass ID</span>
                    <span className="text-[#00FF9D] font-mono font-bold">{lastScanResult.registration.regCode}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
            <button
              onClick={() => setLastScanResult(null)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-colors"
            >
              Scan Next Delegate
            </button>
          </div>
        </div>
      )}

      {/* ── MANUAL PASS CODE ENTRY FALLBACK ── */}
      <div className="rounded-2xl border border-white/10 bg-[#0B0E17]/90 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="h-4 w-4 text-[#12A4C4]" />
          <h3 className="font-display text-sm font-bold text-white">
            Manual Pass Code Lookup
          </h3>
        </div>
        <p className="text-xs text-[#7A8296] mb-3">
          If the camera cannot read the student's screen, enter their Registration Code (e.g. <code>FX26-3020-8492</code>) or Student Roll Number.
        </p>

        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            placeholder="e.g. FX26-3020-8492 or Roll No"
            className="flex-1 h-11 rounded-xl border border-white/10 bg-[#121622] px-3.5 text-xs text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none font-mono uppercase"
          />
          <button
            type="submit"
            disabled={!manualCode.trim() || isVerifying}
            className="px-4 h-11 rounded-xl bg-[#12A4C4] hover:bg-[#12A4C4]/80 text-[#06080C] font-mono text-xs font-bold transition-colors disabled:opacity-40"
          >
            Verify
          </button>
        </form>
      </div>

    </div>
  );
}
