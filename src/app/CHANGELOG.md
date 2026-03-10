# Friction Companion — Changelog

All notable changes to the codebase are documented here for traceability.

---

## [2026-03-10] Reflection Component — Planning & Cross-Questions

### Step-Away Pathway Split (implemented)
- **ControlPanel.tsx**: `handlePickBackUp` now branches on absence duration via `steppedAwayAtRef` timestamp
  - **Short absence** (< 90s): Neural Residue swipe-to-clear (moss pathway), aggressive focus restore to ~80% pre-away
  - **Long absence** (≥ 90s): Skips residue → focus stays at 0.18 → RefocusPopup (exercise cards) appears naturally
  - Threshold configurable via `LONG_ABSENCE_THRESHOLD_MS`
- **RefocusPopup.tsx**: Exercise completion now boosts focus to 0.55 over 2s via `simulateGradualChange`, clearing the < 0.30 threshold so the popup dismisses
- **DigitalMoss.tsx**: `setClearProgress` throttled — only calls setState when rounded percentage changes (was firing 60x/sec)

### Phase 6: Reflection Component — TODO Created
- Full TODO breakdown added to `/src/app/TODO.md` (Phase 6, items T6.1–T6.20)
- 10 cross-questions posed to clarify architecture, styling, data sourcing, and interaction design
- **Awaiting answers before implementation begins**

## [2026-03-09] Friction OS Daemon Spec Implementation

### Phase 0: Bug Fixes & Polish
- **T0.1** Desktop wallpaper replaced with green rolling hills (Unsplash) — Vista-inspired
- **T0.2** Window.tsx: macOS traffic-light buttons replaced with Windows-style minimize/maximize/close (right-aligned, rectangular, red close-on-hover)
- **T0.3** ProgressiveVignette: fixed prop mismatch — now accepts `intensity: number` directly and reads biometrics internally via `useBiometrics()` hook
- **T0.5** DigitalMoss: fixed prop mismatch — DesktopOS was passing `onComplete` but component expects `onClear`

### Phase 1: Right-Side Drawer (Spec Part 1)
- FrictionOverlay rewritten as a dual-mode component:
  - **Idle state**: retracted to thin glowing amber edge on right; expands to 320px drawer on hover
  - **Active session**: adaptive sidebar that scales with biometrics (same as before but with End Session button)
  - **Post-session**: auto-slides out showing Mirror/Reflection screen
- Screen toggle tabs: Terminal (Droplets icon) and Mirror (Eye icon)

### Phase 2: Screen 1 — The Terminal / Moon Pool (Spec Part 2)
- **Moon Pool** visualization: radial gradient "pool" with floating task nodes sized by cognitive weight
- Task list with cognitive weight indicators
- Session duration slider (15-120 min boundary)
- **"Immerse" button**: starts session and retracts drawer

### Phase 3: Screen 2 — The Scaffolding (Spec Part 3)
All 6 biometric-driven sub-states now implemented:
- **State 2.1 Pure Invisibility**: Focus > 80% + Fatigue < 40% = Friction completely invisible
- **State 2.2 Edge-Bump** (`EdgeBump.tsx`): mouse to far-right edge peeks translucent task drawer; click to complete + snap back
- **State 2.3 Passive Task Bar** (`PassiveTaskBar.tsx`): Focus 50-80% = low-contrast floating pill at top-center showing current task name
- **State 2.4 Low Focus Pivot** (`LowFocusPivot.tsx`): Focus < 50% + Fatigue rising = full-screen blur + 3 intervention bubbles (Breathe/Posture/Audio Shift) with progress rings; auto-dismisses after completion, 60s cooldown
- **State 2.5 Digital Moss**: already built, integration verified with context-switch flow
- **State 2.6 Hard Intercept**: ProgressiveVignette at Fatigue > 85%, creeping vignette + lockout modal + countdown

### Phase 4: Session Termination (Spec Part 4)
- End Session button in overlay footer
- On session end: OS returns to normal, drawer auto-slides out with Mirror screen

### Phase 5: Screen 3 — The Mirror / Reflection (Spec Part 5)
- **Depth of Field timeline**: bar chart where each segment's height = focus level, blur = inverse of focus (sharp = flow, blurry = scattered)
- Completed tasks list with checkmarks
- Remaining tasks list
- Session insight text based on completion rate

---

## [2026-03-09] Friction as Background Daemon + Auto-Drift Biometrics

### Friction is NOT a launchable app
- Removed FrictionApp from DesktopOS `APP_COMPONENTS` and Dock app list
- Friction now lives exclusively as a background process — no window, no Dock icon
- The `FrictionOverlay` ambient sidebar is the only user-facing UI manifestation

