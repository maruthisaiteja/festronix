import Link from "next/link";
import { FEST_EVENTS } from "@/data/events";
import { ArrowRight, ArrowLeft, ArrowUpRight, MapPin, Trophy, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All 52 Arenas & Events — Festronix 2026",
  description: "Browse all 52 official competitions across Day 1, Day 2, and Both Days at Festronix 2026, Vardhaman College of Engineering.",
};

export default function EventsDirectoryPage() {
  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#12A4C4] hover:underline mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to main page</span>
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          All 52 Competition Arenas
        </h1>
        <p className="mt-2 text-[#A3A9B8] max-w-2xl text-sm sm:text-base leading-relaxed">
          Official catalog of events scheduled for Festronix 2026 on December 1 & 2 at Vardhaman College of Engineering. Register individually for each arena or read complete rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEST_EVENTS.map((evt) => {
          const dayBadgeStyle =
            evt.day === "Both Days"
              ? "border-[#12A4C4]/30 bg-[#12A4C4]/10 text-[#22D3EE]"
              : evt.day === "Day 1"
              ? "border-[#6366F1]/30 bg-[#5145CD]/10 text-[#818CF8]"
              : "border-[#F43F5E]/30 bg-[#F43F5E]/10 text-[#FB7185]";

          return (
            <div
              key={evt.id}
              className="group flex flex-col justify-between rounded-card border border-white/10 bg-[#0B0E17]/90 backdrop-blur-md p-6 hover:border-white/20 transition-all duration-150 shadow-lg shadow-black/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded bg-[#161C2A] px-2.5 py-0.5 font-mono text-[11px] text-[#A3A9B8] border border-white/5">
                    {evt.category}
                  </span>
                  <span className={`rounded px-2.5 py-0.5 font-mono text-[11px] font-semibold border ${dayBadgeStyle}`}>
                    {evt.day}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-md bg-[#121826] px-2.5 py-1 text-xs text-[#00FF9D] font-mono border border-[#00FF9D]/20 mb-2.5">
                  <MapPin className="h-3 w-3 text-[#00FF9D]" />
                  <span>{evt.venue}</span>
                </div>

                <h2 className="font-display text-xl font-bold text-white group-hover:text-[#22D3EE] transition-colors line-clamp-1">
                  {evt.title}
                </h2>
                <span className="font-mono text-xs text-[#7A8296] block mt-0.5">
                  {evt.trackTag}
                </span>

                <p className="mt-3 text-xs sm:text-sm text-[#A3A9B8] line-clamp-3 leading-relaxed">
                  {evt.shortDescription}
                </p>
              </div>

              <div className="border-t border-white/[0.06] pt-4 mt-5">
                <div className="flex justify-between items-center mb-3.5 text-xs">
                  <div className="flex items-center gap-1.5 text-[#12A4C4] font-medium">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>{evt.rewards}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#7A8296] font-mono">
                    <Users className="h-3.5 w-3.5" />
                    <span>{evt.teamSize}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/events/${evt.slug}`}
                    className="flex items-center justify-center gap-1 rounded-md bg-[#161C2A] border border-white/10 py-2 font-sans text-xs font-medium text-[#EEF0F5] hover:bg-[#202738] transition-colors"
                  >
                    <span>Full Rules</span>
                    <ArrowRight className="h-3 w-3 text-[#7A8296]" />
                  </Link>

                  <Link
                    href={`/register?event=${evt.slug}`}
                    className="flex items-center justify-center gap-1 rounded-xl bg-white py-2 font-sans text-xs font-bold text-[#06080C] hover:bg-[#EEF0F5] transition-colors"
                  >
                    <span>Register</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
