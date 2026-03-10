/**
 * VS CODE APP
 *
 * Full-featured VS Code simulation with syntax-highlighted code,
 * multi-tab editing, file explorer with expand/collapse, line numbers,
 * minimap placeholder, status bar, breadcrumbs, and problems panel.
 */

import React, { useState } from "react";
import {
  FileText, Folder, FolderOpen, ChevronRight, ChevronDown,
  Search, GitBranch, Bug, Package, X, Circle,
} from "lucide-react";

// ── File tree data ──────────────────────────────────────
interface TreeNode {
  name: string;
  type: "file" | "folder";
  lang?: string;
  children?: TreeNode[];
}

const FILE_TREE: TreeNode[] = [
  {
    name: "src", type: "folder", children: [
      {
        name: "components", type: "folder", children: [
          { name: "FocusEngine.tsx", type: "file", lang: "tsx" },
          { name: "BiometricPanel.tsx", type: "file", lang: "tsx" },
          { name: "OverlayProvider.tsx", type: "file", lang: "tsx" },
        ],
      },
      {
        name: "hooks", type: "folder", children: [
          { name: "useFocusState.ts", type: "file", lang: "ts" },
          { name: "useBiometrics.ts", type: "file", lang: "ts" },
        ],
      },
      {
        name: "utils", type: "folder", children: [
          { name: "normalize.ts", type: "file", lang: "ts" },
          { name: "analytics.ts", type: "file", lang: "ts" },
        ],
      },
      { name: "App.tsx", type: "file", lang: "tsx" },
      { name: "main.tsx", type: "file", lang: "tsx" },
      { name: "types.ts", type: "file", lang: "ts" },
    ],
  },
  { name: "package.json", type: "file", lang: "json" },
  { name: "tsconfig.json", type: "file", lang: "json" },
  { name: "vite.config.ts", type: "file", lang: "ts" },
  { name: "README.md", type: "file", lang: "md" },
];

// ── File contents with syntax token hints ───────────────
interface CodeLine {
  text: string;
  tokens?: { start: number; end: number; color: string }[];
}

