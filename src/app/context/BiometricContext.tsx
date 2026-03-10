/**
 * BIOMETRIC CONTEXT
 * 
 * Simulates neural implant data that would come from the physical keyboard.
 * In production, this would be real-time data from the SNN chip.
 * 
 * Data streams:
 * - focus_percent: 0.0-1.0 (cognitive engagement with current task)
 * - fatigue_percent: 0.0-1.0 (glutamate buildup, cognitive exhaustion)
 * 
 * Biometrics are ONLY changed by:
 *   - Manual slider drags in the Control Panel
 *   - Quick Presets (FLOW STATE, DISTRACTED, etc.)
 *   - Persona timeline scrubbing / auto-play
 *   - simulateGradualChange() for animated transitions
 */

import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react";

export interface BiometricState {
  focus_percent: number;
  fatigue_percent: number;
  timestamp: number;
}

interface BiometricContextValue {
  current: BiometricState;
  history: BiometricState[];
  setCurrent: (state: BiometricState) => void;
  setBiometrics: (state: Partial<BiometricState>) => void;
  simulateGradualChange: (target: Partial<BiometricState>, durationMs: number) => void;
}

const DEFAULT_BIOMETRIC_VALUE: BiometricContextValue = {
  current: { focus_percent: 0.5, fatigue_percent: 0.2, timestamp: Date.now() },
  history: [],
  setCurrent: () => {},
  setBiometrics: () => {},
  simulateGradualChange: () => {},
};

const BiometricContext = createContext<BiometricContextValue | null>(null);

export function useBiometrics() {
  const ctx = useContext(BiometricContext);
  return ctx ?? DEFAULT_BIOMETRIC_VALUE;
}

export function useBiometricsSafe() {
  return useContext(BiometricContext);
}

export function BiometricProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<BiometricState>({
    focus_percent: 0.5,
    fatigue_percent: 0.2,
    timestamp: Date.now(),
  });
  const [history, setHistory] = useState<BiometricState[]>([]);
  const animationRef = useRef<number | null>(null);
  const currentRef = useRef(current);
  currentRef.current = current;

  // Record history every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => [...prev.slice(-100), currentRef.current]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const setBiometrics = useCallback((state: Partial<BiometricState>) => {
    setCurrent(prev => ({
      ...prev,
      ...state,
      timestamp: Date.now(),
    }));
  }, []);
  
  const simulateGradualChange = useCallback((target: Partial<BiometricState>, durationMs: number) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startTime = performance.now();
    const startState = { ...currentRef.current };

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      const newState: Partial<BiometricState> = {};
      if (target.focus_percent !== undefined) {
        newState.focus_percent = startState.focus_percent + (target.focus_percent - startState.focus_percent) * progress;
      }
      if (target.fatigue_percent !== undefined) {
        newState.fatigue_percent = startState.fatigue_percent + (target.fatigue_percent - startState.fatigue_percent) * progress;
      }

      setCurrent(p => ({ ...p, ...newState, timestamp: Date.now() }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  return (
    <BiometricContext.Provider value={{ 
      current, 
      history, 
      setCurrent: (state) => {
        setCurrent({ ...state, timestamp: Date.now() });
      }, 
      setBiometrics, 
      simulateGradualChange,
    }}>
      {children}
    </BiometricContext.Provider>
  );
}