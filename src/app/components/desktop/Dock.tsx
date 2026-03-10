/**
 * DOCK / TASKBAR
 * 
 * Windows-style taskbar at bottom of screen with app launchers,
 * system tray, clock, and running app indicators.
 * Friction lives ONLY in the system tray — not as a launchable app.
 */

import { useState, useEffect, useCallback } from "react";
import { useWindowManager } from "../../context/WindowManagerContext";
import { useSession } from "../../context/SessionContext";
import { motion, AnimatePresence } from "motion/react";
import { Search, Wifi, Volume2, BatteryFull, ChevronUp } from "lucide-react";

interface AppDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  size?: { width: number; height: number };
}

const APPS: AppDef[] = [
  { id: "vscode", name: "VS Code", icon: "⌨️", color: "#007acc", size: { width: 1000, height: 700 } },
  { id: "chrome", name: "Chrome", icon: "🌐", color: "#4285f4", size: { width: 1000, height: 700 } },
  { id: "mail", name: "Mail", icon: "✉️", color: "#0071e3", size: { width: 900, height: 650 } },
  { id: "slack", name: "Slack", icon: "💬", color: "#611f69", size: { width: 900, height: 650 } },
  { id: "calendar", name: "Calendar", icon: "📅", color: "#ff3b30", size: { width: 800, height: 600 } },
  { id: "spotify", name: "Spotify", icon: "🎵", color: "#1db954", size: { width: 950, height: 650 } },
  { id: "terminal", name: "Terminal", icon: "▶️", color: "#1a1b26", size: { width: 800, height: 500 } },
  { id: "notes", name: "Notes", icon: "📝", color: "#ffcc02", size: { width: 900, height: 620 } },
  { id: "finder", name: "Finder", icon: "📁", color: "#5aadfc", size: { width: 900, height: 600 } },
  { id: "calculator", name: "Calculator", icon: "🔢", color: "#1c1c1c", size: { width: 480, height: 580 } },
  { id: "settings", name: "Settings", icon: "⚙️", color: "#8e8e93", size: { width: 950, height: 650 } },
];

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);
  const h = time.getHours();
  const m = time.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const dateStr = time.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" });
  return (
    <div className="text-right" style={{ fontSize: "0.7rem", color: "#fff", lineHeight: "1.3" }}>
      <div>{h12}:{m} {ampm}</div>
      <div style={{ opacity: 0.8 }}>{dateStr}</div>
    </div>
  );
}

export function Dock() {
  const { openWindow, isAppOpen, focusAppWindow } = useWindowManager();

  const handleAppClick = (app: AppDef) => {
    if (isAppOpen(app.id)) {
      focusAppWindow(app.id);
    } else {
      openWindow(app.id, app.name, app.size);
    }
  };

  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-center"
      style={{
        height: "48px",
        zIndex: 5000,
        backgroundColor: "rgba(24, 24, 32, 0.85)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {/* Start / Search area */}
      <div className="flex items-center h-full gap-1 px-2 shrink-0">
        {/* Windows logo */}
        <button
          className="flex items-center justify-center h-9 w-9 rounded hover:bg-white/10 transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="0" y="0" width="7" height="7" fill="#0078D4" rx="1" />
            <rect x="9" y="0" width="7" height="7" fill="#0078D4" rx="1" />
            <rect x="0" y="9" width="7" height="7" fill="#0078D4" rx="1" />
            <rect x="9" y="9" width="7" height="7" fill="#0078D4" rx="1" />
          </svg>
        </button>
        {/* Search bar */}
        <div
          className="flex items-center gap-2 px-3 h-8 rounded-full"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            width: "200px",
          }}
        >
          <Search size={13} style={{ color: "rgba(255,255,255,0.5)" }} />
          <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>Search</span>
        </div>
      </div>

      {/* Pinned + Running apps */}
      <div className="flex-1 flex items-center justify-center gap-0.5 h-full px-1">
        {APPS.map(app => {
          const running = isAppOpen(app.id);
          return (
            <TaskbarApp
              key={app.id}
              app={app}
              isRunning={running}
              onClick={() => handleAppClick(app)}
            />
          );
        })}
      </div>

      {/* System tray */}
      <div className="flex items-center gap-2 h-full px-3 shrink-0">
        <button className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer">
          <ChevronUp size={13} style={{ color: "rgba(255,255,255,0.6)" }} />
        </button>
        
        {/* Friction system tray icon */}
        <FrictionTrayIcon />
        
        <Wifi size={14} style={{ color: "rgba(255,255,255,0.7)" }} />
        <Volume2 size={14} style={{ color: "rgba(255,255,255,0.7)" }} />
        <BatteryFull size={14} style={{ color: "rgba(255,255,255,0.7)" }} />
        <div style={{ width: "1px", height: "20px", backgroundColor: "rgba(255,255,255,0.1)" }} />
        <Clock />
      </div>
    </div>
  );
}

