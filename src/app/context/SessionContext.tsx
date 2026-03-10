import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface Task {
  id: string;
  title: string;
  cognitiveWeight: number; // 0-1
  completed: boolean;
  category: "deep" | "moderate" | "light";
  estimatedMinutes: number;
}

export interface SessionState {
  tasks: Task[];            // Session pool tasks (Moon Pool)
  generalTasks: Task[];     // General backlog / inbox
  sessionState: "idle" | "active" | "paused";
  sessionDurationMinutes: number;
  elapsedMinutes: number;
  currentTaskIndex: number;
  sessionSubState: SessionSubState;
}

export type SessionSubState =
  | "invisible"    // Max Focus (>0.90)
  | "taper"        // Moderate (0.50-0.70)
  | "recovery"     // Low Focus / Active Recovery
  | "return"       // Post-Distraction
  | "intercept"    // Hard Intercept (fatigue >0.95)
  | "idle";        // No session

export type DrawerScreen = "terminal" | "mirror" | "scaffolding";

interface SessionContextValue extends SessionState {
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  completeTask: (id: string) => void;
  reorderTask: (fromIndex: number, toIndex: number) => void;
  // General task list
  addGeneralTask: (task: Task) => void;
  removeGeneralTask: (id: string) => void;
  reorderGeneralTask: (fromIndex: number, toIndex: number) => void;
  moveToPool: (id: string) => void;
  moveToGeneral: (id: string) => void;
  setSessionDuration: (mins: number) => void;
  startSession: () => void;
  endSession: () => void;
  setElapsedMinutes: (mins: number) => void;
  setSessionSubState: (state: SessionSubState) => void;
  // OS-level effects
  tactileStrikeData: { completed: string; next: string } | null;
  triggerStrike: (completed: string, next: string) => void;
  mossActive: boolean;
  mossKeywords: string[];
  activateMoss: (keywords: string[]) => void;
  clearMoss: () => void;
  // Screen navigation for demo
  drawerScreen: DrawerScreen;
  setDrawerScreen: (screen: DrawerScreen) => void;
  forceScreen: (screen: 1 | 2 | 3) => void;
  activeScreenNumber: 1 | 2 | 3;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const DEFAULT_SESSION_VALUE: SessionContextValue = {
  tasks: [],
  generalTasks: [],
  sessionState: "idle",
  sessionDurationMinutes: 90,
  elapsedMinutes: 0,
  currentTaskIndex: 0,
  sessionSubState: "idle",
  setTasks: () => {},
  addTask: () => {},
  removeTask: () => {},
  completeTask: () => {},
  reorderTask: () => {},
  addGeneralTask: () => {},
  removeGeneralTask: () => {},
  reorderGeneralTask: () => {},
  moveToPool: () => {},
  moveToGeneral: () => {},
  setSessionDuration: () => {},
  startSession: () => {},
  endSession: () => {},
  setElapsedMinutes: () => {},
  setSessionSubState: () => {},
  tactileStrikeData: null,
  triggerStrike: () => {},
  mossActive: false,
  mossKeywords: [],
  activateMoss: () => {},
  clearMoss: () => {},
  drawerScreen: "terminal",
  setDrawerScreen: () => {},
  forceScreen: () => {},
  activeScreenNumber: 1,
};

export function useSession() {
  const ctx = useContext(SessionContext);
  return ctx ?? DEFAULT_SESSION_VALUE;
}

const defaultTasks: Task[] = [
  { id: "1", title: "Debug normalization pipeline", cognitiveWeight: 0.92, completed: false, category: "deep", estimatedMinutes: 90 },
  { id: "2", title: "Write unit tests for auth module", cognitiveWeight: 0.78, completed: false, category: "deep", estimatedMinutes: 60 },
  { id: "3", title: "Review pull requests", cognitiveWeight: 0.45, completed: false, category: "moderate", estimatedMinutes: 30 },
  { id: "4", title: "Organize project folders", cognitiveWeight: 0.15, completed: false, category: "light", estimatedMinutes: 15 },
  { id: "5", title: "Reply to team messages", cognitiveWeight: 0.2, completed: false, category: "light", estimatedMinutes: 10 },
];

const defaultGeneralTasks: Task[] = [
  { id: "g1", title: "Read Deep Work chapter 4", cognitiveWeight: 0.55, completed: false, category: "moderate", estimatedMinutes: 45 },
  { id: "g2", title: "Schedule dentist appointment", cognitiveWeight: 0.1, completed: false, category: "light", estimatedMinutes: 5 },
  { id: "g3", title: "Research new monitoring tools", cognitiveWeight: 0.65, completed: false, category: "deep", estimatedMinutes: 60 },
  { id: "g4", title: "Update portfolio site", cognitiveWeight: 0.7, completed: false, category: "deep", estimatedMinutes: 120 },
  { id: "g5", title: "Grocery list for the week", cognitiveWeight: 0.08, completed: false, category: "light", estimatedMinutes: 10 },
  { id: "g6", title: "Refactor authentication hooks", cognitiveWeight: 0.85, completed: false, category: "deep", estimatedMinutes: 75 },
];

export function SessionProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [generalTasks, setGeneralTasks] = useState<Task[]>(defaultGeneralTasks);
  const [sessionState, setSessionState] = useState<"idle" | "active" | "paused">("idle");
  const [sessionDurationMinutes, setSessionDuration] = useState(120);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [sessionSubState, setSessionSubState] = useState<SessionSubState>("idle");
  const [tactileStrikeData, setTactileStrikeData] = useState<{ completed: string; next: string } | null>(null);
  const [mossActive, setMossActiveState] = useState(false);
  const [mossKeywords, setMossKeywords] = useState<string[]>([]);
  const [drawerScreen, setDrawerScreen] = useState<DrawerScreen>("terminal");

