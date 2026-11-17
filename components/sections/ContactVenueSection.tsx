"use client";

import { FEST_CONFIG } from "@/data/config";
import { MapPin, Phone, Mail, Plane, Bus, ExternalLink } from "lucide-react";

export function ContactVenueSection() {
  return (
    <section id="contact" className="relative z-10 py-20 md:py-28 border-t border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <span className="font-mono text-xs text-[#7A8296] block mb-2">
            Location & Transit
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#EEF0F5]">
            Campus venue and transit
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#A3A9B8]">
            Vardhaman College of Engineering is situated near Shamshabad, accessible via Outer Ring Road (ORR) and Rajiv Gandhi International Airport.
          </p>
        </div>

        {/* 2-Column Split: Telemetry Details + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Transit Specs & Student Leads */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            <div className="rounded-card border border-white/[0.08] bg-[#11141C] p-6">
              <h3 className="font-display text-base font-semibold text-[#EEF0F5] mb-3">
                {FEST_CONFIG.college}
              </h3>

              <div className="flex flex-col gap-3 text-xs sm:text-sm text-[#A3A9B8]">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#7A8296] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#EEF0F5] block font-medium">Campus Address</span>
                    <span>{FEST_CONFIG.location.campus}, {FEST_CONFIG.location.city}, {FEST_CONFIG.location.state} — {FEST_CONFIG.location.pincode}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Plane className="h-4 w-4 text-[#7A8296] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#EEF0F5] block font-medium">Airport Connectivity</span>
                    <span>{FEST_CONFIG.location.airportDistance}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Bus className="h-4 w-4 text-[#7A8296] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#EEF0F5] block font-medium">Transit Shuttle</span>
                    <span>College transport points running from Aramghar and Mehdipatnam junctions.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coordinators Contact Card */}
            <div className="rounded-card border border-white/[0.08] bg-[#11141C] p-6">
              <h4 className="font-sans text-xs font-semibold text-[#7A8296] mb-3">
                Direct coordinator directory
              </h4>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-medium text-[#EEF0F5] block">{FEST_CONFIG.contact.convenor.name}</span>
                    <span className="text-[#7A8296]">Faculty Convenor</span>
                  </div>
                  <a href={`tel:${FEST_CONFIG.contact.convenor.phone}`} className="font-mono text-[#12A4C4] hover:underline">
                    {FEST_CONFIG.contact.convenor.phone}
                  </a>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-white/[0.04] pt-2">
                  <div>
                    <span className="font-medium text-[#EEF0F5] block">{FEST_CONFIG.contact.techLead.name}</span>
                    <span className="text-[#7A8296]">Student Technical Lead</span>
                  </div>
                  <a href={`tel:${FEST_CONFIG.contact.techLead.phone}`} className="font-mono text-[#12A4C4] hover:underline">
                    {FEST_CONFIG.contact.techLead.phone}
                  </a>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-white/[0.04] pt-2">
                  <div>
                    <span className="font-medium text-[#EEF0F5] block">{FEST_CONFIG.contact.studentWelfare.name}</span>
                    <span className="text-[#7A8296]">Student Welfare & Lodging</span>
                  </div>
                  <a href={`tel:${FEST_CONFIG.contact.studentWelfare.phone}`} className="font-mono text-[#12A4C4] hover:underline">
                    {FEST_CONFIG.contact.studentWelfare.phone}
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Embedded Interactive Map Block */}
          <div className="lg:col-span-6 h-[340px] sm:h-[400px] rounded-card border border-white/[0.08] bg-[#11141C] overflow-hidden relative">
            <iframe
              src={FEST_CONFIG.location.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(92%) hue-rotate(180deg) contrast(90%)" }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="VCE Campus Map"
            />
          </div>

        </div>

      </div>
    </section>
  );
}
