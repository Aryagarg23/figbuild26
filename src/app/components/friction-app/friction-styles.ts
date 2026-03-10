/**
 * FRICTION OS-SIDE STYLE GUIDE
 * ============================================================
 *
 * This file defines the complete visual identity for Friction's
 * user-facing components inside the fake OS environment.
 *
 * DESIGN PHILOSOPHY:
 *   "Calm Authority" -- Friction should feel like a composed,
 *   intelligent presence. Not aggressive or panicky. Not playful.
 *   Think of a trusted advisor who speaks softly but carries weight.
 *   The visual language communicates depth, stillness, and warmth.
 *
 * COLOR INSPIRATION:
 *   Derived from the Breathing Visualizer (#6B5FFF electric violet,
 *   #FF5F8F hot rose, #A78FFF periwinkle) and Constellation Yoga
 *   (#0a0f1e deep navy, rgba(139,92,246) mid-violet, soft white borders).
 *   The palette shifts from the old steel-blue / desaturated-crimson
 *   to a vibrant violet–rose spectrum while keeping the deep navy base.
 *
 * KEY DISTINCTIONS FROM CONTROL PANEL:
 *   Control Panel (left side) = Brutalist Tactile
 *     - JetBrains Mono, amber/orange, matte black, Dune-inspired
 *     - Industrial, raw, exposed -- "wizard behind the curtain"
 *
 *   Friction OS App (right side) = Calm Authority
 *     - Space Grotesk headings, DM Sans body, violet-rose gradients
 *     - Grainy textures, deep navy, electric violet, glass morphism
 *     - Feels like a premium wellness/productivity app -- serene
 *
 * MOON POOL DENSITY STAGES:
 *   The pool is the emotional heart of the app. It responds
 *   physically and chromatically to cognitive load:
 *
 *   Stage 0 "Still"     (density 0.00-0.15) -- Deep indigo void
 *   Stage 1 "Shallow"   (density 0.15-0.35) -- Cool violet glow, gentle drift
 *   Stage 2 "Moderate"  (density 0.35-0.60) -- Bright violet, faster orbits
 *   Stage 3 "Dense"     (density 0.60-0.85) -- Rose-violet, viscous, heavy
 *   Stage 4 "Critical"  (density 0.85-1.00) -- Deep rose, near-solid, pulsing
 */

import type React from "react";

// ── TYPOGRAPHY ──────────────────────────────────────────────

export const FRICTION_FONTS = {
  heading: "'Space Grotesk', sans-serif",
  body: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', monospace", // only for data readouts
} as const;

// ── COLOR PALETTE ───────────────────────────────────────────

export const FRICTION_COLORS = {
  // Backgrounds
  bgDeep: "#060a14",           // deepest layer (slightly warmer navy)
  bgPrimary: "#0a0f1e",       // primary surface (yoga bg)
  bgElevated: "#10152a",      // cards, panels (more indigo)
  bgGlass: "rgba(10, 14, 30, 0.75)", // glassmorphism

  // Blue/Violet spectrum (was steel blue, now electric violet)
  blue100: "#e0d4f5",          // light lavender
  blue200: "#b8a0f0",          // medium lavender
  blue300: "#8B7FFF",          // periwinkle (hero mid-tone)
  blue400: "#6B5FFF",          // electric violet (hero accent)
  blue500: "#4A3FD4",          // deep violet
  blueGlow: "rgba(107, 95, 255, 0.35)",

  // Red / Rose spectrum (was desaturated crimson, now hot rose)
  red100: "#f5d0e0",           // light rose
  red200: "#f0a0b8",           // medium rose
  red300: "#FF5F8F",           // hot rose (hero accent)
  red400: "#D94A78",           // deep rose
  red500: "#A83360",           // dark rose
  redGlow: "rgba(255, 95, 143, 0.35)",

  // Violet (violet-rose bridge)
  violet300: "#B06DFF",
  violet400: "#9040E0",
  violetGlow: "rgba(160, 80, 240, 0.3)",

  // Text
  textPrimary: "#d4dbe8",      // main text
  textSecondary: "#9a8ec0",    // labels, descriptions (lavender tint)
  textMuted: "#5a5080",        // disabled, hints (violet-grey)
  textAccent: "#8B7FFF",       // links, interactive (periwinkle)

  // Borders (white-based like exercises)
  borderSubtle: "rgba(255, 255, 255, 0.08)",
  borderDefault: "rgba(255, 255, 255, 0.14)",
  borderActive: "rgba(107, 95, 255, 0.3)",
  borderDanger: "rgba(255, 95, 143, 0.25)",

  // Functional
  success: "#4ead7a",
  warning: "#d4a054",
  danger: "#FF5F8F",
} as const;

// ── MOON POOL DENSITY STAGES ────────────────────────────────

