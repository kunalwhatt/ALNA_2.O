import React from "react";
import { ShieldAlert, Lock, AlertTriangle, RefreshCw, EyeOff, ShieldCheck } from "lucide-react";
import { playPorcelainClick } from "../utils/audio";

interface LuxurySecurityShieldProps {
  isVpnDetected: boolean;
  vpnReason: string | null;
  captureWarning: string | null;
  isBlurred: boolean;
  onRecheckVpn: () => void;
  onBypassVpn: () => void;
}

export const LuxurySecurityShield: React.FC<LuxurySecurityShieldProps> = ({
  isVpnDetected,
  vpnReason,
  captureWarning,
  isBlurred,
  onRecheckVpn,
  onBypassVpn,
}) => {
  return (
    <>
      {/* 1. Terminal Blur Shield when focus is lost */}
      {isBlurred && (
        <div
          className="fixed inset-0 z-[9999] bg-[#0C0B0A]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none transition-opacity duration-300"
          aria-hidden="true"
        >
          <div className="w-16 h-16 rounded-full border border-[#D4AF37] flex items-center justify-center mb-5 bg-[#D4AF37]/10 shadow-[0_0_25px_rgba(212,175,55,0.3)]">
            <EyeOff className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h2 className="font-bodoni font-bold text-2xl sm:text-3xl text-[#F7F5EE] tracking-tight mb-2">
            Sanctuary Enclave Active
          </h2>
          <p className="font-cinzel text-xs tracking-[0.25em] text-[#D4AF37] uppercase max-w-sm">
            al:na · Content Shielded During Inactivity or Screen Capture Sequence
          </p>
        </div>
      )}

      {/* 2. Capture Warning Floating Toast */}
      {captureWarning && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9998] w-[90%] max-w-md animate-fade-in">
          <div className="p-4 rounded-2xl bg-[#141210]/95 border border-[#D4AF37]/60 text-[#F7F5EE] shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center flex-none">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-cinzel text-xs uppercase tracking-wider text-[#D4AF37] font-bold">
                Transmission Protected
              </div>
              <div className="text-xs text-[#9E968B] truncate">
                {captureWarning}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. VPN / Proxy Barrier Screen */}
      {isVpnDetected && (
        <div className="fixed inset-0 z-[9990] bg-[#0C0B0A]/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-[#141210] border border-[#D4AF37]/40 shadow-[0_20px_80px_rgba(0,0,0,0.8)] text-center">
            {/* Header Badge */}
            <div className="w-16 h-16 rounded-full border border-red-500/50 flex items-center justify-center mx-auto mb-6 bg-red-500/10 text-red-400">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase font-bold block mb-2">
              TRANSMISSION ENCLAVE · CODE 403-VPN
            </span>

            <h3 className="font-bodoni font-bold text-2xl sm:text-3xl text-[#F7F5EE] tracking-tight mb-4">
              Direct Connection Required
            </h3>

            <p className="font-editorial text-xs sm:text-sm text-[#9E968B] leading-relaxed mb-6">
              This sanctuary enforces direct ISP connectivity to preserve authentic chronological telemetry and tamper-proof visitor logs. VPN tunnels or datacenter proxies are restricted.
            </p>

            {vpnReason && (
              <div className="p-3 rounded-xl bg-[#1A1715] border border-[#D4AF37]/20 text-xs font-mono text-[#D4AF37] mb-6">
                <b>Flag:</b> {vpnReason}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  playPorcelainClick();
                  onRecheckVpn();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#ECC880] text-[#141210] font-cinzel text-xs tracking-wider uppercase font-bold flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-verify Connection</span>
              </button>

              <button
                onClick={() => {
                  playPorcelainClick();
                  onBypassVpn();
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#D4AF37] font-cinzel text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Direct Pass-through</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
