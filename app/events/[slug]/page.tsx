import { notFound } from "next/navigation";
import Link from "next/link";
import { FEST_EVENTS } from "@/data/events";
import {
  Trophy,
  Users,
  MapPin,
  Clock,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Phone,
  CreditCard,
} from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return FEST_EVENTS.map((event) => ({
    slug: event.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = FEST_EVENTS.find((e) => e.slug === params.slug);
  if (!event) return { title: "Event Not Found — Festronix 2026" };

  return {
    title: `${event.title} — Festronix 2026`,
    description: event.shortDescription,
  };
}

export default function SingleEventPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = FEST_EVENTS.find((e) => e.slug === params.slug);
  if (!event) notFound();

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto w-full">
      <Link
        href="/#events"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-[#12A4C4] hover:underline mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to all 52 arenas</span>
      </Link>

      <div className="rounded-panel border border-white/10 bg-[#0B0E17]/90 backdrop-blur-md p-6 sm:p-10 shadow-2xl shadow-black/60">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-xs text-[#12A4C4] font-semibold">
            {event.trackTag}
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="font-mono text-xs text-[#00FF9D]">
            {event.day}
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="font-mono text-xs text-[#7A8296]">
            {event.category}
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          {event.title}
        </h1>

        {/* Venue Room Code Pill */}
        <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#121826] border border-[#00FF9D]/30 px-3 py-1.5 text-xs text-[#00FF9D] font-mono">
          <MapPin className="h-3.5 w-3.5 text-[#00FF9D]" />
          <span className="font-bold">Official Venue: {event.venue}</span>
        </div>

        {/* Metadata Row */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#161C2A] border border-white/5 px-3 py-1 text-[#12A4C4] font-medium">
            <Trophy className="h-3.5 w-3.5" />
            <span>Honors: {event.rewards}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#161C2A] border border-white/5 px-3 py-1 text-[#A3A9B8]">
            <Users className="h-3.5 w-3.5 text-[#7A8296]" />
            <span>Team Size: {event.teamSize}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-md bg-[#161C2A] border border-white/5 px-3 py-1 text-[#A3A9B8]">
            <CreditCard className="h-3.5 w-3.5 text-[#7A8296]" />
            <span>Registration Fee: {event.entryFee}</span>
          </span>

          {event.timingNote && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#161C2A] border border-white/5 px-3 py-1 text-[#F43F5E]">
              <Clock className="h-3.5 w-3.5" />
              <span>{event.timingNote}</span>
            </span>
          )}
        </div>

        <div className="mt-8 border-t border-white/[0.08] pt-6">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#7A8296] mb-2">
            Overview & Arena Objective
          </h2>
          <p className="text-sm text-[#A3A9B8] leading-relaxed">
            {event.fullDescription}
          </p>
        </div>

        {event.rounds && event.rounds.length > 0 && (
          <div className="mt-6 border-t border-white/[0.08] pt-6">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#7A8296] mb-3">
              Round Structure & Evaluation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {event.rounds.map((rnd) => (
                <div key={rnd.roundNumber} className="rounded-md border border-white/[0.06] bg-[#121622] p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-1">
                    <span className="text-[#22D3EE]">Round 0{rnd.roundNumber}: {rnd.title}</span>
                    <span className="font-mono text-[#7A8296] text-[11px]">{rnd.duration}</span>
                  </div>
                  <p className="text-xs text-[#A3A9B8] leading-relaxed">{rnd.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {event.rules && event.rules.length > 0 && (
          <div className="mt-6 border-t border-white/[0.08] pt-6">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-[#7A8296] mb-2.5">
              Arena Guidelines & Rules
            </h2>
            <ul className="flex flex-col gap-2 text-xs text-[#A3A9B8]">
              {event.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#12A4C4] flex-shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Coordinators & Registration Action */}
        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="block font-sans text-xs font-semibold text-[#7A8296] uppercase tracking-wider">
              Student Coordinators
            </span>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              {event.coordinators.map((c, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-white">
                  <Phone className="h-3 w-3 text-[#12A4C4]" />
                  <span>{c.name}: <span className="font-mono text-[#A3A9B8]">{c.phone}</span></span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href={`/register?event=${event.slug}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 font-sans text-xs font-bold text-[#06080C] hover:bg-[#EEF0F5] shadow-lg shadow-white/10 transition-all flex-shrink-0"
          >
            <span>Register for this arena</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
