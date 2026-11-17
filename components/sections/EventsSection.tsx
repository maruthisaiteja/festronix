"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FEST_EVENTS, FestEvent, EventDay } from "@/data/events";
import { EventModal } from "@/components/sections/EventModal";
import {
  Trophy,
  Users,
  MapPin,
  ArrowUpRight,
  Search,
  X,
  Sparkles,
  ChevronRight,
  Terminal,
  Cpu,
  Bot,
  Wrench,
  Gamepad2,
  HelpCircle,
  Compass,
  Palette,
  Layers,
} from "lucide-react";

export function EventsSection() {
  const [selectedDay, setSelectedDay] = useState<"All" | EventDay>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalEvent, setActiveModalEvent] = useState<FestEvent | null>(null);

  const categories = [
    { label: "All Domains", value: "All", icon: Layers },
    { label: "Coding & Software", value: "Coding & Software", icon: Terminal },
    { label: "Hardware & Electronics", value: "Hardware & Electronics", icon: Cpu },
    { label: "Robotics & Avionics", value: "Robotics & Avionics", icon: Bot },
    { label: "Workshops & Ideation", value: "Workshops & Ideation", icon: Wrench },
    { label: "Gaming & Esports", value: "Gaming & Esports", icon: Gamepad2 },
    { label: "Quizzes & Logic", value: "Quizzes & Logic", icon: HelpCircle },
    { label: "Mystery & Hunts", value: "Mystery, Forensics & Hunts", icon: Compass },
    { label: "Media & Design", value: "Media, Design & Fun", icon: Palette },
  ];

  const quickJumps = [
    { label: "Smartathon", room: "3020" },
    { label: "Smart Karts", room: "1325" },
    { label: "Valorant LAN", room: "1001" },
    { label: "Drone Workshop", room: "GB 1st Fl" },
    { label: "Escape Room 2.0", room: "3101" },
    { label: "Circuit Debugging", room: "3213" },
    { label: "Squid Game 4.0", room: "GB 2nd Fl" },
    { label: "IPL Auction", room: "1009" },
  ];

  const days: { label: string; value: "All" | EventDay; count: number }[] = [
    { label: "All 52 Arenas", value: "All", count: FEST_EVENTS.length },
    {
      label: "Both Days (Nov 1 & 2)",
      value: "Both Days",
      count: FEST_EVENTS.filter((e) => e.day === "Both Days").length,
    },
    {
      label: "Day 01 (Nov 1)",
      value: "Day 1",
      count: FEST_EVENTS.filter((e) => e.day === "Day 1").length,
    },
    {
      label: "Day 02 (Nov 2)",
      value: "Day 2",
      count: FEST_EVENTS.filter((e) => e.day === "Day 2").length,
    },
  ];

  // Filtering Logic
  const filteredEvents = useMemo(() => {
    return FEST_EVENTS.filter((evt) => {
      // Day filter
      if (selectedDay !== "All" && evt.day !== selectedDay) return false;

      // Category filter
      if (selectedCategory !== "All" && evt.category !== selectedCategory) return false;

      // Search query (title, room code / venue, description, category, trackTag)
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = evt.title.toLowerCase().includes(query);
        const matchesVenue = evt.venue.toLowerCase().includes(query);
        const matchesDesc = evt.shortDescription.toLowerCase().includes(query);
        const matchesCat = evt.category.toLowerCase().includes(query);
        const matchesTag = evt.trackTag.toLowerCase().includes(query);
        if (!matchesTitle && !matchesVenue && !matchesDesc && !matchesCat && !matchesTag) {
          return false;
        }
      }

      return true;
    });
  }, [selectedDay, selectedCategory, searchQuery]);

  return (
    <section id="events" className="relative z-10 py-24 md:py-32 border-t border-white/[0.08] bg-[#06080C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#12A4C4]/30 bg-[#12A4C4]/10 px-3.5 py-1 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#12A4C4]" />
              <span className="font-mono text-xs font-bold text-[#12A4C4] uppercase tracking-wider">
                Official 52-Event Catalog
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Explore All 52 Arenas
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A3A9B8] leading-relaxed">
              Every event features its own venue room code, technical rules, team size, and direct registration portal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-[#10141E] px-4 py-2 font-mono text-xs text-[#EEF0F5] shadow-lg">
              Showing <span className="text-[#00FF9D] font-bold text-sm">{filteredEvents.length}</span> of {FEST_EVENTS.length} Arenas
            </div>
          </div>
        </div>

        {/* ── HIGH-VISIBILITY SEARCH & FILTER CONSOLE ── */}
        <div className="rounded-2xl border border-white/10 bg-[#0B0E17]/95 backdrop-blur-2xl p-4 sm:p-6 mb-10 shadow-2xl shadow-black/80">
          
          {/* Main Full-Width Search Input */}
          <div className="relative w-full mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#12A4C4]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 52 events by name, room code (e.g. 3020, GB 2nd Floor, 5106), or domain..."
              className="w-full h-14 rounded-xl border border-white/15 bg-[#121622] pl-12 pr-28 font-sans text-sm sm:text-base text-white placeholder-[#7A8296] focus:border-[#12A4C4] focus:ring-2 focus:ring-[#12A4C4]/20 focus:outline-none transition-all shadow-inner"
            />
            
            {/* Right Status Badge & Clear Trigger */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1E2536] text-[#A3A9B8] hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <span className="hidden sm:inline-flex rounded-lg bg-[#1A2030] px-2.5 py-1 font-mono text-[11px] text-[#A3A9B8]">
                {filteredEvents.length} found
              </span>
            </div>
          </div>

          {/* Quick-Jump Chips (Instant Discovery) */}
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="font-mono text-[#7A8296] font-medium mr-1">Quick jump:</span>
            {quickJumps.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setSearchQuery(q.label)}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#141926] px-2.5 py-1 text-[#EEF0F5] hover:border-[#12A4C4]/50 hover:bg-[#1A2234] hover:text-[#22D3EE] transition-all"
              >
                <span>{q.label}</span>
                <span className="font-mono text-[10px] text-[#7A8296]">({q.room})</span>
              </button>
            ))}
          </div>

          {/* Day Filter Pills (High-Contrast Segmented Bar) */}
          <div className="border-t border-white/[0.08] pt-5 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#A3A9B8]">
                Filter by Fest Day
              </span>
              <span className="font-mono text-[11px] text-[#7A8296]">
                Dates: December 1 & 2, 2026
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              {days.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDay(d.value)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 font-sans text-xs sm:text-sm font-semibold transition-all duration-150 ${
                    selectedDay === d.value
                      ? "bg-[#5145CD] text-white shadow-lg shadow-[#5145CD]/40 ring-1 ring-white/30"
                      : "bg-[#121622] border border-white/10 text-[#A3A9B8] hover:text-white hover:border-white/20 hover:bg-[#181D2E]"
                  }`}
                >
                  <span>{d.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-xs ${
                      selectedDay === d.value
                        ? "bg-white/25 text-white"
                        : "bg-[#1C2233] text-[#7A8296]"
                    }`}
                  >
                    {d.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Domain Category Filter Badges */}
          <div className="border-t border-white/[0.08] pt-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#A3A9B8]">
                Filter by Domain & Category
              </span>
              {(selectedCategory !== "All" || selectedDay !== "All" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedDay("All");
                    setSearchQuery("");
                  }}
                  className="font-mono text-xs text-[#F43F5E] hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-2 font-sans text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#12A4C4] text-white font-bold shadow-md shadow-[#12A4C4]/40"
                        : "bg-[#121622] border border-white/10 text-[#A3A9B8] hover:text-white hover:border-white/25 hover:bg-[#181D2E]"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-[#7A8296]"}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── 52 Events Responsive Grid ── */}
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-white/10 bg-[#10141E] text-center p-8">
            <p className="font-display text-xl font-bold text-white">No arenas found matching your search</p>
            <p className="text-sm text-[#A3A9B8] mt-2 max-w-md">
              We couldn't find any events matching "<span className="text-white font-semibold">{searchQuery}</span>". Try clearing the search or switching day/domain filters.
            </p>
            <button
              onClick={() => {
                setSelectedDay("All");
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-5 rounded-xl bg-[#12A4C4] px-5 py-2.5 font-sans text-xs font-bold text-white hover:bg-[#0F8EA8] transition-colors shadow-lg shadow-[#12A4C4]/30"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((evt) => {
              // Day Tag Color Variations
              const dayBadgeStyle =
                evt.day === "Both Days"
                  ? "border-[#12A4C4]/40 bg-[#12A4C4]/15 text-[#22D3EE]"
                  : evt.day === "Day 1"
                  ? "border-[#6366F1]/40 bg-[#5145CD]/15 text-[#818CF8]"
                  : "border-[#F43F5E]/40 bg-[#F43F5E]/15 text-[#FB7185]";

              return (
                <div
                  key={evt.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0B0E17]/95 backdrop-blur-xl p-6 hover:border-white/25 hover:bg-[#111524] transition-all duration-200 shadow-xl shadow-black/50"
                >
                  <div>
                    {/* Top Badges Row */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="rounded-lg bg-[#161C2A] px-2.5 py-1 font-mono text-[11px] text-[#A3A9B8] border border-white/5">
                        {evt.category}
                      </span>
                      <span
                        className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold border ${dayBadgeStyle}`}
                      >
                        {evt.day}
                      </span>
                    </div>

                    {/* Venue Room Code Tag */}
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#121826] px-3 py-1.5 text-xs text-[#00FF9D] font-mono border border-[#00FF9D]/30 mb-3 shadow-inner">
                      <MapPin className="h-3.5 w-3.5 text-[#00FF9D]" />
                      <span className="font-bold">{evt.venue}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-[#22D3EE] transition-colors line-clamp-1">
                      {evt.title}
                    </h3>
                    <span className="font-mono text-xs text-[#7A8296] block mt-0.5">
                      {evt.trackTag}
                    </span>

                    {/* Short Description */}
                    <p className="mt-3 text-xs sm:text-sm text-[#A3A9B8] leading-relaxed line-clamp-3 font-sans">
                      {evt.shortDescription}
                    </p>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="border-t border-white/[0.08] pt-4 mt-5">
                    {/* Meta Info: Rewards & Team Size */}
                    <div className="flex items-center justify-between mb-4 text-xs">
                      <div className="flex items-center gap-1.5 text-[#12A4C4] font-medium">
                        <Trophy className="h-3.5 w-3.5" />
                        <span>{evt.rewards}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[#7A8296] font-mono">
                        <Users className="h-3.5 w-3.5" />
                        <span>{evt.teamSize}</span>
                      </div>
                    </div>

                    {/* 2 ACTION BUTTONS */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Button 1: View Rules & Rounds */}
                      <button
                        onClick={() => setActiveModalEvent(evt)}
                        className="flex items-center justify-center gap-1 rounded-xl bg-[#161C2A] border border-white/10 px-3 py-2.5 font-sans text-xs font-semibold text-[#EEF0F5] hover:bg-[#202738] hover:text-white transition-colors"
                      >
                        <span>View Rules</span>
                        <ChevronRight className="h-3.5 w-3.5 text-[#7A8296]" />
                      </button>

                      {/* Button 2: Direct Registration Page with Pre-Selected Event */}
                      <Link
                        href={`/register?event=${evt.slug}`}
                        className="flex items-center justify-center gap-1 rounded-xl bg-white px-3 py-2.5 font-sans text-xs font-bold text-[#06080C] hover:bg-[#EEF0F5] hover:shadow-lg hover:shadow-white/20 active:scale-[0.98] transition-all"
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
        )}

      </div>

      {/* Detail Modal */}
      <EventModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
      />
    </section>
  );
}