const FILE_CONTENTS: Record<string, CodeLine[]> = {
  "FocusEngine.tsx": [
    { text: 'import { useState, useEffect, useRef } from "react";', tokens: [{ start: 0, end: 6, color: "#c586c0" }, { start: 48, end: 55, color: "#ce9178" }] },
    { text: 'import { useBiometrics } from "../hooks/useBiometrics";', tokens: [{ start: 0, end: 6, color: "#c586c0" }, { start: 38, end: 57, color: "#ce9178" }] },
    { text: "" },
    { text: "interface FocusEngineProps {", tokens: [{ start: 0, end: 9, color: "#569cd6" }, { start: 10, end: 26, color: "#4ec9b0" }] },
    { text: "  sensitivity: number;", tokens: [{ start: 2, end: 13, color: "#9cdcfe" }, { start: 15, end: 21, color: "#4ec9b0" }] },
    { text: "  onStateChange: (state: FocusState) => void;", tokens: [{ start: 2, end: 15, color: "#9cdcfe" }] },
    { text: "  thresholds?: Partial<ThresholdConfig>;", tokens: [{ start: 2, end: 13, color: "#9cdcfe" }] },
    { text: "}" },
    { text: "" },
    { text: "export function FocusEngine({ sensitivity, onStateChange }: FocusEngineProps) {", tokens: [{ start: 0, end: 6, color: "#c586c0" }, { start: 7, end: 15, color: "#569cd6" }, { start: 16, end: 27, color: "#dcdcaa" }] },
    { text: "  const { current } = useBiometrics();", tokens: [{ start: 2, end: 7, color: "#569cd6" }, { start: 24, end: 37, color: "#dcdcaa" }] },
    { text: "  const [focusLevel, setFocusLevel] = useState(0);", tokens: [{ start: 2, end: 7, color: "#569cd6" }, { start: 42, end: 50, color: "#dcdcaa" }] },
    { text: "  const smoothingRef = useRef(new Float32Array(64));", tokens: [{ start: 2, end: 7, color: "#569cd6" }] },
    { text: "" },
    { text: "  // Exponential moving average for focus signal", tokens: [{ start: 0, end: 49, color: "#6a9955" }] },
    { text: "  useEffect(() => {", tokens: [{ start: 2, end: 11, color: "#dcdcaa" }] },
    { text: "    const alpha = 0.15 * sensitivity;", tokens: [{ start: 4, end: 9, color: "#569cd6" }, { start: 20, end: 24, color: "#b5cea8" }] },
    { text: "    const raw = current.focus_percent;", tokens: [{ start: 4, end: 9, color: "#569cd6" }] },
    { text: "    const smoothed = alpha * raw + (1 - alpha) * focusLevel;", tokens: [{ start: 4, end: 9, color: "#569cd6" }] },
    { text: "" },
    { text: "    // Apply batch variance normalization", tokens: [{ start: 0, end: 42, color: "#6a9955" }] },
    { text: "    const batch_variance_threshold = 0.042;", tokens: [{ start: 4, end: 9, color: "#569cd6" }, { start: 38, end: 43, color: "#b5cea8" }] },
    { text: "    const normalized = Math.max(0, Math.min(1, smoothed));", tokens: [{ start: 4, end: 9, color: "#569cd6" }] },
    { text: "" },
    { text: "    setFocusLevel(normalized);", tokens: [{ start: 4, end: 17, color: "#dcdcaa" }] },
    { text: "    onStateChange(deriveFocusState(normalized));", tokens: [{ start: 4, end: 17, color: "#dcdcaa" }] },
    { text: "  }, [current.focus_percent, sensitivity]);", tokens: [{ start: 4, end: 5, color: "#569cd6" }] },
    { text: "" },
    { text: "  return (", tokens: [{ start: 2, end: 8, color: "#c586c0" }] },
    { text: '    <div className="focus-engine-wrapper">', tokens: [{ start: 5, end: 8, color: "#569cd6" }, { start: 20, end: 40, color: "#ce9178" }] },
    { text: "      <FocusRing intensity={focusLevel} />", tokens: [{ start: 6, end: 16, color: "#4ec9b0" }] },
    { text: "      <MetricsOverlay data={current} />", tokens: [{ start: 6, end: 20, color: "#4ec9b0" }] },
    { text: "    </div>", tokens: [{ start: 5, end: 10, color: "#569cd6" }] },
    { text: "  );" },
    { text: "}" },
  ],
  "App.tsx": [
    { text: 'import { FocusEngine } from "./components/FocusEngine";', tokens: [{ start: 0, end: 6, color: "#c586c0" }] },
    { text: 'import { BiometricProvider } from "./context/BiometricContext";', tokens: [{ start: 0, end: 6, color: "#c586c0" }] },
    { text: 'import { SessionProvider } from "./context/SessionContext";', tokens: [{ start: 0, end: 6, color: "#c586c0" }] },
    { text: "" },
    { text: "export default function App() {", tokens: [{ start: 0, end: 6, color: "#c586c0" }, { start: 15, end: 23, color: "#569cd6" }, { start: 24, end: 27, color: "#dcdcaa" }] },
    { text: "  return (", tokens: [{ start: 2, end: 8, color: "#c586c0" }] },
    { text: "    <BiometricProvider>", tokens: [{ start: 5, end: 23, color: "#4ec9b0" }] },
    { text: "      <SessionProvider>", tokens: [{ start: 7, end: 23, color: "#4ec9b0" }] },
    { text: "        <FocusEngine sensitivity={0.8} />", tokens: [{ start: 9, end: 20, color: "#4ec9b0" }, { start: 34, end: 37, color: "#b5cea8" }] },
    { text: "      </SessionProvider>", tokens: [{ start: 7, end: 23, color: "#4ec9b0" }] },
    { text: "    </BiometricProvider>", tokens: [{ start: 5, end: 23, color: "#4ec9b0" }] },
    { text: "  );" },
    { text: "}" },
  ],
  "normalize.ts": [
    { text: "/**", tokens: [{ start: 0, end: 3, color: "#6a9955" }] },
    { text: " * Normalization utilities for biometric signal processing", tokens: [{ start: 0, end: 57, color: "#6a9955" }] },
    { text: " */", tokens: [{ start: 0, end: 3, color: "#6a9955" }] },
    { text: "" },
    { text: "export interface NormalizationConfig {", tokens: [{ start: 0, end: 6, color: "#c586c0" }, { start: 7, end: 16, color: "#569cd6" }] },
    { text: "  windowSize: number;       // Rolling window in samples" },
    { text: "  outlierThreshold: number;  // Z-score for outlier rejection" },
    { text: "  smoothingFactor: number;   // EMA alpha coefficient" },
    { text: "}" },
    { text: "" },
    { text: "export function normalize(", tokens: [{ start: 0, end: 6, color: "#c586c0" }, { start: 7, end: 15, color: "#569cd6" }, { start: 16, end: 25, color: "#dcdcaa" }] },
    { text: "  signal: Float32Array," },
    { text: "  config: NormalizationConfig" },
    { text: "): Float32Array {" },
    { text: "  const { windowSize, outlierThreshold, smoothingFactor } = config;" },
    { text: "  const output = new Float32Array(signal.length);" },
    { text: "" },
    { text: "  // Pass 1: Z-score outlier rejection", tokens: [{ start: 0, end: 38, color: "#6a9955" }] },
    { text: "  const mean = signal.reduce((a, b) => a + b, 0) / signal.length;" },
    { text: "  const variance = signal.reduce((a, b) => a + (b - mean) ** 2, 0) / signal.length;" },
    { text: "  const stdDev = Math.sqrt(variance);" },
    { text: "" },
    { text: "  for (let i = 0; i < signal.length; i++) {", tokens: [{ start: 2, end: 5, color: "#c586c0" }] },
    { text: "    const zScore = Math.abs((signal[i] - mean) / stdDev);" },
    { text: "    output[i] = zScore > outlierThreshold ? mean : signal[i];" },
    { text: "  }" },
    { text: "" },
    { text: "  // Pass 2: Exponential moving average", tokens: [{ start: 0, end: 39, color: "#6a9955" }] },
    { text: "  for (let i = 1; i < output.length; i++) {", tokens: [{ start: 2, end: 5, color: "#c586c0" }] },
    { text: "    output[i] = smoothingFactor * output[i] + (1 - smoothingFactor) * output[i - 1];" },
    { text: "  }" },
    { text: "" },
    { text: "  return output;" },
    { text: "}" },
  ],
  "package.json": [
    { text: "{" },
    { text: '  "name": "friction-companion",', tokens: [{ start: 2, end: 8, color: "#9cdcfe" }, { start: 10, end: 31, color: "#ce9178" }] },
    { text: '  "version": "2.1.0",', tokens: [{ start: 2, end: 11, color: "#9cdcfe" }, { start: 13, end: 20, color: "#ce9178" }] },
    { text: '  "private": true,', tokens: [{ start: 2, end: 11, color: "#9cdcfe" }, { start: 13, end: 17, color: "#569cd6" }] },
    { text: '  "scripts": {', tokens: [{ start: 2, end: 11, color: "#9cdcfe" }] },
    { text: '    "dev": "vite",', tokens: [{ start: 4, end: 9, color: "#9cdcfe" }, { start: 11, end: 17, color: "#ce9178" }] },
    { text: '    "build": "tsc && vite build",', tokens: [{ start: 4, end: 11, color: "#9cdcfe" }, { start: 13, end: 32, color: "#ce9178" }] },
    { text: '    "lint": "eslint . --ext ts,tsx"', tokens: [{ start: 4, end: 10, color: "#9cdcfe" }, { start: 12, end: 34, color: "#ce9178" }] },
    { text: "  }," },
    { text: '  "dependencies": {', tokens: [{ start: 2, end: 16, color: "#9cdcfe" }] },
    { text: '    "react": "^19.0.0",', tokens: [{ start: 4, end: 11, color: "#9cdcfe" }, { start: 13, end: 23, color: "#ce9178" }] },
    { text: '    "react-dom": "^19.0.0",', tokens: [{ start: 4, end: 15, color: "#9cdcfe" }, { start: 17, end: 27, color: "#ce9178" }] },
    { text: '    "motion": "^11.0.0"', tokens: [{ start: 4, end: 12, color: "#9cdcfe" }, { start: 14, end: 24, color: "#ce9178" }] },
    { text: "  }" },
    { text: "}" },
  ],
};

