/**
 * PASSIVE TASK BAR — State 2.3
 *
 * A minimalist, low-contrast, pill-shaped floating widget that fades in
 * at the top-center of the screen when Focus drops to 50-70%.
 * Displays the name of the current active task. Not clickable —
 * purely a visual anchor to gently remind the user what they're working on.
 * Uses Friction "Calm Authority" styling (navy/blue), not amber.
 */

import { motion } from "motion/react";
import { useSession } from "../../context/SessionContext";

interface Props {
  focus: number;
}

export function PassiveTaskBar({ focus }: Props) {
  const { tasks } = useSession();
  const activeTasks = tasks.filter(t => !t.completed);
  const currentTask = activeTasks[0];

  if (!currentTask) return null;

  // Opacity scales with how far focus has dropped into the 50-70% band
  const t = Math.max(0, Math.min(1, (0.70 - focus) / 0.20));
  const pillOpacity = 0.35 + t * 0.45;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: pillOpacity, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none"
      style={{ zIndex: 7000 }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-2 rounded-full"
        style={{
          backgroundColor: "rgba(10, 15, 26, 0.65)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(90, 143, 196, 0.12)",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Blue breathing dot */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: "rgba(90, 143, 196, 0.7)" }}
        />
        <span
          className="truncate"
          style={{
            fontSize: "0.65rem",
            color: "rgba(180, 200, 220, 0.6)",
            maxWidth: "280px",
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          {currentTask.title}
        </span>
      </div>
    </motion.div>
  );
}