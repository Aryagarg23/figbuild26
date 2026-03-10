/**
 * TERMINAL APP
 * 
 * Interactive terminal emulator with command history and fake filesystem.
 */

import { useState, useRef, useEffect } from "react";

interface HistoryEntry {
  command: string;
  output: string;
}

const FILESYSTEM: Record<string, string[]> = {
  "~": ["Documents/", "Downloads/", "Projects/", ".config/", ".zshrc"],
  "~/Documents": ["notes.md", "resume.pdf", "todo.txt"],
  "~/Downloads": ["image.png", "setup.dmg", "report.xlsx"],
  "~/Projects": ["friction-app/", "ml-pipeline/", "dotfiles/"],
  "~/Projects/friction-app": ["src/", "package.json", "README.md", "tsconfig.json"],
};

const FILE_CONTENTS: Record<string, string> = {
  "notes.md": "# Session Notes\n\n- Focus calibration at 0.82\n- Fatigue threshold adjusted\n- New persona: Deep Work mode",
  "todo.txt": "[ ] Ship friction overlay v2\n[x] Implement tactile strike\n[x] Digital moss canvas\n[ ] Breathing visualizer\n[ ] Progressive vignette tuning",
  ".zshrc": 'export PATH="$HOME/.local/bin:$PATH"\nalias ll="ls -la"\nalias gs="git status"\nexport FRICTION_ENV="development"',
  "package.json": '{\n  "name": "friction-companion",\n  "version": "2.1.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "tsc && vite build"\n  }\n}',
  "README.md": "# Friction Companion\n\nAdaptive cognitive load management system.\n\n## Quick Start\n```\nnpm install\nnpm run dev\n```",
};

export function TerminalApp() {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { command: "", output: "Welcome to Friction Terminal v2.1.0\nType 'help' for available commands.\n" },
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const processCommand = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case "help":
        return "Available commands:\n  ls        - list directory contents\n  cd <dir>  - change directory\n  cat <file>- display file contents\n  pwd       - print working directory\n  echo      - print text\n  date      - show current date\n  whoami    - display current user\n  clear     - clear terminal\n  neofetch  - system info\n  history   - command history";
      case "ls": {
        const dir = FILESYSTEM[cwd];
        return dir ? dir.join("  ") : "ls: cannot access: No such file or directory";
      }
      case "cd": {
        const target = args[0];
        if (!target || target === "~") { setCwd("~"); return ""; }
        if (target === "..") {
          const parent = cwd.split("/").slice(0, -1).join("/") || "~";
          setCwd(parent);
          return "";
        }
        const newPath = `${cwd}/${target.replace(/\/$/, "")}`;
        if (FILESYSTEM[newPath]) { setCwd(newPath); return ""; }
        return `cd: no such file or directory: ${target}`;
      }
      case "cat": {
        const file = args[0];
        if (!file) return "cat: missing file operand";
        const content = FILE_CONTENTS[file];
        return content || `cat: ${file}: No such file or directory`;
      }
      case "pwd":
        return cwd.replace("~", "/Users/operator");
      case "echo":
        return args.join(" ");
      case "date":
        return new Date().toString();
      case "whoami":
        return "operator";
      case "neofetch":
        return `  ╭──────────────────────╮
  │   FRICTION OS 2.1    │
  ╰──────────────────────╯
  OS:      Friction/macOS 15.2
  Host:    Neural Interface Sim
  Kernel:  friction-kernel 2.1.0
  Shell:   zsh 5.9
  CPU:     Focus Engine @ ${(Math.random() * 0.4 + 0.6).toFixed(2)} GHz
  Memory:  ${Math.floor(Math.random() * 4 + 12)}GB / 32GB
  Uptime:  ${Math.floor(Math.random() * 8)}h ${Math.floor(Math.random() * 60)}m`;
      case "history":
        return cmdHistory.map((c, i) => `  ${i + 1}  ${c}`).join("\n") || "No commands in history";
      case "clear":
        setHistory([]);
        return "__CLEAR__";
      default:
        return command ? `zsh: command not found: ${command}` : "";
    }
  };

  const handleSubmit = () => {
    if (!input.trim() && input === "") {
      setHistory(prev => [...prev, { command: "", output: "" }]);
      return;
    }
    const output = processCommand(input);
    if (output !== "__CLEAR__") {
      setHistory(prev => [...prev, { command: input, output }]);
    }
    if (input.trim()) {
      setCmdHistory(prev => [...prev, input]);
    }
    setInput("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIdx = historyIndex < cmdHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIdx = historyIndex - 1;
        setHistoryIndex(newIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - newIdx]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple tab completion for files in current directory
      const dir = FILESYSTEM[cwd];
      if (dir && input.startsWith("cat ") || input.startsWith("cd ")) {
        const partial = input.split(" ")[1] || "";
        const match = dir?.find(f => f.startsWith(partial));
        if (match) {
          setInput(`${input.split(" ")[0]} ${match}`);
        }
      }
    }
  };

  return (
    <div
      className="size-full flex flex-col font-mono"
      style={{ backgroundColor: "#1a1b26", color: "#a9b1d6" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 text-sm" style={{ fontSize: "13px" }}>
        {history.map((entry, i) => (
          <div key={i} className="mb-1">
            {entry.command !== undefined && entry.command !== "" && (
              <div className="flex items-center gap-2">
                <span style={{ color: "#7aa2f7" }}>operator</span>
                <span style={{ color: "#565f89" }}>@</span>
                <span style={{ color: "#9ece6a" }}>friction</span>
                <span style={{ color: "#565f89" }}>{cwd.replace("~", "~")}</span>
                <span style={{ color: "#bb9af7" }}>❯</span>
                <span>{entry.command}</span>
              </div>
            )}
            {entry.output && (
              <pre className="whitespace-pre-wrap mt-0.5 ml-0" style={{ color: "#c0caf5", fontFamily: "inherit" }}>
                {entry.output}
              </pre>
            )}
          </div>
        ))}
        {/* Active Input Line */}
        <div className="flex items-center gap-2">
          <span style={{ color: "#7aa2f7" }}>operator</span>
          <span style={{ color: "#565f89" }}>@</span>
          <span style={{ color: "#9ece6a" }}>friction</span>
          <span style={{ color: "#565f89" }}>{cwd.replace("~", "~")}</span>
          <span style={{ color: "#bb9af7" }}>❯</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none"
            style={{ color: "#c0caf5", fontFamily: "inherit", fontSize: "inherit", caretColor: "#7aa2f7" }}
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