// ── Default file to open ──────────────────────
const DEFAULT_FILES = ["FocusEngine.tsx", "App.tsx"];

function findFileContent(name: string): CodeLine[] {
  return FILE_CONTENTS[name] || [{ text: `// ${name}` }, { text: "// File contents not loaded" }];
}

// ── Syntax-highlighted line ─────────────────────────────
function HighlightedLine({ line }: { line: CodeLine }) {
  if (!line.tokens || line.tokens.length === 0) {
    return <span style={{ color: "#d4d4d4" }}>{line.text || "\u00A0"}</span>;
  }

  const parts: Array<React.ReactElement> = [];
  let cursor = 0;
  const sorted = [...line.tokens].sort((a, b) => a.start - b.start);

  for (const tok of sorted) {
    if (cursor < tok.start) {
      parts.push(
        <span key={`pre-${cursor}`} style={{ color: "#d4d4d4" }}>
          {line.text.slice(cursor, tok.start)}
        </span>
      );
    }
    parts.push(
      <span key={`tok-${tok.start}`} style={{ color: tok.color }}>
        {line.text.slice(tok.start, tok.end)}
      </span>
    );
    cursor = tok.end;
  }
  if (cursor < line.text.length) {
    parts.push(
      <span key={`end-${cursor}`} style={{ color: "#d4d4d4" }}>
        {line.text.slice(cursor)}
      </span>
    );
  }
  return <>{parts}</>;
}

