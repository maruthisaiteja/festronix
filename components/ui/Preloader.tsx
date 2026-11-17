"use client";

import { useEffect, useState } from "react";

export function Preloader() {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Quick, subtle entrance check
    const timeout = setTimeout(() => {
      setIsDone(true);
    }, 350);

    return () => clearTimeout(timeout);
  }, []);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B0D14] transition-opacity duration-300 ${
        isDone ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center text-center px-4">
        <span className="font-display text-xl font-semibold text-[#EEF0F5] tracking-tight">
          Festronix <span className="text-[#12A4C4] font-normal">'26</span>
        </span>
        <span className="font-mono text-xs text-[#7A8296] mt-1">
          Vardhaman College of Engineering
        </span>
      </div>
    </div>
  );
}