### System Tray Icon
- Added `FrictionTrayIcon` to the Dock's system tray area (between ChevronUp and WiFi)
- Diamond-shaped icon: glows amber + pulses when session is active, dim gray when idle
- **Rich hover tooltip** shows:
  - "Friction Companion" header with diamond logo
  - Current mode (Invisible / Monitoring / Taper / Scaffolding / Recovery / Hard Intercept)
  - Live biometric bars (Focus, Fatigue, Engagement) with color-coded values
  - "(auto)" indicator when auto-drift is running

### Auto-Drift Biometrics
- `BiometricContext` now includes `isAutoDrifting` (default: `true`) and `setAutoDrifting`
- Auto-drift engine: layered sine waves cycle biometrics through a ~3 minute "work session":
  - Focus ramps up → peaks → tapers (range: 0.08–0.95)
  - Fatigue slowly builds then dips on cycle reset (range: 0.05–0.92)
  - Engagement fluctuates independently (range: 0.15–0.90)
- **Manual override**: touching any slider pauses auto-drift for 8 seconds, then resumes
- **Play/Pause button**: added to the "Biometric Override" section header in ControlPanel
- Demo is now self-running — the OS effects (brightness, taper warmth, overlay sidebar)
  animate continuously without any user interaction

### Auto-Start Session
- `AppContent` now auto-starts a session on mount so the Friction effects are always live
- The FrictionOverlay responds to biometrics immediately — no need to click "start session"

---

## [2026-03-09] Three-Chunk Architecture Refactor

Codebase reorganized into 3 clearly separated architectural chunks so the
Neural Interface and Desktop OS (both at final fidelity) can remain stable
while the Friction digital app is iterated on independently.

### Chunk 1 — Neural Interface (`components/control-panel/`)
Left-side simulation panel. Contains `ControlPanel.tsx` and `FrictionKeyboard.tsx`.
No file changes — already cleanly isolated.

### Chunk 2 — Desktop OS (`components/desktop/` + `components/apps/`)
Right-side fake Windows environment. 11 OS apps remain in `components/apps/`.
Desktop infrastructure (Window, Dock, DesktopOS, effects) stays in `components/desktop/`.
FrictionApp registered as a launchable OS app (icon: diamond, Dock entry).

### Chunk 3 — Friction App (`components/friction-app/`) — NEW DIRECTORY
All Friction product code consolidated from 4 scattered locations into one directory:

**Moved in:**
- `FrictionApp.tsx` — from `components/apps/` (main app shell with tab navigation)
- `FrictionOverlay.tsx` — from `components/apps/` (ambient sidebar, null when no session)
- `TerminalPage.tsx` — from `pages/` (task ingestion UI)
- `SessionPage.tsx` — from `pages/` (live session monitor)
- `MirrorPage.tsx` — from `pages/` (post-session review)
- `BatteryStack.tsx` — from `components/terminal/` (cognitive load visualization)
- `TaskNode.tsx` — from `components/terminal/` (individual task row)
- `DepthTimeline.tsx` — from `components/mirror/` (blur-based session topography)
- `InsightCard.tsx` — from `components/mirror/` (qualitative insight display)

**Deleted directories:** `pages/`, `components/terminal/`, `components/mirror/`

**Import path fixes:** All internal imports updated for new directory structure.
All cross-references verified — zero broken imports.

### CSS Separation

Component-specific CSS tokens extracted from `brutalist-tactile.css` into 3 files:

- **`themes/neural-interface.css`** — Keyboard connection indicator, panel color tokens
- **`themes/desktop-os.css`** — Window chrome, moss overlay, progressive vignette
- **`themes/friction-app.css`** — Task weights, cognitive battery, timeline blur, overlay sidebar

Base theme files (`brutalist-tactile.css`, `invisible-clinic.css`) retain shared tokens
(backgrounds, text, accents, borders, shadows, typography, spacing, transitions).
`index.css` updated to import all 3 chunk CSS files after the active theme.

