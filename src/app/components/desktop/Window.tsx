/**
 * WINDOW COMPONENT
 * 
 * Draggable, closeable window wrapper for apps.
 * Includes title bar with window controls and content area.
 * Green button toggles fullscreen (fills the desktop area).
 */

import { useState, useRef, useEffect, type ReactNode } from "react";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { useWindowManager } from "../../context/WindowManagerContext";

interface WindowProps {
  windowId: string;
  title: string;
  children: ReactNode;
  width: number;
  height: number;
  position: { x: number; y: number };
  zIndex: number;
  isFocused: boolean;
  isFullscreen: boolean;
}

export function Window({
  windowId,
  title,
  children,
  width,
  height,
  position,
  zIndex,
  isFocused,
  isFullscreen,
}: WindowProps) {
  const { closeWindow, minimizeWindow, toggleFullscreen, focusWindow, updateWindowPosition } = useWindowManager();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls")) return;
    if (isFullscreen) return; // Don't allow dragging in fullscreen
    
    focusWindow(windowId);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateWindowPosition(windowId, {
        x: Math.max(0, e.clientX - dragOffset.x),
        y: Math.max(0, e.clientY - dragOffset.y),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, windowId, updateWindowPosition]);

  // Double-click title bar to toggle fullscreen
  const handleTitleDoubleClick = () => {
    toggleFullscreen(windowId);
  };

  return (
    <div
      ref={windowRef}
      className="absolute flex flex-col overflow-hidden shadow-2xl"
      style={{
        left: isFullscreen ? 0 : position.x,
        top: isFullscreen ? 0 : position.y,
        width: isFullscreen ? "100%" : width,
        height: isFullscreen ? "calc(100% - 72px)" : height,
        zIndex,
        backgroundColor: "#1e1e1e",
        border: isFullscreen
          ? "none"
          : isFocused 
            ? "1px solid rgba(255, 255, 255, 0.12)" 
            : "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: isFullscreen ? "0" : "8px",
        boxShadow: isFullscreen
          ? "none"
          : isFocused 
            ? "0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)" 
            : "0 10px 40px rgba(0, 0, 0, 0.5)",
        transition: isDragging ? "none" : "left 0.3s ease, top 0.3s ease, width 0.3s ease, height 0.3s ease, border-radius 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseDown={() => focusWindow(windowId)}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-3 select-none"
        style={{
          height: "36px",
          backgroundColor: "#2d2d2d",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          cursor: isFullscreen ? "default" : "move",
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleTitleDoubleClick}
      >
        {/* Title (left-aligned, Windows style) */}
        <span
          className="text-xs uppercase tracking-wider truncate"
          style={{
            color: "rgba(255, 255, 255, 0.65)",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontWeight: 400,
            fontSize: "0.72rem",
            letterSpacing: "0.02em",
            textTransform: "none",
          }}
        >
          {title}
        </span>

        {/* Window Controls — Windows style: right-aligned, rectangular */}
        <div className="window-controls flex items-center h-full -mr-3">
          <button
            onClick={() => minimizeWindow(windowId)}
            className="flex items-center justify-center h-full transition-colors cursor-pointer hover:bg-white/10"
            style={{ width: "46px" }}
          >
            <Minus size={14} style={{ color: "rgba(255,255,255,0.7)" }} />
          </button>
          <button
            onClick={() => toggleFullscreen(windowId)}
            className="flex items-center justify-center h-full transition-colors cursor-pointer hover:bg-white/10"
            style={{ width: "46px" }}
          >
            {isFullscreen ? (
              <Minimize2 size={14} style={{ color: "rgba(255,255,255,0.7)" }} />
            ) : (
              <Maximize2 size={14} style={{ color: "rgba(255,255,255,0.7)" }} />
            )}
          </button>
          <button
            onClick={() => closeWindow(windowId)}
            className="flex items-center justify-center h-full transition-colors cursor-pointer hover:bg-[#e81123]"
            style={{ width: "46px" }}
          >
            <X size={14} style={{ color: "rgba(255,255,255,0.7)" }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}