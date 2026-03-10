/**
 * TERMINAL PAGE
 *
 * Task ingestion and cognitive offloading.
 * Pre-populated with persona-specific tasks.
 *
 * Layout (3-column):
 *   Left:   Session boundary, task input, brain dump, Enter Session
 *   Center: Moon Pool (BatteryStack) + session tasks below
 *   Right:  General / Backlog task list
 *
 * All tasks are draggable between the two lists and reorderable within each.
 * Uses --friction-* theme variables for all styling.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ArrowRight, Clock, Brain } from "lucide-react";
import { useSession, type Task } from "../../context/SessionContext";
import { usePersona } from "../../context/PersonaContext";
import { DraggableTaskNode } from "./DraggableTaskNode";
import { TaskDropZone } from "./TaskDropZone";
import { BatteryStack } from "./BatteryStack";

export function TerminalPage() {
  const {
    tasks,
    generalTasks,
    setTasks,
    addTask,
    addGeneralTask,
    removeTask,
    removeGeneralTask,
    reorderTask,
    reorderGeneralTask,
    moveToPool,
    moveToGeneral,
    sessionDurationMinutes,
    setSessionDuration,
    startSession,
  } = useSession();
  const persona = usePersona();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [brainDump, setBrainDump] = useState("");
  const [showBrainDump, setShowBrainDump] = useState(false);
  const [boundaryResistance, setBoundaryResistance] = useState(0);
  const [generalNativeDragOver, setGeneralNativeDragOver] = useState(false);
  const [poolNativeDragOver, setPoolNativeDragOver] = useState(false);
  const resistanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-populate tasks from persona
  useEffect(() => {
    if (persona.currentPersona && tasks.length === 0) {
      setTasks(persona.currentPersona.tasks);
      setSessionDuration(persona.currentPersona.sessionDurationMinutes);
    }
  }, [persona.currentPersona, tasks.length, setTasks, setSessionDuration]);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      cognitiveWeight: 0.5,
      completed: false,
      category: "moderate",
      estimatedMinutes: 30,
    };
    addTask(task);
    setNewTaskTitle("");
  };

  const handleBrainDump = () => {
    if (!brainDump.trim()) return;
    const lines = brainDump.split(/[,.\\n]+/).filter((l) => l.trim());
    const newTasks: Task[] = lines.map((line, i) => ({
      id: `dump-${Date.now()}-${i}`,
      title: line.trim(),
      cognitiveWeight: Math.random() * 0.6 + 0.2,
      completed: false,
      category:
        Math.random() > 0.6
          ? "deep"
          : Math.random() > 0.4
            ? "moderate"
            : "light",
      estimatedMinutes: Math.round((Math.random() * 60 + 15) / 5) * 5,
    }));
    setTasks([...tasks, ...newTasks]);
    setBrainDump("");
    setShowBrainDump(false);
  };

  const handleStartSession = () => {
    startSession();
  };

  const totalMinutes = tasks
    .filter((t) => !t.completed)
    .reduce((sum, t) => sum + t.estimatedMinutes, 0);

  // Fluid time boundary resistance
  const handleSessionDurationChange = (value: number) => {
    if (value > 240) {
      const overAmount = value - 240;
      const resistance = Math.min(1, overAmount / 60);
      setBoundaryResistance(resistance);
      const dampened = 240 + overAmount * (1 - resistance * 0.5);
      setSessionDuration(Math.round(dampened));
      if (resistanceTimerRef.current) clearTimeout(resistanceTimerRef.current);
      resistanceTimerRef.current = setTimeout(
        () => setBoundaryResistance(0),
        1500,
      );
    } else {
      setBoundaryResistance(0);
      setSessionDuration(value);
    }
  };

  const activeTasks = tasks.filter((t) => !t.completed);
  const activeGeneralTasks = generalTasks.filter((t) => !t.completed);

  /** Generate a randomized task from native drop text (for demo variety) */
  const makeDroppedTask = (text: string, prefix: string): Task => {
    const weight = Math.round((Math.random() * 0.7 + 0.15) * 100) / 100; // 0.15–0.85
    const category = weight > 0.6 ? "deep" : weight > 0.35 ? "moderate" : "light";
    const minutes = Math.round((Math.random() * 80 + 10) / 5) * 5; // 10–90 min, step 5
    return {
      id: `${prefix}-${Date.now()}`,
      title: text.slice(0, 80),
      cognitiveWeight: weight,
      completed: false,
      category,
      estimatedMinutes: minutes,
    };
  };

  return (
    <div
      className="size-full overflow-y-auto"
      style={{
        backgroundColor: "var(--friction-bg-primary)",
        color: "var(--friction-text-primary)",
        paddingBottom: "120px",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h2
            className="uppercase mb-2"
            style={{
              color: "var(--friction-accent-amber)",
              fontSize: "var(--friction-text-xs)",
              letterSpacing: "var(--friction-tracking-wide)",
              fontWeight: "var(--friction-font-semibold)",
            }}
          >
            Page 01 — The Terminal
          </h2>
          <p
            style={{
              color: "var(--friction-text-secondary)",
              fontSize: "var(--friction-text-sm)",
            }}
          >
            Offload your intent. Drag tasks between lists to shape your session.
          </p>
        </motion.div>

        {/* ── 3-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN: Controls ── */}
          <div className="flex flex-col gap-5">
            {/* Session Boundary */}
            <div
              className="p-4 rounded"
              style={{
                backgroundColor: "var(--friction-bg-secondary)",
                border: "var(--friction-window-border)",
                borderRadius: "var(--friction-radius-md)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock
                  size={14}
                  style={{ color: "var(--friction-accent-amber)" }}
                />
                <span
                  className="uppercase"
                  style={{
                    color: "var(--friction-text-muted)",
                    fontSize: "var(--friction-text-xs)",
                    letterSpacing: "var(--friction-tracking-wide)",
                  }}
                >
                  Session Boundary
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="range"
                    min={30}
                    max={300}
                    step={15}
                    value={sessionDurationMinutes}
                    onChange={(e) =>
                      handleSessionDurationChange(Number(e.target.value))
                    }
                    className="w-full cursor-pointer"
                    style={{
                      accentColor:
                        boundaryResistance > 0
                          ? `rgb(${220 + boundaryResistance * 35}, ${160 - boundaryResistance * 110}, ${38 - boundaryResistance * 38})`
                          : "var(--friction-accent-amber)",
                    }}
                  />
                  {boundaryResistance > 0 && (
                    <div
                      className="absolute -bottom-4 left-0 right-0 text-center uppercase tracking-[0.15em]"
                      style={{
                        fontSize: "0.5rem",
                        color: `rgba(220, 50, 50, ${boundaryResistance})`,
                      }}
                    >
                      Biological resistance:{" "}
                      {Math.round(boundaryResistance * 100)}%
                    </div>
                  )}
                </div>
                <span
                  className="tabular-nums min-w-[4rem] text-right"
                  style={{
                    color: "var(--friction-text-primary)",
                    fontSize: "var(--friction-text-sm)",
                  }}
                >
                  {Math.floor(sessionDurationMinutes / 60)}h{" "}
                  {sessionDurationMinutes % 60}m
                </span>
              </div>
              {sessionDurationMinutes > 240 && (
                <p
                  className="mt-2"
                  style={{
                    color: "var(--friction-accent-red)",
                    fontSize: "var(--friction-text-xs)",
                  }}
                >
                  Warning: Exceeds historical cognitive stamina.
                </p>
              )}
            </div>

            {/* Task Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                placeholder="Add a task..."
                className="flex-1 rounded px-3 py-2 focus:outline-none transition-colors"
                style={{
                  backgroundColor: "var(--friction-bg-secondary)",
                  border: "var(--friction-window-border)",
                  color: "var(--friction-text-primary)",
                  fontSize: "var(--friction-text-sm)",
                  borderRadius: "var(--friction-radius-md)",
                }}
              />
              <button
                onClick={handleAddTask}
                className="px-2.5 py-2 rounded transition-colors cursor-pointer"
                style={{
                  backgroundColor: "var(--friction-bg-secondary)",
                  border: "var(--friction-window-border)",
                  color: "var(--friction-text-muted)",
                  borderRadius: "var(--friction-radius-md)",
                }}
              >
                <Plus size={14} />
              </button>
              <button
                onClick={() => setShowBrainDump(!showBrainDump)}
                className="px-2.5 py-2 rounded transition-colors cursor-pointer"
                style={{
                  backgroundColor: showBrainDump
                    ? "rgba(255, 167, 38, 0.1)"
                    : "var(--friction-bg-secondary)",
                  border: showBrainDump
                    ? "1px solid var(--friction-border-active)"
                    : "var(--friction-window-border)",
                  color: showBrainDump
                    ? "var(--friction-accent-amber)"
                    : "var(--friction-text-muted)",
                  borderRadius: "var(--friction-radius-md)",
                }}
              >
                <Brain size={14} />
              </button>
            </div>

            {/* Brain Dump */}
            <AnimatePresence>
              {showBrainDump && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="p-4 rounded"
                    style={{
                      backgroundColor: "var(--friction-bg-secondary)",
                      border: "1px solid var(--friction-border-active)",
                      borderRadius: "var(--friction-radius-md)",
                    }}
                  >
                    <span
                      className="uppercase block mb-2"
                      style={{
                        color: "var(--friction-accent-amber)",
                        fontSize: "var(--friction-text-xs)",
                        letterSpacing: "var(--friction-tracking-wide)",
                      }}
                    >
                      Brain Dump — Stream of consciousness
                    </span>
                    <textarea
                      value={brainDump}
                      onChange={(e) => setBrainDump(e.target.value)}
                      placeholder="I need to finish the auth module, review PRs, organize the docs folder..."
                      rows={3}
                      className="w-full bg-transparent border-none focus:outline-none resize-none"
                      style={{
                        color: "var(--friction-text-primary)",
                        fontSize: "var(--friction-text-sm)",
                      }}
                    />
                    <button
                      onClick={handleBrainDump}
                      className="mt-2 px-4 py-1.5 rounded transition-colors cursor-pointer uppercase"
                      style={{
                        color: "var(--friction-accent-amber)",
                        border: "1px solid var(--friction-border-active)",
                        fontSize: "var(--friction-text-xs)",
                        letterSpacing: "var(--friction-tracking-wide)",
                        borderRadius: "var(--friction-radius-sm)",
                      }}
                    >
                      Parse
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enter Session */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleStartSession}
              disabled={activeTasks.length === 0}
              className="flex items-center justify-center gap-3 px-6 py-3.5 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed uppercase"
              style={{
                backgroundColor: "rgba(255, 167, 38, 0.1)",
                border: "1px solid var(--friction-border-active)",
                color: "var(--friction-accent-amber)",
                fontSize: "var(--friction-text-sm)",
                letterSpacing: "var(--friction-tracking-wide)",
                borderRadius: "var(--friction-radius-md)",
                fontWeight: "var(--friction-font-semibold)",
              }}
            >
              <span>Enter Session</span>
              <ArrowRight size={14} />
            </motion.button>
          </div>

          {/* ── CENTER COLUMN: Moon Pool + Session Tasks ── */}
          <div className="flex flex-col gap-5">
            <BatteryStack tasks={tasks} sessionDuration={sessionDurationMinutes} />

            {/* Session Task Queue (Moon Pool) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="uppercase"
                  style={{
                    color: "var(--friction-text-muted)",
                    fontSize: "var(--friction-text-xs)",
                    letterSpacing: "var(--friction-tracking-wide)",
                  }}
                >
                  Session Pool ({activeTasks.length})
                </span>
                <span
                  className="tabular-nums"
                  style={{
                    color: "var(--friction-text-muted)",
                    fontSize: "var(--friction-text-xs)",
                  }}
                >
                  ~{totalMinutes}m
                </span>
              </div>

              <TaskDropZone
                list="pool"
                onDropFromOther={moveToPool}
                onNativeDragOver={setPoolNativeDragOver}
                onNativeDropText={(text) => {
                  addTask(makeDroppedTask(text, "task-drop"));
                }}
              >
                <AnimatePresence>
                  {activeTasks.map((task, i) => (
                    <DraggableTaskNode
                      key={task.id}
                      task={task}
                      index={i}
                      list="pool"
                      onRemove={removeTask}
                      onMoveToOther={moveToGeneral}
                      onReorder={reorderTask}
                      moveLabel="Move to General"
                    />
                  ))}
                </AnimatePresence>
                {activeTasks.length === 0 && (
                  <div
                    className="flex items-center justify-center py-8"
                    style={{
                      color: "var(--friction-text-disabled)",
                      fontSize: "var(--friction-text-sm)",
                    }}
                  >
                    Drag tasks here for this session
                  </div>
                )}
              </TaskDropZone>
            </div>
          </div>

          {/* ── RIGHT COLUMN: General / Backlog ── */}
          <div className="flex flex-col gap-5">
            <div
              className="p-3 rounded"
              style={{
                backgroundColor: "var(--friction-bg-secondary)",
                border: "var(--friction-window-border)",
                borderRadius: "var(--friction-radius-md)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="uppercase"
                  style={{
                    color: "var(--friction-text-muted)",
                    fontSize: "var(--friction-text-xs)",
                    letterSpacing: "var(--friction-tracking-wide)",
                  }}
                >
                  General Backlog
                </span>
                <span
                  className="tabular-nums"
                  style={{
                    color: "var(--friction-text-disabled)",
                    fontSize: "var(--friction-text-xs)",
                  }}
                >
                  {activeGeneralTasks.length} items
                </span>
              </div>
              <p
                style={{
                  color: "var(--friction-text-disabled)",
                  fontSize: "0.55rem",
                  marginBottom: 8,
                }}
              >
                Drag tasks left to add to your session pool
              </p>
            </div>

            <TaskDropZone
              list="general"
              onDropFromOther={moveToGeneral}
              onNativeDragOver={setGeneralNativeDragOver}
              onNativeDropText={(text) => {
                addGeneralTask(makeDroppedTask(text, "gen-drop"));
              }}
            >
              <AnimatePresence>
                {activeGeneralTasks.map((task, i) => (
                  <DraggableTaskNode
                    key={task.id}
                    task={task}
                    index={i}
                    list="general"
                    onRemove={removeGeneralTask}
                    onMoveToOther={moveToPool}
                    onReorder={reorderGeneralTask}
                    moveLabel="Move to Session"
                  />
                ))}
              </AnimatePresence>
              {activeGeneralTasks.length === 0 && (
                <div
                  className="flex items-center justify-center py-8"
                  style={{
                    color: "var(--friction-text-disabled)",
                    fontSize: "var(--friction-text-sm)",
                  }}
                >
                  No backlog tasks
                </div>
              )}
            </TaskDropZone>
          </div>
        </div>
      </div>
    </div>
  );
}