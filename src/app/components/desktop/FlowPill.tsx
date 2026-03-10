/**
 * FLOW PILL — Max Focus State (>0.80)
 *
 * A translucent pill at the top-center of the screen showing the current task.
 * Hover for >1 second → expands to reveal a checkmark.
 * Click the checkmark → task text "shreds" apart in a particle burst,
 * then reforms with the next queued task.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { useSession } from "../../context/SessionContext";
import { FRICTION_FONTS, FRICTION_COLORS } from "../friction-app/friction-styles";

export function FlowPill() {
  const { tasks, triggerStrike } = useSession();
  const activeTasks = tasks.filter(t => !t.completed);
  const currentTask = activeTasks[0];
  const nextTask = activeTasks[1];

  const [hoverExpanded, setHoverExpanded] = useState(false);
  const [shredding, setShredding] = useState(false);
  const [shredChars, setShredChars] = useState<
    { char: string; x: number; y: number; rot: number; delay: number }[]
  >([]);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    hoverTimer.current = setTimeout(() => setHoverExpanded(true), 1000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHoverExpanded(false);
  }, []);

  const handleStrike = useCallback(() => {
    if (!currentTask) return;

    // Generate shred particles from each character
    const chars = currentTask.title.split("").map((char, i) => ({
      char,
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 400 - 100,
      rot: (Math.random() - 0.5) * 720,
      delay: i * 0.015,
    }));
    setShredChars(chars);
    setShredding(true);

    // Trigger the OS-level strike effect
    const next = nextTask?.title || "Session complete";
    triggerStrike(currentTask.title, next);

    // Reset after animation
    setTimeout(() => {
      setShredding(false);
      setShredChars([]);
      setHoverExpanded(false);
    }, 1200);
  }, [currentTask, nextTask, triggerStrike]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  if (!currentTask) return null;

  return (
    <div
      className="absolute top-5 left-1/2 -translate-x-1/2"
      style={{ zIndex: 7500 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        {shredding ? (
          /* ── Shred Animation ── */
          <motion.div
            key="shred"
            className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-full"
            style={{
              backgroundColor: "rgba(10, 15, 26, 0.55)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${FRICTION_COLORS.borderSubtle}`,
              minWidth: 200,
              overflow: "visible",
            }}
          >
            {/* Burst flash */}
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.4 }}
              style={{
                backgroundColor: FRICTION_COLORS.blue300,
                filter: "blur(8px)",
              }}
            />
            {/* Flying characters */}
            <div className="relative" style={{ height: 18 }}>
              {shredChars.map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
                  animate={{
                    x: c.x,
                    y: c.y,
                    opacity: 0,
                    rotate: c.rot,
                    scale: 0.2,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: c.delay,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="inline-block"
                  style={{
                    fontSize: "0.7rem",
                    color: FRICTION_COLORS.textPrimary,
                    fontFamily: FRICTION_FONTS.body,
                    position: "absolute",
                    left: `${i * 0.55}em`,
                    filter: "blur(0.5px)",
                  }}
                >
                  {c.char}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ── Normal Pill ── */
          <motion.div
            key="pill"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-2.5 rounded-full"
            style={{
              backgroundColor: "rgba(10, 15, 26, 0.55)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${FRICTION_COLORS.borderSubtle}`,
              boxShadow: `0 4px 24px rgba(0, 0, 0, 0.3), 0 0 1px ${FRICTION_COLORS.blueGlow}`,
              padding: "8px 18px",
              cursor: "default",
            }}
          >
            {/* Checkmark button — appears on long hover */}
            <AnimatePresence>
              {hoverExpanded && (
                <motion.button
                  initial={{ width: 0, opacity: 0, scale: 0.5 }}
                  animate={{ width: 22, opacity: 1, scale: 1 }}
                  exit={{ width: 0, opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  onClick={handleStrike}
                  className="flex items-center justify-center rounded-full shrink-0 cursor-pointer overflow-hidden"
                  style={{
                    width: 22,
                    height: 22,
                    backgroundColor: `${FRICTION_COLORS.blue300}15`,
                    border: `1.5px solid ${FRICTION_COLORS.borderActive}`,
                  }}
                  whileHover={{
                    backgroundColor: `${FRICTION_COLORS.blue300}30`,
                    borderColor: FRICTION_COLORS.blue300,
                  }}
                  whileTap={{ scale: 0.85 }}
                >
                  <Check size={12} style={{ color: FRICTION_COLORS.blue300 }} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Breathing dot */}
            <motion.div
              animate={{ opacity: [0.3, 0.65, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: FRICTION_COLORS.blue300 }}
            />

            {/* Task title */}
            <span
              className="truncate"
              style={{
                fontSize: "0.7rem",
                color: FRICTION_COLORS.textSecondary,
                maxWidth: "300px",
                fontFamily: FRICTION_FONTS.body,
                letterSpacing: "0.02em",
              }}
            >
              {currentTask.title}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
