import React from "react";
import { ShieldAlert, Lock, AlertTriangle, RefreshCw, EyeOff, ShieldCheck } from "lucide-react";
import { Typography } from "./neopop/Typography";
import { FontVariant, colorPalette } from "./neopop/primitives";
import { NeoButton } from "./neopop/NeoButton";
import { NeoCard } from "./neopop/NeoCard";

interface SecurityShieldProps {
  isVpnDetected: boolean;
  vpnReason: string | null;
  captureWarning: string | null;
  isBlurred: boolean;
  onRecheckVpn: () => void;
  onBypassVpn: () => void;
}

export const SecurityShield: React.FC<SecurityShieldProps> = ({
  isVpnDetected,
  vpnReason,
  captureWarning,
  isBlurred,
  onRecheckVpn,
  onBypassVpn,
}) => {
  return (
    <>
      {/* 1. Blur / Screen Recording Shield */}
      {isBlurred && (
        <div
          className="fixed inset-0 z-[9999] bg-[#0A0D14] flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-16 h-16 border-2 border-[#D4AF37] flex items-center justify-center mb-4 bg-[#141824] shadow-[4px_4px_0px_#D4AF37]">
            <EyeOff className="w-8 h-8 text-[#FFE066]" />
          </div>
          <Typography
            {...FontVariant.HeadingBold20}
            color="#FFFFFF"
            className="tracking-wider uppercase mb-2"
          >
            Terminal Privacy Active
          </Typography>
          <Typography
            {...FontVariant.CapsBold11}
            color="#D4AF37"
            className="tracking-widest"
          >
            al:na • Content Shielded During Inactivity or Capture Attempt
          </Typography>
        </div>
      )}

      {/* 2. Capture Warning Floating Toast (When 3-finger touch or PrintScreen occurs) */}
      {captureWarning && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9998] w-[90%] max-w-md animate-in slide-in-from-top-4 duration-200">
          <NeoCard
            elevation="md"
            variant="porcelain"
            className="p-3.5 bg-[#FAF7EE] border-2 border-[#B8304A] flex items-center gap-3 shadow-[4px_4px_0px_#B8304A]"
          >
            <div className="w-9 h-9 flex-none bg-[#B8304A] text-white flex items-center justify-center border border-[#0A0D14]">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <Typography
                {...FontVariant.HeadingBold14}
                color="#B8304A"
                className="leading-tight"
              >
                Security Violation Restricted
              </Typography>
              <Typography
                {...FontVariant.BodyRegular12}
                color={colorPalette.popBlack[400]}
                className="truncate"
              >
                {captureWarning}
              </Typography>
            </div>
          </NeoCard>
        </div>
      )}

      {/* 3. VPN / Proxy Barrier Screen */}
      {isVpnDetected && (
        <div className="fixed inset-0 z-[9990] bg-[#FAF8F5]/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <NeoCard
              elevation="lg"
              variant="porcelain"
              className="p-6 sm:p-8 bg-[#FFFFFF] border-2 border-[#0A0D14] shadow-[6px_6px_0px_#0A0D14]"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b-2 border-[#0A0D14]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#B8304A] text-white flex items-center justify-center border border-[#0A0D14] shadow-[2px_2px_0px_#0A0D14]">
                    <ShieldAlert className="w-4 h-4 text-white" />
                  </div>
                  <Typography
                    {...FontVariant.CapsBold11}
                    color="#0A0D14"
                    className="font-bold tracking-widest"
                  >
                    TRANSMISSION PROTOCOL • CODE 403-VPN
                  </Typography>
                </div>
                <div className="px-2 py-0.5 border border-[#B8304A] text-[#B8304A] text-[10px] font-mono font-bold">
                  RESTRICTED
                </div>
              </div>

              {/* Title & Cirka Heading */}
              <div className="space-y-3 mb-6">
                <Typography
                  {...FontVariant.CirkaHeadingBold28}
                  color="#0A0D14"
                  className="leading-tight"
                >
                  Website cannot be accessed with VPN
                </Typography>
                <Typography
                  {...FontVariant.BodyRegular14}
                  color={colorPalette.popBlack[300]}
                  className="leading-relaxed"
                >
                  This keeper station enforces direct ISP connections to preserve authentic telemetry, visitor origin logs, and tamper-proof transmission records. Proxy networks and VPN tunnels are blocked.
                </Typography>
                {vpnReason && (
                  <div className="p-3 bg-[#FAF7EE] border border-[#0A0D14]/20 text-xs font-mono text-[#5A6788]">
                    <b>Network Flag:</b> {vpnReason}
                  </div>
                )}
              </div>

              {/* Action Buttons in Flutter/Figma NeoPOP style */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <NeoButton
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={onRecheckVpn}
                  className="flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Re-verify Connection</span>
                </NeoButton>
                <NeoButton
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={onBypassVpn}
                  className="flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Direct Pass-through</span>
                </NeoButton>
              </div>
            </NeoCard>
          </div>
        </div>
      )}
    </>
  );
};
