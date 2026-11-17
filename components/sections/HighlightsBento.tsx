"use client";

import { Terminal, Cpu, CircuitBoard, Gamepad2 } from "lucide-react";

export function HighlightsBento() {
  const highlights = [
    {
      icon: Terminal,
      tag: "Software Engineering & Marathons",
      accent: "text-[#22D3EE]",
      badgeBorder: "border-[#12A4C4]/30 bg-[#12A4C4]/10",
      title: "Smartathon & Web Sprints",
      desc: "Two days of continuous algorithmic problem solving, full-stack application development, and live bug bounty hunting across campus computing labs.",
      tracks: ["Smartathon (3020)", "Webathon (3217)", "Blind Coding (1328)", "Bug Bounty (1015)"],
    },
    {
      icon: Cpu,
      tag: "Autonomous Hardware & Avionics",
      accent: "text-[#00FF9D]",
      badgeBorder: "border-[#10B981]/30 bg-[#10B981]/10",
      title: "Smart Karts & Drone Workshop",
      desc: "Custom smart kart trials, high-torque obstacle navigation in ROBO Games, and hands-on drone flight controller construction.",
      tracks: ["Smart Karts (1325/1326)", "ROBO Games (3rd Block)", "Drone Workshop (GB 1st Floor)"],
    },
    {
      icon: CircuitBoard,
      tag: "Silicon & Embedded Systems",
      accent: "text-[#818CF8]",
      badgeBorder: "border-[#5145CD]/30 bg-[#5145CD]/10",
      title: "Electronics Design & Debugging",
      desc: "Breadboard waveform probing, IC fault isolation, schematic ideation, and live problem-solving in dedicated engineering laboratories.",
      tracks: ["Electronics Design (5005-5008)", "Circuit Debugging (3213)", "Electrofusion (5211)"],
    },
    {
      icon: Gamepad2,
      tag: "LAN Esports & Tactical Gauntlets",
      accent: "text-[#FB7185]",
      badgeBorder: "border-[#F43F5E]/30 bg-[#F43F5E]/10",
      title: "Valorant LAN & Escape Rooms",
      desc: "5v5 campus tactical shooter championship on low-latency LAN nodes, physical mystery escape rooms, and high-intensity behavioral games.",
      tracks: ["LAN Valorant (1001)", "Escape Room 2.0 (3101/3102)", "Squid Game 4.0 (GB 2nd Fl)"],
    },
  ];

  return (
    <section id="highlights" className="relative z-10 py-24 md:py-32 border-t border-white/[0.08] bg-[#06080C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#10141E] px-3 py-1 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#12A4C4]" />
            <span className="font-mono text-xs font-semibold text-[#A3A9B8] uppercase tracking-wider">
              Core Pillars
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Flagship Competition Pillars
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#A3A9B8] leading-relaxed">
            Four primary arenas anchoring the two-day experience at Vardhaman College of Engineering, with dedicated laboratories, test benches, and tournament setups.
          </p>
        </div>

        {/* 4 Multi-Tone Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-card border border-white/10 bg-[#0B0E17]/90 backdrop-blur-md p-7 flex flex-col justify-between hover:border-white/20 transition-all duration-200 shadow-lg shadow-black/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-6 w-6 ${item.accent}`} />
                    <span className={`rounded px-2.5 py-0.5 font-mono text-[11px] font-semibold border ${item.badgeBorder} ${item.accent}`}>
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#A3A9B8] leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap gap-2">
                  {item.tracks.map((t, i) => (
                    <span
                      key={i}
                      className="rounded bg-[#161C2A] border border-white/5 px-2.5 py-1 font-mono text-[11px] text-[#EEF0F5]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
