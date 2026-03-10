/**
 * REFLECTION PAGE — 3-screen Mirror replacement
 * ============================================================
 * Screen 1: Latest Session Recap (tasks from SessionContext + reflection box)
 * Screen 2: Session History (stat cards, session list, radial clock, bar chart)
 * Screen 3: Session Detail (drill-down with contextual insights)
 *
 * Supports squished (45% drawer) and expanded (100% full-screen) layouts.
 * All visuals are bespoke SVG — no charting libraries.
 * Uses Calm Authority palette from friction-styles.ts.
 */

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, ChevronRight, Clock, Flame, Zap, Calendar,
  TrendingUp, BarChart3, Activity, Sun, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  FRICTION_FONTS, FRICTION_COLORS, GRAIN_OVERLAY_STYLE,
  labelStyle, bodyStyle, dataStyle, cardStyle, btnPrimaryStyle, blueRedGradient,
} from "./friction-styles";
import {
  PAST_SESSIONS, INTENSITY_DISTRIBUTION, SESSIONS_THIS_MONTH,
  TOTAL_DEEP_WORK_HOURS, WEEKLY_INTENSITY, HOURLY_INTENSITY,
  DETAIL_INSIGHTS, type ReflectionTask, type PastSession,
} from "./reflection-data";

// ── Types ───────────────────────────────────────────────────

type SubScreen = "recap" | "history" | "detail";
type DetailView = "intensity" | "sessions" | "hours";

interface ReflectionPageProps {
  /** Tasks from the current/latest session via SessionContext */
  sessionTasks: { id: string; title: string; cognitiveWeight: number; completed: boolean; category: string; estimatedMinutes: number }[];
  /** Is the drawer in full-screen (100%) or split (45%) mode? */
  fullScreen?: boolean;
}

// ── Helpers ─────────────────────────────────────────────────

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function intensityColor(label: "high" | "moderate" | "low" | "High" | "Moderate" | "Calm"): string {
  const l = label.toLowerCase();
  if (l === "high") return FRICTION_COLORS.red300;
  if (l === "moderate") return FRICTION_COLORS.violet300;
  return FRICTION_COLORS.blue300;
}

function intensityBg(label: string): string {
  const l = label.toLowerCase();
  if (l === "high") return "rgba(255, 95, 143, 0.1)";
  if (l === "moderate") return "rgba(124, 77, 160, 0.1)";
  return "rgba(107, 95, 255, 0.1)";
}

// ── Main Component ──────────────────────────────────────────

