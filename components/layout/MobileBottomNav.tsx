"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  Calendar,
  Ticket,
  ShieldCheck,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on scanner page to keep viewfinder unobstructed
  if (pathname === "/portal/coordinator/scan" || pathname === "/portal/coordinator/print") {
    return null;
  }

  const isRegister = pathname === "/register";
  const isPortal = pathname?.startsWith("/portal");

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden print:hidden border-t border-white/10 bg-[#0B0E17]/95 backdrop-blur-xl px-2 py-2"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            pathname === "/"
              ? "text-[#12A4C4] font-bold"
              : "text-[#7A8296] hover:text-white"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="font-mono text-[10px] mt-1">Home</span>
        </Link>

        {/* Arenas */}
        <Link
          href="/#events"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[#7A8296] hover:text-white transition-all"
        >
          <LayoutGrid className="h-5 w-5" />
          <span className="font-mono text-[10px] mt-1">52 Arenas</span>
        </Link>

        {/* Center Register Button (Elevated) */}
        <Link
          href="/register"
          className="relative -top-2 flex flex-col items-center justify-center"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-transform active:scale-95 ${
              isRegister
                ? "bg-gradient-to-r from-[#12A4C4] to-[#00FF9D] text-[#06080C] shadow-cyan-500/30"
                : "bg-gradient-to-r from-[#12A4C4] to-[#5145CD] text-white shadow-cyan-950/50"
            }`}
          >
            <Ticket className="h-6 w-6" />
          </div>
          <span className="font-mono text-[10px] font-bold text-white mt-0.5">
            Register
          </span>
        </Link>

        {/* Schedule */}
        <Link
          href="/#schedule"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-[#7A8296] hover:text-white transition-all"
        >
          <Calendar className="h-5 w-5" />
          <span className="font-mono text-[10px] mt-1">Schedule</span>
        </Link>

        {/* Portal Login / Dashboard */}
        <Link
          href="/portal/login"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isPortal
              ? "text-[#00FF9D] font-bold"
              : "text-[#7A8296] hover:text-white"
          }`}
        >
          <ShieldCheck className="h-5 w-5" />
          <span className="font-mono text-[10px] mt-1">Portal</span>
        </Link>
      </div>
    </nav>
  );
}
