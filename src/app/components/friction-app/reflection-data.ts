/**
 * REFLECTION — Hardcoded Demo Data
 * ============================================================
 * Fake session history for the Reflection / Mirror screen.
 * 8 sessions spanning Feb 28 – Mar 8, 2026.
 */

export interface ReflectionTask {
  id: string;
  title: string;
  intensity: "high" | "moderate" | "low";
  durationMinutes: number;
  completed: boolean;
}

export interface PastSession {
  id: string;
  date: string;            // "Mar 8, 2026"
  dateShort: string;       // "Mar 8"
  dayOfWeek: string;       // "Sunday"
  durationMinutes: number;
  taskCount: number;
  intensityScore: number;  // 0–1
  intensityLabel: "High" | "Moderate" | "Calm";
  tasks: ReflectionTask[];
}

export const PAST_SESSIONS: PastSession[] = [
  {
    id: "s1",
    date: "Mar 8, 2026",
    dateShort: "Mar 8",
    dayOfWeek: "Sunday",
    durationMinutes: 145,
    taskCount: 6,
    intensityScore: 0.82,
    intensityLabel: "High",
    tasks: [
      { id: "s1t1", title: "API architecture review", intensity: "high", durationMinutes: 42, completed: true },
      { id: "s1t2", title: "Sprint planning notes", intensity: "moderate", durationMinutes: 25, completed: true },
      { id: "s1t3", title: "Debug auth token refresh", intensity: "high", durationMinutes: 38, completed: true },
      { id: "s1t4", title: "Update deployment docs", intensity: "low", durationMinutes: 12, completed: true },
      { id: "s1t5", title: "Code review — PR #247", intensity: "moderate", durationMinutes: 18, completed: true },
      { id: "s1t6", title: "Refactor error handling", intensity: "high", durationMinutes: 10, completed: false },
    ],
  },
  {
    id: "s2",
    date: "Mar 7, 2026",
    dateShort: "Mar 7",
    dayOfWeek: "Saturday",
    durationMinutes: 90,
    taskCount: 4,
    intensityScore: 0.45,
    intensityLabel: "Moderate",
    tasks: [
      { id: "s2t1", title: "Read research papers", intensity: "moderate", durationMinutes: 35, completed: true },
      { id: "s2t2", title: "Organize bookmarks", intensity: "low", durationMinutes: 15, completed: true },
      { id: "s2t3", title: "Draft blog outline", intensity: "moderate", durationMinutes: 28, completed: true },
      { id: "s2t4", title: "Reply to emails", intensity: "low", durationMinutes: 12, completed: true },
    ],
  },
  {
    id: "s3",
    date: "Mar 6, 2026",
    dateShort: "Mar 6",
    dayOfWeek: "Friday",
    durationMinutes: 175,
    taskCount: 7,
    intensityScore: 0.91,
    intensityLabel: "High",
    tasks: [
      { id: "s3t1", title: "Implement WebSocket layer", intensity: "high", durationMinutes: 55, completed: true },
      { id: "s3t2", title: "Write integration tests", intensity: "high", durationMinutes: 40, completed: true },
      { id: "s3t3", title: "Performance profiling", intensity: "high", durationMinutes: 30, completed: true },
      { id: "s3t4", title: "Team standup notes", intensity: "low", durationMinutes: 8, completed: true },
      { id: "s3t5", title: "Database migration plan", intensity: "moderate", durationMinutes: 22, completed: true },
      { id: "s3t6", title: "Update CI pipeline", intensity: "moderate", durationMinutes: 15, completed: true },
      { id: "s3t7", title: "Security audit prep", intensity: "high", durationMinutes: 5, completed: false },
    ],
  },
  {
    id: "s4",
    date: "Mar 5, 2026",
    dateShort: "Mar 5",
    dayOfWeek: "Thursday",
    durationMinutes: 120,
    taskCount: 5,
    intensityScore: 0.62,
    intensityLabel: "Moderate",
    tasks: [
      { id: "s4t1", title: "Design system audit", intensity: "moderate", durationMinutes: 35, completed: true },
      { id: "s4t2", title: "Component library docs", intensity: "moderate", durationMinutes: 30, completed: true },
      { id: "s4t3", title: "Fix CSS grid issues", intensity: "moderate", durationMinutes: 25, completed: true },
      { id: "s4t4", title: "Slack catch-up", intensity: "low", durationMinutes: 15, completed: true },
      { id: "s4t5", title: "Accessibility review", intensity: "moderate", durationMinutes: 15, completed: true },
    ],
  },
  {
    id: "s5",
    date: "Mar 4, 2026",
    dateShort: "Mar 4",
    dayOfWeek: "Wednesday",
    durationMinutes: 95,
    taskCount: 3,
    intensityScore: 0.28,
    intensityLabel: "Calm",
    tasks: [
      { id: "s5t1", title: "Journal & planning", intensity: "low", durationMinutes: 25, completed: true },
      { id: "s5t2", title: "Organize project files", intensity: "low", durationMinutes: 40, completed: true },
      { id: "s5t3", title: "Light reading — HN", intensity: "low", durationMinutes: 30, completed: true },
    ],
  },
  {
    id: "s6",
    date: "Mar 3, 2026",
    dateShort: "Mar 3",
    dayOfWeek: "Tuesday",
    durationMinutes: 160,
    taskCount: 6,
    intensityScore: 0.78,
    intensityLabel: "High",
    tasks: [
      { id: "s6t1", title: "Rewrite caching layer", intensity: "high", durationMinutes: 50, completed: true },
      { id: "s6t2", title: "Load testing scripts", intensity: "high", durationMinutes: 35, completed: true },
      { id: "s6t3", title: "Monitoring dashboard", intensity: "moderate", durationMinutes: 30, completed: true },
      { id: "s6t4", title: "Update env configs", intensity: "low", durationMinutes: 10, completed: true },
      { id: "s6t5", title: "PR reviews (3)", intensity: "moderate", durationMinutes: 25, completed: true },
      { id: "s6t6", title: "Incident postmortem", intensity: "high", durationMinutes: 10, completed: false },
    ],
  },
  {
    id: "s7",
    date: "Mar 1, 2026",
    dateShort: "Mar 1",
    dayOfWeek: "Sunday",
    durationMinutes: 70,
    taskCount: 3,
    intensityScore: 0.35,
    intensityLabel: "Calm",
    tasks: [
      { id: "s7t1", title: "Weekly review", intensity: "low", durationMinutes: 20, completed: true },
      { id: "s7t2", title: "Sketch new feature ideas", intensity: "moderate", durationMinutes: 30, completed: true },
      { id: "s7t3", title: "Clean up desktop", intensity: "low", durationMinutes: 20, completed: true },
    ],
  },
  {
    id: "s8",
    date: "Feb 28, 2026",
    dateShort: "Feb 28",
    dayOfWeek: "Saturday",
    durationMinutes: 130,
    taskCount: 5,
    intensityScore: 0.72,
    intensityLabel: "High",
    tasks: [
      { id: "s8t1", title: "GraphQL schema refactor", intensity: "high", durationMinutes: 45, completed: true },
      { id: "s8t2", title: "Resolver unit tests", intensity: "moderate", durationMinutes: 30, completed: true },
      { id: "s8t3", title: "Documentation update", intensity: "low", durationMinutes: 20, completed: true },
      { id: "s8t4", title: "Client SDK review", intensity: "moderate", durationMinutes: 25, completed: true },
      { id: "s8t5", title: "Backlog grooming", intensity: "low", durationMinutes: 10, completed: true },
    ],
  },
];

