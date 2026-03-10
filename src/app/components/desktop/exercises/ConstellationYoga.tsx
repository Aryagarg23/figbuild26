/**
 * CONSTELLATION YOGA — Refocus Exercise C
 *
 * Renders the Constellation Yoga HTML experience inside a sandboxed iframe.
 * The outer shell handles backdrop, close button, and Friction styling.
 */

import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { FRICTION_COLORS } from "../../friction-app/friction-styles";
import { CONSTELLATION_YOGA_HTML } from "./constellation-yoga-html";

interface Props {
  onClose: () => void;
}

export function ConstellationYoga({ onClose }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Clean up any animation frames / audio when unmounting
  useEffect(() => {
    return () => {
      try {
        const iframe = iframeRef.current;
        if (iframe?.contentWindow) {
          const win = iframe.contentWindow as any;
          if (win.audioCtx) win.audioCtx.close();
        }
      } catch {
        // iframe may already be gone, ignore
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 flex items-center justify-center"
      style={{
        zIndex: 9200,
        backgroundColor: "rgba(6, 10, 18, 0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full cursor-pointer"
        style={{
          zIndex: 9300,
          backgroundColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: FRICTION_COLORS.borderSubtle,
          color: FRICTION_COLORS.textMuted,
        }}
      >
        <X size={16} />
      </button>

      {/* ── Full-bleed iframe for Constellation Yoga ── */}
      <iframe
        ref={iframeRef}
        srcDoc={CONSTELLATION_YOGA_HTML}
        title="Constellation Yoga"
        className="absolute inset-0 w-full h-full"
        style={{
          border: "none",
          borderRadius: 0,
          background: "transparent",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        sandbox="allow-scripts allow-same-origin"
        onLoad={() => setLoaded(true)}
      />
    </motion.div>
  );
}