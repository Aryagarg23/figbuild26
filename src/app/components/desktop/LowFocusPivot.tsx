/**
 * LOW FOCUS PIVOT — State 2.4
 *
 * When Focus < 50% and Fatigue is rising, the entire OS gets a
 * backdrop-filter: blur(). A smooth overlay appears with three
 * non-intrusive intervention bubbles:
 *   - Breathe (60s expanding/contracting animation)
 *   - Posture (stretch prompt)
 *   - Audio Shift (changes mock background track)
 *
 * Clicking one and letting it play out removes the blur and returns
 * the user to the OS.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wind, Armchair, Music } from "lucide-react";

interface Props {
  focus: number;
  fatigue: number;
  onDismiss: () => void;
}

type Intervention = "breathe" | "posture" | "audio" | null;

export function LowFocusPivot({ focus, fatigue, onDismiss }: Props) {
  const [selected, setSelected] = useState<Intervention>(null);
  const [progress, setProgress] = useState(0);

  // Progress timer when an intervention is selected
  useEffect(() => {
    if (!selected) return;
    const duration = selected === "breathe" ? 12000 : selected === "posture" ? 8000 : 6000;
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(1, elapsed / duration);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(tick);
        setTimeout(onDismiss, 600);
      }
    }, 50);
    return () => clearInterval(tick);
  }, [selected, onDismiss]);

  // Blur intensity scales with how far below 50% focus is
  const blurAmount = Math.min(16, (0.50 - focus) * 40);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        zIndex: 8200,
        backdropFilter: `blur(${blurAmount}px)`,
        backgroundColor: `rgba(0, 0, 0, ${0.15 + (0.50 - focus) * 0.3})`,
        transition: "backdrop-filter 1.5s ease, background-color 1.5s ease",
      }}
    >
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="options"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Header */}
            <div className="text-center mb-2">
              <div
                className="uppercase tracking-[0.3em] mb-2"
                style={{
                  fontSize: "0.6rem",
                  color: "rgba(255, 167, 38, 0.6)",
                }}
              >
                Focus Depleting
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                Choose a micro-recovery
              </div>
            </div>

            {/* Intervention bubbles */}
            <div className="flex gap-6">
              <InterventionBubble
                icon={<Wind size={24} />}
                label="Breathe"
                sublabel="60s cycle"
                color="#38bdf8"
                onClick={() => setSelected("breathe")}
              />
              <InterventionBubble
                icon={<Armchair size={24} />}
                label="Posture"
                sublabel="Quick stretch"
                color="#a78bfa"
                onClick={() => setSelected("posture")}
              />
              <InterventionBubble
                icon={<Music size={24} />}
                label="Audio Shift"
                sublabel="Change track"
                color="#4ade80"
                onClick={() => setSelected("audio")}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Active intervention visualization */}
            {selected === "breathe" && <BreathingAnimation progress={progress} />}
            {selected === "posture" && <PosturePrompt progress={progress} />}
            {selected === "audio" && <AudioShift progress={progress} />}

            {/* Progress ring */}
            <div className="relative" style={{ width: 80, height: 80 }}>
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="2"
                />
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="rgba(255, 167, 38, 0.6)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${progress * 226} 226`}
                  transform="rotate(-90 40 40)"
                  style={{ transition: "stroke-dasharray 0.15s ease" }}
                />
              </svg>
              <div
                className="absolute inset-0 flex items-center justify-center tabular-nums"
                style={{ fontSize: "0.7rem", color: "rgba(255, 167, 38, 0.7)" }}
              >
                {Math.round(progress * 100)}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InterventionBubble({
  icon,
  label,
  sublabel,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-6 rounded-2xl cursor-pointer"
      style={{
        backgroundColor: "rgba(10, 10, 14, 0.7)",
        border: `1px solid ${color}33`,
        backdropFilter: "blur(8px)",
        minWidth: "120px",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: 56,
          height: 56,
          backgroundColor: `${color}15`,
          border: `1.5px solid ${color}40`,
          color,
        }}
      >
        {icon}
      </div>
      <div className="text-center">
        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.8)" }}>{label}</div>
        <div style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>{sublabel}</div>
      </div>
    </motion.button>
  );
}

function BreathingAnimation({ progress }: { progress: number }) {
  const phase = progress < 0.33 ? "inhale" : progress < 0.5 ? "hold" : "exhale";
  const scale = phase === "inhale" ? 1.4 : phase === "hold" ? 1.4 : 0.8;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="uppercase tracking-[0.2em]"
        style={{ fontSize: "0.55rem", color: "rgba(56, 189, 248, 0.7)" }}
      >
        Breathe with the rhythm
      </div>
      <motion.div
        animate={{ scale }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className="rounded-full"
        style={{
          width: 100,
          height: 100,
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
          border: "1.5px solid rgba(56, 189, 248, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          className="uppercase tracking-[0.15em]"
          style={{ fontSize: "0.6rem", color: "rgba(56, 189, 248, 0.8)" }}
        >
          {phase}
        </span>
      </motion.div>
    </div>
  );
}

function PosturePrompt({ progress }: { progress: number }) {
  const prompts = [
    "Roll your shoulders back",
    "Unclench your jaw",
    "Straighten your spine",
    "Relax your hands",
  ];
  const idx = Math.min(Math.floor(progress * prompts.length), prompts.length - 1);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="uppercase tracking-[0.2em]"
        style={{ fontSize: "0.55rem", color: "rgba(167, 139, 250, 0.7)" }}
      >
        Physical Reset
      </div>
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "0.85rem",
          color: "rgba(167, 139, 250, 0.9)",
          textAlign: "center",
        }}
      >
        {prompts[idx]}
      </motion.div>
    </div>
  );
}

function AudioShift({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="uppercase tracking-[0.2em]"
        style={{ fontSize: "0.55rem", color: "rgba(74, 222, 128, 0.7)" }}
      >
        Shifting Ambient Audio
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              height: [8, 8 + Math.random() * 24, 8],
              opacity: i / 12 <= progress ? [0.3, 0.8, 0.3] : 0.15,
            }}
            transition={{
              duration: 0.8 + Math.random() * 0.4,
              repeat: Infinity,
              delay: i * 0.08,
            }}
            className="rounded-full"
            style={{
              width: 3,
              backgroundColor: i / 12 <= progress ? "rgba(74, 222, 128, 0.7)" : "rgba(74, 222, 128, 0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