// ── Derived aggregates ──────────────────────────────────────

/** Donut chart: 42% High, 34% Moderate, 24% Calm */
export const INTENSITY_DISTRIBUTION = {
  high: 42,
  moderate: 34,
  calm: 24,
} as const;

/** Sessions this month */
export const SESSIONS_THIS_MONTH = PAST_SESSIONS.length;

/** Total deep work hours (sum of all session durations) */
export const TOTAL_DEEP_WORK_HOURS = +(
  PAST_SESSIONS.reduce((sum, s) => sum + s.durationMinutes, 0) / 60
).toFixed(1);

/** 7-day bar chart: Mon–Sun intensity averages */
export const WEEKLY_INTENSITY = [
  { day: "Mon", value: 0.0 },   // no session
  { day: "Tue", value: 0.78 },
  { day: "Wed", value: 0.28 },
  { day: "Thu", value: 0.62 },
  { day: "Fri", value: 0.91 },
  { day: "Sat", value: 0.58 },  // avg of s2 + s8
  { day: "Sun", value: 0.58 },  // avg of s1 + s7
] as const;

/** Radial clock: intensity by hour (24 slots, peaks at 9–12) */
export const HOURLY_INTENSITY: number[] = Array.from({ length: 24 }, (_, h) => {
  if (h >= 9 && h <= 11) return 0.85 + Math.random() * 0.1;
  if (h === 8 || h === 12) return 0.6 + Math.random() * 0.1;
  if (h >= 13 && h <= 16) return 0.4 + Math.random() * 0.15;
  if (h >= 17 && h <= 19) return 0.25 + Math.random() * 0.1;
  if (h >= 20 && h <= 22) return 0.15 + Math.random() * 0.1;
  return 0.05 + Math.random() * 0.05;
});

