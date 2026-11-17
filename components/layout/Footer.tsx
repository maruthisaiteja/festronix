import Link from "next/link";
import Image from "next/image";
import { FEST_CONFIG } from "@/data/config";
import { ArrowUpRight, Github, Instagram, Linkedin, MessageSquare, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.08] bg-[#07080D] pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1 & 2: College & Cell Branding */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {/* College Logo */}
              <div className="relative h-8 w-10 overflow-hidden">
                <Image
                  src="/assets/logos/vce_crest.png"
                  alt="Vardhaman College of Engineering"
                  fill
                  className="object-contain"
                />
              </div>

              <span className="h-4 w-px bg-white/[0.12]" />

              {/* SAC Logo */}
              <div className="relative h-7 w-7 overflow-hidden rounded-full">
                <Image
                  src="/assets/logos/sac_emblem.png"
                  alt="Student Affairs Cell"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <h3 className="font-display text-base font-semibold text-[#EEF0F5]">
              Festronix 2026
            </h3>
            <p className="font-mono text-xs text-[#7A8296] mt-0.5">
              Vardhaman College of Engineering · Student Affairs Cell
            </p>
            <p className="mt-3 max-w-sm text-xs sm:text-sm text-[#A3A9B8] leading-relaxed">
              A national-level technical festival fostering competitive engineering,
              hardware debugging, and software systems. December 1 & 2, 2026.
            </p>

            <div className="mt-4 flex items-center gap-2 font-mono text-xs text-[#7A8296]">
              <MapPin className="h-3.5 w-3.5 text-[#7A8296]" />
              <span>Shamshabad, Hyderabad · Telangana 501218</span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="font-sans text-xs font-semibold text-[#EEF0F5] mb-3">
              Directory
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#A3A9B8] list-none">
              <li><Link href="/#events" className="hover:text-[#EEF0F5] transition-colors">52 Arenas & Tracks</Link></li>
              <li><Link href="/#about" className="hover:text-[#EEF0F5] transition-colors">About Festronix</Link></li>
              <li><Link href="/#schedule" className="hover:text-[#EEF0F5] transition-colors">Event Schedule</Link></li>
              <li><Link href="/#gallery" className="hover:text-[#EEF0F5] transition-colors">Campus Gallery</Link></li>
              <li><Link href="/#faq" className="hover:text-[#EEF0F5] transition-colors">FAQ</Link></li>
              <li><Link href="/register" className="text-[#00FF9D] hover:underline font-semibold">Delegate Registration</Link></li>
            </ul>
          </div>

          {/* Col 4: Coordinators */}
          <div>
            <h4 className="font-sans text-xs font-semibold text-[#EEF0F5] mb-3">
              Coordinators
            </h4>
            <div className="flex flex-col gap-2.5 text-xs text-[#A3A9B8]">
              <div>
                <span className="block font-medium text-[#EEF0F5]">{FEST_CONFIG.contact.convenor.name}</span>
                <span className="font-mono text-[#7A8296]">{FEST_CONFIG.contact.convenor.phone}</span>
              </div>
              <div>
                <span className="block font-medium text-[#EEF0F5]">{FEST_CONFIG.contact.techLead.name}</span>
                <span className="font-mono text-[#7A8296]">{FEST_CONFIG.contact.techLead.phone}</span>
              </div>
              <div className="pt-1">
                <a
                  href={`mailto:${FEST_CONFIG.contact.email}`}
                  className="inline-flex items-center gap-1 font-mono text-xs text-[#12A4C4] hover:underline"
                >
                  <Mail className="h-3 w-3" />
                  <span>{FEST_CONFIG.contact.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 5: Social Channels */}
          <div>
            <h4 className="font-sans text-xs font-semibold text-[#EEF0F5] mb-3">
              Ecosystem
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm text-[#A3A9B8] list-none">
              <li>
                <a
                  href={FEST_CONFIG.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#EEF0F5] transition-colors"
                >
                  <Instagram className="h-3.5 w-3.5 text-[#7A8296]" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href={FEST_CONFIG.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#EEF0F5] transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5 text-[#7A8296]" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href={FEST_CONFIG.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#EEF0F5] transition-colors"
                >
                  <Github className="h-3.5 w-3.5 text-[#7A8296]" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href={FEST_CONFIG.socials.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[#EEF0F5] transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#7A8296]" />
                  <span>Discord</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row text-xs text-[#7A8296]">
          <p>© {FEST_CONFIG.year} Vardhaman College of Engineering. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/register" className="hover:text-[#EEF0F5] transition-colors text-[#12A4C4]">
              Register Now ↗
            </Link>
            <span className="h-3 w-px bg-white/[0.12]" />
            <Link href="/#about" className="hover:text-[#EEF0F5] transition-colors">
              About VCE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
