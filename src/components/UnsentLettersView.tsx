import React, { useState } from "react";
import { BookOpen, Sparkles, Heart, Clock, Search, Send, Feather } from "lucide-react";
import { playPorcelainClick } from "../utils/audio";

interface UnsentLettersViewProps {
  paragraphs: string[];
  totalDays: number;
}

export const UnsentLettersView: React.FC<UnsentLettersViewProps> = ({ paragraphs, totalDays }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChapter, setActiveChapter] = useState<number>(0);

  // Group the 101 paragraphs into 5 evocative chapters
  const chapters = [
    { title: "All Paragraphs", range: [0, paragraphs.length] },
    { title: "I. The Final Note", range: [0, 20] },
    { title: "II. Ghosts from the Past", range: [20, 45] },
    { title: "III. Kali & Kalki Within", range: [45, 70] },
    { title: "IV. Passing Cloud", range: [70, 90] },
    { title: "V. Prema Andariki Dorakadhu", range: [90, paragraphs.length] },
  ];

  const currentRange = chapters[activeChapter].range;
  const filteredParagraphs = paragraphs
    .map((text, idx) => ({ text, idx }))
    .filter(({ idx }) => idx >= currentRange[0] && idx < currentRange[1])
    .filter(({ text }) => text.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto px-4 py-28 select-text">
      {/* Vintage Airmail Envelope Container */}
      <div className="relative rounded-3xl bg-[#FCF9F0] text-[#1B2A4A] border-4 border-[#22418A]/20 shadow-[0_25px_80px_rgba(27,42,74,0.15)] overflow-hidden">
        {/* Vintage Airmail Chevron Strip */}
        <div
          className="h-3 w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #B8304A 0, #B8304A 15px, #FCF9F0 15px, #FCF9F0 25px, #22418A 25px, #22418A 40px, #FCF9F0 40px, #FCF9F0 50px)",
          }}
        />

        {/* Envelope Header & Postmark */}
        <div className="p-6 sm:p-8 border-b border-[#22418A]/15 bg-[#FCF9F0]">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Postmark Stamp */}
            <div className="border-2 border-dashed border-[#5A6788]/50 rounded-2xl p-3 text-left font-mono text-xs text-[#5A6788] rotate-[-1deg] bg-white/40 shadow-sm">
              <div className="font-bold text-[#22418A] tracking-wider uppercase">
                AIR MAIL • UNRETURNED STATIONERY
              </div>
              <div className="text-[11px]">POSTMARKED: 03 AUG 2022 • 00:00:00 IST</div>
              <div className="text-[11px] text-[#C9892B] font-bold">
                LIGHTHOUSE ARCHIVE • {totalDays.toLocaleString("en-IN")} NIGHTS
              </div>
            </div>

            {/* Embossed Wax Seal */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5A93C] text-white shadow-md font-serif text-xs font-bold">
              <Sparkles className="w-4 h-4 text-[#FFF2A1]" />
              <span>SEALED WITH GOLD • AL:NA</span>
            </div>
          </div>

          <h2 className="font-serif italic text-3xl sm:text-4xl font-bold text-[#22418A] mb-2">
            Unsent Letters • చివరి లేఖ
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#5A6788] max-w-2xl leading-relaxed">
            Written across {totalDays.toLocaleString("en-IN")} nights. Not to force an ending or demand answers,
            but to let love speak its truth before resting forever in gold.
          </p>

          {/* Telugu Heartbreak Dedication Box */}
          <div className="mt-5 p-5 rounded-2xl bg-[#EEF5F3] border-l-4 border-[#C9892B] shadow-inner space-y-1.5">
            <p className="text-[#22418A] font-serif font-bold text-sm sm:text-base leading-relaxed">
              “Nuvvu ennisarlu nannu pagalkottina... ennisarlu na gunde ni mukkalu chesina... I can't stop loving you like this.”
            </p>
            <p className="text-xs text-[#5A6788]">
              Double-tap any paragraph below to leave a golden heart.
            </p>
          </div>

          {/* Chapter Selector Tabs & Search */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playPorcelainClick();
                    setActiveChapter(idx);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-serif font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeChapter === idx
                      ? "bg-[#22418A] text-white shadow-sm"
                      : "bg-white/60 hover:bg-white text-[#5A6788] border border-[#22418A]/10"
                  }`}
                >
                  {ch.title}
                </button>
              ))}
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#5A6788]" />
              <input
                type="text"
                placeholder="Search words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/80 border border-[#22418A]/15 rounded-full pl-8 pr-3 py-1.5 text-xs text-[#1B2A4A] placeholder-[#5A6788]/60 outline-none focus:border-[#22418A]"
              />
            </div>
          </div>
        </div>

        {/* Paragraphs List */}
        <div className="p-6 sm:p-8 space-y-4 max-h-[70vh] overflow-y-auto">
          {filteredParagraphs.map(({ text, idx }) => (
            <LetterCard key={idx} text={text} index={idx} />
          ))}

          {filteredParagraphs.length === 0 && (
            <div className="py-12 text-center text-xs font-mono text-[#5A6788]">
              No memories matching "{searchQuery}".
            </div>
          )}

          {/* Letter Footer */}
          <div className="pt-8 pb-4 text-center border-t border-[#22418A]/15 space-y-3">
            <p className="text-sm font-serif italic text-[#C9892B] font-bold">
              “PREMA ANDARIKI DORAKADHU. DORIKITHE PORADALI.”
            </p>
            <p className="text-xs text-[#5A6788]">
              And I fought for it... Good luck with your journey.
            </p>
          </div>
        </div>

        {/* Vintage Bottom Airmail Chevron */}
        <div
          className="h-3 w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #B8304A 0, #B8304A 15px, #FCF9F0 15px, #FCF9F0 25px, #22418A 25px, #22418A 40px, #FCF9F0 40px, #FCF9F0 50px)",
          }}
        />
      </div>
    </div>
  );
};

function LetterCard({ text, index }: { text: string; index: number }) {
  const [likes, setLikes] = useState<number>(0);
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const handleDoubleTap = () => {
    playPorcelainClick();
    setLikes((prev) => prev + 1);
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 900);
  };

  const isHeading =
    text.startsWith("MY FINAL NOTE") ||
    text.startsWith("Sanjana,") ||
    text.startsWith("AND I FOUGHT FOR IT");

  return (
    <div
      onDoubleClick={handleDoubleTap}
      className={`relative group transition-all select-text ${
        isHeading
          ? "py-3 text-center"
          : "p-4 sm:p-5 rounded-2xl bg-white/70 hover:bg-white border border-[#22418A]/10 shadow-[0_2px_8px_rgba(27,42,74,0.03)] hover:shadow-md cursor-pointer"
      }`}
    >
      {/* Floating Animated Heart on Double Tap */}
      {showHeartAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Heart className="w-12 h-12 text-[#B8304A] fill-[#B8304A] animate-ping" />
        </div>
      )}

      {isHeading ? (
        <h3 className="font-serif italic text-xl font-bold text-[#22418A] tracking-wide">
          {text}
        </h3>
      ) : (
        <div className="space-y-2">
          <p className="text-xs sm:text-sm font-sans leading-relaxed text-[#1B2A4A]/90">
            {text}
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono text-[#5A6788]/60">#{index + 1}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDoubleTap();
              }}
              className="flex items-center gap-1 text-[11px] text-[#5A6788] hover:text-[#B8304A] transition-colors"
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  likes > 0 ? "fill-[#B8304A] text-[#B8304A]" : "text-[#5A6788]"
                }`}
              />
              {likes > 0 && <span>{likes}</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
