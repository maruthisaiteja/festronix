"use client";

import { useState } from "react";
import { FEST_GALLERY, GalleryItem } from "@/data/gallery";
import { X, Camera } from "lucide-react";

export function GallerySection() {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="relative z-10 py-20 md:py-28 border-t border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <span className="font-mono text-xs text-[#7A8296] block mb-2">
            Campus Archives
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#EEF0F5]">
            Moments and archives
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#A3A9B8]">
            Highlights from previous editions spanning late-night prototyping, rover heats, and auditorium valedictories.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEST_GALLERY.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative h-64 flex flex-col justify-between p-6 rounded-card border border-white/[0.08] bg-[#11141C] hover:border-white/[0.16] hover:bg-[#151924] transition-[border-color,background-color] duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-[#1A1E28] px-2.5 py-1 font-mono text-[11px] text-[#A3A9B8]">
                  {item.category}
                </span>
                <span className="font-mono text-xs text-[#7A8296]">
                  0{idx + 1}
                </span>
              </div>

              <div>
                <h3 className="font-sans text-base font-semibold text-[#EEF0F5] group-hover:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-[#A3A9B8] mt-1 line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07080D]/80 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-panel border border-white/[0.08] bg-[#11141C] p-6 text-left"
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-[#1A1E28] text-[#A3A9B8] hover:text-[#EEF0F5]"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="font-mono text-xs text-[#12A4C4] block mb-1">
              {activeItem.category} // Archive {activeItem.id}
            </span>
            <h3 className="font-display text-xl font-semibold text-[#EEF0F5]">
              {activeItem.title}
            </h3>
            <p className="text-sm text-[#A3A9B8] mt-2 leading-relaxed">
              {activeItem.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
