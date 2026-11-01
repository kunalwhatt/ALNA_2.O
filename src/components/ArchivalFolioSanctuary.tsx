import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  Bookmark,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Share2,
  Heart,
  Quote,
} from "lucide-react";
import { playPorcelainClick, playGoldChime } from "../utils/audio";

interface ArchivalFolioSanctuaryProps {
  paragraphs: string[];
  totalDays: number;
}

export const ArchivalFolioSanctuary: React.FC<ArchivalFolioSanctuaryProps> = ({
  paragraphs,
  totalDays,
}) => {
  const [activeAct, setActiveAct] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = useState<"standard" | "editorial" | "magnified">("editorial");
  const [bookmarkedIndex, setBookmarkedIndex] = useState<number | null>(() => {
    const saved = localStorage.getItem("alna_bookmarked_paragraph");
    return saved !== null ? parseInt(saved, 10) : null;
  });

  // Act divisions across 101 paragraphs
  const acts = [
    { title: "Act I", label: "The Inevitable Fracture", range: [0, 19] },
    { title: "Act II", label: "Ghosts & Echoes of Memory", range: [20, 39] },
    { title: "Act III", label: "Kali & Kalki: The Internal War", range: [40, 59] },
    { title: "Act IV", label: "The Passing Cloud & Oneness", range: [60, 79] },
    { title: "Act V", label: "The Final Shore & Farewell", range: [80, 100] },
  ];

  const handleBookmark = (idx: number) => {
    playGoldChime();
    if (bookmarkedIndex === idx) {
      setBookmarkedIndex(null);
      localStorage.removeItem("alna_bookmarked_paragraph");
    } else {
      setBookmarkedIndex(idx);
      localStorage.setItem("alna_bookmarked_paragraph", String(idx));
    }
  };

  // Filtered paragraphs if searching
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) {
      const [start, end] = acts[activeAct].range;
      return paragraphs
        .map((text, idx) => ({ text, idx }))
        .slice(start, end + 1);
    }
    const q = searchQuery.toLowerCase();
    return paragraphs
      .map((text, idx) => ({ text, idx }))
      .filter((item) => item.text.toLowerCase().includes(q));
  }, [searchQuery, activeAct, paragraphs]);

  const fontSizeClass = {
    standard: "text-base sm:text-lg leading-relaxed",
    editorial: "text-lg sm:text-xl md:text-2xl leading-relaxed sm:leading-loose font-serif",
    magnified: "text-xl sm:text-2xl md:text-3xl leading-loose font-serif",
  }[fontSize];

  return (
    <section id="folio-sanctuary" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-cinzel tracking-[0.25em] uppercase mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ILLUMINATED FOLIO · 101 PARAGRAPHS</span>
        </div>
        <h2 className="font-bodoni font-bold text-3xl sm:text-5xl text-[#141210] dark:text-[#F7F5EE] tracking-tight mb-4">
          The Unsent Monograph
        </h2>
        <p className="font-editorial text-sm sm:text-base text-[#6B635B] dark:text-[#9E968B] max-w-xl">
          Written in dedication to Sanjana. Delivered as a lasting archival record without demand or expectation.
        </p>

        {/* Bookmark indicator if present */}
        {bookmarkedIndex !== null && (
          <button
            onClick={() => {
              const el = document.getElementById(`para-${bookmarkedIndex}`);
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37] text-xs font-mono text-[#D4AF37] rounded-full hover:bg-[#D4AF37]/25 transition-all"
          >
            <Bookmark className="w-3 h-3 fill-current" />
            <span>Resume from Paragraph #{bookmarkedIndex + 1}</span>
          </button>
        )}
      </div>

      {/* Control Bar: Acts Navigation & Search */}
      <div className="sticky top-20 z-30 mb-12 p-3 sm:p-4 rounded-2xl luxury-glass shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Acts Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {acts.map((act, i) => (
              <button
                key={i}
                onClick={() => {
                  playPorcelainClick();
                  setActiveAct(i);
                  setSearchQuery("");
                }}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-cinzel tracking-wider whitespace-nowrap transition-all ${
                  activeAct === i && !searchQuery
                    ? "bg-[#D4AF37] text-[#141210] font-bold shadow-md"
                    : "text-[#6B635B] dark:text-[#9E968B] hover:text-[#141210] dark:hover:text-[#F7F5EE] hover:bg-[#D4AF37]/10"
                }`}
              >
                <span>{act.title}</span>
                <span className="hidden sm:inline opacity-70 ml-1.5 text-[10px]">· {act.label}</span>
              </button>
            ))}
          </div>

          {/* Search & Typography scale */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-[#D4AF37]/15">
            <div className="relative flex-1 md:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]" />
              <input
                type="text"
                placeholder="Search letter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] dark:bg-[#141210] pl-8 pr-3 py-1.5 text-xs text-[#141210] dark:text-[#F7F5EE] rounded-lg border border-[#D4AF37]/25 focus:border-[#D4AF37] outline-none"
              />
            </div>

            <div className="flex items-center gap-1 border border-[#D4AF37]/20 rounded-lg p-0.5">
              {(["standard", "editorial", "magnified"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-2 py-1 text-[10px] font-mono rounded ${
                    fontSize === size
                      ? "bg-[#D4AF37] text-[#141210] font-bold"
                      : "text-[#6B635B] dark:text-[#9E968B]"
                  }`}
                  title={`Font size: ${size}`}
                >
                  {size === "standard" ? "A" : size === "editorial" ? "A+" : "A++"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Paragraphs Folio Sheet */}
      <div className="space-y-12 bg-[#FCFAF7] dark:bg-[#141210] p-6 sm:p-12 md:p-16 rounded-3xl border border-[#D4AF37]/25 shadow-[0_12px_50px_rgba(20,18,16,0.06)] dark:shadow-[0_12px_50px_rgba(0,0,0,0.4)]">
        {filteredList.length === 0 ? (
          <div className="text-center py-16">
            <Quote className="w-8 h-8 text-[#D4AF37]/40 mx-auto mb-3" />
            <p className="font-cinzel text-sm text-[#6B635B] dark:text-[#9E968B]">
              No passages found matching “{searchQuery}”
            </p>
          </div>
        ) : (
          filteredList.map(({ text, idx }) => {
            const isCallout =
              idx === 0 ||
              idx === 1 ||
              idx === 57 ||
              idx === 99 ||
              idx === 100 ||
              text.includes("PREMA ANDARIKI") ||
              text.includes("MY FINAL NOTE");

            const isBookmarked = bookmarkedIndex === idx;

            return (
              <article
                key={idx}
                id={`para-${idx}`}
                className={`relative group transition-all duration-300 ${
                  isCallout
                    ? "p-6 sm:p-8 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border-l-4 border-[#D4AF37]"
                    : "pb-8 border-b border-[#D4AF37]/15 last:border-b-0"
                } ${isBookmarked ? "ring-2 ring-[#D4AF37] p-4 rounded-xl" : ""}`}
              >
                {/* Paragraph Meta & Hallmark */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-xs tracking-widest text-[#D4AF37] font-bold">
                      FOLIO § {String(idx + 1).padStart(3, "0")}
                    </span>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-cinzel uppercase bg-[#D4AF37] text-[#141210] font-bold">
                        Preamble
                      </span>
                    )}
                    {idx === 100 && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-cinzel uppercase bg-[#D4AF37] text-[#141210] font-bold">
                        Closing Benediction
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBookmark(idx)}
                      className={`p-1.5 rounded-full border transition-all ${
                        isBookmarked
                          ? "bg-[#D4AF37] text-[#141210] border-[#D4AF37]"
                          : "border-transparent text-[#6B635B] dark:text-[#9E968B] hover:text-[#D4AF37] hover:border-[#D4AF37]/30"
                      }`}
                      title={isBookmarked ? "Remove Bookmark" : "Bookmark this passage"}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Paragraph Prose */}
                <p
                  className={`text-[#141210] dark:text-[#F7F5EE] ${fontSizeClass} ${
                    isCallout ? "font-bodoni italic font-medium" : "font-serif text-[#2C2623] dark:text-[#E8E2D5]"
                  }`}
                >
                  {text}
                </p>
              </article>
            );
          })
        )}
      </div>

      {/* Pagination Footer across Acts */}
      {!searchQuery && (
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#D4AF37]/25">
          <button
            disabled={activeAct === 0}
            onClick={() => {
              playPorcelainClick();
              setActiveAct((prev) => Math.max(0, prev - 1));
              document.getElementById("folio-sanctuary")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D4AF37]/30 text-xs font-cinzel tracking-wider text-[#141210] dark:text-[#F7F5EE] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#D4AF37]/10"
          >
            <ChevronLeft className="w-4 h-4 text-[#D4AF37]" />
            <span>Previous Act</span>
          </button>

          <span className="font-cinzel text-xs tracking-widest text-[#D4AF37]">
            {acts[activeAct].title} of V · {acts[activeAct].label}
          </span>

          <button
            disabled={activeAct === acts.length - 1}
            onClick={() => {
              playPorcelainClick();
              setActiveAct((prev) => Math.min(acts.length - 1, prev + 1));
              document.getElementById("folio-sanctuary")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D4AF37]/30 text-xs font-cinzel tracking-wider text-[#141210] dark:text-[#F7F5EE] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#D4AF37]/10"
          >
            <span>Next Act</span>
            <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      )}
    </section>
  );
};
