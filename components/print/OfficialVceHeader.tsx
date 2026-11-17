"use client";

import React from "react";
import { VCE_LOGO_BASE64, VCE_26_YEARS_BASE64 } from "@/lib/report-assets";

interface OfficialVceHeaderProps {
  title?: string;
  subtitle?: string;
  venueRoom?: string;
  coordinatorName?: string;
  festDay?: string;
  totalCount?: number;
  presentCount?: number;
}

export function OfficialVceHeader({
  title = "FESTRONIX 2026 — OFFICIAL ARENA REGISTRATION & ATTENDANCE ROSTER",
  subtitle = "Student Affairs Cell (SAC) · National Level Technical Fest",
  venueRoom,
  coordinatorName,
  festDay,
  totalCount,
  presentCount,
}: OfficialVceHeaderProps) {
  const printDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="w-full text-slate-900 mb-6 print:mb-4">
      {/* Institutional Table Header */}
      <table className="w-full border-collapse mb-2">
        <tbody>
          <tr>
            {/* Left: VCE Crest Logo */}
            <td className="w-36 align-middle text-left p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={VCE_LOGO_BASE64}
                alt="Vardhaman College of Engineering"
                className="h-16 max-w-[135px] object-contain block"
              />
            </td>

            {/* Vertical Divider */}
            <td className="w-[1.5px] bg-[#3C4978] p-0" />

            {/* Center: Institutional Text */}
            <td className="align-middle text-center px-4 py-0">
              <div className="font-serif text-[18px] font-extrabold tracking-wide text-[#1e1b4b] uppercase leading-tight mb-0.5">
                Vardhaman College of Engineering
              </div>
              <div className="font-sans text-[10.5px] leading-tight text-[#3C4978]">
                <div className="font-bold tracking-tight">
                  (Autonomous Institute, Affiliated to JNTUH, Approved by AICTE, Accredited by NAAC with A++ Grade)
                </div>
                <div className="mt-0.5 text-[10px]">
                  Kacharam, Shamshabad, <strong>Hyderabad</strong> - 501 218, <strong>Telangana</strong>, India.
                </div>
              </div>
            </td>

            {/* Right: 26 Years Logo */}
            <td className="w-36 align-middle text-right p-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={VCE_26_YEARS_BASE64}
                alt="26 Years of Vibrant Vardhaman"
                className="h-14 max-w-[145px] object-contain block ml-auto"
              />
            </td>
          </tr>
        </tbody>
      </table>

      {/* Horizontal Solid Divider */}
      <div className="w-full h-[2px] bg-[#3C4978] my-2" />

      {/* SAC Department Header */}
      <div className="font-serif text-[13px] font-extrabold text-[#1e1b4b] text-center uppercase tracking-wider mb-1">
        STUDENT AFFAIRS CELL (SAC) — FESTRONIX 2026
      </div>

      {/* Document Title */}
      <div className="font-sans text-[12px] font-extrabold text-slate-900 text-center uppercase tracking-wide">
        {title}
      </div>
      {subtitle && (
        <div className="font-sans text-[10.5px] font-medium text-slate-600 text-center mt-0.5">
          {subtitle}
        </div>
      )}

      {/* Official Metadata Strip */}
      <div className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 mt-2.5 text-[10px] font-sans flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span>
            <strong>Fest Dates:</strong> Dec 1 & 2, 2026
          </span>
          {festDay && (
            <span>
              <strong>Schedule:</strong> {festDay}
            </span>
          )}
          {venueRoom && (
            <span>
              <strong>Venue Room:</strong> {venueRoom}
            </span>
          )}
          {coordinatorName && (
            <span>
              <strong>Coordinator:</strong> {coordinatorName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {totalCount !== undefined && (
            <span>
              <strong>Total Registered:</strong> {totalCount}
            </span>
          )}
          {presentCount !== undefined && (
            <span>
              <strong>Present:</strong> {presentCount} (
              {totalCount ? Math.round((presentCount / totalCount) * 100) : 0}%)
            </span>
          )}
          <span>
            <strong>Generated:</strong> {printDate}
          </span>
          <span className="inline-block bg-indigo-50 text-indigo-900 border border-indigo-200 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase">
            OFFICIAL SAC RECORD
          </span>
        </div>
      </div>
    </div>
  );
}
