"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FEST_CONFIG } from "@/data/config";
import { HeroCanvas } from "@/components/3d/HeroCanvas";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function HeroSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: "45",
    hours: "18",
    minutes: "32",
    seconds: "40",
  });

  useEffect(() => {
    // Dynamic countdown targeting December 1
    const getTargetTime = () => {
      const now = new Date();
      let target = new Date(now.getFullYear(), 11, 1, 9, 0, 0); // Month is 0-indexed: 11 = December
      if (target.getTime() <= now.getTime()) {
        target = new Date(now.getFullYear() + 1, 11, 1, 9, 0, 0);
      }
      return target.getTime();
    };

    const targetTime = getTargetTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetTime - now);

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] w-full flex items-center justify-center overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24"
    >
      {/* 3D WebGL Canvas with Topographic Waves & Multi-Tone Sculptures */}
      <HeroCanvas />

      {/* Hero Foreground Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 w-full flex flex-col items-center text-center">
        
        {/* Presenting Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#10141E]/85 backdrop-blur-md px-4 py-1.5 mb-5 shadow-lg shadow-black/40">
          <span className="flex h-2 w-2 rounded-full bg-[#12A4C4] animate-ping" />
          <span className="font-mono text-xs font-semibold tracking-wider text-[#A3A9B8] uppercase">
            Student Affairs Cell Presents
          </span>
        </div>

        {/* Headline Lockup with High-Impact Typography */}
        <div className="my-1 select-none w-full max-w-full flex flex-col items-center">
          <h1 className="font-display text-[clamp(2.8rem,9vw,8.2rem)] font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-[#F0FBFF] to-[#22D3EE] drop-shadow-[0_4px_35px_rgba(18,164,196,0.35)]">
            FESTRONIX
          </h1>

          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-center">
            {/* The Year of 2026 Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#5145CD] px-3 py-1 font-mono text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#5145CD]/40">
              <Sparkles className="h-3.5 w-3.5" />
              <span>The Year of 2026</span>
            </span>
            <span className="h-3 w-px bg-white/20 hidden sm:inline-block" />
            <span className="font-mono text-xs sm:text-sm tracking-[0.2em] text-[#12A4C4] uppercase font-bold">
              A National Level Technical Fest
            </span>
          </div>
        </div>

        {/* Grounded Subtitle */}
        <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#A3A9B8] leading-relaxed font-sans">
          Join us for a 2-Day National Technical Fest featuring 52 competitive arenas in software architecture, autonomous robotics, circuit debugging, and creative gauntlets.
        </p>

        {/* ── Zenith-Style Modular Telemetry HUD Bar ── */}
        <div className="mt-9 w-full max-w-3xl flex flex-col items-center">
          
          {/* Main Connected Control Bar */}
          <div className="w-full rounded-card border border-white/10 bg-[#07090F]/90 backdrop-blur-xl p-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 shadow-2xl shadow-black/60">
            
            {/* Left Module: Context Label */}
            <div className="flex items-center justify-center rounded-md bg-[#10141E] px-4 py-3 text-left border border-white/5 flex-shrink-0">
              <span className="font-sans text-xs font-semibold text-[#A3A9B8] leading-tight text-center md:text-left">
                The countdown begins in
              </span>
            </div>

            {/* Middle Module: 4 Tabular Countdown Blocks */}
            <div className="grid grid-cols-4 gap-1.5 flex-1 w-full">
              {/* Days */}
              <div className="flex flex-col items-center justify-center rounded-md py-2 px-1 bg-[#10141E] border border-white/5">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-sm bg-[#12A4C4]" />
                  <span className="font-mono text-[11px] text-[#7A8296] font-medium">Days</span>
                </div>
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-white mt-0.5">
                  {timeLeft.days}
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center justify-center rounded-md py-2 px-1 bg-[#10141E] border border-white/5">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-sm bg-[#10B981]" />
                  <span className="font-mono text-[11px] text-[#7A8296] font-medium">Hours</span>
                </div>
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-white mt-0.5">
                  {timeLeft.hours}
                </span>
              </div>

              {/* Mins */}
              <div className="flex flex-col items-center justify-center rounded-md py-2 px-1 bg-[#10141E] border border-white/5">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-sm bg-[#F43F5E]" />
                  <span className="font-mono text-[11px] text-[#7A8296] font-medium">Mins</span>
                </div>
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-white mt-0.5">
                  {timeLeft.minutes}
                </span>
              </div>

              {/* Secs: Solid Royal Violet Card (Zenith Match!) */}
              <div className="flex flex-col items-center justify-center rounded-md py-2 px-1 bg-[#5145CD] text-white shadow-lg shadow-[#5145CD]/40">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-sm bg-white" />
                  <span className="font-mono text-[11px] text-white/90 font-semibold">Secs</span>
                </div>
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-white mt-0.5">
                  {timeLeft.seconds}
                </span>
              </div>
            </div>

            {/* Right Module: Primary Registration Action Links directly to /register */}
            <Link
              href="/register"
              className="flex items-center justify-center gap-1.5 rounded-md bg-white px-5 py-3 font-sans text-xs font-bold text-[#06080C] hover:bg-[#EEF0F5] active:scale-[0.98] transition-all duration-150 flex-shrink-0 shadow-md shadow-white/10"
            >
              <span>Register now</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Two Docked Metadata Cards Directly Below Control Bar */}
          <div className="mt-2.5 w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Date Card */}
            <div className="flex flex-col items-start rounded-md border border-white/[0.08] bg-[#10141E]/90 backdrop-blur-md px-4 py-3 text-left">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-[#5145CD]" />
                <span className="font-mono text-[11px] font-semibold text-[#A3A9B8]">
                  Date
                </span>
              </div>
              <span className="font-sans text-xs sm:text-sm font-semibold text-white mt-1">
                December 1 & 2, 2026
              </span>
              <span className="font-mono text-[11px] text-[#7A8296] mt-0.5">
                Two-Day Technical Fest // 52 Arenas
              </span>
            </div>

            {/* Location Card */}
            <div className="flex flex-col items-start rounded-md border border-white/[0.08] bg-[#10141E]/90 backdrop-blur-md px-4 py-3 text-left">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm bg-[#12A4C4]" />
                <span className="font-mono text-[11px] font-semibold text-[#A3A9B8]">
                  Location
                </span>
              </div>
              <span className="font-sans text-xs sm:text-sm font-semibold text-white mt-1">
                Vardhaman College of Engineering, Hyderabad
              </span>
              <span className="font-mono text-[11px] text-[#7A8296] mt-0.5">
                Kacharam, Shamshabad · 25 mins from RGIA
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
