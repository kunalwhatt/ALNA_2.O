import { useState, useEffect, useCallback } from "react";

export interface SecurityState {
  isVpnDetected: boolean;
  vpnReason: string | null;
  isCaptureProtected: boolean;
  captureWarning: string | null;
  isBlurred: boolean;
}

export function useSecurityShield() {
  const [isVpnDetected, setIsVpnDetected] = useState<boolean>(false);
  const [vpnReason, setVpnReason] = useState<string | null>(null);
  const [isCaptureProtected, setIsCaptureProtected] = useState<boolean>(false);
  const [captureWarning, setCaptureWarning] = useState<string | null>(null);
  const [isBlurred, setIsBlurred] = useState<boolean>(false);

  // Trigger temporary capture warning toast
  const triggerCaptureWarning = useCallback((msg: string) => {
    setCaptureWarning(msg);
    setIsCaptureProtected(true);
    setTimeout(() => {
      setCaptureWarning(null);
      setIsCaptureProtected(false);
    }, 2800);
  }, []);

  // 1. VPN & Proxy Detection Heuristic
  const checkVpnStatus = useCallback(async () => {
    try {
      // Query IP info
      const res = await fetch("https://ipapi.co/json/");
      if (res.ok) {
        const data = await res.json();
        
        const org = (data.org || "").toLowerCase();
        const asn = (data.asn || "").toLowerCase();
        
        // Common hosting / proxy / VPN providers
        const vpnKeywords = [
          "vpn", "proxy", "datacenter", "hosting", "tor", "ovh", "digitalocean",
          "amazon", "aws", "google llc", "linode", "hetzner", "m247", "packethub",
          "expressvpn", "nordvpn", "surfshark", "proton", "cloudflare warp"
        ];

        const isKnownVpnOrg = vpnKeywords.some(
          (kw) => org.includes(kw) || asn.includes(kw)
        );

        // Check timezone mismatch between device and IP
        let tzMismatch = false;
        try {
          const clientTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (data.timezone && clientTz && data.timezone !== clientTz) {
            // Mismatch might indicate VPN
            const offsetDevice = new Date().getTimezoneOffset();
            if (data.utc_offset) {
              const ipOffsetMin = parseInt(data.utc_offset) * 60;
              if (Math.abs(-offsetDevice - ipOffsetMin) > 180) {
                tzMismatch = true;
              }
            }
          }
        } catch (_) {}

        if (data.proxy || data.hosting || isKnownVpnOrg || tzMismatch) {
          setIsVpnDetected(true);
          setVpnReason(
            data.proxy
              ? "Proxy connection flagged by network security."
              : isKnownVpnOrg
              ? `Datacenter tunnel detected (${data.org || "Anonymizer"}).`
              : "Timezone routing mismatch detected."
          );
          return;
        }
      }
    } catch (e) {
      // If error or blocked by adblock, allow safe pass-through without blocking innocent users
      console.warn("VPN verification note:", e);
    }
    setIsVpnDetected(false);
    setVpnReason(null);
  }, []);

  // 2. Anti-Screenshot & Screen Capture Protection
  useEffect(() => {
    // A. Multi-touch gesture blocker (3-finger touch screenshot on Android / iOS)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length >= 3) {
        e.preventDefault();
        e.stopPropagation();
        triggerCaptureWarning("3-Finger Screenshot Gesture Blocked • al:na Protected Record");
      }
    };

    // B. Keyboard shortcuts blocker (PrintScreen, Meta+Shift+3/4/S, Ctrl+P, Ctrl+S, Inspect)
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === "PrintScreen" || e.keyCode === 44) {
        e.preventDefault();
        triggerCaptureWarning("Screen Capture Restricted • PrintScreen Disabled");
        return;
      }

      // Windows Snipping tool / Mac capture combos (Meta+Shift+3, Meta+Shift+4, Meta+Shift+5, Meta+Shift+S)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        const key = e.key.toLowerCase();
        if (key === "s" || key === "3" || key === "4" || key === "5" || key === "i" || key === "c" || key === "j") {
          e.preventDefault();
          e.stopPropagation();
          triggerCaptureWarning("Screen Snip Restricted • Transmission Protected");
          return;
        }
      }

      // Ctrl+P (Print) or Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === "p" || e.key === "s" || e.key === "u")) {
        e.preventDefault();
        triggerCaptureWarning("Document Export Restricted • Visual Record Only");
        return;
      }
    };

    // C. Window blur & visibility change protection
    // When screenshot tool opens, or window loses focus (such as Android screenshot preview or snipping tool)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsBlurred(true);
      } else {
        // Returned to window
        setIsBlurred(false);
      }
    };

    const handleBlur = () => {
      setIsBlurred(true);
    };

    const handleFocus = () => {
      setIsBlurred(false);
    };

    // Prevent context menu (right click save)
    const handleContextMenu = (e: MouseEvent) => {
      // Allow right-click on inputs only
      if ((e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
        e.preventDefault();
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("contextmenu", handleContextMenu);

    // Initial VPN check
    checkVpnStatus();

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [triggerCaptureWarning, checkVpnStatus]);

  return {
    isVpnDetected,
    vpnReason,
    isCaptureProtected,
    captureWarning,
    isBlurred,
    recheckVpn: checkVpnStatus,
    bypassVpnForSession: () => setIsVpnDetected(false),
  };
}
