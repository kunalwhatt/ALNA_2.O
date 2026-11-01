import React, { useEffect, useRef, useState } from "react";
import { Compass, BookOpen, Clock, Sparkles, Feather, Heart } from "lucide-react";
import { playGoldChime, playPorcelainClick } from "../utils/audio";

interface CelestialAstrolabeHeroProps {
  elapsed: {
    y: number;
    m: number;
    d: number;
    h: string;
    mi: string;
    s: string;
    total: number;
  };
  onScrollToFolio: () => void;
  onScrollToTelemetry: () => void;
  onOpenWhisper: () => void;
}

export const CelestialAstrolabeHero: React.FC<CelestialAstrolabeHeroProps> = ({
  elapsed,
  onScrollToFolio,
  onScrollToTelemetry,
  onOpenWhisper,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHeartHealed, setIsHeartHealed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle system (floating gold leaf flecks & starlight)
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.1,
      alpha: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.02 + 0.01,
    }));

    let angle1 = 0;
    let angle2 = 0;
    let angle3 = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.44;

      // Draw subtle orbital concentric astrolabe rings
      ctx.save();
      ctx.translate(centerX, centerY);

      // Astrolabe Ring 1 (Outer Zodiac / Hour Markings)
      angle1 += 0.0012;
      ctx.save();
      ctx.rotate(angle1);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width * 0.42, 280), 0, Math.PI * 2);
      ctx.stroke();

      // Outer radial notches (24 hours)
      const outerR = Math.min(width * 0.42, 280);
      for (let i = 0; i < 24; i++) {
        const rad = (i * Math.PI) / 12;
        const x1 = Math.cos(rad) * (outerR - 5);
        const y1 = Math.sin(rad) * (outerR - 5);
        const x2 = Math.cos(rad) * outerR;
        const y2 = Math.sin(rad) * outerR;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();

      // Astrolabe Ring 2 (Middle Solstice & Constellation Points)
      angle2 -= 0.0008;
      ctx.save();
      ctx.rotate(angle2);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.28)";
      ctx.lineWidth = 0.75;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width * 0.32, 210), 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Nodes on ring 2
      for (let j = 0; j < 8; j++) {
        const nodeRad = (j * Math.PI) / 4;
        const nx = Math.cos(nodeRad) * Math.min(width * 0.32, 210);
        const ny = Math.sin(nodeRad) * Math.min(width * 0.32, 210);
        ctx.fillStyle = "rgba(212, 175, 55, 0.6)";
        ctx.beginPath();
        ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Astrolabe Ring 3 (Inner Meridian)
      angle3 += 0.0016;
      ctx.save();
      ctx.rotate(angle3);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width * 0.2, 130), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      // Draw floating gold leaf particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.pulse;
        if (p.alpha > 0.85 || p.alpha < 0.2) p.pulse *= -1;
        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleHeartHover = () => {
    if (!isHeartHealed) {
      setIsHeartHealed(true);
      playGoldChime();
    }
  };

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center overflow-hidden">
      {/* Astrolabe Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Gentle Radial Spotlight */}
      <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none z-0" />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Archival Inscription Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-cinzel text-[11px] tracking-[0.25em] font-semibold uppercase">
            TRANSMISSION RECORD · JUNE 06, 2026
          </span>
        </div>

        {/* Interactive Kintsugi Broken & Mended Porcelain Heart */}
        <div
          onMouseEnter={handleHeartHover}
          onClick={handleHeartHover}
          className="relative w-28 h-28 sm:w-36 sm:h-36 mb-8 cursor-pointer group flex items-center justify-center"
          title="The Kintsugi Heart: Repaired with 24K Liquid Gold"
        >
          {/* Subtle Golden Glow */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              isHeartHealed
                ? "bg-amber-400/25 blur-2xl scale-125"
                : "bg-amber-400/10 blur-xl group-hover:scale-110"
            }`}
          />

          {/* SVG Heart with Kintsugi Gold Veins */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-transform duration-700 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="goldVein" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2D1" />
                <stop offset="40%" stopColor="#D4AF37" />
                <stop offset="80%" stopColor="#997B28" />
                <stop offset="100%" stopColor="#FFF2D1" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Left Porcelain Shard */}
            <path
              d="M50 85 C35 72, 10 52, 10 32 C10 18, 22 10, 34 10 C42 10, 48 15, 50 20 Z"
              fill={isHeartHealed ? "#FCFAF7" : "#F4EFE6"}
              stroke="#D4AF37"
              strokeWidth="0.8"
              className="transition-colors duration-700"
            />

            {/* Right Porcelain Shard */}
            <path
              d="M50 85 C65 72, 90 52, 90 32 C90 18, 78 10, 66 10 C58 10, 52 15, 50 20 Z"
              fill={isHeartHealed ? "#FCFAF7" : "#EDE6DA"}
              stroke="#D4AF37"
              strokeWidth="0.8"
              className="transition-colors duration-700"
            />

            {/* Kintsugi Gold Fracture Seams */}
            <path
              d="M50 20 L48 35 L54 48 L46 62 L52 74 L50 85"
              fill="none"
              stroke="url(#goldVein)"
              strokeWidth={isHeartHealed ? "3.2" : "1.8"}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              className="transition-all duration-1000"
            />
            {/* Branching gold fractures */}
            <path
              d="M48 35 L36 30 M54 48 L68 44 M46 62 L32 68 M52 74 L64 78"
              fill="none"
              stroke="url(#goldVein)"
              strokeWidth={isHeartHealed ? "2" : "1.2"}
              strokeLinecap="round"
              className="transition-all duration-1000 opacity-90"
            />
          </svg>

          {/* Touch instruction hint */}
          <span className="absolute -bottom-6 font-cinzel text-[10px] tracking-widest text-[#D4AF37] uppercase opacity-75 group-hover:opacity-100 transition-opacity">
            {isHeartHealed ? "Repaired with Gold" : "Touch to Mend"}
          </span>
        </div>

        {/* Grand Quote Title */}
        <h1 className="font-bodoni italic font-bold text-3xl sm:text-5xl md:text-6xl text-[#141210] dark:text-[#F7F5EE] leading-[1.18] tracking-tight mb-6 max-w-3xl text-balance">
          “I keep the light on, in case you ever find your way back.”
        </h1>

        {/* Telugu Plaque & Inscription */}
        <div className="flex flex-col items-center gap-2 mb-10 max-w-2xl">
          <p className="font-serif text-lg sm:text-xl text-[#997B28] dark:text-[#E5C378] font-medium tracking-wide">
            “ప్రేమ అందరికీ దొరకదు. దొరికితే పోరాడాలి.”
          </p>
          <p className="font-cinzel text-xs sm:text-sm tracking-[0.18em] text-[#6B635B] dark:text-[#9E968B] uppercase">
            Love doesn’t come to everyone. When it does, you fight for it. And I fought for it.
          </p>
        </div>

        {/* Master Timekeeper Plaque */}
        <div className="w-full max-w-xl p-5 sm:p-6 rounded-2xl luxury-glass mb-10 shadow-[0_8px_30px_rgba(212,175,55,0.08)]">
          <div className="text-[10px] font-cinzel tracking-[0.25em] text-[#D4AF37] uppercase mb-3">
            TEMPORAL CONTINUUM SINCE 3RD AUGUST, 2022
          </div>
          <div className="grid grid-cols-4 gap-2 text-center divide-x divide-[#D4AF37]/20">
            <div>
              <span className="block font-bodoni font-bold text-2xl sm:text-3xl text-[#141210] dark:text-[#F7F5EE] tabular-nums">
                {elapsed.y}
              </span>
              <span className="text-[10px] tracking-wider text-[#6B635B] dark:text-[#9E968B] uppercase font-cinzel">
                Years
              </span>
            </div>
            <div>
              <span className="block font-bodoni font-bold text-2xl sm:text-3xl text-[#141210] dark:text-[#F7F5EE] tabular-nums">
                {elapsed.m}
              </span>
              <span className="text-[10px] tracking-wider text-[#6B635B] dark:text-[#9E968B] uppercase font-cinzel">
                Months
              </span>
            </div>
            <div>
              <span className="block font-bodoni font-bold text-2xl sm:text-3xl text-[#141210] dark:text-[#F7F5EE] tabular-nums">
                {elapsed.d}
              </span>
              <span className="text-[10px] tracking-wider text-[#6B635B] dark:text-[#9E968B] uppercase font-cinzel">
                Days
              </span>
            </div>
            <div>
              <span className="block font-mono font-bold text-xl sm:text-2xl text-[#D4AF37] tabular-nums pt-0.5">
                {elapsed.h}:{elapsed.mi}:{elapsed.s}
              </span>
              <span className="text-[10px] tracking-wider text-[#6B635B] dark:text-[#9E968B] uppercase font-cinzel">
                Elapsed
              </span>
            </div>
          </div>
        </div>

        {/* Haute Navigation Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => {
              playPorcelainClick();
              onScrollToFolio();
            }}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#141210] dark:bg-[#F7F5EE] text-[#FAF7F2] dark:text-[#141210] font-cinzel text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#D4AF37] dark:hover:bg-[#D4AF37] dark:hover:text-[#141210] hover:text-[#141210] transition-all shadow-[0_4px_18px_rgba(20,18,16,0.15)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.4)]"
          >
            <BookOpen className="w-4 h-4 text-[#D4AF37] dark:text-[#141210]" />
            <span>Open The 101 Chapters</span>
          </button>

          <button
            onClick={() => {
              playPorcelainClick();
              onScrollToTelemetry();
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#D4AF37]/50 text-[#141210] dark:text-[#F7F5EE] font-cinzel text-xs tracking-[0.18em] uppercase font-semibold hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all"
          >
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            <span>Observatory Telemetry</span>
          </button>

          <button
            onClick={() => {
              playPorcelainClick();
              onOpenWhisper();
            }}
            className="flex items-center gap-2 px-5 py-3.5 rounded-full border border-[#D4AF37]/30 text-[#6B635B] dark:text-[#9E968B] hover:text-[#141210] dark:hover:text-[#F7F5EE] hover:border-[#D4AF37]/60 font-cinzel text-xs tracking-[0.15em] uppercase transition-all"
          >
            <Feather className="w-4 h-4 text-[#D4AF37]" />
            <span>Leave a Whisper</span>
          </button>
        </div>
      </div>
    </section>
  );
};
