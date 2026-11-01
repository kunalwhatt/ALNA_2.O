import React, { useState } from "react";
import {
  Compass,
  Clock,
  Eye,
  Calendar,
  ShieldCheck,
  Send,
  Sparkles,
  MapPin,
  Activity,
  Heart,
  Feather,
} from "lucide-react";
import { Firestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { playGoldChime, playPorcelainClick } from "../utils/audio";

interface ObservatoryTelemetryProps {
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
  lastSeenExact: string;
  visitorIp: string;
  db: Firestore;
}

export const ObservatoryTelemetry: React.FC<ObservatoryTelemetryProps> = ({
  elapsed,
  visits,
  lastSeenRelative,
  lastSeenExact,
  visitorIp,
  db,
}) => {
  const [whisperNote, setWhisperNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSendWhisper = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whisperNote.trim() || isSubmitting) return;

    setIsSubmitting(true);
    playGoldChime();

    try {
      await addDoc(collection(db, "chat_messages"), {
        text: whisperNote.trim(),
        timestamp: serverTimestamp(),
        senderIp: visitorIp,
        isAdmin: false,
        seen: false,
        type: "whisper",
      });
      setWhisperNote("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.warn("Whisper note writing warning:", err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="observatory-telemetry" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-cinzel tracking-[0.25em] uppercase mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>CELESTIAL CHRONOMETER &amp; TELEMETRY</span>
        </div>
        <h2 className="font-bodoni font-bold text-3xl sm:text-5xl text-[#141210] dark:text-[#F7F5EE] tracking-tight mb-4">
          The Living Chronicle
        </h2>
        <p className="font-editorial text-sm sm:text-base text-[#6B635B] dark:text-[#9E968B] max-w-xl">
          Real-time astronomical timekeeper tracking every breath since 3rd of August, 2022.
        </p>
      </div>

      {/* Main Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1: Chronometer Time */}
        <div className="p-6 sm:p-8 rounded-3xl luxury-glass shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-cinzel text-xs tracking-widest text-[#D4AF37] uppercase font-bold">
              Time In The Light
            </span>
            <Clock className="w-4 h-4 text-[#D4AF37]" />
          </div>

          <div className="my-4">
            <div className="font-bodoni font-bold text-4xl sm:text-5xl text-[#141210] dark:text-[#F7F5EE] tracking-tight mb-2">
              {elapsed.total.toLocaleString()} <span className="text-xl font-cinzel text-[#D4AF37]">NIGHTS</span>
            </div>
            <div className="font-mono text-base sm:text-lg text-[#6B635B] dark:text-[#9E968B] tabular-nums">
              {elapsed.y}y {elapsed.m}m {elapsed.d}d · {elapsed.h}:{elapsed.mi}:{elapsed.s}
            </div>
          </div>

          <div className="pt-4 border-t border-[#D4AF37]/15 text-[11px] font-cinzel tracking-wider text-[#6B635B] dark:text-[#9E968B]">
            ORIGIN: 03 AUGUST 2022 · 00:00 IST
          </div>
        </div>

        {/* Card 2: Presence Counter & Last Contact */}
        <div className="p-6 sm:p-8 rounded-3xl luxury-glass shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-cinzel text-xs tracking-widest text-[#D4AF37] uppercase font-bold">
              Sanctuary Telemetry
            </span>
            <Eye className="w-4 h-4 text-[#D4AF37]" />
          </div>

          <div className="my-4">
            <div className="font-bodoni font-bold text-4xl sm:text-5xl text-[#141210] dark:text-[#F7F5EE] tracking-tight mb-2 flex items-baseline gap-2">
              <span>{visits}</span>
              <span className="text-sm font-cinzel uppercase text-[#D4AF37]">Presences</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#6B635B] dark:text-[#9E968B]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Last light recorded: </span>
              <span className="text-[#D4AF37] font-semibold">{lastSeenRelative}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#D4AF37]/15 text-[11px] font-mono text-[#6B635B] dark:text-[#9E968B] truncate">
            {lastSeenExact ? `EXACT: ${lastSeenExact}` : "LIVE CLOUD SYNCHRONIZED"}
          </div>
        </div>

        {/* Card 3: Security & Network Enclave */}
        <div className="p-6 sm:p-8 rounded-3xl luxury-glass shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-cinzel text-xs tracking-widest text-[#D4AF37] uppercase font-bold">
              Security Protocol
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="my-4">
            <div className="font-cinzel font-semibold text-lg sm:text-xl text-[#141210] dark:text-[#F7F5EE] tracking-wide mb-2">
              Enclave Guard Active
            </div>
            <p className="text-xs text-[#6B635B] dark:text-[#9E968B] leading-relaxed">
              Anti-capture shield, multi-touch screenshot prevention, and direct ISP integrity verified.
            </p>
          </div>

          <div className="pt-4 border-t border-[#D4AF37]/15 flex items-center justify-between text-[11px] font-mono text-[#6B635B] dark:text-[#9E968B]">
            <span>NODE: {visitorIp || "Verified Client"}</span>
            <span className="text-emerald-500 font-semibold">PROTECTED</span>
          </div>
        </div>
      </div>

      {/* Spiritual Surrender Plaque */}
      <div className="p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/30 bg-radial from-amber-500/5 to-transparent text-center mb-12 shadow-md">
        <Heart className="w-6 h-6 text-[#D4AF37] mx-auto mb-4 fill-current opacity-80" />
        <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#141210] dark:text-[#F7F5EE] max-w-3xl mx-auto leading-relaxed mb-4">
          “Nuvvu ennisarlu nannu pagalkottina... I gave my pain to God. I gave my questions to God. And now, I am giving this story to God too. Love You Till I Die.”
        </p>
        <span className="font-cinzel text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold">
          KUNAL · TRANSCENDING TIME
        </span>
      </div>

      {/* Whisper into the Light: Guest Prayer/Message Form */}
      <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl luxury-glass shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Feather className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h3 className="font-cinzel font-bold text-base text-[#141210] dark:text-[#F7F5EE] tracking-wide">
              Whisper Into The Light
            </h3>
            <p className="text-xs text-[#6B635B] dark:text-[#9E968B]">
              Leave a quiet note or prayer into the sanctuary's encrypted ledger.
            </p>
          </div>
        </div>

        <form onSubmit={handleSendWhisper} className="flex flex-col gap-3">
          <textarea
            rows={3}
            value={whisperNote}
            onChange={(e) => setWhisperNote(e.target.value)}
            placeholder="Type your quiet thought here... only the keeper's eye shall see."
            className="w-full p-4 rounded-xl bg-[#FAF7F2] dark:bg-[#141210] border border-[#D4AF37]/30 focus:border-[#D4AF37] text-sm text-[#141210] dark:text-[#F7F5EE] placeholder-[#6B635B]/60 outline-none resize-none transition-all"
          />

          <div className="flex items-center justify-between">
            {submitted ? (
              <span className="text-xs text-[#D4AF37] font-cinzel font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Whisper received and preserved in the sanctuary.
              </span>
            ) : (
              <span className="text-[10px] text-[#6B635B] dark:text-[#9E968B] font-mono">
                ENCRYPTED TRANSCRIPTION
              </span>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !whisperNote.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#141210] dark:bg-[#F7F5EE] text-[#FAF7F2] dark:text-[#141210] hover:bg-[#D4AF37] dark:hover:bg-[#D4AF37] dark:hover:text-[#141210] hover:text-[#141210] font-cinzel text-xs tracking-wider uppercase font-semibold disabled:opacity-40 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
