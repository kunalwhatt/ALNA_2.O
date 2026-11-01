import React, { useState, useEffect, useMemo } from "react";
import {
  Lock,
  Key,
  X,
  Shield,
  RefreshCw,
  Trash2,
  ArrowLeft,
  Radio,
  Database,
  Users,
  Clock,
  AlertTriangle,
  Eye,
  ShieldCheck,
  Download,
  ArrowUpDown,
  Search,
} from "lucide-react";
import {
  Firestore,
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  deleteDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { Typography } from "./neopop/Typography";
import { FontVariant } from "./neopop/primitives";
import { NeoButton } from "./neopop/NeoButton";
import { NeoCard } from "./neopop/NeoCard";

interface AdminAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = password.trim().replace(/^<|>$/g, "").trim();
    // Strictly accept 1811! or <1811!>
    if (cleanKey === "1811!" || password.trim() === "<1811!>" || password.trim() === "1811!") {
      onSuccess();
    } else {
      setError("Incorrect authorization key. Access denied.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0A0D14]/75 backdrop-blur-md">
      <div className="w-full max-w-sm">
        <NeoCard
          elevation="lg"
          variant="porcelain"
          className="p-6 bg-[#FFFFFF] border-2 border-[#0A0D14] shadow-[6px_6px_0px_#0A0D14] flex flex-col items-center"
        >
          {/* Header Icon */}
          <div className="w-12 h-12 bg-[#0A0D14] text-[#D4AF37] border-2 border-[#0A0D14] flex items-center justify-center mb-4 shadow-[3px_3px_0px_#D4AF37]">
            <Key className="w-6 h-6" />
          </div>

          <Typography {...FontVariant.HeadingBold20} color="#0A0D14" className="text-center mb-1">
            Lighthouse Keeper Terminal
          </Typography>

          <Typography {...FontVariant.BodyRegular13} color="#5A6788" className="text-center mb-6">
            Authenticate to view all visitor transmission logs from the start
          </Typography>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="relative w-full">
              <input
                type="password"
                autoFocus
                placeholder="Enter Authorization Key"
                value={password}
                onChange={(e) => {
                  setError("");
                  setPassword(e.target.value);
                }}
                className="w-full bg-[#FAF7EE] border-2 border-[#0A0D14] px-4 py-3 text-sm text-[#0A0D14] placeholder-[#7B8191] outline-none focus:border-[#22418A] text-center font-mono font-bold tracking-widest shadow-[2px_2px_0px_#0A0D14]"
              />
            </div>

            {error && (
              <div className="p-2.5 bg-[#FDE8EC] border border-[#B8304A] flex items-center justify-center gap-1.5 text-xs text-[#B8304A] font-bold">
                <AlertTriangle className="w-4 h-4 flex-none" />
                <span>{error}</span>
              </div>
            )}

            <NeoButton type="submit" variant="primary" size="md" fullWidth className="mt-1">
              Verify &amp; Unlock
            </NeoButton>

            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#5A6788] hover:text-[#0A0D14] transition-colors py-1 cursor-pointer font-sans"
            >
              Cancel
            </button>
          </form>
        </NeoCard>
      </div>
    </div>
  );
};

interface AdminDashboardProps {
  onBack: () => void;
  db: Firestore;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack, db }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [resetting, setResetting] = useState(false);
  const [activeTab, setActiveTab] = useState<"visitors" | "telemetry">("visitors");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Default 'asc' so all logs from starting come first
  const [searchFilter, setSearchFilter] = useState("");

  // Subscribe to visitor logs & global stats (fetching ALL logs from the start)
  useEffect(() => {
    // 1. Global site telemetry
    const statsUnsub = onSnapshot(doc(db, "site", "global"), (snap) => {
      if (snap.exists()) {
        setGlobalStats(snap.data());
      }
    });

    // 2. Real-time visitor logs - ALL logs from beginning without arbitrary 50 limit
    const q = query(collection(db, "visitor_logs"), orderBy("timestamp", "asc"));
    const logsUnsub = onSnapshot(
      q,
      (snap) => {
        const fetched = snap.docs.map((docSnap, idx) => ({
          id: docSnap.id,
          sequence: idx + 1,
          ...docSnap.data(),
        }));
        setLogs(fetched);
        setLoading(false);
      },
      (err) => {
        console.warn("Logs snapshot fallback:", err);
        setLoading(false);
      }
    );

    return () => {
      statsUnsub();
      logsUnsub();
    };
  }, [db]);

  // Sorted and filtered logs
  const processedLogs = useMemo(() => {
    let result = [...logs];
    if (sortOrder === "desc") {
      result.reverse();
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      result = result.filter(
        (l) =>
          (l.ip && l.ip.toLowerCase().includes(q)) ||
          (l.userAgent && l.userAgent.toLowerCase().includes(q))
      );
    }
    return result;
  }, [logs, sortOrder, searchFilter]);

  const handleResetVisits = async () => {
    if (confirm("Reset telemetry counter to zero?")) {
      setResetting(true);
      try {
        await setDoc(doc(db, "site", "global"), { visits: 0 }, { merge: true });
      } catch (err) {
        console.error("Failed to reset:", err);
      } finally {
        setResetting(false);
      }
    }
  };

  const handleClearLogs = async () => {
    if (confirm("Purge visitor log history?")) {
      try {
        const q = query(collection(db, "visitor_logs"));
        const snap = await getDocs(q);
        const batch = snap.docs.map((d) => deleteDoc(d.ref));
        await Promise.all(batch);
      } catch (err) {
        console.error("Failed to clear logs:", err);
      }
    }
  };

  const exportCsv = () => {
    if (!logs.length) return;
    const headers = ["Index", "IP Address", "Timestamp", "Duration (seconds)", "User Agent"];
    const rows = logs.map((l) => [
      l.sequence,
      l.ip || "Unknown",
      l.timestamp
        ? new Date(l.timestamp.toDate ? l.timestamp.toDate() : l.timestamp).toISOString()
        : "",
      l.durationSeconds || 0,
      `"${(l.userAgent || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `lighthouse_all_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDuration = (sec: number | undefined) => {
    if (!sec || sec < 10) return "< 10s";
    if (sec < 60) return `${sec}s`;
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`;
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7EE] text-[#0A0D14] p-4 sm:p-8 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#0A0D14]">
          <div className="flex items-center gap-3">
            <NeoButton variant="secondary" size="sm" onClick={onBack} className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              <span>Return</span>
            </NeoButton>
            <div>
              <Typography {...FontVariant.HeadingBold20} color="#0A0D14">
                Keeper Telemetry Terminal
              </Typography>
              <Typography {...FontVariant.BodyRegular13} color="#5A6788">
                All visitor transmission logs from the very start
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NeoButton
              variant={activeTab === "visitors" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("visitors")}
            >
              All Logs ({logs.length})
            </NeoButton>
            <NeoButton
              variant={activeTab === "telemetry" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveTab("telemetry")}
            >
              Telemetry Controls
            </NeoButton>
          </div>
        </div>

        {/* Global Telemetry Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NeoCard elevation="md" variant="porcelain" className="p-4 bg-[#FFFFFF]">
            <div className="flex items-center justify-between pb-2 border-b border-[#0A0D14]/15">
              <Typography {...FontVariant.CapsBold11} color="#5A6788">
                TOTAL SHIPS / VISITS
              </Typography>
              <Eye className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="mt-3">
              <span className="font-['Cinzel',serif] text-3xl font-black text-[#0A0D14] tabular-nums">
                {globalStats?.visits ?? "—"}
              </span>
            </div>
          </NeoCard>

          <NeoCard elevation="md" variant="porcelain" className="p-4 bg-[#FFFFFF]">
            <div className="flex items-center justify-between pb-2 border-b border-[#0A0D14]/15">
              <Typography {...FontVariant.CapsBold11} color="#5A6788">
                RECORDED CONTACTS
              </Typography>
              <Users className="w-4 h-4 text-[#22418A]" />
            </div>
            <div className="mt-3 font-mono font-bold text-2xl text-[#0A0D14]">
              {logs.length} from Day 1
            </div>
          </NeoCard>

          <NeoCard elevation="md" variant="porcelain" className="p-4 bg-[#FFFFFF]">
            <div className="flex items-center justify-between pb-2 border-b border-[#0A0D14]/15">
              <Typography {...FontVariant.CapsBold11} color="#5A6788">
                TERMINAL STATUS
              </Typography>
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
              <span className="font-bold text-sm text-[#0A0D14]">Active • Full Log Mode</span>
            </div>
          </NeoCard>
        </div>

        {/* Tab 1: Visitors Log Table (All Logs from Beginning) */}
        {activeTab === "visitors" && (
          <NeoCard elevation="md" variant="porcelain" className="p-5 bg-[#FFFFFF]">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-[#0A0D14] mb-4">
              <div>
                <Typography {...FontVariant.HeadingBold18} color="#0A0D14">
                  All Visitor Transmission Logs
                </Typography>
                <Typography {...FontVariant.BodyRegular12} color="#5A6788">
                  Showing {processedLogs.length} of {logs.length} logged contacts from the beginning
                </Typography>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#5A6788]" />
                  <input
                    type="text"
                    placeholder="Filter by IP..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-8 pr-3 py-1 bg-[#FAF7EE] border border-[#0A0D14] text-xs font-mono outline-none focus:border-[#22418A]"
                  />
                </div>

                {/* Sort Order Toggle */}
                <button
                  onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
                  className="px-2.5 py-1 bg-[#FAF7EE] hover:bg-[#FFFFFF] border border-[#0A0D14] text-xs font-bold flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_#0A0D14]"
                  title="Toggle Chronological Order"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#22418A]" />
                  <span>{sortOrder === "asc" ? "From Starting (#1 first)" : "Latest First"}</span>
                </button>

                {/* Export CSV */}
                <button
                  onClick={exportCsv}
                  disabled={!logs.length}
                  className="px-2.5 py-1 bg-[#FAF7EE] hover:bg-[#FFFFFF] disabled:opacity-40 border border-[#0A0D14] text-xs font-bold flex items-center gap-1 cursor-pointer shadow-[1px_1px_0px_#0A0D14]"
                  title="Download All Logs as CSV"
                >
                  <Download className="w-3.5 h-3.5 text-[#C9892B]" />
                  <span>Export</span>
                </button>

                <NeoButton
                  variant="secondary"
                  size="sm"
                  onClick={handleClearLogs}
                  className="flex items-center gap-1 text-[#B8304A]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge</span>
                </NeoButton>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm font-mono text-[#5A6788]">
                Loading all transmission contacts from the start...
              </div>
            ) : processedLogs.length === 0 ? (
              <div className="p-8 text-center text-sm font-mono text-[#5A6788]">
                No radar contacts recorded yet.
              </div>
            ) : (
              <div
                className="overflow-x-auto max-h-[600px] overflow-y-auto overscroll-y-contain touch-pan-y"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                <table className="w-full text-left text-xs font-mono">
                  <thead className="sticky top-0 bg-[#FFFFFF] z-10">
                    <tr className="border-b-2 border-[#0A0D14] text-[#0A0D14]">
                      <th className="py-2.5 px-3"># No.</th>
                      <th className="py-2.5 px-3">IP Address</th>
                      <th className="py-2.5 px-3">Dwell Time</th>
                      <th className="py-2.5 px-3">Timestamp (IST)</th>
                      <th className="py-2.5 px-3">Client Identifier</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedLogs.map((log) => {
                      const dateStr = log.timestamp
                        ? new Date(
                            log.timestamp.toDate ? log.timestamp.toDate() : log.timestamp
                          ).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })
                        : "Initial Transmission";
                      return (
                        <tr
                          key={log.id}
                          className="border-b border-[#0A0D14]/10 hover:bg-[#FAF7EE] transition-colors"
                        >
                          <td className="py-2.5 px-3 font-bold text-[#B8304A]">#{log.sequence}</td>
                          <td className="py-2.5 px-3 font-bold text-[#0A0D14]">{log.ip || "Unknown"}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-1.5 py-0.5 bg-[#FAF7EE] border border-[#0A0D14]/20 font-bold">
                              {formatDuration(log.durationSeconds)}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[#5A6788] whitespace-nowrap">{dateStr}</td>
                          <td className="py-2.5 px-3 max-w-[220px] truncate text-[#7B8191]" title={log.userAgent}>
                            {log.userAgent || "Browser Client"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </NeoCard>
        )}

        {/* Tab 2: Telemetry Controls */}
        {activeTab === "telemetry" && (
          <NeoCard elevation="md" variant="porcelain" className="p-6 bg-[#FFFFFF] space-y-6">
            <div>
              <Typography {...FontVariant.HeadingBold18} color="#0A0D14">
                Beacon Telemetry Management
              </Typography>
              <Typography {...FontVariant.BodyRegular13} color="#5A6788">
                Reset or modify live Firestore counters
              </Typography>
            </div>

            <div className="p-4 bg-[#FAF7EE] border-2 border-[#0A0D14] space-y-3">
              <Typography {...FontVariant.HeadingBold14} color="#0A0D14">
                Reset Global Visit Counter
              </Typography>
              <Typography {...FontVariant.BodyRegular12} color="#5A6788">
                This will set the global visit count in Firestore back to 0. Use with caution.
              </Typography>
              <NeoButton
                variant="crimson"
                size="sm"
                onClick={handleResetVisits}
                disabled={resetting}
              >
                {resetting ? "Resetting..." : "Reset Counter to Zero"}
              </NeoButton>
            </div>
          </NeoCard>
        )}
      </div>
    </div>
  );
};
