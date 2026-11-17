"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FestEvent } from "@/data/events";
import {
  X,
  Trophy,
  Users,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Phone,
  CreditCard,
} from "lucide-react";

interface EventModalProps {
  event: FestEvent | null;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (event) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#06080C]/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Window */}
      <div className="relative z-10 w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0B0E17] p-6 sm:p-8 shadow-2xl shadow-black/90">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#161C2A] text-[#A3A9B8] hover:text-white hover:border-white/20 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Track Tag & Day Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-2 pr-8">
          <span className="font-mono text-xs text-[#12A4C4] font-bold">
            {event.trackTag}
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="font-mono text-xs text-[#00FF9D] font-semibold">
            {event.day}
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="font-mono text-xs text-[#7A8296]">
            {event.category}
          </span>
        </div>

        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
          {event.title}
        </h3>

        {/* Venue Room Code High-Visibility Pill */}
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#121826] border border-[#00FF9D]/30 px-3 py-1.5 text-xs text-[#00FF9D] font-mono">
          <MapPin className="h-3.5 w-3.5 text-[#00FF9D]" />
          <span className="font-bold">Official Venue: {event.venue}</span>
        </div>

        {/* Metadata Chips Row */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#161C2A] border border-white/5 px-3 py-1 text-[#12A4C4] font-medium">
            <Trophy className="h-3.5 w-3.5" />
            <span>{event.rewards}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#161C2A] border border-white/5 px-3 py-1 text-[#A3A9B8]">
            <Users className="h-3.5 w-3.5 text-[#7A8296]" />
            <span>Team: {event.teamSize}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#161C2A] border border-white/5 px-3 py-1 text-[#A3A9B8]">
            <CreditCard className="h-3.5 w-3.5 text-[#7A8296]" />
            <span>Fee: {event.entryFee}</span>
          </span>

          {event.timingNote && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#161C2A] border border-white/5 px-3 py-1 text-[#F43F5E]">
              <Clock className="h-3.5 w-3.5" />
              <span>{event.timingNote}</span>
            </span>
          )}
        </div>

        {/* Overview & Objective */}
        <div className="mt-6 border-t border-white/[0.08] pt-5">
          <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#7A8296] mb-2">
            Overview & Arena Objective
          </h4>
          <p className="text-sm text-[#A3A9B8] leading-relaxed font-sans">
            {event.fullDescription}
          </p>
        </div>

        {/* Rounds Breakdown */}
        {event.rounds && event.rounds.length > 0 && (
          <div className="mt-6 border-t border-white/[0.08] pt-5">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#7A8296] mb-3">
              Round Structure & Evaluation
            </h4>
            <div className="flex flex-col gap-2.5">
              {event.rounds.map((rnd) => (
                <div
                  key={rnd.roundNumber}
                  className="rounded-xl border border-white/[0.06] bg-[#121622] p-3.5"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                    <span className="text-[#22D3EE]">
                      Round 0{rnd.roundNumber}: {rnd.title}
                    </span>
                    <span className="font-mono text-[#7A8296] text-[11px]">
                      {rnd.duration}
                    </span>
                  </div>
                  <p className="text-xs text-[#A3A9B8] leading-relaxed">
                    {rnd.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rules & Constraints */}
        {event.rules && event.rules.length > 0 && (
          <div className="mt-6 border-t border-white/[0.08] pt-5">
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#7A8296] mb-3">
              Arena Rules & Constraints
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-[#A3A9B8]">
              {event.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#12A4C4] flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Student Coordinators & CTA */}
        <div className="mt-7 border-t border-white/10 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="block font-sans text-xs font-semibold text-[#7A8296] uppercase tracking-wider">
              Student Coordinators
            </span>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              {event.coordinators.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-white">
                  <Phone className="h-3 w-3 text-[#12A4C4]" />
                  <span>
                    {c.name}: <span className="font-mono text-[#A3A9B8]">{c.phone}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Registration Link */}
          <Link
            href={`/register?event=${event.slug}`}
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 font-sans text-xs font-bold text-[#06080C] hover:bg-[#EEF0F5] shadow-lg shadow-white/10 transition-all flex-shrink-0"
          >
            <span>Register for this arena</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
