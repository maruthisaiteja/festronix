"use client";

import { FEST_CONFIG } from "@/data/config";
import { Trophy, Cpu, Users, GraduationCap, Award, CheckCircle2 } from "lucide-react";

export function AboutSection() {
  const stats = [
    {
      icon: Trophy,
      value: "52 Arenas",
      label: "Official Competitions",
      detail: "From Smartathon and circuit debugging to smart karts and drone workshops.",
      accent: "text-[#22D3EE]",
      badgeBorder: "border-[#12A4C4]/30",
    },
    {
      icon: Users,
      value: FEST_CONFIG.metrics.expectedParticipants,
      label: "Active Competitors",
      detail: "Engineers, makers, and innovators representing premier technology campuses.",
      accent: "text-[#00FF9D]",
      badgeBorder: "border-[#10B981]/30",
    },
    {
      icon: GraduationCap,
      value: FEST_CONFIG.metrics.partnerColleges,
      label: "Colleges Represented",
      detail: "Pan-India collegiate representation across electronics, computing, and mechanical.",
      accent: "text-[#818CF8]",
      badgeBorder: "border-[#5145CD]/30",
    },
    {
      icon: Award,
      value: FEST_CONFIG.metrics.duration,
      label: "Immersive Days",
      detail: "December 1 & 2, 2026 · Two full days of live evaluation and competitions.",
      accent: "text-[#FB7185]",
      badgeBorder: "border-[#F43F5E]/30",
    },
  ];

  return (
    <section id="about" className="relative z-10 py-24 md:py-32 border-t border-white/[0.08] bg-[#06080C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#10141E] px-3 py-1 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#12A4C4]" />
            <span className="font-mono text-xs font-semibold text-[#A3A9B8] uppercase tracking-wider">
              About Festronix
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Engineering Craft at National Scale
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A9B8] leading-relaxed">
            Organized by the Student Affairs Cell (SAC) at Vardhaman College of Engineering,
            Festronix 2026 brings together over 2,500 students for two days of rigorous technical
            showdowns, hardware prototyping, and competitive esports across our Shamshabad campus.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Campus Narrative & Accreditations */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="rounded-card border border-white/10 bg-[#0B0E17]/90 backdrop-blur-md p-7 shadow-lg shadow-black/40">
              <h3 className="font-display text-xl font-bold text-white mb-3">
                Autonomous Campus & Real Lab Venues
              </h3>
              <p className="text-xs sm:text-sm text-[#A3A9B8] leading-relaxed mb-5 font-sans">
                Festronix is hosted directly across Vardhaman's state-of-the-art facilities—from the 
                Advanced Computing Center and VLSI Design Benches to the outdoor Karting tracks and the air-conditioned Main Auditorium.
              </p>
              
              <div className="border-t border-white/[0.08] pt-4 flex flex-wrap gap-2 text-xs font-mono text-[#EEF0F5]">
                <span className="rounded bg-[#161C2A] border border-white/5 px-3 py-1">UGC Autonomous</span>
                <span className="rounded bg-[#161C2A] border border-white/5 px-3 py-1">NAAC A++ Grade</span>
                <span className="rounded bg-[#161C2A] border border-white/5 px-3 py-1">NBA Accredited Programs</span>
              </div>
            </div>

            <div className="rounded-card border border-[#12A4C4]/20 bg-[#101422] p-6 flex items-start gap-4 shadow-md shadow-cyan-950/20">
              <CheckCircle2 className="h-6 w-6 text-[#22D3EE] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-sans text-sm font-bold text-white block">
                  Official Institutional Certificates
                </span>
                <p className="text-xs text-[#A3A9B8] mt-1 leading-relaxed">
                  Every participant earns an official institutional certificate accredited by VCE Student Affairs Cell, with special merit citations and trophies for arena winners.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Multi-Tone Stat Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-card border border-white/10 bg-[#0B0E17]/90 backdrop-blur-md p-6 flex flex-col justify-between h-52 hover:border-white/20 transition-all duration-200 shadow-lg shadow-black/40"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#161C2A] border border-white/5">
                      <Icon className={`h-5 w-5 ${stat.accent}`} />
                    </div>
                    <span className="font-mono text-xs text-[#7A8296]">
                      0{idx + 1}
                    </span>
                  </div>

                  <div>
                    <span className="font-display text-3xl font-extrabold tracking-tight text-white block">
                      {stat.value}
                    </span>
                    <span className={`font-mono text-xs font-semibold ${stat.accent} block mt-0.5`}>
                      {stat.label}
                    </span>
                    <p className="font-sans text-xs text-[#A3A9B8] mt-2 leading-relaxed">
                      {stat.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
