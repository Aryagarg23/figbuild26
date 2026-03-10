/**
 * RECOVERY BREATHING
 *
 * Organic breathing visualizer with concentric pulsing rings.
 * Displayed in the Friction overlay sidebar during active recovery
 * (focus < 0.30). Guides the user through a 4s inhale / 2s hold / 6s exhale cycle.
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Wind } from "lucide-react";

interface RecoveryBreathingProps {
  biometrics: { focus_percent: number; fatigue_percent: number };
}

export function RecoveryBreathing({ biometrics }: RecoveryBreathingProps) {
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathCount, setBreathCount] = useState(0);

  // Breathing cycle
  const cycleDuration = 12000; // 4s in, 2s hold, 6s out
  useEffect(() => {
    const cycle = () => {
      setBreathPhase("inhale");
      setTimeout(() => setBreathPhase("hold"), 4000);
      setTimeout(() => {
        setBreathPhase("exhale");
        setTimeout(() => setBreathCount(prev => prev + 1), 6000);
      }, 6000);
    };
    cycle();
    const interval = setInterval(cycle, cycleDuration);
    return () => clearInterval(interval);
  }, []);

  const scale = breathPhase === "inhale" ? 1.4 : breathPhase === "hold" ? 1.4 : 0.8;
  const ringOpacity = breathPhase === "inhale" ? 0.8 : breathPhase === "hold" ? 0.7 : 0.3;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-1.5 mb-6">
        <Wind size={10} style={{ color: "rgba(255, 167, 38, 0.5)" }} />
        <span
          className="uppercase tracking-[0.2em]"
          style={{
            fontSize: "0.5rem",
            color: "rgba(255, 167, 38, 0.5)",
          }}
        >
          Active Recovery
        </span>
      </div>

      <div
        className="mb-4"
        style={{
          fontSize: "0.55rem",
          color: "rgba(255, 167, 38, 0.3)",
          textAlign: "center",
        }}
      >
        Focus depleted. Breathe with the rhythm.
      </div>

      {/* Breathing rings */}
      <div className="relative" style={{ width: 140, height: 140 }}>
        {/* Outer ring */}
        <motion.div
          animate={{ scale: scale * 1.1, opacity: ringOpacity * 0.3 }}
          transition={{
            duration: breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 0.5 : 6,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full"
          style={{
            border: "1px solid rgba(255, 167, 38, 0.15)",
            boxShadow: "0 0 30px rgba(255, 167, 38, 0.05)",
          }}
        />
        {/* Middle ring */}
        <motion.div
          animate={{ scale, opacity: ringOpacity * 0.5 }}
          transition={{
            duration: breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 0.5 : 6,
            ease: "easeInOut",
          }}
          className="absolute inset-3 rounded-full"
          style={{
            border: "1px solid rgba(255, 167, 38, 0.25)",
            background: "radial-gradient(circle, rgba(255, 167, 38, 0.05) 0%, transparent 70%)",
          }}
        />
        {/* Inner core */}
        <motion.div
          animate={{ scale: scale * 0.9, opacity: ringOpacity }}
          transition={{
            duration: breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 0.5 : 6,
            ease: "easeInOut",
          }}
          className="absolute inset-8 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, rgba(255, 167, 38, 0.15) 0%, rgba(255, 167, 38, 0.03) 70%, transparent 100%)`,
            border: "1.5px solid rgba(255, 167, 38, 0.35)",
            boxShadow: "0 0 20px rgba(255, 167, 38, 0.1), inset 0 0 15px rgba(255, 167, 38, 0.05)",
          }}
        >
          <div className="text-center">
            <div
              className="uppercase tracking-[0.15em]"
              style={{
                fontSize: "0.65rem",
                color: "rgba(255, 167, 38, 0.8)",
              }}
            >
              {breathPhase}
            </div>
            <div
              className="mt-0.5"
              style={{
                fontSize: "0.5rem",
                color: "rgba(255, 167, 38, 0.35)",
              }}
            >
              {breathPhase === "inhale" && "4s"}
              {breathPhase === "hold" && "2s"}
              {breathPhase === "exhale" && "6s"}
            </div>
          </div>
        </motion.div>

        {/* Floating particles */}
        {[0, 1, 2, 3, 4, 5].map(i => (
          <motion.div
            key={i}
            animate={{
              x: [
                Math.cos((i / 6) * Math.PI * 2) * 50,
                Math.cos((i / 6) * Math.PI * 2 + 0.5) * (breathPhase === "inhale" ? 70 : 35),
                Math.cos((i / 6) * Math.PI * 2) * 50,
              ],
              y: [
                Math.sin((i / 6) * Math.PI * 2) * 50,
                Math.sin((i / 6) * Math.PI * 2 + 0.5) * (breathPhase === "inhale" ? 70 : 35),
                Math.sin((i / 6) * Math.PI * 2) * 50,
              ],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
            className="absolute rounded-full"
            style={{
              width: 3,
              height: 3,
              left: "50%",
              top: "50%",
              backgroundColor: "rgba(255, 167, 38, 0.5)",
              boxShadow: "0 0 6px rgba(255, 167, 38, 0.3)",
            }}
          />
        ))}
      </div>

      <div
        className="mt-6"
        style={{
          fontSize: "0.5rem",
          color: "rgba(255, 167, 38, 0.2)",
        }}
      >
        Cycle {breathCount}/3
      </div>
    </div>
  );
}
