"use client";

import { useState } from "react";
import { FEST_FAQS } from "@/data/faq";
import { FEST_CONFIG } from "@/data/config";
import { Plus, Mail } from "lucide-react";

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="relative z-10 py-20 md:py-28 border-t border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Context & Support Desk */}
          <div className="lg:col-span-5">
            <span className="font-mono text-xs text-[#7A8296] block mb-2">
              Frequently asked questions
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#EEF0F5]">
              Answers to common inquiries
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#A3A9B8] leading-relaxed">
              Find details regarding eligibility, cross-college team registration, on-campus accommodation, and competition regulations.
            </p>

            <div className="mt-6 rounded-card border border-white/[0.08] bg-[#11141C] p-5">
              <span className="font-sans text-xs font-semibold text-[#EEF0F5] block mb-1">
                Student welfare support
              </span>
              <p className="text-xs text-[#A3A9B8] mb-3 leading-relaxed">
                The Student Welfare Desk assists with group registration, transit from airport/railway stations, and campus lodging.
              </p>
              <a
                href={`mailto:${FEST_CONFIG.contact.email}`}
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[#12A4C4] hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{FEST_CONFIG.contact.email}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Clean Accordion List */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            {FEST_FAQS.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`overflow-hidden rounded-md border transition-colors duration-150 ${
                    isOpen
                      ? "border-white/[0.14] bg-[#161A24]"
                      : "border-white/[0.06] bg-[#11141C] hover:border-white/[0.10]"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="flex w-full items-center justify-between p-4 text-left font-sans text-sm font-medium text-[#EEF0F5]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#7A8296]">
                        0{idx + 1}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                    <Plus
                      className={`h-4 w-4 text-[#7A8296] transition-transform duration-150 flex-shrink-0 ml-2 ${
                        isOpen ? "rotate-45 text-[#EEF0F5]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 font-sans text-xs sm:text-sm text-[#A3A9B8] leading-relaxed border-t border-white/[0.04]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
