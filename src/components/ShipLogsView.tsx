import React, { useEffect, useState } from "react";
import { Key, Radio, Shield, Clock, Eye, MapPin, RefreshCw, Lock, Sparkles, Navigation } from "lucide-react";
import { Firestore, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

interface ShipLogsViewProps {
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
  visitorIp: string;
  onOpenAdmin: () => void;
  db: Firestore;
}

export const ShipLogsView: React.FC<ShipLogsViewProps> = ({
  elapsed,
  visits,
  lastSeenRelative,
  visitorIp,
  onOpenAdmin,
  db,
}) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, "visitor_logs"), orderBy("timestamp", "desc"), limit(25));
      const unsub = onSnapshot(
        q,
        (snap) => {
          const items = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setLogs(items);
          setLoading(false);
        },
        (err) => {
          console.warn("Visitor logs listener note:", err);
          setLoading(false);
        }
      );
      return () => unsub();
    } catch (e) {
      setLoading(false);
    }
  }, [db]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-28 select-none">
      {/* Header Banner with PROMINENT KEEPER LOGIN */}
      <div className="relative mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1B2A4A] via-[#22418A] to-[#1B2A4A] text-white shadow-2xl border-2 border-[#D4AF37]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        {/* Subtle Radar Wave */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full border-4 border-white/10 pointer-events-none animate-ping" style={{ animationDuration: "4s" }} />

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FCD34D] text-xs font-mono uppercase mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#4ADE80]" />
            <span>LIGHTHOUSE RADAR &amp; TRANSMISSIONS</span>
          </div>
          <h2 className="font-serif italic text-3xl sm:text-4xl font-bold">
            Ships That Passed By The Horizon
          </h2>
          <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-xl font-sans">
            Every visitor is recorded as a ship passing the lighthouse. Total count:{" "}
            <span className="font-bold text-[#FCD34D]">
              {typeof visits === "number" ? visits.toLocaleString("en-IN") : visits}
            </span>{" "}
            ships across {elapsed.total.toLocaleString("en-IN")} nights.
          </p>
        </div>

        {/* PROMINENT KEEPER LOGIN BUTTON */}
        <div className="flex flex-col items-center sm:items-end gap-2 w-full md:w-auto">
          <button
            onClick={onOpenAdmin}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D4AF37] hover:from-[#FBBF24] hover:to-[#F59E0B] text-[#1B2A4A] font-serif text-sm font-bold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/40"
          >
            <Key className="w-4 h-4 text-[#1B2A4A]" />
            <span>Authenticate as Keeper (1811!)</span>
          </button>
          <span className="text-[10px] text-white/60 font-mono">
            Keeper authentication grants full logs &amp; controls
          </span>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white/80 border border-[#22418A]/10 shadow-sm">
          <span className="text-[10px] font-mono text-[#5A6788] uppercase block">TOTAL NIGHTS</span>
          <span className="text-2xl font-serif font-black text-[#22418A]">
            {elapsed.total.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] text-[#C9892B] block mt-0.5">since 3 Aug 2022</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-[#22418A]/10 shadow-sm">
          <span className="text-[10px] font-mono text-[#5A6788] uppercase block">TOTAL VISITS</span>
          <span className="text-2xl font-serif font-black text-[#B8304A]">
            {typeof visits === "number" ? visits.toLocaleString("en-IN") : visits}
          </span>
          <span className="text-[10px] text-[#5A6788] block mt-0.5">verified count</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-[#22418A]/10 shadow-sm">
          <span className="text-[10px] font-mono text-[#5A6788] uppercase block">LAST SEEN</span>
          <span className="text-lg font-serif font-bold text-[#1B2A4A] truncate block">
            {lastSeenRelative}
          </span>
          <span className="text-[10px] text-[#5A6788] block mt-0.5">live horizon</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-[#22418A]/10 shadow-sm">
          <span className="text-[10px] font-mono text-[#5A6788] uppercase block">YOUR CURRENT IP</span>
          <span className="text-sm font-mono font-bold text-[#22418A] truncate block">
            {visitorIp}
          </span>
          <span className="text-[10px] text-[#4ADE80] flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /> Connected
          </span>
        </div>
      </div>

      {/* Ships Passing Table / Card Stream */}
      <div className="bg-white/80 rounded-3xl border border-[#22418A]/15 shadow-md overflow-hidden">
        <div className="p-5 border-b border-[#22418A]/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#22418A]" />
            <h3 className="font-serif font-bold text-[#1B2A4A] text-base">
              Lighthouse Radar Manifest
            </h3>
          </div>
          <span className="text-xs font-mono text-[#5A6788]">
            Showing recent transmissions
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-[#5A6788] text-xs font-mono">
            <RefreshCw className="w-5 h-5 animate-spin mb-2 text-[#22418A]" />
            <span>Scanning oceanic frequencies...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-[#5A6788]">
            <span>Initial transmissions logged. New ships appear automatically.</span>
          </div>
        ) : (
          <div className="divide-y divide-[#22418A]/10 max-h-[500px] overflow-y-auto">
            {logs.map((log, index) => {
              const dateStr = log.timestamp?.toDate
                ? log.timestamp.toDate().toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "Active now";

              const dur = log.durationSeconds ? `${log.durationSeconds}s` : "First contact";

              return (
                <div
                  key={log.id || index}
                  className="p-4 hover:bg-[#FAF8F5] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#22418A]/10 text-[#22418A] flex items-center justify-center font-mono font-bold text-[10px]">
                      #{logs.length - index}
                    </div>
                    <div>
                      <div className="font-mono font-bold text-[#1B2A4A] flex items-center gap-2">
                        <span>Ship from {log.ip || "Shore"}</span>
                        {log.durationSeconds > 60 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#D97706] text-[10px] font-bold">
                            Lingered long
                          </span>
                        )}
                      </div>
                      <div className="text-[#5A6788] text-[11px] font-sans truncate max-w-sm">
                        {log.userAgent || "Desktop / Mobile"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[#5A6788] font-mono text-[11px] sm:text-right">
                    <div className="flex flex-col">
                      <span>{dateStr}</span>
                      <span className="text-[10px] text-[#22418A]">Duration: {dur}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
