import { motion } from "motion/react";
import { X, GripVertical } from "lucide-react";
import type { Task } from "../../context/SessionContext";

interface TaskNodeProps {
  task: Task;
  onRemove: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  deep: "#f59e0b",
  moderate: "#d97706",
  light: "#92400e",
};

export function TaskNode({ task, onRemove }: TaskNodeProps) {
  const color = categoryColors[task.category] ?? "#f59e0b";
  const weightWidth = `${task.cognitiveWeight * 100}%`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="group relative flex items-center gap-3 px-4 py-3 bg-[#111] border border-[#1a1a1a] rounded hover:border-[#2a2a2a] transition-colors"
    >
      <GripVertical size={14} className="text-[#333] shrink-0" />

      {/* Cognitive weight bar */}
      <div className="absolute bottom-0 left-0 h-[2px] rounded-b" style={{ width: weightWidth, backgroundColor: color, opacity: 0.5 }} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "0.75rem" }} className="text-[#ccc] truncate">
            {task.title}
          </span>
          <span
            className="uppercase tracking-[0.15em] px-1.5 py-0.5 rounded shrink-0"
            style={{
              fontSize: "0.5rem",
              backgroundColor: `${color}15`,
              color: color,
              border: `1px solid ${color}30`,
            }}
          >
            {task.category}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[#444]" style={{ fontSize: "0.6rem" }}>
            ~{task.estimatedMinutes}m
          </span>
          <span className="text-[#333]" style={{ fontSize: "0.6rem" }}>
            Weight: {(task.cognitiveWeight * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      <button
        onClick={() => onRemove(task.id)}
        className="opacity-0 group-hover:opacity-100 text-[#444] hover:text-red-500 transition-all cursor-pointer"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