export interface PoolStage {
  name: string;
  /** Core gradient colors [center, mid, outer] */
  gradient: [string, string, string];
  /** Particle color */
  particleColor: string;
  /** Particle glow color */
  particleGlow: string;
  /** Border color */
  border: string;
  /** Box shadow (inset glow) */
  innerGlow: string;
  /** Orbit speed multiplier (1 = normal) */
  orbitSpeed: number;
  /** Drift amplitude in px (how far particles wander) */
  driftAmplitude: number;
  /** Ripple opacity */
  rippleOpacity: number;
  /** Ripple speed (duration in seconds) */
  rippleSpeed: number;
  /** Additional ring count */
  extraRings: number;
}

export function getPoolStage(density: number): PoolStage {
  if (density < 0.15) {
    // Stage 0: Still — deep indigo void, near-frozen molecules
    return {
      name: "still",
      gradient: [
        "rgba(16, 18, 42, 0.4)",
        "rgba(10, 14, 30, 0.7)",
        "rgba(6, 10, 20, 0.95)",
      ],
      particleColor: "rgba(107, 95, 255, 0.15)",
      particleGlow: "rgba(107, 95, 255, 0.05)",
      border: "rgba(107, 95, 255, 0.06)",
      innerGlow: "inset 0 0 30px rgba(107, 95, 255, 0.03)",
      orbitSpeed: 0.15,
      driftAmplitude: 0.5,
      rippleOpacity: 0.04,
      rippleSpeed: 10,
      extraRings: 0,
    };
  }
  if (density < 0.35) {
    // Stage 1: Shallow — cool violet gas, gentle molecular drift
    const t = (density - 0.15) / 0.20;
    return {
      name: "shallow",
      gradient: [
        `rgba(50, 40, 130, ${0.06 + t * 0.08})`,
        `rgba(25, 20, 80, ${0.08 + t * 0.06})`,
        "rgba(6, 10, 20, 0.92)",
      ],
      particleColor: `rgba(107, 95, 255, ${0.25 + t * 0.15})`,
      particleGlow: `rgba(107, 95, 255, ${0.08 + t * 0.07})`,
      border: `rgba(107, 95, 255, ${0.08 + t * 0.06})`,
      innerGlow: `inset 0 0 40px rgba(107, 95, 255, ${0.04 + t * 0.04})`,
      orbitSpeed: 0.3 + t * 0.2,
      driftAmplitude: 1 + t * 1.5,
      rippleOpacity: 0.06 + t * 0.04,
      rippleSpeed: 8 - t * 2,
      extraRings: 1,
    };
  }
  if (density < 0.60) {
    // Stage 2: Moderate — bright violet, molecules accelerating
    const t = (density - 0.35) / 0.25;
    return {
      name: "moderate",
      gradient: [
        `rgba(120, 60, 200, ${0.08 + t * 0.1})`,
        `rgba(70, 35, 140, ${0.1 + t * 0.08})`,
        "rgba(6, 10, 20, 0.88)",
      ],
      particleColor: `rgba(176, 109, 255, ${0.3 + t * 0.15})`,
      particleGlow: `rgba(144, 64, 224, ${0.1 + t * 0.08})`,
      border: `rgba(144, 64, 224, ${0.12 + t * 0.08})`,
      innerGlow: `inset 0 0 50px rgba(144, 64, 224, ${0.06 + t * 0.06}), 0 0 20px rgba(144, 64, 224, ${0.03 + t * 0.03})`,
      orbitSpeed: 0.6 + t * 0.5,
      driftAmplitude: 3 + t * 3,
      rippleOpacity: 0.1 + t * 0.06,
      rippleSpeed: 5 - t * 1,
      extraRings: 2,
    };
  }
  if (density < 0.85) {
    // Stage 3: Dense — rose-violet, viscous, heavy
    const t = (density - 0.60) / 0.25;
    return {
      name: "dense",
      gradient: [
        `rgba(217, 74, 120, ${0.12 + t * 0.12})`,
        `rgba(140, 40, 80, ${0.15 + t * 0.1})`,
        `rgba(10, 8, 18, 0.85)`,
      ],
      particleColor: `rgba(255, 95, 143, ${0.35 + t * 0.2})`,
      particleGlow: `rgba(255, 95, 143, ${0.12 + t * 0.1})`,
      border: `rgba(255, 95, 143, ${0.15 + t * 0.1})`,
      innerGlow: `inset 0 0 60px rgba(255, 95, 143, ${0.08 + t * 0.08}), 0 0 25px rgba(255, 95, 143, ${0.04 + t * 0.04})`,
      orbitSpeed: 1.2 + t * 0.8,
      driftAmplitude: 6 + t * 4,
      rippleOpacity: 0.15 + t * 0.05,
      rippleSpeed: 3 - t * 0.5,
      extraRings: 3,
    };
  }
  // Stage 4: Critical — deep rose, chaotic molecular storm
  const t = Math.min(1, (density - 0.85) / 0.15);
  return {
    name: "critical",
    gradient: [
      `rgba(168, 51, 96, ${0.2 + t * 0.15})`,
      `rgba(110, 25, 60, ${0.25 + t * 0.1})`,
      `rgba(10, 5, 12, 0.9)`,
    ],
    particleColor: `rgba(255, 95, 143, ${0.5 + t * 0.3})`,
    particleGlow: `rgba(255, 95, 143, ${0.2 + t * 0.15})`,
    border: `rgba(255, 95, 143, ${0.25 + t * 0.15})`,
    innerGlow: `inset 0 0 80px rgba(255, 95, 143, ${0.15 + t * 0.1}), 0 0 40px rgba(255, 95, 143, ${0.08 + t * 0.06})`,
    orbitSpeed: 2.5 + t * 1.5,
    driftAmplitude: 10 + t * 5,
    rippleOpacity: 0.2,
    rippleSpeed: 2,
    extraRings: 4,
  };
}

