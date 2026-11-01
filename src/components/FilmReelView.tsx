import React from "react";
import { Film, Clapperboard, Calendar, Play, Sparkles } from "lucide-react";

interface FilmReelViewProps {
  totalNights: number;
  onOpenLetters: () => void;
}

export const FilmReelView: React.FC<FilmReelViewProps> = ({ totalNights, onOpenLetters }) => {
  const scenes = [
    {
      scene: "SCENE 01",
      take: "001",
      date: "3 August 2022",
      title: "The Opening Shot",
      desc: "Before I even knew what love truly demanded. The day my heart opened itself at a time it never opened to anyone else.",
      quote: "I never chose you because of your appearance. I believed in what I thought was an innocent soul.",
      mood: "Warm Kodak Gold",
    },
    {
      scene: "SCENE 02",
      take: "240",
      date: "Intermediate Phase",
      title: "The Long Walks & Crossing Roads",
      desc: "Coming to college just to catch a glimpse. Holding hands through the chaos of traffic. Moments that became timeless.",
      quote: "I remember my first hug. I remember holding your hand while crossing roads. Those were some of the happiest moments of my life.",
      mood: "Pale CineStill 800T",
    },
    {
      scene: "SCENE 03",
      take: "780",
      date: "The Storm",
      title: "Shadows from the Past",
      desc: "Realizing I was standing in a place already occupied by old memories. A battle between who we were and who we were becoming.",
      quote: "I held onto your words like a drowning man holds onto a piece of wood in the middle of the ocean.",
      mood: "B&W Tri-X Grain",
    },
    {
      scene: "SCENE 04",
      take: String(totalNights),
      date: "Present Day",
      title: "Kintsugi — The Final Cut",
      desc: "Putting the sword down. Not because love ended, but because every storm finds its shore. The porcelain heart repaired with gold.",
      quote: "PREMA ANDARIKI DORAKADHU. DORIKITHE PORADALI. And I fought for it.",
      mood: "Molten Gold Amber",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-28 select-none">
      {/* Clapperboard Header */}
      <div className="relative mb-12 p-6 sm:p-8 rounded-3xl bg-[#1B2A4A] text-white shadow-2xl border-4 border-[#22418A]/30 overflow-hidden">
        {/* Clapperboard Top Striped Bar */}
        <div
          className="absolute top-0 left-0 right-0 h-4"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #FAF8F5 0, #FAF8F5 20px, #1B2A4A 20px, #1B2A4A 40px)",
          }}
        />

        <div className="pt-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D4AF37] mb-1">
              <Clapperboard className="w-4 h-4" />
              <span>DIRECTOR'S ARCHIVE • 35MM PRODUCTION</span>
            </div>
            <h2 className="font-serif italic text-3xl sm:text-4xl font-bold tracking-tight">
              A Film About Two People
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6788] mt-1 font-mono">
              PRODUCTION: AL:NA • DIRECTOR: KUNAL • LEAD: SANJANA
            </p>
          </div>

          {/* Clapperboard Take Slate */}
          <div className="grid grid-cols-3 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-center font-mono">
            <div>
              <span className="text-[10px] text-[#D4AF37] block uppercase">SCENE</span>
              <span className="text-xl font-bold text-white">01</span>
            </div>
            <div className="border-x border-white/10 px-3">
              <span className="text-[10px] text-[#D4AF37] block uppercase">TAKE</span>
              <span className="text-xl font-bold text-[#FCD34D]">{totalNights}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#D4AF37] block uppercase">ROLL</span>
              <span className="text-xl font-bold text-white">2022</span>
            </div>
          </div>
        </div>
      </div>

      {/* 35mm Film Strip Reel */}
      <div className="relative border-y-8 border-[#1B2A4A] bg-[#111827] py-8 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top 35mm Sprocket Holes */}
        <div className="flex items-center justify-between px-4 pb-6 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-3 rounded-sm bg-[#FAF8F5]/30 border border-black/40 flex-none mx-2 shadow-inner"
            />
          ))}
        </div>

        {/* Film Contact Sheet Frames */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
          {scenes.map((s, idx) => (
            <div
              key={idx}
              className="relative bg-[#1E293B] border border-white/15 rounded-2xl p-6 text-white flex flex-col justify-between group hover:border-[#D4AF37] transition-all shadow-lg"
            >
              {/* Frame Label */}
              <div className="flex items-center justify-between text-xs font-mono text-[#D4AF37] pb-3 border-b border-white/10">
                <span>
                  {s.scene} • TAKE {s.take}
                </span>
                <span className="text-white/60">{s.date}</span>
              </div>

              {/* Title & Description */}
              <div className="py-4 space-y-2">
                <h3 className="font-serif italic text-xl font-bold text-[#FCD34D]">{s.title}</h3>
                <p className="text-xs text-white/80 leading-relaxed font-sans">{s.desc}</p>
                <div className="p-3 rounded-xl bg-black/40 border-l-2 border-[#D4AF37] italic font-serif text-xs text-white/90">
                  “{s.quote}”
                </div>
              </div>

              {/* Mood Filter */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
                <span>TONE: {s.mood}</span>
                <span className="text-[#D4AF37]">FRAME 00{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 35mm Sprocket Holes */}
        <div className="flex items-center justify-between px-4 pt-6 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-3 rounded-sm bg-[#FAF8F5]/30 border border-black/40 flex-none mx-2 shadow-inner"
            />
          ))}
        </div>
      </div>

      {/* Button to Open Full Note */}
      <div className="mt-8 text-center">
        <button
          onClick={onOpenLetters}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B2A4A] hover:bg-[#22418A] text-white font-serif text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#FCD34D]" />
          <span>Read the Director's Unsent Note</span>
        </button>
      </div>
    </div>
  );
};
