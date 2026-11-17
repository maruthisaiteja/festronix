"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Arenas", href: "/#events" },
    { label: "About", href: "/#about" },
    { label: "Schedule", href: "/#schedule" },
    { label: "Gallery", href: "/#gallery" },
    { label: "FAQ", href: "/#faq" },
    { label: "Venue", href: "/#contact" },
    { label: "Portal", href: "/portal/login" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav
          className={`mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8 transition-colors duration-150 ${
            isScrolled
              ? "bg-[#06080C]/90 backdrop-blur-md border-b border-white/10"
              : "bg-transparent border-b border-transparent"
          }`}
        >
          {/* Left: Institutional Logos & Fest Wordmark */}
          <Link href="/" className="flex items-center gap-3">
            {/* VCE Crest */}
            <div className="relative h-7 w-8 sm:h-8 sm:w-9 overflow-hidden">
              <Image
                src="/assets/logos/vce_crest.png"
                alt="Vardhaman College of Engineering"
                fill
                className="object-contain"
                priority
              />
            </div>

            <span className="h-4 w-px bg-white/20" />

            {/* SAC Emblem */}
            <div className="relative h-6 w-6 sm:h-7 sm:w-7 overflow-hidden rounded-full">
              <Image
                src="/assets/logos/sac_emblem.png"
                alt="Student Affairs Cell"
                fill
                className="object-contain"
                priority
              />
            </div>

            <span className="h-4 w-px bg-white/20" />

            {/* Fest Title */}
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-white">
                Festronix <span className="text-[#12A4C4]">'26</span>
              </span>
              <span className="font-mono text-[10px] text-[#7A8296] hidden sm:inline-block">
                VCE Hyderabad
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <ul className="hidden md:flex items-center gap-6 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-xs sm:text-sm font-medium text-[#A3A9B8] hover:text-white transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Action Stack: Sound Toggle + Register Button */}
          <div className="flex items-center gap-3">
            <SoundToggle />

            {/* Primary Action Button Links to /register */}
            <Link
              href="/register"
              className="flex items-center gap-1.5 rounded-xl bg-white px-4 py-2 font-sans text-xs font-bold text-[#06080C] hover:bg-[#EEF0F5] shadow-md shadow-white/10 transition-colors"
            >
              <span>Register</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#10141E] text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#06080C]/98 backdrop-blur-xl flex flex-col justify-center px-6 md:hidden">
          <ul className="flex flex-col gap-5 text-center list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-2xl font-bold text-white hover:text-[#12A4C4] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-sans text-sm font-bold text-[#06080C]"
              >
                <span>Register for Arenas</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
