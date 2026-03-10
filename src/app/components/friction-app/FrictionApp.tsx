/**
 * FRICTION APP
 * 
 * The main Friction app that runs inside a desktop window.
 * Contains the Terminal, Scaffolding, and Mirror pages with internal navigation.
 * Uses the "Brutalist Tactile" aesthetic with mechanical transitions.
 */

import { useState, useEffect } from "react";
import { TerminalPage } from "./TerminalPage";
import { SessionPage } from "./SessionPage";
import { MirrorPage } from "./MirrorPage";
import { Terminal, Layers, Eye } from "lucide-react";
import { useSession } from "../../context/SessionContext";

type FrictionView = "terminal" | "session" | "mirror";

const NAV_ITEMS = [
  { id: "terminal" as const, label: ">_ Terminal", icon: Terminal },
  { id: "session" as const, label: "Scaffolding", icon: Layers },
  { id: "mirror" as const, label: "O Mirror", icon: Eye },
];

export function FrictionApp() {
  const [currentView, setCurrentView] = useState<FrictionView>("terminal");
  const { sessionState } = useSession();

  // Auto-navigate to session when session starts
  useEffect(() => {
    if (sessionState === "active" && currentView === "terminal") {
      setCurrentView("session");
    }
  }, [sessionState, currentView]);

  return (
    <div
      className="size-full flex flex-col"
      style={{
        backgroundColor: "#0a0a0c",
        color: "#e0d6c8",
        fontFamily: "var(--friction-font-primary)",
      }}
    >
      {/* Internal Navigation - tab bar */}
      <nav
        className="flex items-center gap-0 border-b"
        style={{
          borderColor: "rgba(255, 94, 0, 0.15)",
          backgroundColor: "#0e0e10",
        }}
      >
        {NAV_ITEMS.map(item => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 cursor-pointer uppercase tracking-wider relative"
              style={{
                fontSize: "0.6rem",
                backgroundColor: isActive ? "#0a0a0c" : "transparent",
                color: isActive ? "#FF5E00" : "#555",
                borderBottom: isActive ? "2px solid #FF5E00" : "2px solid transparent",
                transition: "all 0.15s steps(3, end)",
              }}
            >
              <Icon size={11} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {currentView === "terminal" && <TerminalPage />}
        {currentView === "session" && <SessionPage />}
        {currentView === "mirror" && <MirrorPage />}
      </div>
    </div>
  );
}
