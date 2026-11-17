"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";
import { FEST_EVENTS, FestEvent } from "@/data/events";
import { FEST_CONFIG } from "@/data/config";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  QrCode,
  Download,
  RotateCcw,
  Sparkles,
  CreditCard,
  Building,
  GraduationCap,
  User,
  Mail,
  Phone,
  Hash,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

function RegisterForm() {
  const searchParams = useSearchParams();
  const eventSlugParam = searchParams.get("event");

  // Selected event state
  const [selectedEventSlug, setSelectedEventSlug] = useState<string>(
    eventSlugParam || "smartathon"
  );

  useEffect(() => {
    if (eventSlugParam) {
      const match = FEST_EVENTS.find((e) => e.slug === eventSlugParam);
      if (match) setSelectedEventSlug(match.slug);
    }
  }, [eventSlugParam]);

  const selectedEvent =
    FEST_EVENTS.find((e) => e.slug === selectedEventSlug) || FEST_EVENTS[0];

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "Vardhaman College of Engineering",
    rollNumber: "",
    department: "Computer Science & Engineering (CSE)",
    yearOfStudy: "3rd Year",
    isTeam: false,
    teamName: "",
    member2: "",
    member3: "",
    member4: "",
  });

  // UI Flow Stages: "FORM" | "PAYMENT" | "PASS"
  const [stage, setStage] = useState<"FORM" | "PAYMENT" | "PASS">("FORM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Registration response data
  const [regData, setRegData] = useState<{
    id: string;
    regCode: string;
    ticketToken: string;
    fullName: string;
    rollNumber: string;
    college: string;
    department: string;
    yearOfStudy: string;
    eventTitle: string;
    venueRoom: string;
    festDay: string;
    paymentMode: string;
    paymentAmount: number;
    paymentStatus: string;
    isTeam: boolean;
    teamName: string | null;
  } | null>(null);

  // UPI Payment data
  const [upiDetails, setUpiDetails] = useState<{
    uri: string;
    qrDataUrl: string;
    amount: number;
    note: string;
  } | null>(null);
  const [attendanceQrUrl, setAttendanceQrUrl] = useState<string>("");

  // UTR Form State
  const [utrNumber, setUtrNumber] = useState("");
  const [utrSubmitting, setUtrSubmitting] = useState(false);
  const [utrError, setUtrError] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  const upiId = "9490298994-2@ybl";
  const upiName = "Pilli Maruthi Sai Teja";

  // Handle Form Submission -> calls POST /api/registrations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const teamMembersList = formData.isTeam
        ? [formData.member2, formData.member3, formData.member4].filter(Boolean)
        : [];

      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.slug,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          rollNumber: formData.rollNumber,
          department: formData.department,
          yearOfStudy: formData.yearOfStudy,
          isTeam: formData.isTeam,
          teamName: formData.isTeam ? formData.teamName : undefined,
          teamMembers: teamMembersList,
          paymentMode: "UPI_QR",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.existingRegCode) {
          setFormError(
            `${data.error} If you already registered, your pass code is ${data.existingRegCode}.`
          );
        } else {
          setFormError(data.error || "Registration failed. Please check your details.");
        }
        setIsSubmitting(false);
        return;
      }

      setRegData(data.registration);
      setAttendanceQrUrl(data.attendanceQrDataUrl || "");

      // If fee > 0, proceed to dynamic UPI payment step
      if (data.registration?.paymentAmount > 0 && data.upi) {
        setUpiDetails(data.upi);
        setStage("PAYMENT");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Free event -> Directly show verified pass
        setStage("PASS");
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#12A4C4", "#5145CD", "#00FF9D"],
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      setFormError("Network error. Please verify your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle UTR Submission -> calls POST /api/payments/verify-utr
  const handleUtrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUtrError(null);

    const cleanUtr = utrNumber.replace(/\D/g, "");
    if (cleanUtr.length !== 12) {
      setUtrError("Please enter the complete 12-digit UPI Reference / UTR Number from your banking app.");
      return;
    }

    if (!regData?.regCode) return;

    setUtrSubmitting(true);
    try {
      const res = await fetch("/api/payments/verify-utr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regCode: regData.regCode,
          utrNumber: cleanUtr,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setUtrError(data.error || "UTR verification failed. Please re-check the 12 digits.");
        setUtrSubmitting(false);
        return;
      }

      // Success! Fire confetti and proceed to pass view
      confetti({
        particleCount: 120,
        spread: 85,
        origin: { y: 0.5 },
        colors: ["#00FF9D", "#22D3EE", "#818CF8"],
      });

      if (regData) {
        setRegData({
          ...regData,
          paymentStatus: "PENDING_VERIFICATION",
        });
      }

      setStage("PASS");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setUtrError("Network error submitting UTR. Please try again.");
    } finally {
      setUtrSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: "upi" | "amount" | "note") => {
    navigator.clipboard.writeText(text);
    if (type === "upi") {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else if (type === "amount") {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    } else if (type === "note") {
      setCopiedNote(true);
      setTimeout(() => setCopiedNote(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 2: DYNAMIC UPI PAYMENT (OptiForge Replicated Experience)
  // ═══════════════════════════════════════════════════════════════════
  if (stage === "PAYMENT" && regData && upiDetails) {
    const rawUri = upiDetails.uri;
    const phonepeUri = rawUri.replace("upi://", "phonepe://");
    const gpayUri = rawUri.replace("upi://", "tez://upi/");
    const paytmUri = rawUri.replace("upi://", "paytmmp://");

    return (
      <div className="pt-28 pb-24 px-4 sm:px-6 md:px-8 max-w-3xl mx-auto w-full">
        {/* Step Indicator Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#12A4C4]/30 bg-[#12A4C4]/10 px-3.5 py-1 mb-3">
            <CreditCard className="h-3.5 w-3.5 text-[#12A4C4]" />
            <span className="font-mono text-xs font-bold text-[#12A4C4] uppercase tracking-wider">
              Step 2 of 2 · Dynamic UPI Payment
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-black text-white">
            Complete Arena Registration Fee
          </h1>
          <p className="mt-2 text-sm text-[#A3A9B8] max-w-lg">
            Registration logged for <strong className="text-white">{regData.fullName}</strong>. Scan the dynamic QR code below using any UPI app and enter the 12-digit UTR.
          </p>
        </div>

        {/* Dynamic Payment Card */}
        <div className="rounded-3xl border-2 border-[#12A4C4]/30 bg-gradient-to-b from-[#0B0E17] via-[#101422] to-[#0D1525] p-6 sm:p-8 shadow-2xl shadow-cyan-950/30">
          
          {/* Arena Summary Banner */}
          <div className="rounded-2xl border border-white/10 bg-[#141928] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <span className="font-mono text-[11px] text-[#12A4C4] font-bold uppercase tracking-wider block">
                Target Arena
              </span>
              <div className="font-display text-xl font-bold text-white mt-0.5">
                {regData.eventTitle}
              </div>
              <div className="font-mono text-xs text-[#00FF9D] mt-1 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> Venue: {regData.venueRoom} · {regData.festDay}
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs text-[#A3A9B8] block">Fee Payable</span>
              <div className="font-display text-3xl font-black text-[#00FF9D]">
                ₹{upiDetails.amount}
              </div>
              <span className="font-mono text-[10px] text-[#818CF8] block">
                Ref: {regData.regCode}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pb-8 border-b border-white/10">
            {/* Left: Dynamic QR Standee Box */}
            <div className="flex flex-col items-center text-center">
              <div className="relative p-4 rounded-2xl bg-white shadow-2xl border-4 border-slate-200">
                {upiDetails.qrDataUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={upiDetails.qrDataUrl}
                    alt="UPI Payment QR Code"
                    className="w-56 h-56 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center bg-slate-100 rounded-lg">
                    <QrCode className="h-16 w-16 text-slate-400 animate-pulse" />
                  </div>
                )}
                <div className="mt-2 text-[11px] font-mono font-bold text-slate-800">
                  Scan with GPay / PhonePe / Paytm / BHIM
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#00FF9D] font-mono">
                <ShieldCheck className="h-4 w-4" /> Official SAC Payment Gateway
              </div>
            </div>

            {/* Right: Payment Intent Buttons & Details */}
            <div className="flex flex-col gap-4">
              <div>
                <span className="font-mono text-xs text-[#A3A9B8] uppercase tracking-wider block mb-1">
                  Pay directly via installed app:
                </span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <a
                    href={phonepeUri}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#5f259f]/30 border border-[#5f259f]/60 hover:bg-[#5f259f]/50 text-white font-sans text-xs font-semibold transition-all"
                  >
                    PhonePe <ExternalLink className="h-3 w-3" />
                  </a>

                  <a
                    href={gpayUri}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#4285f4]/30 border border-[#4285f4]/60 hover:bg-[#4285f4]/50 text-white font-sans text-xs font-semibold transition-all"
                  >
                    Google Pay <ExternalLink className="h-3 w-3" />
                  </a>

                  <a
                    href={paytmUri}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#002e6e]/30 border border-[#00b9f5]/50 hover:bg-[#002e6e]/50 text-white font-sans text-xs font-semibold transition-all"
                  >
                    Paytm <ExternalLink className="h-3 w-3" />
                  </a>

                  <a
                    href={rawUri}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-white font-sans text-xs font-semibold transition-all"
                  >
                    Any UPI App <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Copy UPI Details Helper */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141928] border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-[#7A8296] block">UPI ID</span>
                    <span className="font-mono font-bold text-white">{upiId}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(upiId, "upi")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono transition-colors"
                  >
                    {copiedUpi ? <Check className="h-3 w-3 text-[#00FF9D]" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedUpi ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141928] border border-white/5 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-[#7A8296] block">Transaction Note</span>
                    <span className="font-mono font-bold text-[#00FF9D]">{upiDetails.note}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(upiDetails.note, "note")}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono transition-colors"
                  >
                    {copiedNote ? <Check className="h-3 w-3 text-[#00FF9D]" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedNote ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── SUBMIT 12-DIGIT UTR SECTION ── */}
          <form onSubmit={handleUtrSubmit} className="mt-8 pt-2">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="h-4 w-4 text-[#00FF9D]" />
              <h3 className="font-display text-base font-bold text-white">
                Submit 12-Digit UPI Reference (UTR) Number
              </h3>
            </div>
            <p className="text-xs text-[#A3A9B8] mb-4">
              After successful transfer in your UPI app, find the 12-digit UPI Transaction ID / UTR from the receipt and enter it below to confirm your admission.
            </p>

            {utrError && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/30 text-xs text-[#F43F5E]">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{utrError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                maxLength={12}
                pattern="\d{12}"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 12-digit UTR (e.g. 432109876543)"
                className="flex-1 h-12 rounded-xl border border-white/20 bg-[#121622] px-4 font-mono text-sm text-white placeholder-[#7A8296] focus:border-[#00FF9D] focus:outline-none focus:ring-2 focus:ring-[#00FF9D]/20 tracking-wider"
              />

              <button
                type="submit"
                disabled={utrSubmitting || utrNumber.length !== 12}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#12A4C4] to-[#00FF9D] text-[#06080C] font-sans text-sm font-bold shadow-lg shadow-cyan-950/40 hover:opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
              >
                {utrSubmitting ? (
                  <span>Verifying UTR...</span>
                ) : (
                  <>
                    <span>Confirm Payment & Get Pass</span>
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 3: OFFICIAL DIGITAL DELEGATE PASS (Verified / Confirmed)
  // ═══════════════════════════════════════════════════════════════════
  if (stage === "PASS" && regData) {
    return (
      <div className="pt-28 pb-24 px-4 sm:px-6 md:px-8 max-w-3xl mx-auto w-full">
        {/* Success Banner */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#00FF9D] mb-4 shadow-xl shadow-[#10B981]/20">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <span className="font-mono text-xs text-[#00FF9D] uppercase tracking-wider font-bold">
            Registration Confirmed · Admitted to Arena
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white mt-2">
            You're In for Festronix 2026!
          </h1>
          <p className="mt-2 text-sm text-[#A3A9B8] max-w-lg">
            Your registration details have been verified and logged with the Student Affairs Cell. Keep your official pass handy at the venue entrance.
          </p>
        </div>

        {/* ── OFFICIAL DIGITAL DELEGATE PASS ── */}
        <div className="relative rounded-3xl border-2 border-[#12A4C4]/40 bg-gradient-to-b from-[#0B0E17] via-[#101422] to-[#0D1525] p-6 sm:p-10 shadow-2xl shadow-cyan-950/40 overflow-hidden">
          
          {/* Watermark Crest Background */}
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 opacity-5">
            <QrCode className="h-96 w-96 text-white" />
          </div>

          {/* Pass Top Branding */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-12">
                <Image
                  src="/assets/logos/vce_crest.png"
                  alt="Vardhaman College of Engineering"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="h-6 w-px bg-white/20" />
              <div className="relative h-9 w-9 rounded-full overflow-hidden">
                <Image
                  src="/assets/logos/sac_emblem.png"
                  alt="SAC Emblem"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-display text-base font-bold text-white block leading-tight">
                  FESTRONIX 2026
                </span>
                <span className="font-mono text-[11px] text-[#12A4C4] font-semibold">
                  Official Delegate Pass
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="rounded-lg bg-[#5145CD]/20 border border-[#5145CD]/40 px-3 py-1 font-mono text-xs font-bold text-[#818CF8]">
                {regData.regCode}
              </span>
            </div>
          </div>

          {/* Registered Arena Highlight */}
          <div className="my-6 rounded-2xl border border-white/10 bg-[#141928] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-[#12A4C4]">
                {selectedEvent.category}
              </span>
              <span className="rounded-md bg-[#10B981]/20 border border-[#10B981]/40 px-2.5 py-0.5 font-mono text-[11px] text-[#00FF9D] font-bold">
                {regData.festDay}
              </span>
            </div>

            <h2 className="font-display text-2xl font-black text-white">
              {regData.eventTitle}
            </h2>
            <span className="font-mono text-xs text-[#7A8296] block mt-0.5">
              {selectedEvent.trackTag}
            </span>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D253A] px-3 py-1 text-[#00FF9D] font-mono font-bold border border-[#00FF9D]/30">
                <MapPin className="h-3.5 w-3.5" />
                <span>Venue: {regData.venueRoom}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D253A] px-3 py-1 text-[#EEF0F5] font-mono border border-white/5">
                <Calendar className="h-3.5 w-3.5 text-[#12A4C4]" />
                <span>Dec 1 & 2, 2026</span>
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D253A] px-3 py-1 text-[#EEF0F5] font-mono border border-white/5">
                <CreditCard className="h-3.5 w-3.5 text-[#00FF9D]" />
                <span>Fee: {regData.paymentAmount > 0 ? `₹${regData.paymentAmount} (${regData.paymentStatus.replace('_', ' ')})` : "FREE"}</span>
              </span>
            </div>
          </div>

          {/* Delegate Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-white/10 text-xs">
            <div>
              <span className="font-mono text-[#7A8296] block uppercase tracking-wider text-[10px]">
                Delegate Name
              </span>
              <span className="font-sans text-sm font-bold text-white mt-0.5 block">
                {regData.fullName}
              </span>
            </div>

            <div>
              <span className="font-mono text-[#7A8296] block uppercase tracking-wider text-[10px]">
                Student Roll Number
              </span>
              <span className="font-mono text-sm font-semibold text-[#22D3EE] mt-0.5 block">
                {regData.rollNumber}
              </span>
            </div>

            <div>
              <span className="font-mono text-[#7A8296] block uppercase tracking-wider text-[10px]">
                College / Institution
              </span>
              <span className="font-sans text-xs font-medium text-[#EEF0F5] mt-0.5 block">
                {regData.college}
              </span>
            </div>

            <div>
              <span className="font-mono text-[#7A8296] block uppercase tracking-wider text-[10px]">
                Department & Year
              </span>
              <span className="font-sans text-xs font-medium text-[#EEF0F5] mt-0.5 block">
                {regData.department} · {regData.yearOfStudy}
              </span>
            </div>

            <div>
              <span className="font-mono text-[#7A8296] block uppercase tracking-wider text-[10px]">
                Registration ID
              </span>
              <span className="font-mono text-xs text-[#00FF9D] mt-0.5 block font-bold">
                {regData.regCode}
              </span>
            </div>

            {regData.isTeam && regData.teamName && (
              <div>
                <span className="font-mono text-[#7A8296] block uppercase tracking-wider text-[10px]">
                  Team Name
                </span>
                <span className="font-sans text-xs font-semibold text-[#00FF9D] mt-0.5 block">
                  {regData.teamName}
                </span>
              </div>
            )}
          </div>

          {/* Pass Footer & Dynamic QR Verification */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white p-1 shadow-md flex-shrink-0">
                {attendanceQrUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={attendanceQrUrl}
                    alt="Attendance QR Code"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <QrCode className="h-full w-full text-black" />
                )}
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-white block uppercase">
                  OFFICIAL ATTENDANCE QR PASS
                </span>
                <span className="font-sans text-[11px] text-[#7A8296]">
                  Scan upon room entry at {regData.venueRoom} on Dec 1 & 2
                </span>
                <span className="font-mono text-[10px] text-[#00FF9D] block mt-0.5">
                  ● Ready for Coordinator Camera Scan
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 font-sans text-xs font-bold text-[#06080C] hover:bg-[#EEF0F5] transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Print / Save Pass</span>
              </button>

              <button
                onClick={() => {
                  setStage("FORM");
                  setFormData({
                    ...formData,
                    isTeam: false,
                    teamName: "",
                    member2: "",
                    member3: "",
                    member4: "",
                  });
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-[#161C2A] border border-white/10 px-4 py-2.5 font-sans text-xs font-semibold text-[#EEF0F5] hover:bg-[#202738] transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Register Another</span>
              </button>
            </div>
          </div>

        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/#events"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-[#12A4C4] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Festronix Home & 52-Event Explorer</span>
          </Link>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // STAGE 1: MAIN REGISTRATION FORM
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto w-full">
      {/* Navigation Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/#events"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#12A4C4] hover:underline mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All 52 Arenas</span>
        </Link>
        
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#10141E] px-3.5 py-1 mb-3">
          <Sparkles className="h-3 w-3 text-[#12A4C4]" />
          <span className="font-mono text-xs font-semibold text-[#A3A9B8] uppercase tracking-wider">
            Official Portal · Festronix 2026
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Delegate & Arena Registration
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#A3A9B8] max-w-2xl leading-relaxed">
          Provide your student identity and contact details below. Your official entry pass and arena verification will be generated immediately upon submission.
        </p>
      </div>

      {formError && (
        <div className="mb-6 flex items-center gap-2 p-4 rounded-2xl bg-[#F43F5E]/10 border border-[#F43F5E]/40 text-sm text-[#F43F5E]">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* ── Active Arena Focus Card ── */}
      <div className="mb-10 rounded-2xl border-2 border-[#12A4C4]/30 bg-[#0B0E17]/95 backdrop-blur-xl p-5 sm:p-7 shadow-xl shadow-cyan-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="font-mono text-xs font-bold text-[#12A4C4] uppercase tracking-wider block">
              Currently Selected Arena
            </span>
            <h2 className="font-display text-2xl font-black text-white mt-1">
              {selectedEvent.title}
            </h2>
            <span className="font-mono text-xs text-[#7A8296] block mt-0.5">
              {selectedEvent.trackTag}
            </span>
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#121826] border border-[#00FF9D]/30 px-3 py-1 text-xs text-[#00FF9D] font-mono font-bold">
              <MapPin className="h-3.5 w-3.5" />
              <span>{selectedEvent.venue}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-[#5145CD]/20 border border-[#5145CD]/40 px-3 py-1 font-mono text-xs text-[#818CF8] font-bold">
                {selectedEvent.day}
              </span>
              <span className="rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 px-3 py-1 font-mono text-xs text-[#00FF9D] font-bold">
                Fee: {selectedEvent.entryFee}
              </span>
            </div>
          </div>
        </div>

        {/* Change Arena Dropdown Quick Switcher */}
        <div className="mt-4 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label htmlFor="arena-select" className="font-mono text-xs text-[#A3A9B8]">
            Switch arena:
          </label>
          <select
            id="arena-select"
            value={selectedEventSlug}
            onChange={(e) => setSelectedEventSlug(e.target.value)}
            className="flex-1 max-w-md rounded-xl border border-white/15 bg-[#121622] px-3.5 py-2 font-sans text-xs sm:text-sm text-white focus:border-[#12A4C4] focus:outline-none focus:ring-1 focus:ring-[#12A4C4]"
          >
            {FEST_EVENTS.map((evt) => (
              <option key={evt.slug} value={evt.slug} className="bg-[#0B0E17] text-white">
                {evt.title} ({evt.venue}) — {evt.day} — {evt.entryFee}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── MAIN REGISTRATION FORM ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Section 1: Basic Identity Details */}
        <div className="rounded-2xl border border-white/10 bg-[#0B0E17]/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-black/40">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/10">
            <User className="h-5 w-5 text-[#12A4C4]" />
            <h3 className="font-display text-lg font-bold text-white">
              1. Delegate Contact & Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                Full Name <span className="text-[#F43F5E]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] px-4 font-sans text-sm text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none focus:ring-2 focus:ring-[#12A4C4]/20 transition-all"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                Email Address <span className="text-[#F43F5E]">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. rahul@student.vardhaman.org"
                className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] px-4 font-sans text-sm text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none focus:ring-2 focus:ring-[#12A4C4]/20 transition-all"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                Phone / WhatsApp Number <span className="text-[#F43F5E]">*</span>
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="10-digit mobile number"
                className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] px-4 font-sans text-sm text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none focus:ring-2 focus:ring-[#12A4C4]/20 transition-all"
              />
            </div>

            {/* Roll Number */}
            <div>
              <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                Student Roll / ID Number <span className="text-[#F43F5E]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                placeholder="e.g. 22881A05XX"
                className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] px-4 font-sans text-sm text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none focus:ring-2 focus:ring-[#12A4C4]/20 transition-all uppercase"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Academic Institution Details */}
        <div className="rounded-2xl border border-white/10 bg-[#0B0E17]/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-black/40">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-white/10">
            <Building className="h-5 w-5 text-[#12A4C4]" />
            <h3 className="font-display text-lg font-bold text-white">
              2. Academic Institution & Cohort
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-3">
              <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                College / Institution Name <span className="text-[#F43F5E]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="e.g. Vardhaman College of Engineering"
                className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] px-4 font-sans text-sm text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none focus:ring-2 focus:ring-[#12A4C4]/20 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                Department / Branch <span className="text-[#F43F5E]">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] px-4 font-sans text-sm text-white focus:border-[#12A4C4] focus:outline-none focus:ring-2 focus:ring-[#12A4C4]/20"
              >
                <option value="Computer Science & Engineering (CSE)">Computer Science & Engineering (CSE)</option>
                <option value="Information Technology (IT)">Information Technology (IT)</option>
                <option value="CSE (AI & ML)">CSE (Artificial Intelligence & Machine Learning)</option>
                <option value="CSE (Data Science)">CSE (Data Science)</option>
                <option value="Electronics & Communication Engineering (ECE)">Electronics & Communication (ECE)</option>
                <option value="Electrical & Electronics Engineering (EEE)">Electrical & Electronics (EEE)</option>
                <option value="Mechanical Engineering (MECH)">Mechanical Engineering (MECH)</option>
                <option value="Civil Engineering (CIVIL)">Civil Engineering (CIVIL)</option>
                <option value="Master of Business Administration (MBA)">Master of Business Administration (MBA)</option>
                <option value="Other Engineering / Polytechnic">Other Engineering / Polytechnic Institution</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                Year of Study <span className="text-[#F43F5E]">*</span>
              </label>
              <select
                value={formData.yearOfStudy}
                onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] px-4 font-sans text-sm text-white focus:border-[#12A4C4] focus:outline-none focus:ring-2 focus:ring-[#12A4C4]/20"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate / Alumni">Postgraduate / Alumni</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Team Participation (Optional) */}
        <div className="rounded-2xl border border-white/10 bg-[#0B0E17]/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#12A4C4]" />
              <h3 className="font-display text-lg font-bold text-white">
                3. Team Participation (If Applicable)
              </h3>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isTeam}
                onChange={(e) => setFormData({ ...formData, isTeam: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#161C2A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#12A4C4]"></div>
              <span className="ml-3 font-mono text-xs text-[#A3A9B8]">
                {formData.isTeam ? "Team Mode Enabled" : "Individual Entry"}
              </span>
            </label>
          </div>

          {formData.isTeam ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                  Official Team Name <span className="text-[#F43F5E]">*</span>
                </label>
                <input
                  type="text"
                  required={formData.isTeam}
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  placeholder="e.g. CyberVanguard"
                  className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] px-4 font-sans text-sm text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none focus:ring-2 focus:ring-[#12A4C4]/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                    Member 2 Name & Roll No
                  </label>
                  <input
                    type="text"
                    value={formData.member2}
                    onChange={(e) => setFormData({ ...formData, member2: e.target.value })}
                    placeholder="Name - Roll Number"
                    className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] px-4 font-sans text-sm text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none focus:ring-1 focus:ring-[#12A4C4]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                    Member 3 Name & Roll No
                  </label>
                  <input
                    type="text"
                    value={formData.member3}
                    onChange={(e) => setFormData({ ...formData, member3: e.target.value })}
                    placeholder="Name - Roll Number"
                    className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] px-4 font-sans text-sm text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none focus:ring-1 focus:ring-[#12A4C4]"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs font-semibold text-[#A3A9B8] block mb-2">
                    Member 4 Name & Roll No
                  </label>
                  <input
                    type="text"
                    value={formData.member4}
                    onChange={(e) => setFormData({ ...formData, member4: e.target.value })}
                    placeholder="Name - Roll Number"
                    className="w-full h-12 rounded-xl border border-white/15 bg-[#121622] px-4 font-sans text-sm text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:outline-none focus:ring-1 focus:ring-[#12A4C4]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#7A8296] font-mono">
              Toggle the switch above if you are competing as a team for hackathons, esport rosters, or group ideation arenas.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-[#A3A9B8]">
            <ShieldCheck className="h-4 w-4 text-[#00FF9D]" />
            <span>Strict single-registration enforcement per student per event.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-w-[240px] h-14 rounded-2xl bg-gradient-to-r from-[#12A4C4] to-[#00FF9D] text-[#06080C] font-sans text-base font-bold shadow-xl shadow-cyan-950/40 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Processing Delegate Record...</span>
            ) : (
              <>
                <span>Proceed to Confirmation & Delegate Pass</span>
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#06080C] text-white flex items-center justify-center">
          <p className="font-mono text-sm text-[#12A4C4]">Loading registration portal...</p>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
