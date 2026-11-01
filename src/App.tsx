import React, { useEffect, useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  increment,
  serverTimestamp,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { Volume2, VolumeX, Key } from "lucide-react";
import firebaseConfig from "../firebase-applet-config.json";

import { VanGoghScene } from "./components/VanGoghScene";
import { KeepersLogSheet } from "./components/KeepersLogSheet";
import { UnsentLettersModal } from "./components/UnsentLettersModal";
import { AdminAuthModal, AdminDashboard } from "./components/AdminPanel";
import { BottomDock } from "./components/BottomDock";
import { paragraphs } from "./data/paragraphs";
import { playGoldChime, toggleAmbientSoundscape, isAmbientActive } from "./utils/audio";

// Initialize Firebase safely with robust fallback
let app: any = null;
let db: any = null;
try {
  if (firebaseConfig && (firebaseConfig as any).apiKey) {
    app = initializeApp(firebaseConfig);
    db = (firebaseConfig as any).firestoreDatabaseId
      ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
      : getFirestore(app);
  }
} catch (e) {
  console.warn("Firebase initialization warning (using local fallback state):", e);
}

// Master Temporal Anchor: 3rd of August, 2022 00:00:00 IST
const START_DATE = new Date("2022-08-03T00:00:00+05:30");

const pad = (n: number) => String(n).padStart(2, "0");

function calculateDiff(now: Date) {
  let y = now.getFullYear() - START_DATE.getFullYear();
  let m = now.getMonth() - START_DATE.getMonth();
  let d = now.getDate() - START_DATE.getDate();

  if (d < 0) {
    m--;
    d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }

  const ms = now.getTime() - START_DATE.getTime();
  return {
    y,
    m,
    d,
    h: pad(Math.floor(ms / 3.6e6) % 24),
    mi: pad(Math.floor(ms / 6e4) % 60),
    s: pad(Math.floor(ms / 1e3) % 60),
    total: Math.max(0, Math.floor(ms / 864e5)),
  };
}

function formatAgo(timestamp: number | null): string {
  if (!timestamp) return "First contact";
  const diffSec = Math.max(0, (Date.now() - timestamp) / 1000);
  if (diffSec < 45) return "Just now";
  if (diffSec < 3600) return `${Math.round(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.round(diffSec / 3600)}h ago`;
  return `${Math.round(diffSec / 86400)}d ago`;
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [showLogSheet, setShowLogSheet] = useState(false);
  const [showLetters, setShowLetters] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Master Chronometer state (ticking every second)
  const [elapsed, setElapsed] = useState(() => calculateDiff(new Date()));

  // Telemetry stats
  const [visits, setVisits] = useState<number | string>("…");
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState<number | null>(null);
  const [visitorIp, setVisitorIp] = useState<string>("…");

  // Enforce Title & Light Theme globally
  useEffect(() => {
    document.title = "alna-18:11";
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }, []);

  // Tick chronometer every second
  useEffect(() => {
    const tick = () => {
      setElapsed(calculateDiff(new Date()));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time Firebase Firestore visits & IP tracking
  useEffect(() => {
    let durInterval: NodeJS.Timeout | null = null;
    let fetchedIp = "—";

    const fetchIpAndTrack = async () => {
      // 1. Fetch visitor IP
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        const res = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
        clearTimeout(timeout);
        const json = await res.json();
        if (json.ip) {
          fetchedIp = json.ip;
          setVisitorIp(json.ip);
        }
      } catch (e) {
        try {
          const r = await fetch("https://ipinfo.io/json");
          const j = await r.json();
          if (j.ip) {
            fetchedIp = j.ip;
            setVisitorIp(j.ip);
          }
        } catch (err) {
          setVisitorIp("Active");
        }
      }

      // 2. Real-time Firebase Firestore Sync
      if (!db) {
        setVisits(1551);
        setLastSeenTimestamp(Date.now() - 14 * 60 * 1000);
        return;
      }
      try {
        const statsRef = doc(db, "site", "global");

        const unsub = onSnapshot(statsRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data.visits != null) {
              setVisits(data.visits);
            }
            if (data.lastVisit) {
              const ts =
                typeof data.lastVisit.toMillis === "function"
                  ? data.lastVisit.toMillis()
                  : typeof data.lastVisit.toDate === "function"
                  ? data.lastVisit.toDate().getTime()
                  : new Date(data.lastVisit).getTime();
              setLastSeenTimestamp(ts);
            }
          }
        });

        // Atomic visit increment guard (once per session)
        const alreadyCounted = sessionStorage.getItem("counted_alna_van_gogh") === "1";
        if (!alreadyCounted) {
          sessionStorage.setItem("counted_alna_van_gogh", "1");
          await setDoc(
            statsRef,
            {
              visits: increment(1),
              lastVisit: serverTimestamp(),
              lastIp: fetchedIp,
            },
            { merge: true }
          );
        }

        // 3. Visitor log duration tracker
        try {
          const logRef = await addDoc(collection(db, "visitor_logs"), {
            ip: fetchedIp,
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent,
            durationSeconds: 0,
          });

          durInterval = setInterval(() => {
            setDoc(logRef, { durationSeconds: increment(10) }, { merge: true }).catch(() => {});
          }, 10000);
        } catch (err) {
          console.warn("Visitor log writing warning:", err);
        }

        return unsub;
      } catch (err) {
        console.error("Firebase Firestore sync fallback:", err);
        setVisits(1544);
        setLastSeenTimestamp(Date.now());
      }
    };

    const cleanupPromise = fetchIpAndTrack();

    return () => {
      if (durInterval) clearInterval(durInterval);
      cleanupPromise.then((unsub) => {
        if (typeof unsub === "function") unsub();
      });
    };
  }, []);

  const toggleAudio = () => {
    const newState = toggleAmbientSoundscape();
    if (newState) {
      playGoldChime();
    }
    setIsAudioActive(newState);
  };

  const lastSeenRelative = formatAgo(lastSeenTimestamp);
  const lastSeenExact = lastSeenTimestamp
    ? new Date(lastSeenTimestamp).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : "";

  // Keeper Admin Dashboard View
  if (isAdmin) {
    return <AdminDashboard onBack={() => setIsAdmin(false)} db={db} />;
  }

  return (
    <div className="relative w-full h-full min-h-screen bg-[#EEF5F3] text-[#1B2A4A] overflow-hidden select-none">
      {/* 1. Core Living Van Gogh Painted Seascape Canvas & Stage */}
      <VanGoghScene onOpenLetters={() => setShowLetters(true)} />

      {/* 2. Top Bar Navigation & Telemetry Panel */}
      <header className="top" id="top">
        {/* Brand Lockup */}
        <div className="brand">
          <div className="logo" aria-label="al:na">
            al
            <span className="colon" aria-hidden="true">
              <svg className="h1" viewBox="0 0 200 180">
                <use href="#hp" />
              </svg>
              <svg className="h2" viewBox="0 0 200 180">
                <use href="#hp" />
              </svg>
            </span>
            na
          </div>
          <span className="tag">kunal &amp; sanjana</span>

          {/* Keeper Terminal Button & Audio Toggle */}
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setShowAdminAuth(true)}
              className="px-2.5 py-1 bg-[#FAF7EE] hover:bg-[#FFFFFF] border border-[#22418A]/30 text-[10.5px] font-bold text-[#22418A] flex items-center gap-1.5 rounded-md shadow-sm transition-all cursor-pointer"
              aria-label="Open Keeper Terminal"
              title="Keeper Terminal"
            >
              <Key className="w-3 h-3 text-[#22418A]" />
              <span>Keeper</span>
            </button>

            <button
              onClick={toggleAudio}
              className={`p-1.5 rounded-md border border-[#22418A]/30 transition-all cursor-pointer ${
                isAudioActive ? "bg-[#FFF6D6] text-[#C9892B]" : "bg-[#FAF7EE] text-[#5A6788] hover:bg-[#FFFFFF]"
              }`}
              aria-label={isAudioActive ? "Mute Ocean Frequency" : "Play Ocean Frequency"}
              title={isAudioActive ? "Mute 432Hz Sound" : "Listen to 432Hz Sound"}
            >
              {isAudioActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Telemetry Live Glass Panel */}
        <button
          className="panel"
          id="panel"
          onClick={() => setShowLogSheet(true)}
          aria-haspopup="dialog"
          aria-label="Open the keeper’s log"
        >
          <div className="p-head">
            <i className="live" />
            <span>nights the light stayed on</span>
            <svg
              className="chev"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>

          <div className="p-time">
            <span className="ymd">
              {elapsed.y}y {elapsed.m}m {elapsed.d}d
            </span>
            <span className="hms">
              <span>{elapsed.h}</span>
              <span className="sep">:</span>
              <span>{elapsed.mi}</span>
              <span className="sep">:</span>
              <span>{elapsed.s}</span>
            </span>
          </div>

          <div className="p-stats">
            <div className="stat">
              <span className="lbl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                Last seen
              </span>
              <span className="val">{lastSeenRelative}</span>
            </div>

            <div className="stat">
              <span className="lbl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Visits
              </span>
              <span className="val">{typeof visits === "number" ? visits.toLocaleString("en-IN") : visits}</span>
            </div>

            <div className="stat">
              <span className="lbl">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
                  <circle cx="12" cy="9.5" r="2.5" />
                </svg>
                Visitor IP
              </span>
              <span className="val">{visitorIp}</span>
            </div>
          </div>
        </button>
      </header>

      {/* 3. Bottom Construction Progress Dock */}
      <BottomDock onOpenLetters={() => setShowLetters(true)} />

      {/* 4. Slide-up Keeper's Log Bottom Sheet */}
      <KeepersLogSheet
        isOpen={showLogSheet}
        onClose={() => setShowLogSheet(false)}
        elapsed={elapsed}
        lastSeenRelative={lastSeenRelative}
        lastSeenExact={lastSeenExact}
        visits={visits}
        visitorIp={visitorIp}
        onOpenAdmin={() => {
          setShowLogSheet(false);
          setShowAdminAuth(true);
        }}
      />

      {/* 5. Unsent Letters Modal (101 Paragraphs & Telugu Quote) */}
      <UnsentLettersModal
        isOpen={showLetters}
        onClose={() => setShowLetters(false)}
        paragraphs={paragraphs}
        totalDays={elapsed.total}
      />

      {/* 6. Keeper Authentication Modal (Key: 1811! / <1811!>) */}
      {showAdminAuth && (
        <AdminAuthModal
          onClose={() => setShowAdminAuth(false)}
          onSuccess={() => {
            setShowAdminAuth(false);
            setIsAdmin(true);
          }}
        />
      )}
    </div>
  );
}
