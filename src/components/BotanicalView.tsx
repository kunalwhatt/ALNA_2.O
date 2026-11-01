import React from "react";
import { Flower2, Sun, Sparkles, Heart } from "lucide-react";

interface BotanicalViewProps {
  totalNights: number;
  onOpenLetters: () => void;
}

export const BotanicalView: React.FC<BotanicalViewProps> = ({ totalNights, onOpenLetters }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-28 select-none">
      {/* Herbarium Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EBF3EC] border border-[#4A6B53]/30 text-[#2D4A35] font-serif text-xs mb-4">
          <Flower2 className="w-3.5 h-3.5 text-[#4A6B53]" />
          <span>HERBARIUM &amp; CYANOTYPE • MONO NO AWARE • 物・の・哀・れ</span>
        </div>
        <h2 className="font-serif italic text-3xl sm:text-5xl font-bold text-[#1B2A4A] tracking-tight mb-3">
          Pressed Flowers &amp; Cyanotypes
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#5A6788] leading-relaxed">
          In Japanese aesthetics, <i>mono no aware</i> is a gentle sadness at the impermanence of things.
          Here, memories are pressed like dried blossoms between the pages of an antique journal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Vintage Herbarium Specimen Sheet */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-[#FAF6EE] border-2 border-[#D5CDBC] shadow-[0_12px_40px_rgba(27,42,74,0.06)] flex flex-col justify-between">
          {/* Washi Tape Corner */}
          <div className="absolute -top-3 left-8 w-24 h-6 bg-[#E8DFD0]/80 border border-white/60 shadow-sm rotate-[-3deg] backdrop-blur-sm" />

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#5A6788] pb-3 border-b border-[#D5CDBC]/60">
              <span>SPECIMEN NO. 1811</span>
              <span>KEPT SINCE: AUG 2022</span>
            </div>

            {/* Botanical Drawing Specimen */}
            <div className="py-6 flex flex-col items-center justify-center">
              <svg viewBox="0 0 120 180" className="w-32 h-auto text-[#4A6B53]">
                {/* Stem */}
                <path
                  d="M 60,160 Q 55,100 60,40"
                  fill="none"
                  stroke="#4A6B53"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Leaves */}
                <path d="M 58,120 Q 30,105 25,85 Q 45,95 58,110" fill="#759A7F" opacity="0.8" />
                <path d="M 60,95 Q 85,80 92,60 Q 72,70 60,85" fill="#759A7F" opacity="0.8" />
                {/* Rose Blossom */}
                <circle cx="60" cy="40" r="16" fill="#D9777F" opacity="0.85" />
                <circle cx="56" cy="36" r="10" fill="#B8304A" opacity="0.75" />
                <circle cx="63" cy="42" r="6" fill="#F4A261" opacity="0.9" />
              </svg>
              <span className="font-serif italic text-xs text-[#2D4A35] mt-2 font-bold">
                Rosa Memorabilia (The Unfading Rose)
              </span>
            </div>

            {/* Handwritten Label */}
            <div className="p-4 rounded-2xl bg-white/60 border border-[#D5CDBC] space-y-2">
              <div className="font-serif italic text-[#1B2A4A] text-sm leading-relaxed">
                “Nuvvu ennisarlu nannu pagalkottina... ennisarlu na gunde ni mukkalu chesina... I can't stop loving you like this.”
              </div>
              <div className="text-[11px] font-sans text-[#5A6788]">
                Preserved carefully over {totalNights.toLocaleString("en-IN")} nights. Love that requires no reciprocation to remain pure.
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#D5CDBC]/60 flex items-center justify-between text-[11px] font-mono text-[#5A6788]">
            <span>HERBARIUM FOLIO 01</span>
            <span className="text-[#4A6B53] font-bold">VERIFIED AUTHENTIC</span>
          </div>
        </div>

        {/* Right: Prussian Blue Cyanotype Sun Print */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-[#1A365D] text-white shadow-[0_12px_40px_rgba(26,54,93,0.3)] flex flex-col justify-between border-4 border-[#2B6CB0]/40 overflow-hidden">
          {/* Subtle cyanotype texture */}
          <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between text-xs font-mono text-[#90CDF4] pb-3 border-b border-white/15">
              <span className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-[#F6E05E]" /> CYANOTYPE SUN PRINT
              </span>
              <span>PRUSSIAN BLUE NO. 03</span>
            </div>

            {/* Ghostly Silhouette of Two Hands / Falling Blossoms */}
            <div className="py-6 flex flex-col items-center justify-center">
              <svg viewBox="0 0 160 140" className="w-40 h-auto text-white/90">
                {/* Ghostly heart silhouette */}
                <path
                  d="M 80,45 C 65,15 25,25 25,65 C 25,100 80,125 80,125 C 80,125 135,100 135,65 C 135,25 95,15 80,45 Z"
                  fill="white"
                  opacity="0.15"
                />
                {/* Golden Sun Silhouette */}
                <circle cx="80" cy="70" r="28" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                <path
                  d="M 60,70 L 100,70 M 80,50 L 80,90"
                  stroke="white"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
              </svg>
              <span className="font-mono text-xs text-[#EBF8FF] mt-2 tracking-widest uppercase">
                Silhouette of a Horizon
              </span>
            </div>

            {/* Telugu Quote in Cyanotype Style */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 space-y-2">
              <p className="font-serif italic text-white text-sm leading-relaxed">
                “PREMA ANDARIKI DORAKADHU. DORIKITHE PORADALI.”
              </p>
              <p className="text-[11px] text-[#BEE3F8]">
                Cyanotypes expose under sunlight and leave ghostly silhouettes in permanent deep blue. Even when people detach, the memory remains etched.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] font-mono text-[#90CDF4] relative z-10">
            <span>SUN EXPOSURE: 1,280+ DAYS</span>
            <span className="text-[#F6E05E] font-bold">PERMANENT IMPRINT</span>
          </div>
        </div>
      </div>

      {/* Button to Open Letters */}
      <div className="mt-10 text-center">
        <button
          onClick={onOpenLetters}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D4A35] hover:bg-[#3E6347] text-white font-serif text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#F6E05E]" />
          <span>Open the Unsent Letters Collection</span>
        </button>
      </div>
    </div>
  );
};
