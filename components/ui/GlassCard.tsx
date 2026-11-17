"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverGlow?: boolean;
  tiltMax?: number;
}

export function GlassCard({
  children,
  className,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-card border border-white/[0.08] bg-[#11141C] p-6 transition-[border-color,background-color] duration-150 hover:border-white/[0.16] hover:bg-[#151924]",
        className
      )}
    >
      {children}
    </div>
  );
}
