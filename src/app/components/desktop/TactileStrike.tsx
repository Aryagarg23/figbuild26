/**
 * TACTILE STRIKE — Sub-State 2
 *
 * Glassmorphic ripple that temporarily materializes over the active window
 * when a task is completed in peak flow. Shows checkmark + next task
 * for exactly 1.5-2 seconds, then dissolves back to invisibility.
 * Zero mouse movement required.
 */

import { motion } from "motion/react";
import { Check } from "lucide-react";

interface Props {
  completedTask: string;
  nextTask: string;
}

export function TactileStrike({ completedTask, nextTask }: Props) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: 8000 }}
    >
      {/* Ripple rings */}
      <motion.div
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          border: "1px solid rgba(255, 167, 38, 0.4)",
        }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0.4 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
        className="absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          border: "1px solid rgba(255, 167, 38, 0.3)",
        }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0.3 }}
        animate={{ scale: 2.5, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="absolute rounded-full"
        style={{
          width: 120,
          height: 120,
          border: "2px solid rgba(255, 167, 38, 0.5)",
        }}
      />

      {/* Glassmorphic card */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{
          duration: 0.3,
          delay: 0.15,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative flex flex-col items-center gap-3 px-8 py-6 rounded-lg"
        style={{
          backgroundColor: "rgba(10, 10, 10, 0.75)",
          backdropFilter: "blur(24px) saturate(1.5)",
          border: "1px solid rgba(255, 167, 38, 0.25)",
          boxShadow: "0 0 60px rgba(255, 167, 38, 0.1), inset 0 0 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 15 }}
          className="flex items-center justify-center rounded-full"
          style={{
            width: 40,
            height: 40,
            backgroundColor: "rgba(255, 167, 38, 0.15)",
            border: "2px solid rgba(255, 167, 38, 0.6)",
          }}
        >
          <Check size={20} style={{ color: "#ffb74d" }} />
        </motion.div>

        {/* Completed task */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div
            className="uppercase tracking-[0.15em] mb-1"
            style={{
              fontSize: "0.55rem",
              color: "rgba(255, 167, 38, 0.6)",
            }}
          >
            Completed
          </div>
          <div
            className="line-through"
            style={{
              fontSize: "0.8rem",
              color: "rgba(255, 167, 38, 0.4)",
            }}
          >
            {completedTask}
          </div>
        </motion.div>

        {/* Next task */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div
            className="uppercase tracking-[0.15em] mb-1"
            style={{
              fontSize: "0.55rem",
              color: "rgba(255, 167, 38, 0.4)",
            }}
          >
            Next
          </div>
          <div
            style={{
              fontSize: "0.8rem",
              color: "#ffb74d",
              textShadow: "0 0 15px rgba(255, 167, 38, 0.3)",
            }}
          >
            {nextTask}
          </div>
        </motion.div>
      </motion.div>

      {/* Fade out the entire thing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute inset-0"
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
}
