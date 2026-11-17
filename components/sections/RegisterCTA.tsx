"use client";

import { FEST_CONFIG } from "@/data/config";
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Gamepad2,
  QrCode,
  Instagram,
  Facebook,
  Twitter,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export function RegisterCTA() {
  const domains = [
    {
      title: "Software & Silicon Marathons",
      icon: Code2,
      tag: "Marathons & Hackathons",
      accent: "text-[#22D3EE]",
      badgeBorder: "border-[#12A4C4]/30 bg-[#12A4C4]/10",
      desc: "Flagship continuous engineering challenges across software systems and hardware PCB design.",
      events: [
        "Smartathon (Room 3020)",
        "Electronics Design Hackathon (Rooms 5005-5008)",
        "Webathon (Room 3217)",
        "Blind Coding (Room 1328)",
      ],
      venueHighlight: "Dedicated lab benches with high-speed campus LAN and power.",
      btnLabel: "Explore software arenas",
    },
    {
      title: "Robotics, Karts & Workshops",
      icon: Cpu,
      tag: "Hardware & Avionics",
      accent: "text-[#00FF9D]",
      badgeBorder: "border-[#10B981]/30 bg-[#10B981]/10",
      desc: "Autonomous rover racing, custom smart karts, and hands-on drone building masterclasses.",
      events: [
        "Smart Karts (Rooms 1325/1326)",
        "ROBO Games (3rd Block Lobby Outside)",
        "Drone Building Workshop (GB 1st Floor)",
        "Meta-Minds AR/VR Workshop (Room 1003)",
      ],
      venueHighlight: "Outdoor custom tracks, robotic arenas, and lab toolkits.",
      btnLabel: "Explore robotics arenas",
    },
    {
      title: "Esports, Forensics & Logic",
      icon: Gamepad2,
      tag: "Tactical & Mystery",
      accent: "text-[#818CF8]",
      badgeBorder: "border-[#5145CD]/30 bg-[#5145CD]/10",
      desc: "Competitive LAN tournaments, escape rooms, crime file forensics, and rapid-fire quizzes.",
      events: [
        "LAN Gaming Valorant (Room 1001)",
        "Escape Room 2.0 (Rooms 3101/3102)",
        "Cyber Forensics Challenge (Room 1019)",
        "Squid Game 4.0 (GB 2nd Floor)",
      ],
      venueHighlight: "Low-latency LAN hubs, scenario lock-ins, and buzzer rounds.",
      btnLabel: "Explore tactical arenas",
    },
  ];

  return (
    <section id="register" className="relative z-10 py-24 md:py-32 border-t border-white/[0.08] bg-[#06080C]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="mb-14 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#10141E] px-3 py-1 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF9D]" />
            <span className="font-mono text-xs font-semibold text-[#A3A9B8] uppercase tracking-wider">
              Registration Portal
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Register for Festronix 2026
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#A3A9B8] leading-relaxed">
            All 52 events are open for individual and team entries. Each arena has its own dedicated coordinator desk, rules, and entry portal.
          </p>
        </div>

        {/* 3 Domain Clusters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {domains.map((dom, idx) => {
            const Icon = dom.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between rounded-card border border-white/10 bg-[#0B0E17]/90 backdrop-blur-md p-6 sm:p-7 shadow-lg shadow-black/40 hover:border-white/20 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`h-6 w-6 ${dom.accent}`} />
                    <span className={`rounded px-2.5 py-0.5 font-mono text-[11px] font-semibold border ${dom.badgeBorder} ${dom.accent}`}>
                      {dom.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white">
                    {dom.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#A3A9B8] leading-relaxed font-sans">
                    {dom.desc}
                  </p>

                  {/* Sample Arenas List */}
                  <div className="mt-5 border-t border-white/[0.06] pt-4">
                    <span className="font-mono text-[11px] text-[#7A8296] block mb-2 uppercase tracking-wider">
                      Featured Arenas
                    </span>
                    <ul className="flex flex-col gap-1.5 text-xs text-[#EEF0F5]">
                      {dom.events.map((e, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-[#12A4C4]" />
                          <span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <p className="text-[11px] font-mono text-[#7A8296] mb-4">
                    {dom.venueHighlight}
                  </p>
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 font-sans text-xs font-bold text-[#06080C] hover:bg-[#EEF0F5] transition-colors"
                  >
                    <span>{dom.btnLabel}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Official QR Code & Poster Scan Hub (Poster Match!) ── */}
        <div className="rounded-panel border border-[#12A4C4]/30 bg-gradient-to-br from-[#0B0E17] via-[#101422] to-[#0D1525] p-6 sm:p-10 shadow-2xl shadow-cyan-950/30">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left Narrative */}
            <div className="max-w-2xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded bg-[#12A4C4]/15 px-3 py-1 font-mono text-xs font-semibold text-[#22D3EE] mb-3">
                <ShieldCheck className="h-3.5 w-3.5 text-[#22D3EE]" />
                Official Fest Portal · Vardhaman College of Engineering
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Scan to Register or Visit www.festronix.in
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#A3A9B8] leading-relaxed">
                Use your mobile device to access individual registration forms for each of the 52 events, view live rules, or register right here through the online catalog above.
              </p>

              {/* Social Channels Row from Poster */}
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono">
                <a
                  href={FEST_CONFIG.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#161C2A] px-3 py-1.5 text-[#EEF0F5] hover:text-[#00FF9D] hover:border-[#00FF9D]/30 transition-colors"
                >
                  <Instagram className="h-3.5 w-3.5 text-[#E1306C]" />
                  <span>@student_affairs_vce</span>
                </a>

                <a
                  href={FEST_CONFIG.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#161C2A] px-3 py-1.5 text-[#EEF0F5] hover:text-[#22D3EE] hover:border-[#22D3EE]/30 transition-colors"
                >
                  <Facebook className="h-3.5 w-3.5 text-[#1877F2]" />
                  <span>vardhamancollegehyd</span>
                </a>

                <a
                  href={FEST_CONFIG.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#161C2A] px-3 py-1.5 text-[#EEF0F5] hover:text-[#818CF8] hover:border-[#818CF8]/30 transition-colors"
                >
                  <Twitter className="h-3.5 w-3.5 text-[#1DA1F2]" />
                  <span>vardhamanhyd</span>
                </a>
              </div>
            </div>

            {/* Right QR Box Mimicking Poster */}
            <div className="flex flex-col items-center justify-center rounded-card border-2 border-[#12A4C4]/40 bg-[#07090F] p-6 text-center shadow-xl shadow-[#12A4C4]/20 flex-shrink-0">
              <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-white p-3 shadow-inner">
                <QrCode className="h-full w-full text-[#06080C]" />
              </div>
              <span className="font-mono text-xs font-bold text-white mt-4 uppercase tracking-wider">
                SCAN TO REGISTER
              </span>
              <span className="font-mono text-[11px] text-[#12A4C4] font-semibold mt-0.5">
                WWW.FESTRONIX.IN
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
