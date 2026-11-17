"use client";

import { useSound } from "@/hooks/useSound";
import { Volume2, VolumeX } from "lucide-react";

export function SoundToggle() {
  const { enabled, toggleSound } = useSound();

  return (
    <button
      onClick={toggleSound}
      title={enabled ? "Mute interface feedback" : "Enable sound feedback"}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.08] bg-[#11141C] text-[#A3A9B8] hover:text-[#EEF0F5] hover:border-white/[0.16] active:scale-[0.98] transition-[border-color,color,transform] duration-150"
      aria-label="Toggle sound feedback"
    >
      {enabled ? (
        <Volume2 className="h-4 w-4 text-[#12A4C4]" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
    </button>
  );
}
