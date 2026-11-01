import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Check, CheckCheck, Send, Trash2, Lock, Feather } from "lucide-react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  Firestore,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { playGoldChime, playPorcelainClick } from "./utils/audio";

const selfIps = ["122.177.241.176", "106.219.3.107"];

export const ChatWidget = ({ isAdmin, db }: { isAdmin: boolean; db: Firestore }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentIp, setCurrentIp] = useState("Unknown");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTypers, setActiveTypers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setCurrentIp(data.ip || "Unknown"))
      .catch(() => {
        fetch("https://ipinfo.io/json")
          .then((r) => r.json())
          .then((d) => setCurrentIp(d.ip || "Unknown"))
          .catch((e) => console.error("Chat IP lookup warning", e));
      });
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chat_meta", "typing"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const typers: string[] = [];
        Object.keys(data).forEach((ip) => {
          const info = data[ip];
          if (ip !== currentIp && info.isTyping) {
            if (isAdmin && !info.isAdmin && !selfIps.includes(ip)) typers.push("Visitor");
            if (!isAdmin && (info.isAdmin || selfIps.includes(ip))) typers.push("Keeper");
          }
        });
        setActiveTypers(typers);
      }
    });
    return () => unsub();
  }, [isAdmin, currentIp, db]);

  useEffect(() => {
    const q = query(collection(db, "chat_messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        msgs.push({ id: docSnap.id, ...data });

        if (!isAdmin && isOpen) {
          if (!selfIps.includes(currentIp)) {
            if (!data.seen && (data.isAdmin || selfIps.includes(data.senderIp))) {
              updateDoc(doc(db, "chat_messages", docSnap.id), { seen: true, seenAt: new Date() }).catch((e) =>
                console.error(e)
              );
            }
          }
        } else if (isAdmin && isOpen) {
          if (!data.seen && !data.isAdmin && !selfIps.includes(data.senderIp)) {
            updateDoc(doc(db, "chat_messages", docSnap.id), { seen: true, seenAt: new Date() }).catch((e) =>
              console.error(e)
            );
          }
        }
      });
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [isAdmin, currentIp, isOpen, db]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const canSend = isAdmin || !selfIps.includes(currentIp);

  const handleTyping = (val: string) => {
    setNewMessage(val);
    if (!canSend) return;

    setDoc(
      doc(db, "chat_meta", "typing"),
      {
        [currentIp]: {
          isTyping: true,
          isAdmin,
          timestamp: serverTimestamp(),
        },
      },
      { merge: true }
    ).catch((e) => console.error(e));

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setDoc(
        doc(db, "chat_meta", "typing"),
        {
          [currentIp]: {
            isTyping: false,
            isAdmin,
            timestamp: serverTimestamp(),
          },
        },
        { merge: true }
      ).catch((e) => console.error(e));
    }, 2000);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !canSend) return;
    const textToSend = newMessage.trim();
    setNewMessage("");
    playGoldChime();

    try {
      await addDoc(collection(db, "chat_messages"), {
        text: textToSend,
        timestamp: serverTimestamp(),
        seen: false,
        senderIp: currentIp,
        isAdmin: isAdmin,
      });
      setDoc(
        doc(db, "chat_meta", "typing"),
        {
          [currentIp]: {
            isTyping: false,
            isAdmin,
            timestamp: serverTimestamp(),
          },
        },
        { merge: true }
      ).catch((e) => console.error(e));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, "chat_messages", id));
    } catch (e) {
      console.error("Failed to delete message: ", e);
    }
  };

  const unreadCount = messages.filter(
    (m) =>
      !m.seen &&
      ((isAdmin && !m.isAdmin && !selfIps.includes(m.senderIp)) ||
        (!isAdmin && (m.isAdmin || selfIps.includes(m.senderIp))))
  ).length;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => {
              playPorcelainClick();
              setIsOpen(true);
            }}
            className="relative w-14 h-14 rounded-full bg-[#141210] dark:bg-[#F7F5EE] border border-[#D4AF37] text-[#D4AF37] dark:text-[#141210] shadow-[0_8px_30px_rgba(212,175,55,0.35)] flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
            aria-label="Open confidential transmission"
          >
            <Feather className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-[#D4AF37] text-[#141210] text-[10px] font-bold rounded-full border border-[#141210]">
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="w-[320px] sm:w-[380px] rounded-3xl overflow-hidden bg-[#FCFAF7] dark:bg-[#141210] border border-[#D4AF37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col font-sans"
            style={{ height: "460px" }}
          >
            {/* Header */}
            <div className="bg-[#141210] p-4 text-[#F7F5EE] flex items-center justify-between border-b border-[#D4AF37]/30">
              <div className="flex flex-col">
                <span className="font-cinzel font-bold text-xs tracking-widest text-[#D4AF37] uppercase flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#D4AF37]" />
                  Whisper Frequency
                </span>
                <span className="text-[10px] text-[#9E968B] font-mono">
                  Direct encrypted line to keeper
                </span>
              </div>
              <button
                onClick={() => {
                  playPorcelainClick();
                  setIsOpen(false);
                }}
                className="text-[#9E968B] hover:text-[#F7F5EE] p-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#FAF7F2] dark:bg-[#0D0C0B]">
              {messages.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 p-6">
                  <Feather className="w-8 h-8 text-[#D4AF37]/60 mb-2" />
                  <p className="font-cinzel text-xs text-[#6B635B] dark:text-[#9E968B]">
                    No messages yet. Send a quiet word into the sanctuary.
                  </p>
                </div>
              )}
              {messages.map((msg) => {
                const isMsgFromSelf =
                  msg.senderIp === currentIp ||
                  (isAdmin && msg.isAdmin) ||
                  (selfIps.includes(currentIp) && selfIps.includes(msg.senderIp));

                return (
                  <div key={msg.id} className={`flex flex-col ${isMsgFromSelf ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-xs sm:text-[13px] leading-relaxed relative group ${
                        isMsgFromSelf
                          ? "bg-[#D4AF37] text-[#141210] font-medium rounded-br-sm shadow-sm"
                          : "bg-[#FFFFFF] dark:bg-[#1A1715] text-[#141210] dark:text-[#F7F5EE] border border-[#D4AF37]/25 rounded-bl-sm shadow-sm font-serif"
                      }`}
                    >
                      <p className="break-words">{msg.text}</p>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className={`absolute top-1/2 -translate-y-1/2 ${
                            isMsgFromSelf ? "-left-7" : "-right-7"
                          } opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-400 hover:bg-red-950/40 rounded-full`}
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 px-1">
                      <span className="text-[9px] font-mono text-[#6B635B] dark:text-[#9E968B]">
                        {msg.timestamp
                          ? typeof msg.timestamp.toDate === "function"
                            ? msg.timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          : "Sending..."}
                      </span>
                      {isMsgFromSelf &&
                        (msg.seen ? (
                          <CheckCheck className="w-3 h-3 text-[#D4AF37]" />
                        ) : (
                          <Check className="w-3 h-3 text-[#6B635B]" />
                        ))}
                    </div>
                  </div>
                );
              })}
              {activeTypers.length > 0 && (
                <div className="flex items-center gap-2 px-1 text-xs text-[#D4AF37] font-mono italic">
                  <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping" />
                  <span>{activeTypers[0]} is transcribing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            {canSend && (
              <div className="p-3 bg-[#FCFAF7] dark:bg-[#141210] border-t border-[#D4AF37]/20 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Inscribe a confidential message..."
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-[#FAF7F2] dark:bg-[#1A1715] border border-[#D4AF37]/30 rounded-xl px-4 py-2 text-xs text-[#141210] dark:text-[#F7F5EE] placeholder-[#6B635B] outline-none focus:border-[#D4AF37]"
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className="p-2.5 rounded-xl bg-[#D4AF37] text-[#141210] hover:bg-[#ECC880] disabled:opacity-40 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
