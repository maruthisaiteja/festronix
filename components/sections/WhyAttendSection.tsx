"use client";

import { Users, Presentation, Trophy, Award } from "lucide-react";

export function WhyAttendSection() {
  const cards = [
    {
      title: "NETWORK",
      icon: Users,
      tilt: "-rotate-2 md:-rotate-3 hover:rotate-0",
      offset: "md:translate-y-4",
      description:
        "Connect with 2,500+ student innovators, technical leads, and passionate engineers from 40+ premier colleges across the country.",
    },
    {
      title: "WORKSHOPS",
      icon: Presentation,
      tilt: "md:-rotate-1 hover:rotate-0",
      offset: "md:-translate-y-2",
      description:
        "Hands-on immersion in AR/VR Meta-Minds, Drone Engineering & Piloting, and Silicon Circuit Design led by domain specialists.",
    },
    {
      title: "52+ ARENAS",
      icon: Trophy,
      tilt: "rotate-1 md:rotate-3 hover:rotate-0",
      offset: "md:translate-y-2",
      description:
        "Compete with top collegiate talent across 52 distinct arenas spanning software marathons, combat robotics, forensics, and esports.",
    },
    {
      title: "RECOGNITION",
      icon: Award,
      tilt: "-rotate-1 md:-rotate-2 hover:rotate-0",
      offset: "md:translate-y-5",
      description:
        "Earn official institutional merit certificates, championship trophies, cash awards, and add an undeniable credential to your engineering portfolio.",
    },
  ];

  return (
    <section className="relative z-10 py-24 md:py-32 overflow-hidden border-t border-white/[0.08] bg-[#06080C]">
      {/* Background SVG Curved Neon Connector Arc (Zenith Reference) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M -100 450 C 300 150, 700 550, 1100 200 C 1300 50, 1500 350, 1600 250"
            stroke="url(#neonMintGradient)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />
          <path
            d="M 100 520 C 450 250, 850 500, 1250 180 C 1400 90, 1550 280, 1650 220"
            stroke="url(#neonPurpleGradient)"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          <defs>
            <linearGradient id="neonMintGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
              <stop offset="30%" stopColor="#00FF9D" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#12A4C4" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#5145CD" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="neonPurpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5145CD" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#6366F1" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        
        {/* Section Headline Lockup (Zenith Reference Match) */}
        <div className="mb-14 md:mb-20 max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.1]">
            WHY YOU CAN’T <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] via-[#12A4C4] to-[#00FF9D] drop-shadow-[0_0_35px_rgba(99,102,241,0.35)]">
              MISS FESTRONIX ’26
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A9B8] leading-relaxed">
            The definitive two-day technical gathering at Vardhaman College of Engineering, built for builders who demand real competition.
          </p>
        </div>

        {/* 4 Tilted Floating Cards on Arc */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-5 items-stretch">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`group relative flex flex-col justify-between rounded-panel border border-white/10 bg-[#0B0E17]/90 backdrop-blur-xl p-7 transition-all duration-300 hover:border-[#00FF9D]/40 hover:shadow-[0_0_30px_rgba(0,255,157,0.15)] hover:scale-[1.03] ${card.tilt} ${card.offset}`}
              >
                <div>
                  {/* Marker Mint Title */}
                  <h3 className="font-marker text-2xl font-bold tracking-wider text-[#00FF9D] drop-shadow-[0_0_12px_rgba(0,255,157,0.4)] mb-6">
                    {card.title}
                  </h3>

                  {/* Icon in Rounded Box */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-[#121622] text-[#00FF9D] group-hover:border-[#00FF9D]/40 group-hover:bg-[#152028] transition-colors mb-6 shadow-inner">
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#A3A9B8] leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>

                {/* Subtle Bottom Accent Indicator */}
                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="font-mono text-[11px] text-[#7A8296]">
                    Feature 0{idx + 1}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00FF9D]/50 group-hover:bg-[#00FF9D] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
