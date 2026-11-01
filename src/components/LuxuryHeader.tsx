import React, { useState } from "react";
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Key,
  Shield,
  Eye,
  Radio,
  Clock,
  Compass,
} from "lucide-react";
import { toggleAmbientSoundscape, playPorcelainClick } from "../utils/audio";

interface LuxuryHeaderProps {
  elapsed: {
    y: number;
    m: number;
    d: number;
    h: string;
    mi: string;
    s: string;
    total: number;
  };
  visits: number | string;
  lastSeenRelative: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenKeeperAuth: () => void;
  onNavigateToFolio: () => void;
  onNavigateToTelemetry: () => void;
}

export const LuxuryHeader: React.FC<LuxuryHeaderProps> = ({
  elapsed,
  visits,
  lastSeenRelative,
  isDark,
  onToggleTheme,
  onOpenKeeperAuth,
  onNavigateToFolio,
  onNavigateToTelemetry,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleAudioToggle = () => {
    const active = toggleAmbientSoundscape();
    setIsPlayingAudio(active);
    playPorcelainClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#FAF7F2]/80 dark:bg-[#0D0C0B]/80 border-b border-[#D4AF37]/20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Signet / Seal */}
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={onNavigateToTelemetry}>
            {/* Spinning hairline gold halo */}
            <div className="w-11 h-11 rounded-full border border-[#D4AF37]/40 flex items-center justify-center transition-all duration-700 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              <span className="font-bodoni italic font-bold text-lg text-[#141210] dark:text-[#F7F5EE] tracking-tight">
                al<span className="text-[#D4AF37]">:</span>na
              </span>
            </div>
            {/* Subtle live indicator dot */}
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-[#D4AF37] ring-2 ring-[#FAF7F2] dark:ring-[#0D0C0B] animate-pulse" />
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="font-cinzel text-xs tracking-[0.22em] text-[#141210] dark:text-[#F7F5EE] font-semibold">
              SANCTUARY OF THE UNFORGOTTEN
            </span>
            <span className="text-[10px] tracking-wider text-[#6B635B] dark:text-[#9E968B] uppercase">
              SINCE 3RD AUGUST 2022 · TRANSMISSION 2026
            </span>
          </div>
        </div>

        {/* Center Horlogerie Chronometer */}
        <div
          onClick={onNavigateToTelemetry}
          className="cursor-pointer group flex items-center gap-3 px-4 py-2 rounded-full bg-[#FFFFFF]/70 dark:bg-[#1A1715]/70 border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all shadow-[0_2px_12px_rgba(212,175,55,0.06)]"
          title="Master Chronometer: Time elapsed since August 3, 2022"
        >
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping opacity-75" />
          <div className="flex items-baseline gap-2">
            <span className="font-bodoni font-bold text-sm sm:text-base text-[#141210] dark:text-[#F7F5EE] tracking-wide tabular-nums">
              {elapsed.total.toLocaleString()}
            </span>
            <span className="font-cinzel text-[10px] tracking-widest text-[#D4AF37] uppercase">
              DAYS
            </span>
            <span className="text-[#D4AF37]/40 font-mono text-xs">·</span>
            <span className="font-mono text-xs sm:text-sm text-[#141210] dark:text-[#F7F5EE] tabular-nums font-medium">
              {elapsed.h}:{elapsed.mi}:{elapsed.s}
            </span>
          </div>
        </div>

        {/* Right Controls & Telemetry Stats */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Telemetry Chips */}
          <div className="hidden lg:flex items-center gap-3 border-r border-[#D4AF37]/20 pr-4">
            <div className="flex flex-col text-right">
              <span className="text-[9px] uppercase tracking-widest text-[#6B635B] dark:text-[#9E968B]">
                Sanctuary Presence
              </span>
              <span className="text-xs font-mono font-semibold text-[#141210] dark:text-[#F7F5EE] flex items-center justify-end gap-1">
                <Eye className="w-3 h-3 text-[#D4AF37]" />
                {visits} visits
              </span>
            </div>

            <div className="flex flex-col text-right pl-3 border-l border-[#D4AF37]/15">
              <span className="text-[9px] uppercase tracking-widest text-[#6B635B] dark:text-[#9E968B]">
                Last Light
              </span>
              <span className="text-xs font-mono text-[#D4AF37] font-medium">
                {lastSeenRelative}
              </span>
            </div>
          </div>

          {/* Read Folio Nav */}
          <button
            onClick={onNavigateToFolio}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/40 text-[#141210] dark:text-[#F7F5EE] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] text-xs font-cinzel tracking-wider transition-all"
          >
            <span>The 101 Chapters</span>
          </button>

          {/* Soundscape Ambient Frequency */}
          <button
            onClick={handleAudioToggle}
            className={`p-2.5 rounded-full border transition-all ${
              isPlayingAudio
                ? "bg-[#D4AF37] text-[#141210] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                : "border-[#D4AF37]/30 text-[#6B635B] dark:text-[#9E968B] hover:text-[#141210] dark:hover:text-[#F7F5EE] hover:border-[#D4AF37]"
            }`}
            title={isPlayingAudio ? "Mute Harmonic Frequency" : "Play Harmonic Frequency (432Hz)"}
            aria-label="Soundscape toggle"
          >
            {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Switch (Alabaster / Obsidian) */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-full border border-[#D4AF37]/30 text-[#6B635B] dark:text-[#9E968B] hover:text-[#141210] dark:hover:text-[#F7F5EE] hover:border-[#D4AF37] transition-all"
            title={isDark ? "Switch to Alabaster Porcelain" : "Switch to Obsidian Velvet"}
            aria-label="Theme toggle"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#E5C378]" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Keeper's Private Seal Gate (Authenticated by 1811!) */}
          <button
            onClick={onOpenKeeperAuth}
            className="relative group p-2.5 rounded-full bg-[#141210] dark:bg-[#F7F5EE] text-[#D4AF37] dark:text-[#141210] border border-[#D4AF37] hover:scale-105 active:scale-95 transition-all shadow-md"
            title="Keeper's Gate"
            aria-label="Keeper access"
          >
            <Key className="w-4 h-4 transition-transform group-hover:rotate-45" />
          </button>
        </div>
      </div>
    </header>
  );
};
