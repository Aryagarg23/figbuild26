/**
 * SESSION PAGE (SCAFFOLDING)
 *
 * The live work session view inside the FrictionApp panel.
 * Shows session status and keyboard state.
 * Most scaffolding interactions are now OS-level or in the overlay sidebar.
 */

import { motion } from "motion/react";
import { useBiometrics } from "../../context/BiometricContext";
import { useKeyboard } from "../../context/KeyboardContext";
import { useSession } from "../../context/SessionContext";
import { Activity, Keyboard, Radio } from "lucide-react";
import { useEffect } from "react";

export function SessionPage() {
  const { current: biometrics } = useBiometrics();
  const { state: keyboardState, setResistance, setRGBMode, setBinaural } = useKeyboard();
  const { tasks, currentTaskIndex, sessionState } = useSession();

  const focus = biometrics.focus_percent;
  const fatigue = biometrics.fatigue_percent;

  // Drive keyboard state from biometrics
  useEffect(() => {
    if (sessionState !== "active") return;

    if (fatigue > 0.95) {
      setResistance("locked");
      setRGBMode("red-alert");
    } else if (focus > 0.90) {
      setResistance("normal");
      setRGBMode("neutral");
      setBinaural(10);
    } else if (focus < 0.30) {
      setResistance("spongy");
      setRGBMode("dim");
      setBinaural(0);
    } else if (focus >= 0.50 && focus <= 0.70) {
      setResistance(fatigue > 0.6 ? "spongy" : "normal");
      setRGBMode(fatigue > 0.6 ? "amber-glow" : "neutral");
    } else {
      setResistance("normal");
      setRGBMode("neutral");
    }
  }, [biometrics, sessionState]);

  // Determine current sub-state label
  let subStateLabel = "Active";
  let subStateColor = "var(--friction-accent-amber)";
  if (fatigue > 0.95) {
    subStateLabel = "HARD INTERCEPT";
    subStateColor = "var(--friction-accent-red)";
  } else if (focus > 0.90) {
    subStateLabel = "Invisible (Max Flow)";
    subStateColor = "var(--friction-accent-green)";
  } else if (focus < 0.20) {
    subStateLabel = "Active Recovery";
    subStateColor = "#2196f3";
  } else if (focus >= 0.50 && focus <= 0.70) {
    subStateLabel = fatigue > 0.6 ? "The Taper" : "Moderate";
    subStateColor = "var(--friction-accent-amber)";
  }

  const activeTasks = tasks.filter(t => !t.completed);
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div
      className="size-full overflow-y-auto p-6"
      style={{ backgroundColor: "var(--friction-bg-primary)" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2
          className="uppercase mb-2"
          style={{
            color: "var(--friction-accent-amber)",
            fontSize: "var(--friction-text-xs)",
            letterSpacing: "var(--friction-tracking-wide)",
          }}
        >
          Page 02 — The Scaffolding
        </h2>
        <p style={{ color: "var(--friction-text-muted)", fontSize: "0.7rem" }}>
          Live session. OS-level effects respond to your biometrics in real-time.
        </p>
      </motion.div>

      {/* Current Sub-State */}
      <div
        className="p-4 rounded-sm mb-6"
        style={{
          backgroundColor: "var(--friction-bg-secondary)",
          border: `1px solid ${subStateColor}30`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Activity size={12} style={{ color: subStateColor }} />
          <span
            className="uppercase tracking-[0.2em]"
            style={{ fontSize: "0.6rem", color: subStateColor }}
          >
            {subStateLabel}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="uppercase tracking-[0.1em] mb-1" style={{ fontSize: "0.5rem", color: "var(--friction-text-muted)" }}>Focus</div>
            <div className="tabular-nums" style={{ fontSize: "1rem", color: focus > 0.7 ? "var(--friction-accent-green)" : "var(--friction-text-primary)" }}>
              {Math.round(focus * 100)}%
            </div>
          </div>
          <div>
            <div className="uppercase tracking-[0.1em] mb-1" style={{ fontSize: "0.5rem", color: "var(--friction-text-muted)" }}>Fatigue</div>
            <div className="tabular-nums" style={{ fontSize: "1rem", color: fatigue > 0.7 ? "var(--friction-accent-red)" : "var(--friction-text-primary)" }}>
              {Math.round(fatigue * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard State */}
      <div
        className="p-4 rounded-sm mb-6"
        style={{
          backgroundColor: "var(--friction-bg-secondary)",
          border: "1px solid var(--friction-border-default)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Keyboard size={12} style={{ color: "var(--friction-text-muted)" }} />
          <span
            className="uppercase tracking-[0.2em]"
            style={{ fontSize: "0.6rem", color: "var(--friction-text-muted)" }}
          >
            Keyboard State
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="uppercase tracking-[0.1em] mb-1" style={{ fontSize: "0.5rem", color: "var(--friction-text-disabled)" }}>Resistance</div>
            <div
              className="uppercase tracking-[0.1em]"
              style={{
                fontSize: "0.65rem",
                color: keyboardState.resistance === "locked" ? "var(--friction-accent-red)" : "var(--friction-text-primary)",
              }}
            >
              {keyboardState.resistance}
            </div>
          </div>
          <div>
            <div className="uppercase tracking-[0.1em] mb-1" style={{ fontSize: "0.5rem", color: "var(--friction-text-disabled)" }}>RGB</div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    keyboardState.rgbMode === "red-alert" ? "#ff3b30" :
                    keyboardState.rgbMode === "amber-glow" ? "#ffa726" :
                    keyboardState.rgbMode === "dim" ? "#444" :
                    "#888",
                }}
              />
              <span style={{ fontSize: "0.65rem", color: "var(--friction-text-primary)" }}>
                {keyboardState.rgbMode}
              </span>
            </div>
          </div>
          <div>
            <div className="uppercase tracking-[0.1em] mb-1" style={{ fontSize: "0.5rem", color: "var(--friction-text-disabled)" }}>Binaural</div>
            <div className="flex items-center gap-1.5">
              {keyboardState.binaural_hz > 0 && <Radio size={10} style={{ color: "var(--friction-accent-amber)" }} />}
              <span className="tabular-nums" style={{ fontSize: "0.65rem", color: "var(--friction-text-primary)" }}>
                {keyboardState.binaural_hz > 0 ? `${keyboardState.binaural_hz} Hz` : "Off"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Progress */}
      <div
        className="p-4 rounded-sm"
        style={{
          backgroundColor: "var(--friction-bg-secondary)",
          border: "1px solid var(--friction-border-default)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className="uppercase tracking-[0.2em]"
            style={{ fontSize: "0.6rem", color: "var(--friction-text-muted)" }}
          >
            Task Progress
          </span>
          <span className="tabular-nums" style={{ fontSize: "0.6rem", color: "var(--friction-text-disabled)" }}>
            {completedCount}/{tasks.length}
          </span>
        </div>
        <div className="space-y-1.5">
          {tasks.map((task, i) => (
            <div
              key={task.id}
              className="flex items-center gap-2 py-1"
              style={{
                opacity: task.completed ? 0.3 : i === currentTaskIndex ? 1 : 0.6,
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{
                  backgroundColor: task.completed
                    ? "var(--friction-accent-green)"
                    : i === currentTaskIndex
                      ? "var(--friction-accent-amber)"
                      : "var(--friction-text-disabled)",
                }}
              />
              <span
                className={task.completed ? "line-through" : ""}
                style={{
                  fontSize: "0.65rem",
                  color: task.completed ? "var(--friction-text-disabled)" : "var(--friction-text-primary)",
                }}
              >
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}