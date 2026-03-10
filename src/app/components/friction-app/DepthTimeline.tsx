/**
 * DEPTH-OF-FIELD TIMELINE — The Mirror
 *
 * Visualizes the session as a topography of mental energy.
 * Periods of peak flow are rendered razor-sharp.
 * Periods of burnout are rendered with heavy Gaussian blur.
 * The visual metaphor: you see your cognition as a landscape.
 */

import { motion } from "motion/react";
import { useState } from "react";

interface TimelineSegment {
  id: string;
  label: string;
  startMinute: number;
  endMinute: number;
  focusAvg: number;
  fatigueAvg: number;
  category: "deep" | "moderate" | "light" | "break";
}

const mockSegments: TimelineSegment[] = [
  { id: "1", label: "Debug normalization pipeline", startMinute: 0, endMinute: 45, focusAvg: 0.92, fatigueAvg: 0.15, category: "deep" },
  { id: "2", label: "Write unit tests", startMinute: 45, endMinute: 80, focusAvg: 0.85, fatigueAvg: 0.3, category: "deep" },
  { id: "3", label: "Interruption — lab mate", startMinute: 80, endMinute: 85, focusAvg: 0.05, fatigueAvg: 0.35, category: "break" },
  { id: "4", label: "Context recovery (moss)", startMinute: 85, endMinute: 90, focusAvg: 0.4, fatigueAvg: 0.38, category: "moderate" },
  { id: "5", label: "Review pull requests", startMinute: 90, endMinute: 110, focusAvg: 0.55, fatigueAvg: 0.5, category: "moderate" },
  { id: "6", label: "Organize project folders", startMinute: 110, endMinute: 120, focusAvg: 0.3, fatigueAvg: 0.65, category: "light" },
  { id: "7", label: "Reply to team messages", startMinute: 120, endMinute: 130, focusAvg: 0.25, fatigueAvg: 0.72, category: "light" },
  { id: "8", label: "Late-night push (fatigue spike)", startMinute: 130, endMinute: 150, focusAvg: 0.15, fatigueAvg: 0.95, category: "deep" },
];

