import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Heart, RefreshCw, Feather, BookOpen, Compass, Film, Flower2 } from "lucide-react";
import { playGoldChime, playPorcelainClick } from "../utils/audio";

interface KintsugiCenterpieceProps {
  onOpenLetters: () => void;
  onOpenFilm?: () => void;
  onOpenBotanical?: () => void;
  totalNights: number;
}

export const KintsugiCenterpiece: React.FC<KintsugiCenterpieceProps> = ({
  onOpenLetters,
  onOpenFilm,
  onOpenBotanical,
  totalNights,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMended, setIsMended] = useState(true);
  const [isGoldFlowing, setIsGoldFlowing] = useState(false);
  const [goldLevel, setGoldLevel] = useState(100);

  // Canvas Van Gogh Starry Swirls + Golden Petals
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particles: golden dust & sakura petals
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      angle: number;
      spin: number;
      color: string;
      alpha: number;
      type: "gold" | "petal";
    }

    const particles: Particle[] = [];
    const count = Math.min(65, Math.floor(width / 22));

    for (let i = 0; i < count; i++) {
      const isPetal = i % 4 === 0;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: isPetal ? 6 + Math.random() * 6 : 1.5 + Math.random() * 2.5,
        speedY: isPetal ? 0.35 + Math.random() * 0.6 : 0.2 + Math.random() * 0.4,
        speedX: Math.sin(Math.random() * Math.PI) * 0.4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        color: isPetal
          ? ["#FAD2E1", "#FDE2E4", "#F7CAD0", "#E29578"][Math.floor(Math.random() * 4)]
          : ["#F59E0B", "#FCD34D", "#D4AF37", "#FFE600"][Math.floor(Math.random() * 4)],
        alpha: 0.2 + Math.random() * 0.6,
        type: isPetal ? "petal" : "gold",
      });
    }

    // Interactive mouse swirl
    let mouse = { x: width / 2, y: height / 2, active: false };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Van Gogh Swirl Points
    const swirls = [
      { x: width * 0.25, y: height * 0.35, r: 80, speed: 0.008, color: "rgba(212, 175, 55, 0.08)" },
      { x: width * 0.78, y: height * 0.28, r: 120, speed: -0.006, color: "rgba(34, 65, 138, 0.06)" },
      { x: width * 0.5, y: height * 0.7, r: 160, speed: 0.004, color: "rgba(245, 158, 11, 0.06)" },
    ];

    let t = 0;
    const render = () => {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Van Gogh swirling atmospheric rings
      swirls.forEach((swirl) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(swirl.x, swirl.y, swirl.r + Math.sin(t * 2) * 10, 0, Math.PI * 2);
        ctx.strokeStyle = swirl.color;
        ctx.lineWidth = 14;
        ctx.setLineDash([8, 14]);
        ctx.stroke();
        ctx.restore();
      });

      // 2. Render and drift particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(t + p.y * 0.01) * 0.6 + p.speedX;
        p.angle += p.spin;

        if (p.y > height + 20) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha;

        if (p.type === "petal") {
          // Draw delicate sakura petal
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw glowing golden shimmer
          ctx.fillStyle = p.color;
          ctx.shadowColor = "#FCD34D";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const handleMend = () => {
    playPorcelainClick();
    playGoldChime();
    setIsGoldFlowing(true);
    setIsMended(true);
    setGoldLevel((prev) => Math.min(100, prev + 20));
    setTimeout(() => {
      setIsGoldFlowing(false);
    }, 2400);
  };

  const handleToggleState = () => {
    playPorcelainClick();
    if (!isMended) {
      handleMend();
    } else {
      setIsMended(false);
    }
  };

  return (
    <div className="relative w-full min-h-[92vh] flex flex-col items-center justify-center px-4 pt-28 pb-20 select-none overflow-hidden">
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Porcelain Glaze Ambient Glow */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#FDFBF7]/80 via-[#FFF8E7]/40 to-[#FCEECB]/30 blur-3xl pointer-events-none -z-10" />

      {/* Main Kintsugi Centerpiece Container */}
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
        {/* Subtle Header Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCF9F0] border border-[#D4AF37]/40 shadow-[0_4px_16px_rgba(212,175,55,0.12)] text-[#996515] font-serif text-xs mb-6 tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] animate-spin" style={{ animationDuration: "6s" }} />
          <span>KINTSUGI HEART • 金継ぎ • REPAIRED IN LIQUID GOLD</span>
        </div>

        {/* Poetic Quote in High-Contrast Bodoni / Serif */}
        <h1 className="font-serif italic text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1B2A4A] leading-[1.1] mb-4 text-balance">
          You broke my heart <br />
          <span className="font-normal font-sans italic text-[#B8304A]">like that.</span>
        </h1>

        {/* Telugu Dedication Banner */}
        <div className="max-w-2xl px-6 py-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-[#D4AF37]/30 shadow-[0_8px_30px_rgba(27,42,74,0.06)] mb-8">
          <p className="font-serif text-[#22418A] text-sm sm:text-base font-semibold leading-relaxed">
            “Nuvvu ennisarlu nannu pagalkottina... ennisarlu na gunde ni mukkalu chesina... I can't stop loving you like this.”
          </p>
          <p className="text-xs text-[#5A6788] mt-1 italic">
            — The wound is where the molten gold enters. Over {totalNights.toLocaleString("en-IN")} nights preserved.
          </p>
        </div>

        {/* The Kintsugi Porcelain Heart with Liquid Gold Veins */}
        <div className="relative my-4 cursor-pointer group" onClick={handleMend}>
          {/* Subtle Golden Radial Glow */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#F59E0B]/20 via-[#FCD34D]/30 to-transparent blur-2xl transition-all duration-1000 ${
              isGoldFlowing ? "scale-125 opacity-100" : "scale-100 opacity-60"
            }`}
          />

          {/* SVG Porcelain Heart with Gold Seams */}
          <svg
            viewBox="0 0 320 300"
            className={`w-64 sm:w-80 md:w-96 h-auto drop-shadow-[0_20px_45px_rgba(27,42,74,0.2)] transition-transform duration-700 ${
              isMended ? "hover:scale-[1.03]" : "scale-95"
            }`}
          >
            <defs>
              {/* Porcelain Ceramic Radial Gradient */}
              <radialGradient id="porcelainGlaze" cx="35%" cy="30%" r="75%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="45%" stopColor="#FAF7EE" />
                <stop offset="85%" stopColor="#EAE4D3" />
                <stop offset="100%" stopColor="#D5CDBC" />
              </radialGradient>

              {/* Shimmering Liquid Gold Gradient */}
              <linearGradient id="liquidGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2A1" />
                <stop offset="25%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#E5A93C" />
                <stop offset="75%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#FFF4B8" />
              </linearGradient>

              {/* Gold Glow Filter */}
              <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Left Porcelain Fragment */}
            <g
              className="transition-transform duration-700 ease-out"
              style={{
                transform: isMended ? "translate(0, 0)" : "translate(-12px, -6px) rotate(-3deg)",
              }}
            >
              <path
                d="M 160,82 C 145,30 90,20 48,58 C 12,90 12,142 42,185 C 72,228 128,268 160,292 L 160,225 L 148,195 L 168,160 L 142,125 L 160,82 Z"
                fill="url(#porcelainGlaze)"
                stroke="#D5CDBC"
                strokeWidth="1.5"
              />
              {/* Ceramic Surface Highlight Specular */}
              <path
                d="M 70,55 C 100,38 135,46 148,65 C 130,68 95,80 72,110 C 60,90 62,70 70,55 Z"
                fill="white"
                opacity="0.45"
              />
            </g>

            {/* Right Porcelain Fragment */}
            <g
              className="transition-transform duration-700 ease-out"
              style={{
                transform: isMended ? "translate(0, 0)" : "translate(12px, -6px) rotate(3deg)",
              }}
            >
              <path
                d="M 160,82 C 175,30 230,20 272,58 C 308,90 308,142 278,185 C 248,228 192,268 160,292 L 160,225 L 148,195 L 168,160 L 142,125 L 160,82 Z"
                fill="url(#porcelainGlaze)"
                stroke="#D5CDBC"
                strokeWidth="1.5"
              />
              {/* Ceramic Rim Highlight */}
              <path
                d="M 250,55 C 220,38 185,46 172,65 C 190,68 225,80 248,110 C 260,90 258,70 250,55 Z"
                fill="white"
                opacity="0.4"
              />
            </g>

            {/* Molten Liquid Gold Seams (Kintsugi Gold Veins) */}
            <g filter="url(#goldGlow)">
              {/* Primary Central Gold Fracture */}
              <path
                d="M 160,35 Q 163,58 160,82 L 142,125 L 168,160 L 148,195 L 160,225 L 160,292"
                fill="none"
                stroke="url(#liquidGold)"
                strokeWidth={isGoldFlowing ? "7" : "4.5"}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-all duration-500 ${isGoldFlowing ? "animate-pulse" : ""}`}
              />

              {/* Branching Gold Vein 1 */}
              <path
                d="M 142,125 Q 115,130 92,150 Q 80,165 72,190"
                fill="none"
                stroke="url(#liquidGold)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Branching Gold Vein 2 */}
              <path
                d="M 168,160 Q 200,165 228,150 Q 242,140 254,120"
                fill="none"
                stroke="url(#liquidGold)"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Branching Gold Vein 3 */}
              <path
                d="M 148,195 Q 130,220 110,235"
                fill="none"
                stroke="url(#liquidGold)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Branching Gold Vein 4 */}
              <path
                d="M 160,82 Q 190,75 210,65"
                fill="none"
                stroke="url(#liquidGold)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              {/* Gold Droplet / Solder Beads */}
              <circle cx="160" cy="82" r="4" fill="#FFF2A1" />
              <circle cx="142" cy="125" r="4.5" fill="#FFE082" />
              <circle cx="168" cy="160" r="5" fill="#FFD700" />
              <circle cx="148" cy="195" r="4" fill="#FFE082" />
              <circle cx="160" cy="225" r="3.5" fill="#FFF2A1" />
              <circle cx="92" cy="150" r="3" fill="#FFD700" />
              <circle cx="228" cy="150" r="3" fill="#FFD700" />
            </g>

            {/* Central Monogram Embossed in Gold */}
            <text
              x="160"
              y="164"
              textAnchor="middle"
              className="font-serif italic font-black"
              fill="#996515"
              fontSize="13"
              letterSpacing="2"
              opacity="0.85"
            >
              al:na
            </text>
          </svg>

          {/* Interactive Tap Prompt */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-serif text-[#C9892B]">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Click the porcelain heart to pour molten gold</span>
          </div>
        </div>

        {/* Action Controls / Experience Navigators */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <button
            onClick={handleMend}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5A93C] text-white font-serif text-sm font-bold shadow-[0_4px_16px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_22px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mend with Liquid Gold</span>
          </button>

          <button
            onClick={onOpenLetters}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FCF9F0] hover:bg-white text-[#22418A] border border-[#22418A]/25 font-serif text-sm font-bold shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#B8304A]" />
            <span>Read Unsent Letters (101)</span>
          </button>

          {onOpenFilm && (
            <button
              onClick={onOpenFilm}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 hover:bg-white text-[#1B2A4A] border border-[#1B2A4A]/20 font-sans text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-[#22418A]" />
              <span>Director's Film Reel</span>
            </button>
          )}

          {onOpenBotanical && (
            <button
              onClick={onOpenBotanical}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 hover:bg-white text-[#1B2A4A] border border-[#1B2A4A]/20 font-sans text-xs font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Flower2 className="w-3.5 h-3.5 text-[#B8304A]" />
              <span>Herbarium &amp; Cyanotype</span>
            </button>
          )}
        </div>

        {/* Bottom Philosophy Footer */}
        <div className="mt-8 text-center max-w-lg">
          <p className="font-serif italic text-xs text-[#5A6788] leading-relaxed">
            “Kintsugi does not disguise the damage. It illuminates the history of the vessel, proclaiming that broken things are more resilient, more precious, and more beautiful.”
          </p>
        </div>
      </div>
    </div>
  );
};
