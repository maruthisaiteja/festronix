"use client";

import { useState } from "react";
import { FEST_SCHEDULE, ScheduleItem } from "@/data/schedule";
import { Clock, MapPin, Info, Calendar } from "lucide-react";

export function TimelineSection() {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const currentDayData =
    FEST_SCHEDULE.find((d) => d.dayNumber === activeDay) || FEST_SCHEDULE[0];

  return (
    <section id="schedule" className="relative z-10 py-24 md:py-32 border-t border-white/[0.08] bg-[#06080C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        
        {/* Section Header & Tab Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5145CD]/30 bg-[#5145CD]/10 px-3 py-1 mb-3">
              <Calendar className="h-3 w-3 text-[#6366F1]" />
              <span className="font-mono text-xs font-semibold text-[#818CF8] uppercase tracking-wider">
                Two-Day Timeline · December 1 & 2, 2026
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Fest Schedule & Milestones
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A3A9B8]">
              Coordinated timetable across campus room venues, computing labs, and the main auditorium.
            </p>
          </div>

          {/* Day 1 / Day 2 Segmented Control (Zenith Styled) */}
          <div className="flex rounded-md border border-white/10 bg-[#10141E] p-1.5 shadow-lg">
            <button
              onClick={() => setActiveDay(1)}
              className={`rounded px-4 py-2 font-sans text-xs transition-all duration-150 ${
                activeDay === 1
                  ? "bg-[#5145CD] text-white font-semibold shadow-md shadow-[#5145CD]/40"
                  : "text-[#A3A9B8] hover:text-white"
              }`}
            >
              Day 01 · December 1
            </button>

            <button
              onClick={() => setActiveDay(2)}
              className={`rounded px-4 py-2 font-sans text-xs transition-all duration-150 ${
                activeDay === 2
                  ? "bg-[#5145CD] text-white font-semibold shadow-md shadow-[#5145CD]/40"
                  : "text-[#A3A9B8] hover:text-white"
              }`}
            >
              Day 02 · December 2
            </button>
          </div>
        </div>

        {/* Schedule Finalization Banner */}
        <div className="mb-10 rounded-card border border-[#12A4C4]/20 bg-[#10141E]/80 backdrop-blur-md p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-[#A3A9B8]">
          <Info className="h-5 w-5 text-[#12A4C4] flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white font-semibold">Venue Room Allotment Confirmed: </strong>
            Room numbers are already mapped across campus (e.g. Smartathon in Room 3020, CAD Mania in Room 2002, Drone Workshop in GB 1st Floor).
            Individual event hours last between 1 to 2 days, and exact slot timings will be finalized closer to December 1.
          </div>
        </div>

        {/* Timeline Slots List */}
        <div className="flex flex-col gap-3">
          {currentDayData.slots.map((slot: ScheduleItem) => (
            <div
              key={slot.id}
              className={`flex flex-col md:flex-row md:items-center gap-4 md:gap-6 rounded-card border p-5 transition-all duration-150 ${
                slot.isHighlight
                  ? "border-[#12A4C4]/30 bg-[#0F1424] shadow-md shadow-cyan-950/20"
                  : "border-white/[0.08] bg-[#0B0E17]/90 hover:border-white/20 hover:bg-[#101420]"
              }`}
            >
              {/* Time Column */}
              <div className="md:w-52 flex-shrink-0 flex items-center gap-2 font-mono text-xs text-[#00FF9D] font-semibold">
                <Clock className="h-3.5 w-3.5 text-[#00FF9D]/70 md:hidden" />
                <span>{slot.time}</span>
              </div>

              {/* Slot Details */}
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-sans text-sm sm:text-base font-semibold text-white">
                    {slot.title}
                  </span>
                  {slot.isHighlight && (
                    <span className="rounded bg-[#5145CD]/20 border border-[#5145CD]/30 px-2 py-0.5 font-mono text-[10px] text-[#818CF8] font-semibold">
                      Flagship
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#A3A9B8] leading-relaxed max-w-3xl">
                  {slot.description}
                </p>

                <div className="mt-2.5 flex items-center gap-1.5 font-mono text-xs text-[#7A8296]">
                  <MapPin className="h-3.5 w-3.5 text-[#12A4C4]" />
                  <span className="text-[#A3A9B8]">{slot.venue}</span>
                </div>
              </div>

              {/* Category Tag */}
              <div className="self-start md:self-center flex-shrink-0">
                <span className="rounded bg-[#161C2A] border border-white/10 px-3 py-1 font-mono text-[11px] text-[#A3A9B8]">
                  {slot.category}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
