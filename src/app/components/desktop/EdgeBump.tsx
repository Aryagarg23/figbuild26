/**
 * EDGE BUMP — State 2.2
 *
 * When the user is in Pure Invisibility (max focus) and aggressively
 * moves their mouse to the far right edge of the screen, a minimalist,
 * translucent drawer peeks out containing their active task nodes.
 * Click/swipe a node to complete it; the drawer instantly snaps back.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { useSession } from "../../context/SessionContext";

export function EdgeBump() {
  const { tasks, completeTask, triggerStrike } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const activeTasks = tasks.filter(t => !t.completed);

  // Track mouse position — show drawer when mouse hits far right edge
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const threshold = window.innerWidth - 6;
    if (e.clientX >= threshold && e.movementX > 3) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const handleComplete = (taskId: string, taskTitle: string) => {
    const nextTask = activeTasks.find(t => t.id !== taskId);
    completeTask(taskId);
    triggerStrike(taskTitle, nextTask?.title || "Session complete");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Invisible backdrop to close on click away */}
          <div
            className="absolute inset-0"
            style={{ zIndex: 8099 }}
            onClick={() => setIsVisible(false)}
          />
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 right-0 bottom-[48px] flex flex-col"
            style={{
              width: "220px",
              zIndex: 8100,
              backgroundColor: "rgba(10, 10, 14, 0.6)",
              backdropFilter: "blur(20px)",
              borderLeft: "1px solid rgba(255, 167, 38, 0.08)",
            }}
            onMouseLeave={() => setIsVisible(false)}
          >
            {/* Header */}
            <div
              className="px-4 py-3 shrink-0"
              style={{ borderBottom: "1px solid rgba(255, 167, 38, 0.06)" }}
            >
              <div
                className="uppercase tracking-[0.2em]"
                style={{ fontSize: "0.5rem", color: "rgba(255, 167, 38, 0.4)" }}
              >
                Active Tasks
              </div>
            </div>

            {/* Task nodes */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              {activeTasks.map(task => (
                <motion.button
                  key={task.id}
                  whileHover={{ backgroundColor: "rgba(255, 167, 38, 0.06)" }}
                  onClick={() => handleComplete(task.id, task.title)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-sm text-left cursor-pointer"
                  style={{ border: "1px solid transparent" }}
                >
                  <div
                    className="shrink-0 flex items-center justify-center rounded-sm"
                    style={{
                      width: 16,
                      height: 16,
                      border: "1.5px solid rgba(255, 167, 38, 0.25)",
                    }}
                  >
                    <Check size={8} style={{ color: "transparent" }} className="hover:text-amber-500/40" />
                  </div>
                  <span
                    className="truncate"
                    style={{
                      fontSize: "0.6rem",
                      color: "rgba(255, 200, 150, 0.6)",
                    }}
                  >
                    {task.title}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