interface TaskbarAppProps {
  app: AppDef;
  isRunning: boolean;
  onClick: () => void;
}

function TaskbarApp({ app, isRunning, onClick }: TaskbarAppProps) {
  return (
    <motion.button
      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex items-center justify-center cursor-pointer rounded-sm"
      style={{
        width: "40px",
        height: "40px",
      }}
    >
      <div
        className="flex items-center justify-center rounded-md"
        style={{
          width: "28px",
          height: "28px",
          fontSize: "1.1rem",
        }}
      >
        {app.icon}
      </div>

      {/* Running indicator — bottom bar */}
      {isRunning && (
        <div
          className="absolute bottom-0.5 rounded-full"
          style={{
            width: "16px",
            height: "3px",
            backgroundColor: "rgba(120, 180, 255, 0.9)",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute -top-9 px-2.5 py-1.5 rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          backgroundColor: "rgba(30, 30, 40, 0.95)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        {app.name}
      </div>
    </motion.button>
  );
}

/**
 * FRICTION SYSTEM TRAY ICON
 * 
 * Unified diamond icon in the system tray.
 * - Breathing glow synced to an 8s inhale/exhale cycle
 * - Accepts drag-and-drop (text/plain) to add tasks to inbox
 * - Hover tooltip: box breathing square + IN/OUT cycling text
 */
function FrictionTrayIcon() {
  const { sessionState, addGeneralTask } = useSession();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isActive = sessionState === "active";

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const text = e.dataTransfer.getData("text/plain")?.trim();
    if (text) {
      addGeneralTask({
        id: `task-drop-${Date.now()}`,
        title: text.slice(0, 80),
        cognitiveWeight: 0.5,
        completed: false,
        category: "moderate",
        estimatedMinutes: 30,
      });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  }, [addGeneralTask]);

  // Breathing cycle: 8s total — 4s inhale, 4s exhale
  const BREATH_DURATION = 8;
  const boxSize = 56;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => { setShowTooltip(false); setIsDragOver(false); }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* The diamond icon — glow breathes in sync */}
      <motion.div
        animate={
          isDragOver
            ? { scale: 1.5 }
            : justAdded
              ? { scale: [1, 1.4, 1] }
              : {}
        }
        transition={
          isDragOver ? { duration: 0.2 } : justAdded ? { duration: 0.4 } : {}
        }
        className="flex items-center justify-center cursor-pointer rounded-sm"
        style={{ width: "22px", height: "22px" }}
      >
        <motion.svg
          width="14" height="14" viewBox="0 0 12 12" fill="none"
          animate={
            isActive && !isDragOver && !justAdded
              ? { filter: [
                  "drop-shadow(0 0 1px rgba(90,143,196,0.2))",
                  "drop-shadow(0 0 6px rgba(90,143,196,0.7))",
                  "drop-shadow(0 0 6px rgba(198,85,96,0.6))",
                  "drop-shadow(0 0 1px rgba(198,85,96,0.2))",
                  "drop-shadow(0 0 1px rgba(90,143,196,0.2))",
                ]}
              : {}
          }
          transition={
            isActive && !isDragOver && !justAdded
              ? { duration: BREATH_DURATION, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
        >
          <path
            d="M6 0.5L11 6L6 11.5L1 6L6 0.5Z"
            fill={
              isDragOver ? "rgba(90, 143, 196, 0.9)"
              : justAdded ? "rgba(90, 143, 196, 0.7)"
              : isActive ? "#5a8fc4"
              : "#4a5568"
            }
            stroke={
              isDragOver ? "#8db4e0"
              : isActive ? "#8db4e0"
              : "#64748b"
            }
            strokeWidth="0.5"
          />
        </motion.svg>
      </motion.div>

      {/* Hover tooltip: the square IS the tooltip */}
      <AnimatePresence>
        {showTooltip && !isDragOver && !justAdded && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-3 pointer-events-none"
            style={{ zIndex: 9000 }}
          >
            {/* The breathing square — IS the entire tooltip */}
            <div className="relative" style={{ width: boxSize + 16, height: boxSize + 16, padding: 8 }}>
             <div className="relative" style={{ width: boxSize, height: boxSize }}>
              {/* Breathing border: blue → red → blue */}
              <motion.div
                className="absolute inset-0 rounded"
                animate={{ borderColor: [
                  isActive ? "rgba(90,143,196,0.35)" : "rgba(255,255,255,0.08)",
                  isActive ? "rgba(198,85,96,0.35)" : "rgba(255,255,255,0.08)",
                  isActive ? "rgba(90,143,196,0.35)" : "rgba(255,255,255,0.08)",
                ]}}
                transition={{ duration: BREATH_DURATION, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  border: "1px solid",
                  backgroundColor: "rgba(10, 15, 26, 0.85)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
              />

              {/* Diagonal line from top-left to bottom-right */}
              <svg
                className="absolute inset-0"
                width={boxSize} height={boxSize}
                style={{ pointerEvents: "none" }}
              >
                <line
                  x1="0" y1="0" x2={boxSize} y2={boxSize}
                  stroke={isActive ? "rgba(90,143,196,0.10)" : "rgba(255,255,255,0.06)"}
                  strokeWidth="0.5"
                />
              </svg>

              {/* Tracing dot — easeInOut breathing + blue→red color shift */}
              <motion.div
                animate={{
                  left: [0, boxSize, boxSize, 0, 0],
                  top: [0, 0, boxSize, boxSize, 0],
                  width: [8, 10, 8, 6, 8],
                  height: [8, 10, 8, 6, 8],
                  backgroundColor: [
                    "rgba(90,143,196,1)",
                    "rgba(120,130,180,1)",
                    "rgba(198,85,96,1)",
                    "rgba(160,80,100,1)",
                    "rgba(90,143,196,1)",
                  ],
                  boxShadow: [
                    "0 0 10px rgba(90,143,196,0.8)",
                    "0 0 12px rgba(120,130,180,0.7)",
                    "0 0 10px rgba(198,85,96,0.8)",
                    "0 0 8px rgba(160,80,100,0.6)",
                    "0 0 10px rgba(90,143,196,0.8)",
                  ],
                }}
                transition={{
                  duration: BREATH_DURATION,
                  repeat: Infinity,
                  ease: ["easeOut", "easeInOut", "easeOut", "easeInOut"],
                  times: [0, 0.25, 0.5, 0.75, 1],
                }}
                className="absolute rounded-full"
                style={{
                  transform: "translate(-50%, -50%)",
                  zIndex: 2,
                }}
              />
             </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag-over tooltip */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.1 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none whitespace-nowrap"
            style={{ zIndex: 9100 }}
          >
            <div
              className="px-3 py-1.5 rounded-md"
              style={{
                backgroundColor: "rgba(10, 15, 26, 0.96)",
                border: "1px solid rgba(90, 143, 196, 0.3)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.55rem",
                fontWeight: 500,
                color: "rgba(141, 180, 224, 0.9)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Drop to inbox
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Added!" flash */}
      <AnimatePresence>
        {justAdded && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none whitespace-nowrap"
            style={{ zIndex: 9100 }}
          >
            <div
              className="px-3 py-1.5 rounded-md"
              style={{
                backgroundColor: "rgba(10, 15, 26, 0.96)",
                border: "1px solid rgba(90, 143, 196, 0.25)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.55rem",
                fontWeight: 500,
                color: "rgba(141, 180, 224, 0.8)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Added to Inbox
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}