// ── Tree Node ────────────────────────────────────────
function TreeItem({
  node,
  depth,
  selectedFile,
  onSelect,
  expanded,
  onToggle,
}: {
  node: TreeNode;
  depth: number;
  selectedFile: string;
  onSelect: (name: string) => void;
  expanded: Set<string>;
  onToggle: (path: string) => void;
}) {
  const path = node.name;
  const isOpen = expanded.has(path);

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => onToggle(path)}
          className="w-full flex items-center gap-1 px-2 py-[3px] text-xs hover:bg-[#2a2d2e] cursor-pointer"
          style={{ paddingLeft: `${8 + depth * 12}px`, color: "#cccccc" }}
        >
          {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {isOpen ? (
            <FolderOpen size={14} style={{ color: "#dcb67a" }} />
          ) : (
            <Folder size={14} style={{ color: "#dcb67a" }} />
          )}
          <span>{node.name}</span>
        </button>
        {isOpen &&
          node.children?.map((child) => (
            <TreeItem
              key={child.name}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onSelect={onSelect}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
      </div>
    );
  }

  const langColor: Record<string, string> = {
    tsx: "#519aba",
    ts: "#519aba",
    json: "#cbcb41",
    md: "#ffffff",
  };

  return (
    <button
      onClick={() => onSelect(node.name)}
      className="w-full flex items-center gap-1.5 px-2 py-[3px] text-xs cursor-pointer"
      style={{
        paddingLeft: `${20 + depth * 12}px`,
        backgroundColor: selectedFile === node.name ? "#37373d" : "transparent",
        color: selectedFile === node.name ? "#ffffff" : "#cccccc",
      }}
      onMouseEnter={(e) => {
        if (selectedFile !== node.name) e.currentTarget.style.backgroundColor = "#2a2d2e";
      }}
      onMouseLeave={(e) => {
        if (selectedFile !== node.name) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <FileText size={14} style={{ color: langColor[node.lang || ""] || "#8b8b8b" }} />
      <span>{node.name}</span>
    </button>
  );
}

// ── Problems data ───────────────────────────────────
const PROBLEMS = [
  { file: "KeyboardContext.tsx", line: 44, type: "warning" as const, msg: "Setter functions wrapped in useCallback — verify [] deps are intentional (fixes infinite loop)." },
  { file: "MirrorPage.tsx", line: 4, type: "info" as const, msg: "InsightCard import restored — was dropped during iteration 4 rewrite." },
  { file: "FrictionKeyboard.tsx", line: 178, type: "info" as const, msg: "'temperature' field now wired — derives from fatigue (0 → +4°C)." },
];

export function VSCodeApp() {
  const [openTabs, setOpenTabs] = useState<string[]>(DEFAULT_FILES);
  const [activeTab, setActiveTab] = useState(DEFAULT_FILES[0]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["src", "components", "utils"]));
  const [showProblems, setShowProblems] = useState(false);

  const toggleExpanded = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const selectFile = (name: string) => {
    if (!openTabs.includes(name)) setOpenTabs((prev) => [...prev, name]);
    setActiveTab(name);
  };

  const closeTab = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = openTabs.filter((t) => t !== name);
    setOpenTabs(remaining);
    if (activeTab === name) setActiveTab(remaining[remaining.length - 1] || "");
  };

  const lines = findFileContent(activeTab);

  return (
    <div className="size-full flex flex-col" style={{ backgroundColor: "#1e1e1e" }}>
      {/* Activity Bar + Sidebar + Editor */}
      <div className="flex-1 flex min-h-0">
        {/* Activity Bar */}
        <div
          className="flex flex-col items-center py-2 gap-4 shrink-0"
          style={{ width: "42px", backgroundColor: "#252526" }}
        >
          <button className="p-2 rounded" style={{ backgroundColor: "#37373d" }}>
            <FileText size={18} style={{ color: "#ffffff" }} />
          </button>
          <button className="p-2 rounded hover:bg-[#37373d]">
            <Search size={18} style={{ color: "#858585" }} />
          </button>
          <button className="p-2 rounded hover:bg-[#37373d]">
            <GitBranch size={18} style={{ color: "#858585" }} />
          </button>
          <button
            className="p-2 rounded hover:bg-[#37373d] relative"
            onClick={() => setShowProblems(!showProblems)}
          >
            <Bug size={18} style={{ color: "#858585" }} />
            {PROBLEMS.length > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 text-white rounded-full flex items-center justify-center"
                style={{
                  width: "14px", height: "14px", fontSize: "9px",
                  backgroundColor: "#f14c4c",
                }}
              >
                {PROBLEMS.length}
              </span>
            )}
          </button>
          <button className="p-2 rounded hover:bg-[#37373d]">
            <Package size={18} style={{ color: "#858585" }} />
          </button>
        </div>

        {/* File Explorer */}
        <div
          className="flex flex-col shrink-0 overflow-y-auto"
          style={{ width: "210px", backgroundColor: "#252526", borderRight: "1px solid #191919" }}
        >
          <div
            className="px-4 py-2 text-xs uppercase"
            style={{ color: "#bbbbbb", letterSpacing: "0.1em" }}
          >
            Explorer
          </div>
          <div className="text-xs uppercase px-3 py-1" style={{ color: "#cccccc", fontSize: "11px" }}>
            friction-companion
          </div>
          {FILE_TREE.map((node) => (
            <TreeItem
              key={node.name}
              node={node}
              depth={0}
              selectedFile={activeTab}
              onSelect={selectFile}
              expanded={expanded}
              onToggle={toggleExpanded}
            />
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          <div
            className="flex items-center overflow-x-auto shrink-0"
            style={{ backgroundColor: "#252526", height: "36px" }}
          >
            {openTabs.map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex items-center gap-2 px-3 h-full cursor-pointer shrink-0 group"
                style={{
                  backgroundColor: activeTab === tab ? "#1e1e1e" : "#2d2d2d",
                  borderTop: activeTab === tab ? "1px solid #007acc" : "1px solid transparent",
                  borderRight: "1px solid #191919",
                  color: activeTab === tab ? "#ffffff" : "#969696",
                  fontSize: "12px",
                }}
              >
                <Circle size={6} fill={tab.endsWith(".tsx") ? "#519aba" : tab.endsWith(".json") ? "#cbcb41" : "#519aba"} stroke="none" />
                <span>{tab}</span>
                <button
                  onClick={(e) => closeTab(tab, e)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#37373d] transition-opacity cursor-pointer"
                >
                  <X size={12} style={{ color: "#969696" }} />
                </button>
              </div>
            ))}
          </div>

          {/* Breadcrumbs */}
          <div
            className="flex items-center gap-1 px-4 text-xs shrink-0"
            style={{ height: "22px", backgroundColor: "#1e1e1e", color: "#969696" }}
          >
            <span>src</span>
            <ChevronRight size={10} />
            <span>components</span>
            <ChevronRight size={10} />
            <span style={{ color: "#cccccc" }}>{activeTab}</span>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex overflow-hidden">
            {/* Line Numbers + Code */}
            <div className="flex-1 overflow-auto font-mono" style={{ fontSize: "13px", lineHeight: "20px" }}>
              {lines.map((line, i) => (
                <div key={i} className="flex hover:bg-[#2a2d2e]" style={{ minHeight: "20px" }}>
                  <span
                    className="text-right pr-4 pl-4 select-none shrink-0"
                    style={{ width: "52px", color: "#858585", fontSize: "13px" }}
                  >
                    {i + 1}
                  </span>
                  <pre className="flex-1 pr-4" style={{ fontFamily: "JetBrains Mono, Menlo, monospace" }}>
                    <HighlightedLine line={line} />
                  </pre>
                </div>
              ))}
              {/* Padding at bottom */}
              <div style={{ height: "200px" }} />
            </div>

            {/* Minimap */}
            <div
              className="shrink-0 overflow-hidden"
              style={{ width: "50px", backgroundColor: "#1e1e1e", borderLeft: "1px solid #191919" }}
            >
              {lines.map((_, i) => (
                <div
                  key={i}
                  className="mx-2"
                  style={{
                    height: "3px",
                    marginTop: "1px",
                    backgroundColor: "rgba(212,212,212,0.12)",
                    borderRadius: "1px",
                    width: `${Math.min(40, 10 + Math.random() * 30)}px`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Problems Panel */}
      {showProblems && (
        <div
          className="shrink-0 border-t overflow-y-auto"
          style={{
            height: "120px",
            backgroundColor: "#1e1e1e",
            borderColor: "#191919",
          }}
        >
          <div
            className="flex items-center gap-4 px-3 text-xs border-b"
            style={{ height: "28px", backgroundColor: "#252526", borderColor: "#191919", color: "#cccccc" }}
          >
            <span style={{ borderBottom: "1px solid #007acc", paddingBottom: "2px" }}>
              Problems ({PROBLEMS.length})
            </span>
          </div>
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-1.5 text-xs hover:bg-[#2a2d2e] cursor-pointer"
            >
              <span style={{ color: p.type === "warning" ? "#cca700" : "#3794ff" }}>
                {p.type === "warning" ? "⚠" : "ℹ"}
              </span>
              <span style={{ color: "#cccccc" }}>{p.msg}</span>
              <span className="ml-auto" style={{ color: "#858585" }}>
                {p.file}:{p.line}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Status Bar */}
      <div
        className="flex items-center justify-between px-3 text-xs shrink-0"
        style={{
          height: "24px",
          backgroundColor: "#007acc",
          color: "#ffffff",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <GitBranch size={12} /> main
          </span>
          <span className="flex items-center gap-1">
            <span style={{ color: "#ffcc00" }}>⚠</span> {PROBLEMS.filter(p => p.type === "warning").length}
            <span className="ml-1" style={{ color: "#75beff" }}>ℹ</span> {PROBLEMS.filter(p => p.type === "info").length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>Ln {lines.length}, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>TypeScript React</span>
        </div>
      </div>
    </div>
  );
}