import React, { useState } from "react";
import { Key, X, Lock, AlertTriangle, ShieldCheck } from "lucide-react";
import { playGoldChime, playPorcelainClick } from "../utils/audio";

interface KeeperVaultModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const KeeperVaultModal: React.FC<KeeperVaultModalProps> = ({ onClose, onSuccess }) => {
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = keyInput.trim().replace(/^<|>$/g, "").trim();

    // Strictly accepts 1811! or <1811!>
    if (cleanKey === "1811!" || keyInput.trim() === "<1811!>" || keyInput.trim() === "1811!") {
      playGoldChime();
      onSuccess();
    } else {
      playPorcelainClick();
      setError("Authorization cipher rejected. Sanctuary remains sealed.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#141210] border border-[#D4AF37]/40 shadow-[0_20px_70px_rgba(0,0,0,0.8)] text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#9E968B] hover:text-[#F7F5EE] hover:bg-[#D4AF37]/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Golden Emblem */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)]">
          <Key className="w-7 h-7" />
        </div>

        {/* Title */}
        <h3 className="font-bodoni font-bold text-2xl sm:text-3xl text-[#F7F5EE] tracking-tight mb-2">
          Keeper's Vault Gate
        </h3>
        <p className="font-editorial text-xs sm:text-sm text-[#9E968B] mb-8 leading-relaxed">
          Provide authorization seal to access visitor duration telemetry, encrypted correspondence logs, and transmission controls.
        </p>

        {/* Key Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="password"
              autoFocus
              placeholder="Enter Authorization Seal"
              value={keyInput}
              onChange={(e) => {
                setError("");
                setKeyInput(e.target.value);
              }}
              className="w-full bg-[#1A1715] border border-[#D4AF37]/40 rounded-xl px-4 py-3.5 text-center text-sm font-mono tracking-widest text-[#F7F5EE] placeholder-[#6B635B] outline-none focus:border-[#D4AF37] shadow-inner"
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 flex-none" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3.5 rounded-xl bg-[#D4AF37] hover:bg-[#ECC880] text-[#141210] font-cinzel text-xs tracking-[0.2em] uppercase font-bold transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:scale-[1.01] active:scale-[0.99]"
          >
            Authenticate &amp; Unlock
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#D4AF37]/15">
          <span className="font-cinzel text-[10px] tracking-widest text-[#6B635B] uppercase">
            SANCTUARY OBSERVATORY PROTOCOL · 2026
          </span>
        </div>
      </div>
    </div>
  );
};