### Friction App Wired into OS
- `FrictionApp` registered in `DesktopOS.tsx` `APP_COMPONENTS` map
- Added to `Dock.tsx` app list (icon: diamond, color: #ff6f00, 900x650 window)
- Launchable like any other OS app — click the Dock icon to open in a window

### Updated Architecture Tree

```
src/
  styles/
    index.css                        # Master import (fonts, tailwind, theme, chunk CSS)
    fonts.css                        # Google Fonts (JetBrains Mono, Inter)
    tailwind.css                     # Tailwind v4 config
    theme.css                        # shadcn/Tailwind base tokens
    themes/
      brutalist-tactile.css          # Active theme — shared Friction tokens
      invisible-clinic.css           # Alt theme — shared Friction tokens
      neural-interface.css           # Chunk 1 CSS tokens
      desktop-os.css                 # Chunk 2 CSS tokens
      friction-app.css               # Chunk 3 CSS tokens

  app/
    App.tsx                          # Entry — provider stack, 3-panel layout
    CHANGELOG.md                     # This file

    context/                         # Shared React contexts (all 3 chunks)
      BiometricContext.tsx
      KeyboardContext.tsx
      PersonaContext.tsx
      SessionContext.tsx
      WindowManagerContext.tsx

    data/
      personas.ts                    # 3 persona profiles + simulation scripts

    hooks/
      usePersonaSimulation.ts        # Desktop playback engine

    components/
      control-panel/                 # CHUNK 1: Neural Interface
        ControlPanel.tsx             # Persona selector, timeline, biometric sliders
        FrictionKeyboard.tsx         # Haptic keyboard emulator with lethargy system

      desktop/                       # CHUNK 2: Desktop OS infrastructure
        DesktopOS.tsx                # Main desktop env + OS-level Friction effects
        Window.tsx                   # Draggable/fullscreen window wrapper
        Dock.tsx                     # Windows-style taskbar
        DigitalMoss.tsx              # Canvas overlay on interruption return
        ProgressiveVignette.tsx      # Cinematic shutdown on fatigue >0.95
        RecoveryBreathing.tsx        # Breathing visualizer (overlay sidebar)
        TactileStrike.tsx            # Glassmorphic ripple on task completion

      apps/                          # CHUNK 2: OS applications (non-Friction)
        CalculatorApp.tsx
        CalendarApp.tsx
        ChromeApp.tsx
        FinderApp.tsx
        MailApp.tsx
        NotesApp.tsx
        SettingsApp.tsx
        SlackApp.tsx
        SpotifyApp.tsx
        TerminalApp.tsx
        VSCodeApp.tsx

      friction-app/                  # CHUNK 3: Friction digital companion
        FrictionApp.tsx              # Main app (Terminal/Session/Mirror tabs)
        FrictionOverlay.tsx          # Ambient sidebar (null when no session)
        TerminalPage.tsx             # Task ingestion + brain dump
        SessionPage.tsx              # Live session monitor + keyboard state
        MirrorPage.tsx               # Post-session review + depth timeline
        BatteryStack.tsx             # Cognitive load battery visualization
        TaskNode.tsx                 # Individual task row component
        DepthTimeline.tsx            # Blur-based session topography
        InsightCard.tsx              # Qualitative insight card

      figma/
        ImageWithFallback.tsx        # Protected system file

      ui/                            # 47 shadcn primitives (unused, kept as toolkit)
```

## [2026-03-10] Reflection Component — Implemented (T6.1–T6.20)

Replaces the old MirrorScreen with a full 3-sub-screen Reflection flow inside the Friction overlay drawer.

**New files:**
- **`reflection-data.ts`** — 8 hardcoded past sessions (Feb 28–Mar 8, 2026) with per-session tasks, intensity scores, and derived aggregates (donut distribution 42/34/24, weekly bar data, hourly radial clock data, contextual insight text for 3 drill-down views)
- **`ReflectionPage.tsx`** — 570+ line component with 3 sub-screens:

**Screen 1 — Recap:**
- Task list pulled from `SessionContext.tasks` (falls back to hardcoded if empty)
- Each task shows intensity badge (High/Moderate/Low in red/violet/blue), duration, completion dot
- Free-text reflection textarea ("What went well?") with state preserved across tab switches
- Navigation button to History screen

**Screen 2 — History:**
- 3 clickable stat cards: intensity donut, session count, deep work hours
- Mini bespoke SVG donut chart (42% high / 34% moderate / 24% calm)
- 8-session list with date, duration, task count, intensity badge
- Bespoke SVG radial clock (24-hour polar intensity heatmap, 9 AM–noon peak)
- Bespoke SVG weekly bar chart (Mon–Sun, animated with Motion)
- All stat cards drill into Screen 3 with auto-selected view

**Screen 3 — Detail:**
- View switcher pills (Intensity / Sessions / Hours) — right panel changes contextually
- Time-range selector (Today / Last Month / This Year / Custom)
- 3 swappable chart views: large donut, pulsing orb with count, hours bar chart
- 4 contextual mini-stat tiles per view (WoW change, daily avg, sessions, peak day)
- 2 contextual insight paragraphs per view + recommendation box
- Back button returns to History

**Layout:**
- Squished mode (45% drawer): stacked layouts, smaller charts, vertical stat cards
- Full-screen mode (100%): side-by-side layouts, larger charts, grid stat cards
- All animations via Motion (staggered fade, animated SVG arcs, pulsing orb rings)

**Integration:**
- Old `MirrorScreen` function deleted from FrictionOverlay.tsx
- `ReflectionPage` imported and rendered when `drawerScreen === "mirror"`
- Receives `sessionTasks` (full task array from SessionContext) and `fullScreen` (derived from splitView)
- Unused `Check` import cleaned from FrictionOverlay