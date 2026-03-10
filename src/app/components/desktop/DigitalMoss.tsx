/**
 * DIGITAL MOSS → "NEURAL RESIDUE" — Sub-State 5: The Return
 *
 * Canvas-based overlay that creeps from the bezels of the screen when
 * returning from interruption. Reskinned from green "moss" to the
 * Calm Authority blue→violet→red palette so it matches all other
 * Friction OS-side effects.
 *
 * Keywords from the user's last context float in the residue.
 * Mouse swipe to brush away — embodied cognition mechanic.
 *
 * SessionContext API unchanged (mossActive / clearMoss / etc.)
 */

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FRICTION_COLORS, FRICTION_FONTS } from "../friction-app/friction-styles";

interface Props {
  keywords: string[];
  taskContext?: string;
  onClear: () => void;
}

interface ResidueParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  growth: number;
  maxSize: number;
  edge: "top" | "bottom" | "left" | "right";
  depth: number; // how far from edge (0-1)
  cleared: boolean;
  hue: number;    // 210-280 (blue→violet range)
  sat: number;    // saturation variance
}

interface KeywordFloat {
  text: string;
  x: number;
  y: number;
  opacity: number;
  targetOpacity: number;
  cleared: boolean;
  snapX: number;
  snapY: number;
}

// Parse hex color to r,g,b tuple
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

const BLUE_RGB = hexToRgb("#8B7FFF");    // FRICTION_COLORS.blue300 (electric violet)
const VIOLET_RGB = hexToRgb("#7c4da0");  // FRICTION_COLORS.violet400
const RED_RGB = hexToRgb("#FF5F8F");     // FRICTION_COLORS.red300 (hot rose)

