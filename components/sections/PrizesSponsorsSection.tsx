"use client";

import { FEST_SPONSORS } from "@/data/gallery";
import { Trophy, Award, ShieldCheck, Sparkles } from "lucide-react";

export function PrizesSponsorsSection() {
  const honorCards = [
    {
      icon: Trophy,
      tag: "Grand Accolades",
      accent: "text-[#00FF9D]",
      badgeBorder: "border-[#10B981]/30 bg-[#10B981]/10",
      title: "Championship Laurels & Trophies",
      description:
        "Official Festronix winner and runner-up trophies presented during the Grand Valedictory in the Main Auditorium by college leadership and SAC convenors.",
      perk: "Accredited institutional honors & official university recognition",
    },
    {
      icon: Award,
      tag: "52 Arena Pools",
      accent: "text-[#22D3EE]",
      badgeBorder: "border-[#12A4C4]/30 bg-[#12A4C4]/10",
      title: "Dedicated Arena Prizes",
      description:
        "Every single arena—including Smartathon, CAD Mania, Drone Workshop, and ROBO Games—maintains its own independent awards, merit certificates, and registration desks.",
      perk: "Direct recognition across all technical and creative tracks",
    },
    {
      icon: ShieldCheck,
      tag: "Career & Resume",
      accent: "text-[#818CF8]",
      badgeBorder: "border-[#5145CD]/30 bg-[#5145CD]/10",
      title: "Institutional Certification",
      description:
        "All active participants receive official participation credentials bearing NAAC A++ accredited institutional seals, ideal for resumes and graduate portfolios.",
      perk: "Verified participation credentials for all attendees",
    },
  ];

  return (
    <section id="sponsors" className="relative z-10 py-24 md:py-32 border-t border-white/[0.08] bg-[#06080C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#10141E] px-3 py-1 mb-3">
            <Sparkles className="h-3 w-3 text-[#12A4C4]" />
            <span className="font-mono text-xs font-semibold text-[#A3A9B8] uppercase tracking-wider">
              Honors & Recognition
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Championship Honors & Partner Ecosystem
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#A3A9B8] leading-relaxed">
            Every competition operates with dedicated merit laurels and institutional accreditation, organized by the Student Affairs Cell alongside premier developer communities.
          </p>
        </div>

        {/* 3 Honor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {honorCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="rounded-card border border-white/10 bg-[#0B0E17]/90 backdrop-blur-md p-7 flex flex-col justify-between hover:border-white/20 transition-all duration-200 shadow-lg shadow-black/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-6 w-6 ${card.accent}`} />
                    <span className={`rounded px-2.5 py-0.5 font-mono text-[11px] font-semibold border ${card.badgeBorder} ${card.accent}`}>
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A3A9B8] leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs font-mono text-[#00FF9D]">
                  ✓ {card.perk}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ecosystem Partner Network Grid */}
        <div className="rounded-card border border-white/10 bg-[#10141E]/60 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/[0.06] gap-2">
            <div>
              <span className="font-display text-base font-bold text-white block">
                Technical Ecosystem & Student Chapters
              </span>
              <span className="font-sans text-xs text-[#7A8296]">
                Supported by student engineering chapters and collegiate builder groups
              </span>
            </div>
            <span className="font-mono text-xs text-[#12A4C4]">
              Festronix 2026 Edition
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {FEST_SPONSORS.map((s, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center rounded-md border border-white/5 bg-[#161C2A] p-4 text-center hover:border-white/15 transition-colors"
              >
                <span className="font-sans text-xs font-semibold text-[#EEF0F5]">
                  {s.name}
                </span>
                <span className="font-mono text-[10px] text-[#7A8296] mt-0.5">
                  {s.tier}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