  const addTask = useCallback((task: Task) => {
    setTasks((prev) => [...prev, task]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const completeTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
    );
    setCurrentTaskIndex((prev) => prev + 1);
  }, []);

  const triggerStrike = useCallback((completed: string, next: string) => {
    setTactileStrikeData({ completed, next });
    setTimeout(() => setTactileStrikeData(null), 2000);
  }, []);

  const activateMoss = useCallback((keywords: string[]) => {
    setMossActiveState(true);
    setMossKeywords(keywords);
  }, []);

  const clearMoss = useCallback(() => {
    setMossActiveState(false);
    setMossKeywords([]);
  }, []);

  const startSession = useCallback(() => {
    setSessionState("active");
    setElapsedMinutes(0);
    setSessionSubState("invisible");
    setDrawerScreen("scaffolding");
  }, []);

  const endSession = useCallback(() => {
    setSessionState("idle");
    setSessionSubState("idle");
    setDrawerScreen("mirror");
  }, []);

  // activeScreenNumber derives purely from drawerScreen
  const activeScreenNumber: 1 | 2 | 3 =
    drawerScreen === "terminal" ? 1
    : drawerScreen === "scaffolding" ? 2
    : 3; // "mirror"

  const forceScreen = useCallback((screen: 1 | 2 | 3) => {
    // Neural Interface is the master terminal — the god switch.
    // Screen 2 (Scaffolding) force-starts immersion.
    // Screen 1 (Terminal) and Screen 3 (Mirror) force-end immersion.
    if (screen === 1) {
      setDrawerScreen("terminal");
      setSessionState("idle");
      setSessionSubState("idle");
    } else if (screen === 2) {
      setDrawerScreen("scaffolding");
      if (sessionState !== "active") {
        setSessionState("active");
        setSessionSubState("invisible");
        setElapsedMinutes(0);
      }
    } else {
      setDrawerScreen("mirror");
      setSessionState("idle");
      setSessionSubState("idle");
    }
  }, [sessionState]);

  const addGeneralTask = useCallback((task: Task) => {
    setGeneralTasks((prev) => [...prev, task]);
  }, []);

  const removeGeneralTask = useCallback((id: string) => {
    setGeneralTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const reorderTask = useCallback((fromIndex: number, toIndex: number) => {
    setTasks((prev) => {
      const task = prev[fromIndex];
      const newTasks = [...prev];
      newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, task);
      return newTasks;
    });
  }, []);

  const reorderGeneralTask = useCallback((fromIndex: number, toIndex: number) => {
    setGeneralTasks((prev) => {
      const task = prev[fromIndex];
      const newTasks = [...prev];
      newTasks.splice(fromIndex, 1);
      newTasks.splice(toIndex, 0, task);
      return newTasks;
    });
  }, []);

  const moveToPool = useCallback((id: string) => {
    setGeneralTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (task) {
        setTasks((poolPrev) => [...poolPrev, task]);
        return prev.filter((t) => t.id !== id);
      }
      return prev;
    });
  }, []);

  const moveToGeneral = useCallback((id: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      if (task) {
        setGeneralTasks((genPrev) => [...genPrev, { ...task, completed: false }]);
        return prev.filter((t) => t.id !== id);
      }
      return prev;
    });
  }, []);

  return (
    <SessionContext.Provider
      value={{
        tasks,
        generalTasks,
        sessionState,
        sessionDurationMinutes,
        elapsedMinutes,
        currentTaskIndex,
        sessionSubState,
        setTasks,
        addTask,
        removeTask,
        completeTask,
        reorderTask,
        addGeneralTask,
        removeGeneralTask,
        reorderGeneralTask,
        moveToPool,
        moveToGeneral,
        setSessionDuration,
        startSession,
        endSession,
        setElapsedMinutes,
        setSessionSubState,
        tactileStrikeData,
        triggerStrike,
        mossActive,
        mossKeywords,
        activateMoss,
        clearMoss,
        drawerScreen,
        setDrawerScreen,
        forceScreen,
        activeScreenNumber,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}