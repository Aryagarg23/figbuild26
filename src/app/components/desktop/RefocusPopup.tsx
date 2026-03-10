/**
 * REFOCUS POPUP — Low Focus State (<0.30)
 *
 * Three glassmorphic option cards appear center-screen:
 *   A) Music Creator
 *   B) Breathing Visualizer
 *   C) Constellation Yoga
 *
 * Selecting one opens the corresponding full-screen exercise overlay.
 * Each exercise is a separate modular file (placeholder for HTML drops).
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, Wind, Dumbbell } from "lucide-react";
import { FRICTION_FONTS, FRICTION_COLORS, blueRedGradient, GRAIN_OVERLAY_STYLE } from "../friction-app/friction-styles";
import { MusicCreator } from "./exercises/MusicCreator";
import { BreathingVisualizer } from "./exercises/BreathingVisualizer";
import { ConstellationYoga } from "./exercises/ConstellationYoga";
import { useBiometrics } from "../../context/BiometricContext";

type Exercise = "music" | "breathing" | "constellation" | null;

const OPTIONS = [
  {
    key: "music" as const,
    icon: Music,
    label: "Music Creator",
    description: "Create something simple and rhythmic",
    color: FRICTION_COLORS.blue300,
  },
  {
    key: "breathing" as const,
    icon: Wind,
    label: "Breathing",
    description: "Reground your breathing pattern",
    color: FRICTION_COLORS.violet300,
  },
  {
    key: "constellation" as const,
    icon: Dumbbell,
    label: "Constellation Yoga",
    description: "Physical stretch & reset",
    color: FRICTION_COLORS.red300,
  },
];

export function RefocusPopup() {
  const [activeExercise, setActiveExercise] = useState<Exercise>(null);
  const { simulateGradualChange } = useBiometrics();

  /** Closing an exercise = completing it → boost focus above 0.30 threshold */
  const handleExerciseClose = useCallback(() => {
    setActiveExercise(null);
    // Boost focus to 0.55 over 2s — enough to clear the RefocusPopup threshold
    simulateGradualChange({ focus_percent: 0.55 }, 2000);
  }, [simulateGradualChange]);

  return (
    <>
      {/* ── Exercise overlay ── */}
      <AnimatePresence>
        {activeExercise === "music" && (
          <MusicCreator onClose={handleExerciseClose} />
        )}
        {activeExercise === "breathing" && (
          <BreathingVisualizer onClose={handleExerciseClose} />
        )}
        {activeExercise === "constellation" && (
          <ConstellationYoga onClose={handleExerciseClose} />
        )}
      </AnimatePresence>

      {/* ── Option cards (hidden when exercise is active) ── */}
      <AnimatePresence>
        {!activeExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{
              zIndex: 8500,
              backgroundColor: "rgba(6, 10, 18, 0.5)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div className="flex flex-col items-center gap-5">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="text-center mb-2"
              >
                <div
                  className="uppercase tracking-[0.25em] mb-2"
                  style={{
                    fontSize: "0.5rem",
                    color: FRICTION_COLORS.textMuted,
                    fontFamily: FRICTION_FONTS.heading,
                  }}
                >
                  Focus depleted
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: FRICTION_COLORS.textSecondary,
                    fontFamily: FRICTION_FONTS.body,
                  }}
                >
                  Choose a refocus exercise
                </div>
              </motion.div>

              {/* Option cards */}
              <div className="flex gap-4">
                {OPTIONS.map((opt, i) => (
                  <motion.button
                    key={opt.key}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.2 + i * 0.1,
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{
                      scale: 1.04,
                      borderColor: `${opt.color}50`,
                      boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${opt.color}15`,
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveExercise(opt.key)}
                    className="flex flex-col items-center gap-3 p-5 rounded-xl cursor-pointer relative overflow-hidden"
                    style={{
                      backgroundColor: "rgba(10, 16, 30, 0.75)",
                      border: `1px solid ${opt.color}20`,
                      backdropFilter: "blur(16px)",
                      minWidth: 140,
                    }}
                  >
                    {/* Grain */}
                    <div
                      style={{
                        ...GRAIN_OVERLAY_STYLE,
                        opacity: 0.3,
                        borderRadius: "12px",
                      }}
                    />

                    {/* Subtle gradient */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-xl"
                      style={{ background: blueRedGradient(0.06) }}
                    />

                    {/* Icon circle */}
                    <div
                      className="relative flex items-center justify-center rounded-full"
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: `${opt.color}10`,
                        border: `1.5px solid ${opt.color}30`,
                      }}
                    >
                      <opt.icon size={22} style={{ color: opt.color }} />
                    </div>

                    {/* Label */}
                    <div className="relative text-center">
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: FRICTION_COLORS.textPrimary,
                          fontFamily: FRICTION_FONTS.heading,
                          marginBottom: 4,
                        }}
                      >
                        {opt.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.5rem",
                          color: FRICTION_COLORS.textMuted,
                          fontFamily: FRICTION_FONTS.body,
                          maxWidth: 120,
                        }}
                      >
                        {opt.description}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}