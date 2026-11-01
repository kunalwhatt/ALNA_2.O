import React, { useState, useEffect } from "react";
import {
  Shield,
  ArrowLeft,
  Clock,
  Eye,
  RefreshCw,
  Trash2,
  Users,
  MessageSquare,
  Activity,
  Terminal,
  Database,
  Radio,
} from "lucide-react";
import {
  Firestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  setDoc,
  increment,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { playPorcelainClick, playGoldChime } from "../utils/audio";

interface KeeperObservatoryProps {
  onBack: () => void;
  db: Firestore;
}

export const KeeperObservatory: React.FC<KeeperObservatoryProps> = ({ onBack, db }) => {
  const [visitorLogs, setVisitorLogs] = useState<any[]>([]);
  const [whispers, setWhispers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ visits: "…", lastVisit: null });
  const [activeTab, setActiveTab] = useState<"logs" | "whispers" | "telemetry">("logs");
  const [isResetting, setIsResetting] = useState(false);

  // 1. Listen to Global Stats
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "site", "global"), (snap) => {
      if (snap.exists()) {
        setStats(snap.data());
      }
    });
    return () => unsub();
  }, [db]);

  // 2. Listen to Visitor Logs (most recent 40)
  useEffect(() => {
    const q = query(collection(db, "visitor_logs"), orderBy("timestamp", "desc"), limit(40));
    const unsub = onSnapshot(q, (snapshot) => {
      const logs: any[] = [];
      snapshot.forEach((d) => logs.push({ id: d.id, ...d.data() }));
      setVisitorLogs(logs);
    });
    return () => unsub();
  }, [db]);

  // 3. Listen to Whispers / Messages
  useEffect(() => {
    const q = query(collection(db, "chat_messages"), orderBy("timestamp", "desc"), limit(40));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach((d) => msgs.push({ id: d.id, ...d.data() }));
      setWhispers(msgs);
    });
    return () => unsub();
  }, [db]);

  const handleIncrementVisits = async () => {
    playPorcelainClick();
    try {
      await setDoc(doc(db, "site", "global"), { visits: increment(1) }, { merge: true });
    } catch (e) {
      console.error(e);
    }
  };

  const formatDuration = (secs?: number) => {
    if (!secs) return "< 10s";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#F7F5EE] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-[#D4AF37]/25 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                playPorcelainClick();
                onBack();
              }}
              className="p-3 rounded-full border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all text-[#D4AF37]"
              title="Return to Sanctuary"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h1 className="font-bodoni font-bold text-2xl sm:text-3xl text-[#F7F5EE] tracking-tight">
                  Keeper's Executive Observatory
                </h1>
              </div>
              <p className="text-xs font-cinzel tracking-wider text-[#9E968B] uppercase">
                SANCTUARY TELEMETRY &amp; VISITOR RADAR · AUTHENTICATED
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleIncrementVisits}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#D4AF37]/40 text-xs font-cinzel uppercase text-[#D4AF37] hover:bg-[#D4AF37]/15 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Step Counter (+1)</span>
            </button>
            <button
              onClick={() => {
                playGoldChime();
                onBack();
              }}
              className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#141210] font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-[#ECC880] transition-all"
            >
              Exit Terminal
            </button>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <div className="p-6 rounded-2xl bg-[#161412] border border-[#D4AF37]/25">
            <div className="flex items-center justify-between text-[#9E968B] text-xs font-cinzel mb-2">
              <span>TOTAL SANCTUARY VISITS</span>
              <Eye className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="font-bodoni font-bold text-3xl sm:text-4xl text-[#F7F5EE] tabular-nums">
              {stats.visits ?? "…"}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#161412] border border-[#D4AF37]/25">
            <div className="flex items-center justify-between text-[#9E968B] text-xs font-cinzel mb-2">
              <span>LOGGED SESSIONS</span>
              <Users className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="font-bodoni font-bold text-3xl sm:text-4xl text-[#F7F5EE] tabular-nums">
              {visitorLogs.length}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#161412] border border-[#D4AF37]/25">
            <div className="flex items-center justify-between text-[#9E968B] text-xs font-cinzel mb-2">
              <span>WHISPER NOTES RECEIVED</span>
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="font-bodoni font-bold text-3xl sm:text-4xl text-[#F7F5EE] tabular-nums">
              {whispers.length}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#161412] border border-[#D4AF37]/25">
            <div className="flex items-center justify-between text-[#9E968B] text-xs font-cinzel mb-2">
              <span>RADAR STATUS</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-cinzel font-bold text-xl text-emerald-400 mt-1">
              Active Stream
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-3 border-b border-[#D4AF37]/20 pb-4 mb-6">
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-5 py-2 rounded-xl text-xs font-cinzel uppercase tracking-wider transition-all ${
              activeTab === "logs"
                ? "bg-[#D4AF37] text-[#141210] font-bold shadow-md"
                : "text-[#9E968B] hover:text-[#F7F5EE] hover:bg-[#D4AF37]/10"
            }`}
          >
            Visitor Duration &amp; IP Logs ({visitorLogs.length})
          </button>

          <button
            onClick={() => setActiveTab("whispers")}
            className={`px-5 py-2 rounded-xl text-xs font-cinzel uppercase tracking-wider transition-all ${
              activeTab === "whispers"
                ? "bg-[#D4AF37] text-[#141210] font-bold shadow-md"
                : "text-[#9E968B] hover:text-[#F7F5EE] hover:bg-[#D4AF37]/10"
            }`}
          >
            Whispers &amp; Transmissions ({whispers.length})
          </button>
        </div>

        {/* Tab 1: Visitor Logs Table */}
        {activeTab === "logs" && (
          <div className="rounded-2xl bg-[#161412] border border-[#D4AF37]/25 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#1C1815] text-[#D4AF37] border-b border-[#D4AF37]/20 font-cinzel uppercase">
                  <tr>
                    <th className="p-4">Visitor Node (IP)</th>
                    <th className="p-4">Dwell Duration</th>
                    <th className="p-4">Timestamp (IST)</th>
                    <th className="p-4">Client Identity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10">
                  {visitorLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-[#9E968B]">
                        No active visitor logs recorded yet in Firestore.
                      </td>
                    </tr>
                  ) : (
                    visitorLogs.map((log) => {
                      const dateStr = log.timestamp?.toDate
                        ? log.timestamp.toDate().toLocaleString("en-IN")
                        : "Just now";
                      return (
                        <tr key={log.id} className="hover:bg-[#1C1815]/50 transition-colors">
                          <td className="p-4 text-[#F7F5EE] font-semibold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                            {log.ip || "Direct Web"}
                          </td>
                          <td className="p-4 text-[#D4AF37] font-bold">
                            {formatDuration(log.durationSeconds)}
                          </td>
                          <td className="p-4 text-[#9E968B]">{dateStr}</td>
                          <td className="p-4 text-[#9E968B] max-w-xs truncate" title={log.userAgent}>
                            {log.userAgent || "Browser Client"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Whispers & Transmissions */}
        {activeTab === "whispers" && (
          <div className="space-y-4">
            {whispers.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#161412] border border-[#D4AF37]/25 text-[#9E968B]">
                No whispers received yet.
              </div>
            ) : (
              whispers.map((item) => {
                const dateStr = item.timestamp?.toDate
                  ? item.timestamp.toDate().toLocaleString("en-IN")
                  : "Just now";
                return (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl bg-[#161412] border border-[#D4AF37]/25 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-xs text-[#9E968B]">
                      <span className="font-cinzel text-[#D4AF37] uppercase font-bold">
                        {item.isAdmin ? "KEEPER TRANSMISSION" : "VISITOR WHISPER"} · {item.senderIp}
                      </span>
                      <span className="font-mono">{dateStr}</span>
                    </div>
                    <p className="text-sm font-serif text-[#F7F5EE] leading-relaxed pt-2">
                      {item.text}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
