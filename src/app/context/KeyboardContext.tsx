/**
 * KEYBOARD STATE CONTEXT
 * 
 * Simulates the physical keyboard state changes.
 * In production, this would control actual magnetic switches and RGB LEDs.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type KeyboardResistance = "normal" | "spongy" | "heavy" | "locked";
export type KeyboardRGBMode = "neutral" | "amber-glow" | "red-alert" | "dim" | "pulsing";

export interface KeyboardState {
  resistance: KeyboardResistance;
  rgbMode: KeyboardRGBMode;
  binaural_hz: number; // Sub-perceptual hum frequency
  temperature: number; // Peltier cooler simulation (Celsius shift)
}

interface KeyboardContextValue {
  state: KeyboardState;
  setResistance: (resistance: KeyboardResistance) => void;
  setRGBMode: (mode: KeyboardRGBMode) => void;
  setBinaural: (hz: number) => void;
  setTemperature: (temp: number) => void;
}

const KeyboardContext = createContext<KeyboardContextValue | null>(null);

export function useKeyboard() {
  const ctx = useContext(KeyboardContext);
  if (!ctx) return {
    state: { resistance: "normal" as const, rgbMode: "neutral" as const, binaural_hz: 0, temperature: 0 },
    setResistance: () => {},
    setRGBMode: () => {},
    setBinaural: () => {},
    setTemperature: () => {},
  } as KeyboardContextValue;
  return ctx;
}

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<KeyboardState>({
    resistance: "normal",
    rgbMode: "neutral",
    binaural_hz: 0,
    temperature: 0,
  });

  const setResistance = useCallback((resistance: KeyboardResistance) => {
    setState(prev => prev.resistance === resistance ? prev : { ...prev, resistance });
  }, []);

  const setRGBMode = useCallback((rgbMode: KeyboardRGBMode) => {
    setState(prev => prev.rgbMode === rgbMode ? prev : { ...prev, rgbMode });
  }, []);

  const setBinaural = useCallback((binaural_hz: number) => {
    setState(prev => prev.binaural_hz === binaural_hz ? prev : { ...prev, binaural_hz });
  }, []);

  const setTemperature = useCallback((temperature: number) => {
    setState(prev => prev.temperature === temperature ? prev : { ...prev, temperature });
  }, []);

  return (
    <KeyboardContext.Provider value={{ state, setResistance, setRGBMode, setBinaural, setTemperature }}>
      {children}
    </KeyboardContext.Provider>
  );
}