export function DigitalMoss({ keywords, taskContext, onClear }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<ResidueParticle[]>([]);
  const keywordsRef = useRef<KeywordFloat[]>([]);
  const mouseRef = useRef({ x: -100, y: -100, velocity: 0, totalCleared: 0 });
  const animFrameRef = useRef<number>(0);
  const [isClearing, setIsClearing] = useState(false);
  const [clearProgress, setClearProgress] = useState(0);
  const growthRef = useRef(0);
  const timeRef = useRef(0);
  const lastProgressRef = useRef(0);

  // Initialize particles
  const initParticles = useCallback((w: number, h: number) => {
    const particles: ResidueParticle[] = [];
    const count = 600;

    for (let i = 0; i < count; i++) {
      const edge = (["top", "bottom", "left", "right"] as const)[Math.floor(Math.random() * 4)];
      let x = 0, y = 0;
      const depth = Math.random();

      switch (edge) {
        case "top":
          x = Math.random() * w;
          y = depth * h * 0.4;
          break;
        case "bottom":
          x = Math.random() * w;
          y = h - depth * h * 0.4;
          break;
        case "left":
          x = depth * w * 0.35;
          y = Math.random() * h;
          break;
        case "right":
          x = w - depth * w * 0.35;
          y = Math.random() * h;
          break;
      }

      // Add organic jitter
      x += (Math.random() - 0.5) * 40;
      y += (Math.random() - 0.5) * 40;

      // Deeper particles trend redder, edge particles stay bluer
      const baseHue = 210 + depth * 60 + Math.random() * 20; // 210-290
      const sat = 40 + Math.random() * 30;

      particles.push({
        x, y,
        size: 0,
        opacity: 0,
        growth: 0.3 + Math.random() * 0.7,
        maxSize: 8 + Math.random() * 24 + (1 - depth) * 20,
        edge,
        depth,
        cleared: false,
        hue: baseHue,
        sat,
      });
    }

    particlesRef.current = particles;

    // Position keywords
    const kws: KeywordFloat[] = keywords.slice(0, 8).map((text, i) => {
      const angle = (i / keywords.length) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 0.15 + Math.random() * 0.2;
      return {
        text,
        x: w * 0.5 + Math.cos(angle) * w * radius,
        y: h * 0.5 + Math.sin(angle) * h * radius,
        opacity: 0,
        targetOpacity: 0.85,
        cleared: false,
        snapX: w * 0.5 + (Math.random() - 0.5) * 100,
        snapY: h * 0.5 + (Math.random() - 0.5) * 60,
      };
    });
    keywordsRef.current = kws;
  }, [keywords]);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      timeRef.current += 0.016; // ~60fps
      const time = timeRef.current;

      // Grow residue over time
      growthRef.current = Math.min(growthRef.current + 0.008, 1);
      const growth = growthRef.current;

      const mouse = mouseRef.current;

      // Draw residue particles
      for (const p of particlesRef.current) {
        if (p.cleared) continue;

        // Grow based on depth and global growth
        const depthDelay = p.depth * 0.6;
        const localGrowth = Math.max(0, (growth - depthDelay) / (1 - depthDelay));
        p.size = p.maxSize * localGrowth * p.growth;
        p.opacity = Math.min(localGrowth * 0.8, 0.7);

        // Check mouse proximity for clearing
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const clearRadius = 80 + mouse.velocity * 2;

        if (dist < clearRadius && mouse.velocity > 5) {
          p.cleared = true;
          mouse.totalCleared++;
          continue;
        }

        if (p.size < 0.5) continue;

        // Subtle breathing: oscillate size
        const breathe = 1 + Math.sin(time * 0.8 + p.x * 0.005 + p.y * 0.003) * 0.06;

        // Draw organic blob
        ctx.beginPath();
        ctx.globalAlpha = p.opacity;

        const segments = 6;
        for (let s = 0; s <= segments; s++) {
          const angle = (s / segments) * Math.PI * 2;
          const noise = 0.7 + Math.sin(angle * 3 + p.x * 0.01 + time * 0.3) * 0.3;
          const r = p.size * noise * breathe;
          const px = p.x + Math.cos(angle) * r;
          const py = p.y + Math.sin(angle) * r;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Blue → violet → red gradient per particle
        const lightness = 22 + (1 - p.depth) * 12; // brighter at edges
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * breathe);
        gradient.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${lightness + 8}%, ${p.opacity})`);
        gradient.addColorStop(0.6, `hsla(${p.hue}, ${p.sat - 10}%, ${lightness}%, ${p.opacity * 0.6})`);
        gradient.addColorStop(1, `hsla(${p.hue}, ${p.sat - 15}%, ${lightness - 5}%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw connecting tendrils between nearby particles (blue-violet)
      ctx.lineWidth = 1;
      const activeParticles = particlesRef.current.filter(p => !p.cleared && p.size > 3);
      for (let i = 0; i < activeParticles.length; i += 3) {
        const a = activeParticles[i];
        for (let j = i + 1; j < Math.min(i + 8, activeParticles.length); j += 2) {
          const b = activeParticles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 60) {
            const fade = 1 - d / 60;
            // Blend between blue and violet for tendrils
            const avgHue = (a.hue + b.hue) / 2;
            ctx.globalAlpha = 0.1 * fade;
            ctx.strokeStyle = `hsla(${avgHue}, 45%, 35%, 0.4)`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            const cx = (a.x + b.x) / 2 + (Math.random() - 0.5) * 20;
            const cy = (a.y + b.y) / 2 + (Math.random() - 0.5) * 20;
            ctx.quadraticCurveTo(cx, cy, b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw keywords with blue→violet glow
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const kw of keywordsRef.current) {
        if (kw.cleared) continue;

        kw.opacity += (kw.targetOpacity - kw.opacity) * 0.02;

        const dxk = kw.x - mouse.x;
        const dyk = kw.y - mouse.y;
        const distk = Math.sqrt(dxk * dxk + dyk * dyk);
        if (distk < 100 && mouse.velocity > 8) {
          kw.cleared = true;
          mouse.totalCleared += 10;
        }

        if (kw.opacity < 0.01) continue;

        ctx.globalAlpha = kw.opacity * growth;
        ctx.font = `500 13px ${FRICTION_FONTS.mono}`;

        // Blue-violet text glow
        ctx.shadowColor = `rgba(${BLUE_RGB[0]}, ${BLUE_RGB[1]}, ${BLUE_RGB[2]}, 0.8)`;
        ctx.shadowBlur = 12;
        // Cool white-blue text
        ctx.fillStyle = `rgba(${BLUE_RGB[0] + 90}, ${BLUE_RGB[1] + 80}, ${BLUE_RGB[2] + 40}, ${kw.opacity * 0.9})`;
        ctx.fillText(kw.text, kw.x, kw.y);

        // Outline in violet
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(${VIOLET_RGB[0]}, ${VIOLET_RGB[1]}, ${VIOLET_RGB[2]}, ${kw.opacity * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.strokeText(kw.text, kw.x, kw.y);
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Edge vignette — deep navy instead of green
      const edgeGrad = ctx.createRadialGradient(w/2, h/2, Math.min(w, h) * 0.3, w/2, h/2, Math.max(w, h) * 0.7);
      edgeGrad.addColorStop(0, "transparent");
      edgeGrad.addColorStop(1, `rgba(6, 10, 18, ${growth * 0.35})`);
      ctx.fillStyle = edgeGrad;
      ctx.fillRect(0, 0, w, h);

      // Calculate clear progress — only setState when rounded % changes
      const total = particlesRef.current.length;
      const cleared = particlesRef.current.filter(p => p.cleared).length;
      const progress = cleared / total;
      const rounded = Math.round(progress * 100);
      if (rounded !== Math.round(lastProgressRef.current * 100)) {
        lastProgressRef.current = progress;
        setClearProgress(progress);
      }

      if (progress > 0.45 && !isClearing) {
        setIsClearing(true);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles]);

  // Handle clearing completion
  useEffect(() => {
    if (isClearing) {
      const timer = setTimeout(onClear, 1200);
      return () => clearTimeout(timer);
    }
  }, [isClearing, onClear]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;
    const velocity = Math.abs(e.movementX) + Math.abs(e.movementY);
    mouseRef.current = {
      ...mouseRef.current,
      x: newX,
      y: newY,
      velocity: velocity,
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClearing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: isClearing ? 1.2 : 0.8 }}
        className="absolute inset-0 cursor-crosshair"
        style={{ zIndex: 8500 }}
        onMouseMove={handleMouseMove}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Context recovery header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isClearing ? 0 : 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute top-8 left-1/2 -translate-x-1/2 text-center"
          style={{ zIndex: 8501 }}
        >
          <div
            className="uppercase tracking-[0.3em] mb-2"
            style={{
              fontFamily: FRICTION_FONTS.heading,
              color: FRICTION_COLORS.blue200,
              fontSize: "0.6rem",
              textShadow: `0 0 20px ${FRICTION_COLORS.blueGlow}`,
            }}
          >
            Returning from Interruption
          </div>
          {taskContext && (
            <div
              className="mb-3"
              style={{
                fontFamily: FRICTION_FONTS.body,
                color: FRICTION_COLORS.textSecondary,
                fontSize: "0.75rem",
              }}
            >
              {taskContext}
            </div>
          )}
        </motion.div>

        {/* Swipe prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isClearing ? 0 : [0.4, 0.8, 0.4] }}
          transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
          style={{ zIndex: 8501 }}
        >
          <div
            className="uppercase tracking-[0.2em]"
            style={{
              fontFamily: FRICTION_FONTS.heading,
              color: "var(--friction-accent-amber)",
              fontSize: "0.65rem",
              textShadow: "0 0 10px rgba(255, 167, 38, 0.5)",
            }}
          >
            Swipe to clear and resume
          </div>
          <div
            className="mt-2"
            style={{
              fontFamily: FRICTION_FONTS.mono,
              color: FRICTION_COLORS.textMuted,
              fontSize: "0.55rem",
            }}
          >
            {Math.round(clearProgress * 100)}% cleared
          </div>
        </motion.div>

        {/* Mouse trail glow — blue-violet radial */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            left: mouseRef.current.x - 50,
            top: mouseRef.current.y - 50,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, ${FRICTION_COLORS.blueGlow} 0%, rgba(124, 77, 160, 0.08) 50%, transparent 70%)`,
            mixBlendMode: "screen",
            zIndex: 8502,
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}