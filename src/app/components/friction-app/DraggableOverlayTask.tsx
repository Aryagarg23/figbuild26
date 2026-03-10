/**
 * DRAGGABLE OVERLAY TASK
 *
 * Drag-and-drop task row for the FrictionOverlay TerminalScreen.
 * Uses the "Calm Authority" aesthetic (blue/violet/red dots, DM Sans).
 * Supports reorder within list + cross-list transfer via react-dnd.
 */

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ArrowRight, X, GripVertical } from "lucide-react";
import { FRICTION_FONTS, FRICTION_COLORS } from "./friction-styles";

export const ITEM_TYPE = "OVERLAY_TASK";

export interface DragItem {
  id: string;
  index: number;
  list: "pool" | "general";
}

interface Props {
  task: {
    id: string;
    title: string;
    cognitiveWeight: number;
    completed: boolean;
    category: string;
  };
  index: number;
  list: "pool" | "general";
  onMoveToOther?: (id: string) => void;
  onRemove?: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

export function DraggableOverlayTask({
  task,
  index,
  list,
  onMoveToOther,
  onRemove,
  onReorder,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: (): DragItem => ({ id: task.id, index, list }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ITEM_TYPE,
    canDrop: (item) => item.list === list, // Only accept same-list reorders
    drop(item) {
      // Cross-list drops: return undefined so react-dnd bubbles to the parent OverlayDropZone
      if (item.list !== list) return undefined;
      // Same-list reorder is already handled in hover()
      return undefined;
    },
    hover(item) {
      if (!ref.current) return;
      if (item.list !== list) return;
      if (item.index === index) return;
      onReorder?.(item.index, index);
      item.index = index;
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  });

  drag(drop(ref));

  const isPool = list === "pool";
  const dotColor =
    task.category === "deep"
      ? FRICTION_COLORS.red300
      : task.category === "moderate"
        ? FRICTION_COLORS.violet300
        : FRICTION_COLORS.blue300;

  return (
    <div
      ref={ref as any}
      className="flex items-center gap-2 px-2.5 py-2 rounded-md group"
      style={{
        fontFamily: FRICTION_FONTS.body,
        fontSize: "0.65rem",
        color: isPool ? FRICTION_COLORS.textPrimary : FRICTION_COLORS.textSecondary,
        backgroundColor: isOver
          ? "rgba(107, 95, 255, 0.08)"
          : isPool
            ? "rgba(107, 95, 255, 0.04)"
            : "rgba(107, 95, 255, 0.02)",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: isOver
          ? FRICTION_COLORS.borderActive
          : isPool
            ? FRICTION_COLORS.borderDefault
            : FRICTION_COLORS.borderSubtle,
        borderRadius: 6,
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
        transition: "background-color 0.15s, border-color 0.15s",
      }}
    >
      <GripVertical
        size={10}
        className="shrink-0 opacity-30 group-hover:opacity-60 transition-opacity"
        style={{ color: FRICTION_COLORS.textMuted }}
      />

      <div
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: isPool ? dotColor : "transparent", borderWidth: isPool ? 0 : 1, borderStyle: "solid", borderColor: FRICTION_COLORS.textMuted }}
      />

      <span className="truncate flex-1">{task.title}</span>

      {isPool && (
        <span
          style={{
            fontFamily: FRICTION_FONTS.mono || FRICTION_FONTS.heading,
            fontSize: "0.45rem",
            color: FRICTION_COLORS.textMuted,
          }}
        >
          {Math.round(task.cognitiveWeight * 100)}
        </span>
      )}

      {onMoveToOther && (
        <button
          onClick={() => onMoveToOther(task.id)}
          className="opacity-0 group-hover:opacity-60 hover:!opacity-100 cursor-pointer transition-opacity shrink-0"
          title={isPool ? "Move back to inbox" : "Move to session pool"}
        >
          <ArrowRight
            size={10}
            className={isPool ? "rotate-180" : ""}
            style={{ color: isPool ? FRICTION_COLORS.textMuted : FRICTION_COLORS.blue300 }}
          />
        </button>
      )}

      {onRemove && (
        <button
          onClick={() => onRemove(task.id)}
          className="opacity-0 group-hover:opacity-40 hover:!opacity-100 cursor-pointer transition-opacity shrink-0"
          title="Remove"
        >
          <X size={10} style={{ color: FRICTION_COLORS.red300 }} />
        </button>
      )}
    </div>
  );
}

/**
 * Drop zone wrapper for cross-list drops in the overlay.
 */
export function OverlayDropZone({
  list,
  onDropFromOther,
  children,
}: {
  list: "pool" | "general";
  onDropFromOther: (id: string) => void;
  children: React.ReactNode;
}) {
  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: ITEM_TYPE,
    canDrop: (item) => item.list !== list,
    drop: (item) => {
      if (item.list !== list) onDropFromOther(item.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const highlight = isOver && canDrop;

  return (
    <div
      ref={drop as any}
      className="space-y-1 min-h-[48px] rounded-md transition-colors"
      style={{
        padding: highlight ? 6 : 2,
        backgroundColor: highlight ? "rgba(107, 95, 255, 0.1)" : "transparent",
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: highlight ? FRICTION_COLORS.borderActive : "transparent",
        borderRadius: 8,
        boxShadow: highlight ? `inset 0 0 20px ${FRICTION_COLORS.blueGlow}` : "none",
      }}
    >
      {children}
    </div>
  );
}