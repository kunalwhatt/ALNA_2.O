import React, { useEffect, useRef } from "react";
import { Key, Eye, Clock, Shield, Sparkles } from "lucide-react";
import { Typography } from "./neopop/Typography";
import { FontVariant, colorPalette, mainColors } from "./neopop/primitives";
import { NeoCard } from "./neopop/NeoCard";

interface TopBarProps {
  elapsed: {
    y: number;
    m: number;
    d: number;
    h: string;
    mi: string;
    s: string;
    total: number;
  };
  lastSeenRelative: string;
  visits: number | string;
  visitorIp: string;
  onOpenSheet: () => void;
  onOpenAdmin: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  elapsed,
  lastSeenRelative,
  visits,
  visitorIp,
  onOpenSheet,
  onOpenAdmin,
}) => {
  const visitsValRef = useRef<HTMLSpanElement>(null);
  const prevVisits = useRef<string | number>(visits);

  // Bump animation when visits count changes
  useEffect(() => {
    if (prevVisits.current !== visits && visitsValRef.current) {
      prevVisits.current = visits;
      visitsValRef.current.classList.remove("bump");
      void visitsValRef.current.offsetWidth;
      visitsValRef.current.classList.add("bump");
    }
  }, [visits]);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-3 sm:px-6 pt-3 pointer-events-none" id="top">
      <div className="max-w-6xl mx-auto flex items-start justify-between gap-3 sm:gap-6">
        {/* Brand Zone - Clean Flutter/Figma NeoPOP Lockup */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          <NeoCard
            elevation="sm"
            variant="porcelain"
            className="px-3.5 py-2 bg-[#FFFFFF] border-2 border-[#0A0D14] shadow-[3px_3px_0px_#0A0D14] flex items-center gap-2.5"
          >
            <div className="flex items-center">
              <span className="font-['Cinzel',serif] font-black text-xl sm:text-2xl tracking-tighter text-[#0A0D14]">
                al
              </span>
              <div className="flex flex-col items-center gap-0.5 mx-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8304A] animate-pulse" />
                <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
              </div>
              <span className="font-['Cinzel',serif] font-black text-xl sm:text-2xl tracking-tighter text-[#0A0D14]">
                na
              </span>
            </div>

            <div className="h-5 w-0.5 bg-[#0A0D14]/20 hidden sm:block" />

            <div className="hidden sm:flex flex-col">
              <Typography
                {...FontVariant.CapsBold10}
                color="#0A0D14"
                className="tracking-wider leading-none"
              >
                KUNAL &amp; SANJANA
              </Typography>
              <Typography
                {...FontVariant.BodyRegular12}
                color="#5A6788"
                className="text-[10px] leading-tight"
              >
                Lighthouse Station
              </Typography>
            </div>
          </NeoCard>

          {/* Keeper Terminal Button - Discreet, NO key mentioned anywhere */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAdmin();
            }}
            className="pointer-events-auto px-3 py-2 bg-[#FAF7EE] hover:bg-[#FFFFFF] border-2 border-[#0A0D14] shadow-[3px_3px_0px_#0A0D14] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center gap-1.5 cursor-pointer group"
            aria-label="Open Keeper Terminal"
          >
            <Key className="w-3.5 h-3.5 text-[#0A0D14] group-hover:rotate-12 transition-transform" />
            <Typography
              {...FontVariant.CapsBold11}
              color="#0A0D14"
              className="tracking-wider"
            >
              KEEPER
            </Typography>
          </button>
        </div>

        {/* Telemetry Island - NeoPOP 3D elevated interactive module */}
        <div className="pointer-events-auto">
          <NeoCard
            elevation="md"
            variant="porcelain"
            onClick={onOpenSheet}
            className="p-3 sm:px-4 sm:py-3 bg-[#FFFFFF] border-2 border-[#0A0D14] shadow-[4px_4px_0px_#0A0D14] min-w-[200px] sm:min-w-[340px]"
          >
            {/* Top row: Status indicator + Days counter label */}
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[#0A0D14]/15">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                <Typography
                  {...FontVariant.CapsBold10}
                  color="#5A6788"
                  className="tracking-wider"
                >
                  LIGHT KEPT BURNING
                </Typography>
              </div>
              <Typography
                {...FontVariant.CapsBold10}
                color="#0A0D14"
                className="tracking-wider hidden sm:block"
              >
                LOG MANIFEST ▾
              </Typography>
            </div>

            {/* Middle row: Big Time counter with NeoPOP Typography */}
            <div className="flex items-baseline justify-between gap-2 my-1.5">
              <div className="flex items-baseline gap-1">
                <span className="font-['Cinzel',serif] font-black text-lg sm:text-2xl text-[#0A0D14] tabular-nums tracking-tight">
                  {elapsed.y}y {elapsed.m}m {elapsed.d}d
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#5A6788] tabular-nums ml-1">
                  {elapsed.h}:{elapsed.mi}:{elapsed.s}
                </span>
              </div>
              <div className="px-1.5 py-0.5 bg-[#FAF7EE] border border-[#0A0D14]/30 text-[10px] font-mono font-bold text-[#0A0D14] shrink-0">
                {elapsed.total} NIGHTS
              </div>
            </div>

            {/* Bottom telemetry row */}
            <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-[#0A0D14]/15 text-left">
              <div>
                <Typography
                  {...FontVariant.CapsBold10}
                  color="#7B8191"
                  className="text-[9px] block leading-none mb-0.5"
                >
                  LAST SEEN
                </Typography>
                <span className="font-mono text-[11px] sm:text-xs font-bold text-[#0A0D14] truncate block">
                  {lastSeenRelative}
                </span>
              </div>

              <div className="border-l border-[#0A0D14]/15 pl-2">
                <Typography
                  {...FontVariant.CapsBold10}
                  color="#7B8191"
                  className="text-[9px] block leading-none mb-0.5"
                >
                  VISITS
                </Typography>
                <span
                  ref={visitsValRef}
                  className="font-mono text-[11px] sm:text-xs font-black text-[#0A0D14] block"
                >
                  {typeof visits === "number" ? visits.toLocaleString("en-IN") : visits}
                </span>
              </div>

              <div className="border-l border-[#0A0D14]/15 pl-2">
                <Typography
                  {...FontVariant.CapsBold10}
                  color="#7B8191"
                  className="text-[9px] block leading-none mb-0.5"
                >
                  BEACON IP
                </Typography>
                <span className="font-mono text-[11px] sm:text-xs font-bold text-[#0A0D14] truncate block">
                  {visitorIp}
                </span>
              </div>
            </div>
          </NeoCard>
        </div>
      </div>
    </header>
  );
};