export function DepthTimeline() {
  const totalDuration = 150;
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span
          className="uppercase tracking-[0.2em]"
          style={{ fontSize: "0.6rem", color: "var(--friction-text-muted)" }}
        >
          Session Topography — Depth of Field
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div
              className="w-8 h-2 rounded-sm"
              style={{
                background: "linear-gradient(to right, #f59e0b, #ff6f00)",
                boxShadow: "0 0 8px rgba(245, 158, 11, 0.3)",
              }}
            />
            <span style={{ fontSize: "0.5rem", color: "var(--friction-text-disabled)" }}>
              Sharp = Flow
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-8 h-2 rounded-sm"
              style={{
                background: "linear-gradient(to right, #92400e, #451a03)",
                filter: "blur(3px)",
              }}
            />
            <span style={{ fontSize: "0.5rem", color: "var(--friction-text-disabled)" }}>
              Blurred = Fatigue
            </span>
          </div>
        </div>
      </div>

      {/* Depth of Field Timeline */}
      <div className="relative w-full">
        {/* Time axis */}
        <div className="flex justify-between mb-3">
          {[0, 30, 60, 90, 120, 150].map((min) => (
            <span
              key={min}
              className="tabular-nums"
              style={{
                fontSize: "0.5rem",
                color: "var(--friction-text-disabled)",
              }}
            >
              {Math.floor(min / 60)}:{(min % 60).toString().padStart(2, "0")}
            </span>
          ))}
        </div>

        {/* Main timeline visualization */}
        <div className="relative h-48 flex gap-[2px] rounded-sm overflow-hidden">
          {mockSegments.map((seg, i) => {
            const width = ((seg.endMinute - seg.startMinute) / totalDuration) * 100;
            const blurAmount = Math.max(0, (1 - seg.focusAvg) * 8);
            const isHovered = hoveredSegment === seg.id;

            // Color intensity based on focus
            const focusColor = seg.category === "break"
              ? "#ef4444"
              : seg.focusAvg > 0.7
                ? "#f59e0b"
                : seg.focusAvg > 0.4
                  ? "#d97706"
                  : "#92400e";

            // Height based on focus
            const barHeight = 15 + seg.focusAvg * 85;

            // Glow for high-focus segments
            const hasGlow = seg.focusAvg > 0.75;

            return (
              <motion.div
                key={seg.id}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full flex flex-col justify-end cursor-pointer"
                style={{ width: `${width}%`, transformOrigin: "bottom" }}
                onMouseEnter={() => setHoveredSegment(seg.id)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                {/* The actual bar with depth-of-field blur */}
                <div className="relative w-full" style={{ height: `${barHeight}%` }}>
                  {/* Main bar */}
                  <div
                    className="absolute inset-0 rounded-t-sm transition-all duration-500"
                    style={{
                      background: hasGlow
                        ? `linear-gradient(to top, ${focusColor}90, ${focusColor})`
                        : `linear-gradient(to top, ${focusColor}40, ${focusColor}80)`,
                      filter: `blur(${isHovered ? 0 : blurAmount}px)`,
                      boxShadow: hasGlow
                        ? `0 -4px 20px ${focusColor}30, inset 0 2px 8px ${focusColor}20`
                        : undefined,
                    }}
                  />

                  {/* Crisp overlay for high-focus (razor sharp) */}
                  {seg.focusAvg > 0.8 && (
                    <div
                      className="absolute inset-0 rounded-t-sm"
                      style={{
                        background: `linear-gradient(to top, transparent 0%, ${focusColor}15 50%, ${focusColor}30 100%)`,
                        borderTop: `1px solid ${focusColor}60`,
                      }}
                    />
                  )}

                  {/* Fatigue underlay — red creep from bottom */}
                  <div
                    className="absolute bottom-0 w-full rounded-t-sm"
                    style={{
                      height: `${seg.fatigueAvg * 70}%`,
                      background: `linear-gradient(to top, rgba(220, 50, 50, ${seg.fatigueAvg * 0.2}), transparent)`,
                      filter: `blur(${Math.max(0, seg.fatigueAvg * 4)}px)`,
                    }}
                  />
                </div>

                {/* Hover detail card */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                  >
                    <div
                      className="px-4 py-3 rounded-sm whitespace-nowrap"
                      style={{
                        backgroundColor: "rgba(10, 10, 10, 0.95)",
                        border: `1px solid ${focusColor}40`,
                        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 10px ${focusColor}10`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.65rem",
                          color: "var(--friction-text-primary)",
                          filter: `blur(${blurAmount * 0.3}px)`,
                        }}
                      >
                        {seg.label}
                      </p>
                      <div className="flex gap-4 mt-1.5">
                        <span
                          className="tabular-nums"
                          style={{
                            fontSize: "0.55rem",
                            color: focusColor,
                          }}
                        >
                          Focus: {(seg.focusAvg * 100).toFixed(0)}%
                        </span>
                        <span
                          className="tabular-nums"
                          style={{
                            fontSize: "0.55rem",
                            color: seg.fatigueAvg > 0.7 ? "#dc3232" : "var(--friction-text-muted)",
                          }}
                        >
                          Fatigue: {(seg.fatigueAvg * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div
                        className="mt-1"
                        style={{
                          fontSize: "0.5rem",
                          color: "var(--friction-text-disabled)",
                        }}
                      >
                        {seg.startMinute}m — {seg.endMinute}m
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Task labels with blur matching */}
        <div className="flex gap-[2px] mt-2">
          {mockSegments.map((seg) => {
            const width = ((seg.endMinute - seg.startMinute) / totalDuration) * 100;
            const blurAmount = Math.max(0, (1 - seg.focusAvg) * 3);
            return (
              <div key={seg.id} className="overflow-hidden" style={{ width: `${width}%` }}>
                <span
                  className="truncate block"
                  style={{
                    fontSize: "0.45rem",
                    color: "var(--friction-text-disabled)",
                    filter: `blur(${blurAmount}px)`,
                    transition: "filter 0.5s ease",
                  }}
                >
                  {seg.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Interruption marker */}
        <div
          className="absolute"
          style={{
            left: `${(80 / totalDuration) * 100}%`,
            top: 28,
            bottom: 0,
          }}
        >
          <div
            className="w-px h-full"
            style={{
              background: "linear-gradient(to bottom, rgba(239, 68, 68, 0.6), transparent)",
            }}
          />
          <div
            className="absolute -top-5 -translate-x-1/2 whitespace-nowrap uppercase tracking-[0.15em]"
            style={{
              fontSize: "0.45rem",
              color: "rgba(239, 68, 68, 0.5)",
            }}
          >
            Interruption
          </div>
        </div>
      </div>
    </div>
  );
}
