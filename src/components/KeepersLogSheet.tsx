import React, { useEffect, useRef } from "react";
import { X, Clock, Eye, Radio, Sparkles, Key, Compass, Ship, Navigation } from "lucide-react";

interface KeepersLogSheetProps {
  isOpen: boolean;
  onClose: () => void;
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
  lastSeenExact: string;
  visits: number | string;
  visitorIp: string;
  onOpenAdmin: () => void;
}

export const KeepersLogSheet: React.FC<KeepersLogSheetProps> = ({
  isOpen,
  onClose,
  elapsed,
  lastSeenRelative,
  lastSeenExact,
  visits,
  visitorIp,
  onOpenAdmin,
}) => {
  const sheetRef = useRef<HTMLElement>(null);
  const startY = useRef<number | null>(null);
  const deltaY = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Touch drag to dismiss
  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    startY.current = e.clientY;
    deltaY.current = 0;
    if (sheetRef.current) {
      sheetRef.current.style.transition = "none";
      sheetRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (startY.current === null || !sheetRef.current) return;
    deltaY.current = Math.max(0, e.clientY - startY.current);
    sheetRef.current.style.transform = `translateY(${deltaY.current}px)`;
  };

  const handlePointerUp = () => {
    if (startY.current === null || !sheetRef.current) return;
    sheetRef.current.style.transition = "";
    startY.current = null;
    if (deltaY.current > 90) {
      onClose();
    } else {
      sheetRef.current.style.transform = "";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background Soft Scrim */}
      <div
        className="fixed inset-0 z-[150] bg-[#1B2A4A]/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-up Sheet in Van Gogh Warm Sunlit Glass Aesthetics */}
      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        className="fixed bottom-0 left-0 right-0 z-[160] max-w-xl mx-auto bg-[#FCFAF2]/98 text-[#1B2A4A] backdrop-blur-2xl rounded-t-[32px] border-t border-x border-[#22418A]/15 shadow-[0_-20px_50px_rgba(27,42,74,0.2)] max-h-[88dvh] overflow-y-auto overscroll-y-contain touch-pan-y flex flex-col p-6 sm:p-8 animate-in slide-in-from-bottom duration-300 font-['Plus_Jakarta_Sans',sans-serif]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {/* Grab Handle - Drag target only */}
        <div
          className="w-16 h-1.5 rounded-full bg-[#1B2A4A]/25 mx-auto mb-4 cursor-grab touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          aria-label="Drag handle"
        />

        {/* Artistic Van Gogh Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#22418A]/12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFF6D6] to-[#FCEFC4] border border-[#C9892B]/30 flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5 text-[#C9892B]" />
            </div>
            <div>
              <h2 className="font-['Bodoni_Moda',serif] font-black text-2xl sm:text-3xl text-[#22418A] tracking-tight leading-none">
                The Keeper’s Log
              </h2>
              <p className="font-['Homemade_Apple',cursive] text-xs text-[#C9892B] mt-1.5 font-bold">
                the light has stayed on since 3 August 2022
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#22418A]/8 hover:bg-[#22418A]/15 flex items-center justify-center text-[#22418A] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Elegant Sunlit Time Tiles */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 my-5">
          <div className="p-3 bg-[#FFFFFF] rounded-2xl border border-[#22418A]/12 text-center shadow-[0_2px_8px_rgba(34,65,138,0.04)] hover:border-[#F2C230] transition-colors">
            <span className="block text-2xl sm:text-3xl font-['Bodoni_Moda',serif] font-black text-[#22418A] tabular-nums leading-tight">
              {elapsed.y}
            </span>
            <span className="text-[10px] font-extrabold tracking-wider text-[#5A6788] uppercase block mt-0.5">
              Years
            </span>
          </div>

          <div className="p-3 bg-[#FFFFFF] rounded-2xl border border-[#22418A]/12 text-center shadow-[0_2px_8px_rgba(34,65,138,0.04)] hover:border-[#F2C230] transition-colors">
            <span className="block text-2xl sm:text-3xl font-['Bodoni_Moda',serif] font-black text-[#22418A] tabular-nums leading-tight">
              {elapsed.m}
            </span>
            <span className="text-[10px] font-extrabold tracking-wider text-[#5A6788] uppercase block mt-0.5">
              Months
            </span>
          </div>

          <div className="p-3 bg-[#FFFFFF] rounded-2xl border border-[#22418A]/12 text-center shadow-[0_2px_8px_rgba(34,65,138,0.04)] hover:border-[#F2C230] transition-colors">
            <span className="block text-2xl sm:text-3xl font-['Bodoni_Moda',serif] font-black text-[#22418A] tabular-nums leading-tight">
              {elapsed.d}
            </span>
            <span className="text-[10px] font-extrabold tracking-wider text-[#5A6788] uppercase block mt-0.5">
              Days
            </span>
          </div>

          <div className="p-3 bg-[#FFFFFF] rounded-2xl border border-[#22418A]/12 text-center shadow-[0_2px_8px_rgba(34,65,138,0.04)] hover:border-[#F2C230] transition-colors">
            <span className="block text-2xl sm:text-3xl font-mono font-bold text-[#1B2A4A] tabular-nums leading-tight">
              {elapsed.h}
            </span>
            <span className="text-[10px] font-extrabold tracking-wider text-[#5A6788] uppercase block mt-0.5">
              Hours
            </span>
          </div>

          <div className="p-3 bg-[#FFFFFF] rounded-2xl border border-[#22418A]/12 text-center shadow-[0_2px_8px_rgba(34,65,138,0.04)] hover:border-[#F2C230] transition-colors">
            <span className="block text-2xl sm:text-3xl font-mono font-bold text-[#1B2A4A] tabular-nums leading-tight">
              {elapsed.mi}
            </span>
            <span className="text-[10px] font-extrabold tracking-wider text-[#5A6788] uppercase block mt-0.5">
              Mins
            </span>
          </div>

          <div className="p-3 bg-[#FFFFFF] rounded-2xl border border-[#22418A]/12 text-center shadow-[0_2px_8px_rgba(34,65,138,0.04)] hover:border-[#F2C230] transition-colors">
            <span className="block text-2xl sm:text-3xl font-mono font-bold text-[#C9892B] tabular-nums leading-tight">
              {elapsed.s}
            </span>
            <span className="text-[10px] font-extrabold tracking-wider text-[#5A6788] uppercase block mt-0.5">
              Secs
            </span>
          </div>
        </div>

        {/* Warm Sunlit Golden Total Card */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FFF6D6] via-[#FCEFC4] to-[#FFF0B8] border border-[#C9892B]/25 rounded-2xl shadow-[0_4px_16px_rgba(201,137,43,0.12)] flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFFFFF]/80 border border-[#C9892B]/30 flex items-center justify-center text-[#C9892B] shadow-sm">
              <Sparkles className="w-5 h-5 text-[#C9892B]" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base text-[#1B2A4A] block">
                Nights the light stayed on
              </span>
              <span className="font-['Homemade_Apple',cursive] text-xs text-[#C9892B] font-bold block mt-0.5">
                unbroken watch from the shore
              </span>
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-['Bodoni_Moda',serif] font-black text-[#22418A] tabular-nums">
            {elapsed.total.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Refined Horizon Telemetry Card */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#22418A]/12 shadow-[0_2px_12px_rgba(34,65,138,0.05)] overflow-hidden divide-y divide-[#22418A]/10 mb-5">
          {/* Last Seen Row */}
          <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FAF7EE]/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D8EAE8] text-[#3E86A8] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#3E86A8]" />
              </div>
              <div>
                <span className="font-bold text-sm text-[#1B2A4A] block">Last seen</span>
                <span className="font-['Homemade_Apple',cursive] text-xs text-[#C9892B] block">
                  last ship on the horizon
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold font-mono text-sm text-[#1B2A4A] block">
                {lastSeenRelative}
              </span>
              {lastSeenExact && (
                <span className="text-[11px] font-mono text-[#5A6788] block mt-0.5">
                  {lastSeenExact}
                </span>
              )}
            </div>
          </div>

          {/* Visits Row */}
          <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FAF7EE]/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF4D1] text-[#C9892B] flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-[#C9892B]" />
              </div>
              <div>
                <span className="font-bold text-sm text-[#1B2A4A] block">Total Visits</span>
                <span className="font-['Homemade_Apple',cursive] text-xs text-[#C9892B] block">
                  ships that passed by
                </span>
              </div>
            </div>
            <span className="text-2xl font-['Bodoni_Moda',serif] font-black text-[#22418A] tabular-nums">
              {typeof visits === "number" ? visits.toLocaleString("en-IN") : visits}
            </span>
          </div>

          {/* Visitor IP Row */}
          <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#FAF7EE]/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F3F1] text-[#22418A] flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5 text-[#22418A]" />
              </div>
              <div>
                <span className="font-bold text-sm text-[#1B2A4A] block">Visitor IP</span>
                <span className="font-['Homemade_Apple',cursive] text-xs text-[#C9892B] block">
                  your light from the shore
                </span>
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-[#1B2A4A] px-2.5 py-1 rounded-lg bg-[#FAF7EE] border border-[#22418A]/10">
              {visitorIp}
            </span>
          </div>
        </div>

        {/* Keeper Authentication Terminal Button */}
        <div className="pt-1 flex flex-col items-center gap-2">
          <button
            onClick={() => {
              onClose();
              onOpenAdmin();
            }}
            className="w-full py-3 px-4 bg-[#22418A] hover:bg-[#1B2A4A] text-[#FFFFFF] rounded-xl font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(34,65,138,0.25)] transition-all cursor-pointer"
          >
            <Key className="w-4 h-4 text-[#F2C230]" />
            <span>Open Keeper Terminal</span>
          </button>
          <span className="text-[11px] text-[#5A6788] font-medium">
            Access requires authorization key
          </span>
        </div>
      </section>
    </>
  );
};