// ── Screen 3 contextual insights ────────────────────────────

export interface DetailInsight {
  miniStats: { label: string; value: string; change?: string }[];
  paragraphs: string[];
  recommendation: string;
}

export const DETAIL_INSIGHTS: Record<"intensity" | "sessions" | "hours", DetailInsight> = {
  intensity: {
    miniStats: [
      { label: "WoW Change", value: "+12%", change: "up" },
      { label: "Daily Avg", value: "2.1h" },
      { label: "Sessions", value: "8" },
      { label: "Peak Day", value: "Friday" },
    ],
    paragraphs: [
      "Your intensity patterns show a clear mid-week ramp. Tuesdays and Fridays consistently register as your highest-load days, with cognitive weight scores regularly exceeding 0.75. This aligns with typical sprint cadences where deep implementation work clusters around mid-cycle.",
      "Weekend sessions tend to be lighter but longer — you're spending more time in moderate-intensity states. Your recovery windows between high-intensity blocks average 18 hours, which is within the healthy range for sustained cognitive performance.",
    ],
    recommendation: "Schedule your hardest tasks for Tuesday and Friday mornings (9–11 AM). Reserve Wednesday afternoons for lighter administrative work — your data shows a natural energy dip mid-week that you've been intuitively following.",
  },
  sessions: {
    miniStats: [
      { label: "This Month", value: "8", change: "up" },
      { label: "Avg Duration", value: "123min" },
      { label: "Completion", value: "92%" },
      { label: "Streak", value: "6 days" },
    ],
    paragraphs: [
      "You've maintained a consistent session cadence with 8 sessions over 9 days. Your average session duration of 123 minutes sits in the optimal zone — long enough for deep work states but short enough to avoid significant glutamate buildup.",
      "The 6-day streak is your longest this quarter. Sessions on consecutive days show a compounding effect: your time-to-flow decreased from ~12 minutes to ~7 minutes by day 4, suggesting your brain is adapting to the routine.",
    ],
    recommendation: "You're in a strong rhythm. Consider adding a brief 'warm-up task' (5–10 min, low cognitive weight) at the start of each session to prime your attention networks before diving into deep work.",
  },
  hours: {
    miniStats: [
      { label: "This Week", value: "9.2h", change: "up" },
      { label: "Daily Avg", value: "2.1h" },
      { label: "Peak Hours", value: "9–11 AM" },
      { label: "Longest", value: "2h 55m" },
    ],
    paragraphs: [
      "Total deep work hours have increased 18% compared to last week. Your morning window (9 AM–noon) accounts for 64% of all productive hours, with the 10 AM hour being your most consistently high-performing slot across all 8 sessions.",
      "Afternoon sessions (post-2 PM) show 34% lower focus scores on average. When you do work in the afternoon, moderate-intensity tasks perform significantly better than high-intensity ones — your completion rate drops from 95% to 71% for deep tasks after lunch.",
    ],
    recommendation: "Protect your 9–11 AM window aggressively — no meetings, no Slack. Move all deep work to mornings and batch lighter tasks for post-lunch. Your data suggests a 20-minute break at 11:30 AM could extend your morning peak by ~45 minutes.",
  },
};
