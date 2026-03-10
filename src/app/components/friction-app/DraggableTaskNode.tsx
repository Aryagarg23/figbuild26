/**
 * DRAGGABLE TASK NODE
 *
 * A task item that supports:
 *  - Drag-and-drop between Moon Pool ↔ General list
 *  - Reorder within its own list via hover-swap
 */

import { useRef } from "react";
import { motion } from "motion/react";
import { X, GripVertical, ArrowRight, ArrowLeft } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import type { Task } from "../../context/SessionContext";

const ITEM_TYPE = "TASK";

interface DragItem {
  id: string;
  index: number;
  list: "pool" | "general";
}

const categoryColors: Record<string, string> = {
  deep: "#f59e0b",
  moderate: "#d97706",
  light: "#92400e",
};

interface DraggableTaskNodeProps {
  task: Task;
  index: number;
  list: "pool" | "general";
  onRemove: (id: string) => void;
  onMoveToOther: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  moveLabel: string;
}

export function DraggableTaskNode({
  task,
  index,
  list,
  onRemove,
  onMoveToOther,
  onReorder,
  moveLabel,
}: DraggableTaskNodeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const color = categoryColors[task.category] ?? "#f59e0b";
  const weightWidth = `${task.cognitiveWeight * 100}%`;

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: (): DragItem => ({ id: task.id, index, list }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ITEM_TYPE,
    canDrop: (item) => item.list === list, // Only accept same-list reorders; cross-list drops bubble to TaskDropZone
    drop(item) {
      // Cross-list drops: return undefined so react-dnd bubbles to the parent TaskDropZone
      if (item.list !== list) return undefined;
      // Same-list reorder is already handled in hover()
      return undefined;
    },
    hover(item) {
      if (!ref.current) return;
      // Only reorder within same list
      if (item.list !== list) return;
      if (item.index === index) return;
      onReorder(item.index, index);
      item.index = index;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Combine drag and drop refs
  drag(drop(ref));

  return (
    <motion.div
      ref={ref as any}
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: isDragging ? 0.4 : 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="group relative flex items-center gap-2 px-3 py-2.5 rounded transition-colors"
      style={{
        backgroundColor: isOver ? "#1a1a1f" : "#111",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: isOver ? "#333" : "#1a1a1a",
        cursor: "grab",
        borderRadius: "var(--friction-radius-sm, 4px)",
      }}
    >
      <GripVertical size={12} className="text-[#333] shrink-0" />

      {/* Cognitive weight bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] rounded-b"
        style={{ width: weightWidth, backgroundColor: color, opacity: 0.5 }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "0.7rem" }} className="text-[#ccc] truncate">
            {task.title}
          </span>
          <span
            className="uppercase tracking-[0.15em] px-1 py-0.5 rounded shrink-0"
            style={{
              fontSize: "0.45rem",
              backgroundColor: `${color}15`,
              color: color,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: `${color}30`,
            }}
          >
            {task.category}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[#444]" style={{ fontSize: "0.55rem" }}>
            ~{task.estimatedMinutes}m
          </span>
          <span className="text-[#333]" style={{ fontSize: "0.55rem" }}>
            W:{(task.cognitiveWeight * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Action buttons (visible on hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onMoveToOther(task.id)}
          className="text-[#555] hover:text-amber-500 transition-colors cursor-pointer p-0.5"
          title={moveLabel}
        >
          {list === "general" ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
        </button>
        <button
          onClick={() => onRemove(task.id)}
          className="text-[#444] hover:text-red-500 transition-colors cursor-pointer p-0.5"
          title="Remove"
        >
          <X size={12} />
        </button>
      </div>
    </motion.div>
  );
}