export function ReflectionPage({ sessionTasks, fullScreen = false }: ReflectionPageProps) {
  const [screen, setScreen] = useState<SubScreen>("recap");
  const [detailView, setDetailView] = useState<DetailView>("intensity");
  const [reflectionText, setReflectionText] = useState("");

  const goToDetail = useCallback((view: DetailView) => {
    setDetailView(view);
    setScreen("detail");
  }, []);

  const isSquished = !fullScreen;

  return (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: FRICTION_FONTS.body, color: FRICTION_COLORS.textPrimary }}
    >
      {/* ── Sub-Tab Bar ── */}
      <div
        className="flex items-center gap-1 px-4 py-2 shrink-0"
        style={{ borderBottom: `1px solid ${FRICTION_COLORS.borderSubtle}` }}
      >
        {([
          { key: "recap", label: "Recap" },
          { key: "history", label: "History" },
          { key: "detail", label: "Detail" },
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setScreen(tab.key)}
            className="px-3 py-1 rounded-md cursor-pointer transition-all"
            style={{
              fontFamily: FRICTION_FONTS.heading,
              fontSize: "0.5rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              backgroundColor: screen === tab.key ? "rgba(107, 95, 255, 0.1)" : "transparent",
              border: `1px solid ${screen === tab.key ? FRICTION_COLORS.borderActive : "transparent"}`,
              color: screen === tab.key ? FRICTION_COLORS.blue200 : FRICTION_COLORS.textMuted,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Screen Content ── */}
      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          {screen === "recap" && (
            <motion.div
              key="recap"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              <RecapScreen
                sessionTasks={sessionTasks}
                reflectionText={reflectionText}
                onReflectionChange={setReflectionText}
                onGoHistory={() => setScreen("history")}
                isSquished={isSquished}
              />
            </motion.div>
          )}
          {screen === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              <HistoryScreen
                onDrillDown={goToDetail}
                isSquished={isSquished}
              />
            </motion.div>
          )}
          {screen === "detail" && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              <DetailScreen
                activeView={detailView}
                onChangeView={setDetailView}
                onBack={() => setScreen("history")}
                isSquished={isSquished}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
//  SCREEN 1: RECAP
// ══════════════════════════════════════════════════════════════

function RecapScreen({
  sessionTasks, reflectionText, onReflectionChange, onGoHistory, isSquished,
}: {
  sessionTasks: ReflectionPageProps["sessionTasks"];
  reflectionText: string;
  onReflectionChange: (v: string) => void;
  onGoHistory: () => void;
  isSquished: boolean;
}) {
  // Derive reflection tasks from session context OR fall back to latest past session
  const tasks: ReflectionTask[] = useMemo(() => {
    if (sessionTasks.length > 0) {
      return sessionTasks.map(t => ({
        id: t.id,
        title: t.title,
        intensity: t.cognitiveWeight > 0.6 ? "high" as const
          : t.cognitiveWeight > 0.35 ? "moderate" as const
          : "low" as const,
        durationMinutes: t.estimatedMinutes,
        completed: t.completed,
      }));
    }
    return PAST_SESSIONS[0].tasks;
  }, [sessionTasks]);

  const completedCount = tasks.filter(t => t.completed).length;
  const totalDuration = tasks.reduce((s, t) => s + t.durationMinutes, 0);

  return (
    <div className="px-5 py-5 space-y-5">
      {/* Header */}
      <div>
        <div style={{ ...labelStyle, marginBottom: 4 }}>Latest Session</div>
        <div className="flex items-center gap-3">
          <span style={{ ...dataStyle, fontSize: "0.55rem", color: FRICTION_COLORS.textMuted }}>
            {completedCount}/{tasks.length} tasks &middot; {formatDuration(totalDuration)}
          </span>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-1.5">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg"
            style={{
              backgroundColor: FRICTION_COLORS.bgElevated,
              border: `1px solid ${FRICTION_COLORS.borderSubtle}`,
            }}
          >
            {/* Completion indicator */}
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: task.completed ? FRICTION_COLORS.success : "transparent",
                border: task.completed ? "none" : `1.5px solid ${FRICTION_COLORS.textMuted}`,
              }}
            />

            {/* Title */}
            <span
              className="flex-1 truncate"
              style={{
                fontSize: "0.65rem",
                color: task.completed ? FRICTION_COLORS.textPrimary : FRICTION_COLORS.textMuted,
                textDecoration: task.completed ? "none" : "none",
              }}
            >
              {task.title}
            </span>

            {/* Intensity badge */}
            <span
              className="px-2 py-0.5 rounded-full shrink-0"
              style={{
                fontSize: "0.45rem",
                fontFamily: FRICTION_FONTS.heading,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: intensityColor(task.intensity),
                backgroundColor: intensityBg(task.intensity),
                border: `1px solid ${intensityColor(task.intensity)}33`,
              }}
            >
              {task.intensity}
            </span>

            {/* Duration */}
            <span style={{ ...dataStyle, fontSize: "0.45rem", color: FRICTION_COLORS.textMuted, minWidth: 32, textAlign: "right" as const }}>
              {formatDuration(task.durationMinutes)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Reflection box */}
      <div>
        <div style={{ ...labelStyle, fontSize: "0.5rem", marginBottom: 6, color: FRICTION_COLORS.textSecondary }}>
          What went well?
        </div>
        <textarea
          value={reflectionText}
          onChange={e => onReflectionChange(e.target.value)}
          placeholder="Reflect on this session..."
          rows={isSquished ? 3 : 4}
          className="w-full resize-none rounded-lg px-3 py-2 outline-none"
          style={{
            fontFamily: FRICTION_FONTS.body,
            fontSize: "0.65rem",
            color: FRICTION_COLORS.textPrimary,
            backgroundColor: FRICTION_COLORS.bgElevated,
            border: `1px solid ${FRICTION_COLORS.borderSubtle}`,
            lineHeight: 1.6,
          }}
          onFocus={e => { e.target.style.borderColor = FRICTION_COLORS.borderActive; }}
          onBlur={e => { e.target.style.borderColor = FRICTION_COLORS.borderSubtle; }}
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          onClick={onGoHistory}
          className="flex items-center gap-1.5 cursor-pointer transition-all hover:opacity-80"
          style={btnPrimaryStyle}
        >
          <BarChart3 size={11} />
          View History
          <ChevronRight size={10} />
        </button>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
//  SCREEN 2: HISTORY
// ══════════════════════════════════════════════════════════════

function HistoryScreen({
  onDrillDown, isSquished,
}: {
  onDrillDown: (view: DetailView) => void;
  isSquished: boolean;
}) {
  return (
    <div className="px-5 py-5 space-y-5">
      {/* Summary stat cards */}
      <div className={isSquished ? "space-y-2" : "grid grid-cols-3 gap-3"}>
        <StatCard
          label="Intensity"
          onClick={() => onDrillDown("intensity")}
          delay={0}
        >
          <MiniDonut />
        </StatCard>
        <StatCard
          label="Sessions"
          onClick={() => onDrillDown("sessions")}
          delay={0.08}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: FRICTION_FONTS.mono, fontSize: isSquished ? "1rem" : "1.3rem", color: FRICTION_COLORS.blue200 }}>
              {SESSIONS_THIS_MONTH}
            </span>
            <span style={{ fontSize: "0.45rem", color: FRICTION_COLORS.textMuted }}>this month</span>
          </div>
        </StatCard>
        <StatCard
          label="Deep Work"
          onClick={() => onDrillDown("hours")}
          delay={0.16}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: FRICTION_FONTS.mono, fontSize: isSquished ? "1rem" : "1.3rem", color: FRICTION_COLORS.blue200 }}>
              {TOTAL_DEEP_WORK_HOURS}
            </span>
            <span style={{ fontSize: "0.45rem", color: FRICTION_COLORS.textMuted }}>hours</span>
          </div>
        </StatCard>
      </div>

      {/* Recent sessions list */}
      <div>
        <div style={{ ...labelStyle, marginBottom: 8 }}>Recent Sessions</div>
        <div className="space-y-1">
          {PAST_SESSIONS.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all"
              style={{
                backgroundColor: FRICTION_COLORS.bgElevated,
                border: `1px solid ${FRICTION_COLORS.borderSubtle}`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = FRICTION_COLORS.borderActive; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = FRICTION_COLORS.borderSubtle; }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: "0.6rem", color: FRICTION_COLORS.textPrimary }}>{session.dateShort}</span>
                  <span style={{ fontSize: "0.45rem", color: FRICTION_COLORS.textMuted }}>{session.dayOfWeek}</span>
                </div>
              </div>
              <span style={{ ...dataStyle, fontSize: "0.45rem" }}>{formatDuration(session.durationMinutes)}</span>
              <span style={{ ...dataStyle, fontSize: "0.45rem", color: FRICTION_COLORS.textMuted }}>{session.taskCount} tasks</span>
              <span
                className="px-1.5 py-0.5 rounded-full"
                style={{
                  fontSize: "0.4rem",
                  fontFamily: FRICTION_FONTS.heading,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: intensityColor(session.intensityLabel),
                  backgroundColor: intensityBg(session.intensityLabel),
                }}
              >
                {session.intensityLabel}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className={isSquished ? "space-y-4" : "grid grid-cols-2 gap-4"}>
        {/* Radial clock */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-lg"
          style={cardStyle}
        >
          <div style={{ ...labelStyle, fontSize: "0.45rem", marginBottom: 8 }}>Peak Hours</div>
          <RadialClock size={isSquished ? 120 : 160} />
        </motion.div>

        {/* Weekly bar chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="p-4 rounded-lg"
          style={cardStyle}
        >
          <div style={{ ...labelStyle, fontSize: "0.45rem", marginBottom: 8 }}>Weekly Intensity</div>
          <WeeklyBarChart height={isSquished ? 80 : 110} />
        </motion.div>
      </div>
    </div>
  );
}

/** Reusable stat card wrapper */
function StatCard({
  label, onClick, delay, children,
}: {
  label: string;
  onClick: () => void;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="w-full p-3 rounded-lg cursor-pointer transition-all text-left group"
      style={{
        ...cardStyle,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = FRICTION_COLORS.borderActive; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = FRICTION_COLORS.borderSubtle; }}
    >
      <div className="flex items-center justify-between">
        <span style={{ ...labelStyle, fontSize: "0.45rem" }}>{label}</span>
        <ChevronRight size={10} style={{ color: FRICTION_COLORS.textMuted, opacity: 0.5 }} />
      </div>
      {children}
    </motion.button>
  );
}


// ══════════════════════════════════════════════════════════════
//  SCREEN 3: DETAIL
// ══════════════════════════════════════════════════════════════

function DetailScreen({
  activeView, onChangeView, onBack, isSquished,
}: {
  activeView: DetailView;
  onChangeView: (v: DetailView) => void;
  onBack: () => void;
  isSquished: boolean;
}) {
  const [timeRange, setTimeRange] = useState<"today" | "month" | "year" | "custom">("month");
  const insight = DETAIL_INSIGHTS[activeView];

  return (
    <div className="px-5 py-5 space-y-4">
      {/* Back + title */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1 cursor-pointer transition-all hover:opacity-80"
          style={{
            ...labelStyle,
            fontSize: "0.5rem",
            color: FRICTION_COLORS.textAccent,
            background: "none",
            border: "none",
            padding: 0,
          }}
        >
          <ChevronLeft size={12} />
          Back
        </button>
        <div className="flex-1" />
        {/* View switcher pills */}
        {(["intensity", "sessions", "hours"] as const).map(v => (
          <button
            key={v}
            onClick={() => onChangeView(v)}
            className="px-2 py-0.5 rounded-full cursor-pointer transition-all"
            style={{
              fontSize: "0.42rem",
              fontFamily: FRICTION_FONTS.heading,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              backgroundColor: activeView === v ? "rgba(107, 95, 255, 0.12)" : "transparent",
              border: `1px solid ${activeView === v ? FRICTION_COLORS.borderActive : "transparent"}`,
              color: activeView === v ? FRICTION_COLORS.blue200 : FRICTION_COLORS.textMuted,
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Main content: stacked in squished, side-by-side in expanded */}
      <div className={isSquished ? "space-y-4" : "flex gap-5"}>
        {/* Left: time range + chart */}
        <div className={isSquished ? "" : "flex-1"}>
          {/* Time range selector */}
          <div className="flex gap-1 mb-4">
            {(["today", "month", "year", "custom"] as const).map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className="px-2.5 py-1 rounded-md cursor-pointer transition-all"
                style={{
                  fontSize: "0.45rem",
                  fontFamily: FRICTION_FONTS.heading,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  backgroundColor: timeRange === r ? "rgba(107, 95, 255, 0.1)" : "transparent",
                  border: `1px solid ${timeRange === r ? FRICTION_COLORS.borderActive : FRICTION_COLORS.borderSubtle}`,
                  color: timeRange === r ? FRICTION_COLORS.blue200 : FRICTION_COLORS.textMuted,
                }}
              >
                {r === "month" ? "Last Month" : r === "year" ? "This Year" : r === "custom" ? "Custom" : "Today"}
              </button>
            ))}
          </div>

          {/* Chart area */}
          <div
            className="rounded-lg p-4 flex items-center justify-center"
            style={{
              ...cardStyle,
              minHeight: isSquished ? 160 : 220,
            }}
          >
            <AnimatePresence mode="wait">
              {activeView === "intensity" && (
                <motion.div key="donut" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <DetailDonut size={isSquished ? 120 : 170} />
                </motion.div>
              )}
              {activeView === "sessions" && (
                <motion.div key="orb" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <PulsingOrb count={SESSIONS_THIS_MONTH} size={isSquished ? 110 : 150} />
                </motion.div>
              )}
              {activeView === "hours" && (
                <motion.div key="bars" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full">
                  <HoursBarChart height={isSquished ? 120 : 170} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: mini stats + insights + recommendation */}
        <div className={isSquished ? "" : "w-[280px] shrink-0"}>
          {/* Mini stat tiles */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {insight.miniStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="p-2.5 rounded-lg"
                style={cardStyle}
              >
                <div style={{ ...labelStyle, fontSize: "0.4rem", marginBottom: 3 }}>{stat.label}</div>
                <div className="flex items-center gap-1">
                  <span style={{ fontFamily: FRICTION_FONTS.mono, fontSize: "0.75rem", color: FRICTION_COLORS.blue200 }}>
                    {stat.value}
                  </span>
                  {stat.change === "up" && <ArrowUpRight size={10} style={{ color: FRICTION_COLORS.success }} />}
                  {stat.change === "down" && <ArrowDownRight size={10} style={{ color: FRICTION_COLORS.danger }} />}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Insight paragraphs */}
          <div className="space-y-3 mb-4">
            {insight.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                style={{ ...bodyStyle, fontSize: "0.58rem", color: FRICTION_COLORS.textSecondary, lineHeight: 1.65 }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-3 rounded-lg"
            style={{
              backgroundColor: "rgba(107, 95, 255, 0.06)",
              border: `1px solid ${FRICTION_COLORS.borderDefault}`,
              borderRadius: 8,
            }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Sun size={11} style={{ color: FRICTION_COLORS.blue300 }} />
              <span style={{ ...labelStyle, fontSize: "0.42rem", color: FRICTION_COLORS.blue200 }}>Recommendation</span>
            </div>
            <p style={{ ...bodyStyle, fontSize: "0.55rem", color: FRICTION_COLORS.textSecondary, lineHeight: 1.6 }}>
              {insight.recommendation}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════
//  BESPOKE SVG CHARTS
// ══════════════════════════════════════════════════════════════

// ── Mini Donut (for stat card) ──────────────────────────────

function MiniDonut() {
  const size = 36;
  const r = 13;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const slices = [
    { pct: INTENSITY_DISTRIBUTION.high, color: FRICTION_COLORS.red300 },
    { pct: INTENSITY_DISTRIBUTION.moderate, color: FRICTION_COLORS.violet300 },
    { pct: INTENSITY_DISTRIBUTION.calm, color: FRICTION_COLORS.blue300 },
  ];

  let offset = 0;
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size}>
        {slices.map((slice, i) => {
          const dashLength = (slice.pct / 100) * circumference;
          const dashGap = circumference - dashLength;
          const currentOffset = offset;
          offset += dashLength;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={slice.color}
              strokeWidth={5}
              strokeDasharray={`${dashLength} ${dashGap}`}
              strokeDashoffset={-currentOffset}
              style={{ opacity: 0.85 }}
            />
          );
        })}
      </svg>
      <div className="flex flex-col gap-0.5">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: slice.color }} />
            <span style={{ fontSize: "0.4rem", color: FRICTION_COLORS.textMuted }}>
              {slice.pct}% {["High", "Mod", "Calm"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Detail Donut (larger, for Screen 3) ─────────────────────

function DetailDonut({ size }: { size: number }) {
  const r = size * 0.35;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const slices = [
    { pct: INTENSITY_DISTRIBUTION.high, color: FRICTION_COLORS.red300, label: "High" },
    { pct: INTENSITY_DISTRIBUTION.moderate, color: FRICTION_COLORS.violet300, label: "Moderate" },
    { pct: INTENSITY_DISTRIBUTION.calm, color: FRICTION_COLORS.blue300, label: "Calm" },
  ];

  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size}>
        {slices.map((slice, i) => {
          const dashLength = (slice.pct / 100) * circumference;
          const dashGap = circumference - dashLength;
          const currentOffset = offset;
          offset += dashLength;
          return (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={slice.color}
              strokeWidth={size * 0.1}
              strokeDasharray={`${dashLength} ${dashGap}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: -currentOffset }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 4px ${slice.color}44)` }}
            />
          );
        })}
        {/* Center text */}
        <text
          x={cx} y={cy - 4}
          textAnchor="middle"
          fill={FRICTION_COLORS.textPrimary}
          style={{ fontFamily: FRICTION_FONTS.mono, fontSize: size * 0.12 }}
        >
          {INTENSITY_DISTRIBUTION.high}%
        </text>
        <text
          x={cx} y={cy + 10}
          textAnchor="middle"
          fill={FRICTION_COLORS.textMuted}
          style={{ fontFamily: FRICTION_FONTS.heading, fontSize: size * 0.06, textTransform: "uppercase", letterSpacing: "0.1em" }}
        >
          HIGH
        </text>
      </svg>
      <div className="flex gap-4">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: slice.color }} />
            <span style={{ fontSize: "0.5rem", color: FRICTION_COLORS.textSecondary }}>
              {slice.pct}% {slice.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pulsing Orb (for sessions count) ────────────────────────

function PulsingOrb({ count, size }: { count: number; size: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow rings */}
        {[0.8, 0.6, 0.4].map((scale, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [scale, scale + 0.15, scale],
              opacity: [0.08 + i * 0.02, 0.15 + i * 0.03, 0.08 + i * 0.02],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
            style={{
              background: `radial-gradient(circle, ${FRICTION_COLORS.blue300}33 0%, transparent 70%)`,
            }}
          />
        ))}
        {/* Core orb */}
        <motion.div
          className="absolute rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 1.04, 1],
            boxShadow: [
              `0 0 20px ${FRICTION_COLORS.blueGlow}, inset 0 0 20px ${FRICTION_COLORS.blueGlow}`,
              `0 0 35px ${FRICTION_COLORS.blueGlow}, inset 0 0 30px ${FRICTION_COLORS.violetGlow}`,
              `0 0 20px ${FRICTION_COLORS.blueGlow}, inset 0 0 20px ${FRICTION_COLORS.blueGlow}`,
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            inset: "15%",
            background: `radial-gradient(circle at 40% 35%, ${FRICTION_COLORS.blue400} 0%, ${FRICTION_COLORS.bgDeep} 70%)`,
            border: `1px solid ${FRICTION_COLORS.blue400}44`,
          }}
        >
          <div className="text-center">
            <div style={{ fontFamily: FRICTION_FONTS.mono, fontSize: size * 0.2, color: FRICTION_COLORS.blue100 }}>
              {count}
            </div>
            <div style={{ fontFamily: FRICTION_FONTS.heading, fontSize: size * 0.07, color: FRICTION_COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.15em" }}>
              sessions
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ── Radial Clock (24h intensity) ────────────────────────────

function RadialClock({ size }: { size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const innerR = size * 0.18;
  const maxR = size * 0.44;

  return (
    <div className="flex justify-center">
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle cx={cx} cy={cy} r={maxR + 2} fill="none" stroke={FRICTION_COLORS.borderSubtle} strokeWidth={0.5} />
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke={FRICTION_COLORS.borderSubtle} strokeWidth={0.5} />

        {/* Hour segments */}
        {HOURLY_INTENSITY.map((intensity, hour) => {
          const angleStart = ((hour - 6) / 24) * 360 - 90; // 6 AM at top
          const angleEnd = ((hour - 6 + 1) / 24) * 360 - 90;
          const r1 = innerR;
          const r2 = innerR + (maxR - innerR) * intensity;

          const a1 = (angleStart * Math.PI) / 180;
          const a2 = (angleEnd * Math.PI) / 180;
          const gap = 0.015; // small gap between segments

          const x1Inner = cx + r1 * Math.cos(a1 + gap);
          const y1Inner = cy + r1 * Math.sin(a1 + gap);
          const x2Inner = cx + r1 * Math.cos(a2 - gap);
          const y2Inner = cy + r1 * Math.sin(a2 - gap);
          const x1Outer = cx + r2 * Math.cos(a1 + gap);
          const y1Outer = cy + r2 * Math.sin(a1 + gap);
          const x2Outer = cx + r2 * Math.cos(a2 - gap);
          const y2Outer = cy + r2 * Math.sin(a2 - gap);

          const largeArc = 0;

          const d = [
            `M ${x1Inner} ${y1Inner}`,
            `A ${r1} ${r1} 0 ${largeArc} 1 ${x2Inner} ${y2Inner}`,
            `L ${x2Outer} ${y2Outer}`,
            `A ${r2} ${r2} 0 ${largeArc} 0 ${x1Outer} ${y1Outer}`,
            "Z",
          ].join(" ");

          // Color: blue → violet → red based on intensity
          const color = intensity > 0.7
            ? FRICTION_COLORS.red300
            : intensity > 0.4
            ? FRICTION_COLORS.violet300
            : FRICTION_COLORS.blue400;

          return (
            <path
              key={hour}
              d={d}
              fill={color}
              opacity={0.3 + intensity * 0.6}
              style={{ filter: intensity > 0.7 ? `drop-shadow(0 0 2px ${color}66)` : "none" }}
            />
          );
        })}

        {/* Hour labels — just key hours */}
        {[6, 9, 12, 15, 18, 21, 0].map(hour => {
          const angle = ((hour - 6) / 24) * 360 - 90;
          const labelR = maxR + 10;
          const x = cx + labelR * Math.cos((angle * Math.PI) / 180);
          const y = cy + labelR * Math.sin((angle * Math.PI) / 180);
          const label = hour === 0 ? "12a" : hour <= 12 ? `${hour}${hour < 12 ? "a" : "p"}` : `${hour - 12}p`;
          return (
            <text
              key={hour}
              x={x} y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={FRICTION_COLORS.textMuted}
              style={{ fontFamily: FRICTION_FONTS.mono, fontSize: size * 0.055 }}
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ── Weekly Bar Chart ────────────────────────────────────────

function WeeklyBarChart({ height }: { height: number }) {
  const barWidth = 24;
  const gap = 8;
  const totalWidth = WEEKLY_INTENSITY.length * (barWidth + gap) - gap;
  const maxBarHeight = height - 20;

  return (
    <div className="flex justify-center">
      <svg width={totalWidth + 10} height={height + 16} style={{ overflow: "visible" }}>
        {WEEKLY_INTENSITY.map((item, i) => {
          const barH = Math.max(2, item.value * maxBarHeight);
          const x = i * (barWidth + gap) + 5;
          const y = height - barH;

          const color = item.value > 0.7
            ? FRICTION_COLORS.red300
            : item.value > 0.4
            ? FRICTION_COLORS.violet300
            : FRICTION_COLORS.blue400;

          return (
            <g key={item.day}>
              <motion.rect
                x={x}
                width={barWidth}
                rx={3}
                fill={color}
                opacity={item.value === 0 ? 0.1 : 0.7}
                initial={{ y: height, height: 0 }}
                animate={{ y, height: barH }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                style={{ filter: item.value > 0.7 ? `drop-shadow(0 0 3px ${color}44)` : "none" }}
              />
              <text
                x={x + barWidth / 2}
                y={height + 12}
                textAnchor="middle"
                fill={FRICTION_COLORS.textMuted}
                style={{ fontFamily: FRICTION_FONTS.mono, fontSize: "0.45rem" }}
              >
                {item.day}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Hours Bar Chart (for Detail Screen) ─────────────────────

function HoursBarChart({ height }: { height: number }) {
  // Show hours per day for the past 8 sessions, grouped by date
  const data = PAST_SESSIONS.slice(0, 7).reverse().map(s => ({
    label: s.dateShort,
    hours: +(s.durationMinutes / 60).toFixed(1),
  }));

  const maxHours = Math.max(...data.map(d => d.hours));
  const barWidth = 28;
  const gap = 10;
  const totalWidth = data.length * (barWidth + gap) - gap;
  const maxBarHeight = height - 24;

  return (
    <div className="flex justify-center w-full">
      <svg width={totalWidth + 10} height={height + 16} style={{ overflow: "visible" }}>
        {data.map((item, i) => {
          const barH = Math.max(2, (item.hours / maxHours) * maxBarHeight);
          const x = i * (barWidth + gap) + 5;
          const y = height - barH;

          return (
            <g key={item.label}>
              <motion.rect
                x={x}
                width={barWidth}
                rx={3}
                fill={FRICTION_COLORS.blue300}
                opacity={0.7}
                initial={{ y: height, height: 0 }}
                animate={{ y, height: barH }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              />
              {/* Value on top */}
              <motion.text
                x={x + barWidth / 2}
                textAnchor="middle"
                fill={FRICTION_COLORS.textSecondary}
                initial={{ y: height, opacity: 0 }}
                animate={{ y: y - 4, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }}
                style={{ fontFamily: FRICTION_FONTS.mono, fontSize: "0.42rem" }}
              >
                {item.hours}h
              </motion.text>
              <text
                x={x + barWidth / 2}
                y={height + 12}
                textAnchor="middle"
                fill={FRICTION_COLORS.textMuted}
                style={{ fontFamily: FRICTION_FONTS.mono, fontSize: "0.38rem" }}
              >
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}