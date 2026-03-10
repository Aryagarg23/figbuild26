/**
 * PERSONA CONTEXT
 * 
 * Manages the currently selected persona and provides intelligent demo behaviors.
 * Integrates with SessionContext to populate data and simulate biometric patterns.
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { PersonaProfile } from "../data/personas";
import { getPersonaById } from "../data/personas";

interface PersonaContextValue {
  currentPersona: PersonaProfile | null;
  setPersona: (personaId: string) => void;
  clearPersona: () => void;
  
  // Intelligent demo controls
  isAutoPlaying: boolean;
  currentStoryBeatIndex: number;
  playbackSpeed: number; // Multiplier for demo speed
  
  startAutoPlay: () => void;
  stopAutoPlay: () => void;
  nextStoryBeat: () => void;
  prevStoryBeat: () => void;
  setPlaybackSpeed: (speed: number) => void;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) return {
    currentPersona: null,
    setPersona: () => {},
    clearPersona: () => {},
    isAutoPlaying: false,
    currentStoryBeatIndex: 0,
    playbackSpeed: 1,
    startAutoPlay: () => {},
    stopAutoPlay: () => {},
    nextStoryBeat: () => {},
    prevStoryBeat: () => {},
    setPlaybackSpeed: () => {},
  } as PersonaContextValue;
  return ctx;
}

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<PersonaProfile | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentStoryBeatIndex, setCurrentStoryBeatIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const setPersona = (personaId: string) => {
    const persona = getPersonaById(personaId);
    if (persona) {
      setCurrentPersona(persona);
      setCurrentStoryBeatIndex(0);
      setIsAutoPlaying(false);
    }
  };

  const clearPersona = () => {
    setCurrentPersona(null);
    setCurrentStoryBeatIndex(0);
    setIsAutoPlaying(false);
  };

  const startAutoPlay = () => {
    setIsAutoPlaying(true);
  };

  const stopAutoPlay = () => {
    setIsAutoPlaying(false);
  };

  const nextStoryBeat = () => {
    if (currentPersona && currentStoryBeatIndex < currentPersona.storyBeats.length - 1) {
      setCurrentStoryBeatIndex(prev => prev + 1);
    }
  };

  const prevStoryBeat = () => {
    if (currentStoryBeatIndex > 0) {
      setCurrentStoryBeatIndex(prev => prev - 1);
    }
  };

  return (
    <PersonaContext.Provider
      value={{
        currentPersona,
        setPersona,
        clearPersona,
        isAutoPlaying,
        currentStoryBeatIndex,
        playbackSpeed,
        startAutoPlay,
        stopAutoPlay,
        nextStoryBeat,
        prevStoryBeat,
        setPlaybackSpeed,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}