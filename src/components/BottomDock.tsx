import React, { useEffect, useState } from "react";
import { Typography } from "./neopop/Typography";
import { FontVariant } from "./neopop/primitives";
import { NeoCard } from "./neopop/NeoCard";

interface BottomDockProps {
  onOpenLetters: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({ onOpenLetters }) => {
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPercent(34);
      return;
    }

    const timer = setTimeout(() => {
      const t0 = performance.now();
      const duration = 2200;

      const animate = (n: number) => {
        const p = Math.min(1, (n - t0) / duration);
        const ease = 1 - Math.pow(1 - p, 3);
        setPercent(Math.round(34 * ease));
        if (p < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <aside
      className="fixed bottom-4 left-3 right-3 sm:left-6 sm:right-auto z-20 max-w-sm pointer-events-auto"
      role="note"
      aria-label="Website under construction"
      title="The keeper is repainting the lighthouse. Click to read letters."
    >
      <NeoCard
        elevation="md"
        variant="porcelain"
        onClick={onOpenLetters}
        className="p-3 bg-[#FFFFFF]/95 backdrop-blur-md border-2 border-[#0A0D14] shadow-[4px_4px_0px_#0A0D14] flex items-center gap-3 cursor-pointer group"
      >
        {/* Painter's Palette & Brush Icon */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFF6D6] to-[#F7E3A0] border-2 border-[#0A0D14] flex items-center justify-center flex-none group-hover:rotate-6 transition-transform shadow-[2px_2px_0px_#0A0D14]">
          <svg viewBox="0 0 48 48" className="w-6 h-6 animate-pulse" aria-hidden="true">
            <path d="M30 4 L44 18 L24 30 L18 24Z" fill="#C9892B" />
            <path d="M18 24 L24 30 L20 34 L14 28Z" fill="#5A6788" />
            <path d="M14 28 L20 34 C16 42 8 44 4 44 C4 40 6 32 14 28Z" fill="#22418A" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <Typography {...FontVariant.HeadingBold14} color="#0A0D14" className="font-extrabold">
              Website under construction
            </Typography>
            <span className="font-mono text-xs font-black text-[#22418A] tabular-nums">
              {percent}%
            </span>
          </div>

          <p className="text-[11.5px] font-bold text-[#5A6788] truncate mt-0.5">
            The keeper is repainting the lighthouse. Letters next.
          </p>

          {/* Van Gogh cobalt & chrome progress track */}
          <div className="h-2 w-full bg-[#FAF7EE] border border-[#0A0D14] mt-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#3E86A8] via-[#22418A] to-[#F2C230] border-r border-[#0A0D14] transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </NeoCard>
    </aside>
  );
};