// ── GRAIN TEXTURE ───────────────────────────────────────────
// Apply as a pseudo-element or overlay div with this background

export const GRAIN_OVERLAY_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  opacity: 0.55,
  mixBlendMode: "overlay" as const,
  pointerEvents: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  backgroundSize: "200px 200px",
  zIndex: 0,
};

// ── GLASS PANEL ─────────────────────────────────────────────

export const GLASS_PANEL_STYLE: React.CSSProperties = {
  backgroundColor: FRICTION_COLORS.bgGlass,
  backdropFilter: "blur(24px) saturate(1.2)",
  WebkitBackdropFilter: "blur(24px) saturate(1.2)",
};

// ── SHARED COMPONENT STYLES ─────────────────────────────────

/** Standard label text (section headers, tags) */
export const labelStyle: React.CSSProperties = {
  fontFamily: FRICTION_FONTS.heading,
  fontSize: "0.6rem",
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: FRICTION_COLORS.textSecondary,
};

/** Body text */
export const bodyStyle: React.CSSProperties = {
  fontFamily: FRICTION_FONTS.body,
  fontSize: "0.75rem",
  fontWeight: 400,
  lineHeight: 1.5,
  color: FRICTION_COLORS.textPrimary,
};

/** Data readout (numbers, timers) */
export const dataStyle: React.CSSProperties = {
  fontFamily: FRICTION_FONTS.mono,
  fontSize: "0.6rem",
  fontWeight: 400,
  fontVariantNumeric: "tabular-nums",
  color: FRICTION_COLORS.textAccent,
};

/** Card / elevated surface */
export const cardStyle: React.CSSProperties = {
  backgroundColor: FRICTION_COLORS.bgElevated,
  border: `1px solid ${FRICTION_COLORS.borderSubtle}`,
  borderRadius: "8px",
};

/** Button — primary (violet) */
export const btnPrimaryStyle: React.CSSProperties = {
  fontFamily: FRICTION_FONTS.heading,
  fontSize: "0.65rem",
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: FRICTION_COLORS.textPrimary,
  backgroundColor: "rgba(107, 95, 255, 0.1)",
  border: `1px solid rgba(107, 95, 255, 0.2)`,
  borderRadius: "6px",
  cursor: "pointer",
  padding: "8px 16px",
};

/** Button — danger (rose) */
export const btnDangerStyle: React.CSSProperties = {
  fontFamily: FRICTION_FONTS.heading,
  fontSize: "0.55rem",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: FRICTION_COLORS.danger,
  backgroundColor: "rgba(255, 95, 143, 0.06)",
  border: `1px solid ${FRICTION_COLORS.borderDanger}`,
  borderRadius: "6px",
  cursor: "pointer",
  padding: "6px 12px",
};

/** Task item row */
export const taskRowStyle: React.CSSProperties = {
  fontFamily: FRICTION_FONTS.body,
  fontSize: "0.7rem",
  color: FRICTION_COLORS.textPrimary,
  backgroundColor: "rgba(107, 95, 255, 0.03)",
  border: `1px solid ${FRICTION_COLORS.borderSubtle}`,
  borderRadius: "6px",
  padding: "8px 10px",
};

// ── GRADIENT HELPERS ────────────────────────────────────────

/** Violet → blue → rose diagonal gradient for backgrounds */
export const blueRedGradient = (opacity: number = 0.15) =>
  `linear-gradient(135deg, rgba(107, 95, 255, ${opacity}) 0%, rgba(90, 120, 220, ${opacity * 0.7}) 45%, rgba(255, 95, 143, ${opacity * 0.8}) 100%)`;

/** Soft vignette for panels */
export const vignetteGradient =
  `radial-gradient(ellipse at center, transparent 50%, rgba(6, 10, 20, 0.4) 100%)`;