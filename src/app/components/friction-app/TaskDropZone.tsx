/**
 * TASK DROP ZONE
 *
 * A container that accepts dropped tasks from the other list (react-dnd)
 * AND native HTML5 drops from desktop app items (email, slack, calendar, notes).
 * Highlights when a task from the opposite list is dragged over it.
 * Plays a brief flash animation on successful native drop.
 */

import { type ReactNode, useState, useRef, useCallback } from "react";
import { useDrop } from "react-dnd";

const ITEM_TYPE = "TASK";

interface DragItem {
  id: string;
  index: number;
  list: "pool" | "general";
}

interface TaskDropZoneProps {
  list: "pool" | "general";
  onDropFromOther: (id: string) => void;
  /** Called when a native HTML5 drag item (from desktop apps) is dropped */
  onNativeDropText?: (text: string) => void;
  /** Notifies parent of native drag hover state */
  onNativeDragOver?: (hovering: boolean) => void;
  children: ReactNode;
}

export function TaskDropZone({ list, onDropFromOther, onNativeDropText, onNativeDragOver, children }: TaskDropZoneProps) {
  const [nativeHover, setNativeHover] = useState(false);
  const [flash, setFlash] = useState(false);
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerFlash = useCallback(() => {
    setFlash(true);
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    flashTimeout.current = setTimeout(() => setFlash(false), 600);
  }, []);

  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: ITEM_TYPE,
    canDrop: (item) => item.list !== list,
    drop: (item) => {
      if (item.list !== list) {
        onDropFromOther(item.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const showHighlight = (isOver && canDrop) || nativeHover;

  return (
    <div
      ref={drop as any}
      className="flex flex-col gap-1.5 min-h-[60px] rounded p-2"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: showHighlight ? "rgba(245, 158, 11, 0.05)" : "transparent",
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: showHighlight ? "rgba(245, 158, 11, 0.3)" : "transparent",
        borderRadius: "var(--friction-radius-md, 6px)",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        if (!nativeHover) {
          setNativeHover(true);
          onNativeDragOver?.(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setNativeHover(false);
          onNativeDragOver?.(false);
        }
      }}
      onDrop={(e) => {
        const text = e.dataTransfer?.getData("text/plain")?.trim();
        if (text && onNativeDropText) {
          e.preventDefault();
          e.stopPropagation();
          setNativeHover(false);
          onNativeDragOver?.(false);
          onNativeDropText(text);
          triggerFlash();
        } else {
          setNativeHover(false);
          onNativeDragOver?.(false);
        }
      }}
    >
      {/* Drop flash overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0) 70%)",
          opacity: flash ? 1 : 0,
          transition: flash ? "opacity 0.08s ease-out" : "opacity 0.55s ease-in",
          zIndex: 10,
        }}
      />
      {children}
    </div>
  );
}
