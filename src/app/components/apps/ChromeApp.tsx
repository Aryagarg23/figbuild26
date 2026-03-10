/**
 * CHROME APP
 *
 * Full-featured Chrome simulation with tabs, bookmarks bar,
 * realistic page content, working navigation, and dev tools toggle.
 */

import { useState } from "react";
import {
  ArrowLeft, ArrowRight, RotateCw, Search, Star, Plus, X,
  Lock, ChevronDown, Bookmark,
} from "lucide-react";

// ── Page data ──────────────────────────────────────
interface Page {
  url: string;
  title: string;
  favicon: string;
  content: React.ReactNode;
}

function GitHubPage() {
  const repos = [
    { name: "friction-companion", desc: "Adaptive cognitive load management system — FigBuild 2026", lang: "TypeScript", stars: 342, updated: "2h ago" },
    { name: "neural-keyboard-firmware", desc: "SNN chip firmware for magnetic key switches + Peltier coolers", lang: "Rust", stars: 128, updated: "1d ago" },
    { name: "biometric-pipeline", desc: "Real-time EEG/EMG signal processing for flow state detection", lang: "Python", stars: 89, updated: "3d ago" },
    { name: "figmake-friction-demo", desc: "Figma Make prototype — brutalist tactile UI with persona simulation", lang: "TypeScript", stars: 56, updated: "12m ago" },
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "24px" }}>
      <div className="flex items-center gap-4 mb-6 pb-4" style={{ borderBottom: "1px solid #d1d5db" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: "#f3f4f6" }}>
          🧠
        </div>
        <div>
          <h1 className="text-xl" style={{ color: "#1f2937" }}>friction-labs</h1>
          <p className="text-sm" style={{ color: "#6b7280" }}>Arya Garg · Miami Celentana · Haley Potter — FigBuild 2026</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <input
          className="flex-1 px-3 py-1.5 rounded-md border text-sm"
          style={{ borderColor: "#d1d5db", color: "#374151" }}
          placeholder="Find a repository..."
          readOnly
        />
        <button className="px-3 py-1.5 rounded-md text-sm text-white" style={{ backgroundColor: "#238636" }}>
          New
        </button>
      </div>

      <div className="space-y-0">
        {repos.map(repo => (
          <div key={repo.name} className="py-5" style={{ borderBottom: "1px solid #e5e7eb" }}>
            <div className="flex items-start justify-between">
              <div>
                <a className="text-base hover:underline cursor-pointer" style={{ color: "#0969da" }}>{repo.name}</a>
                <p className="text-sm mt-1" style={{ color: "#57606a" }}>{repo.desc}</p>
                <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: "#57606a" }}>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: repo.lang === "TypeScript" ? "#3178c6" : repo.lang === "Rust" ? "#dea584" : "#3572a5" }} />
                    {repo.lang}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} /> {repo.stars}
                  </span>
                  <span>Updated {repo.updated}</span>
                </div>
              </div>
              <button className="flex items-center gap-1 px-3 py-1 rounded-md border text-xs" style={{ borderColor: "#d1d5db", color: "#24292f" }}>
                <Star size={12} /> Star
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StackOverflowPage() {
  const questions = [
    { votes: 47, answers: 8, views: "12k", title: "How to implement EMA smoothing for biometric data in TypeScript?", tags: ["typescript", "signal-processing", "biometrics"] },
    { votes: 23, answers: 4, views: "5.2k", title: "Best practices for adaptive UI based on cognitive state?", tags: ["ux", "accessibility", "react"] },
    { votes: 15, answers: 3, views: "3.1k", title: "WebSocket vs SSE for real-time biometric data streaming", tags: ["websocket", "sse", "performance"] },
    { votes: 8, answers: 2, views: "1.8k", title: "Implementing progressive vignette shader with CSS only", tags: ["css", "shader", "animation"] },
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <h1 className="text-xl mb-4" style={{ color: "#3b4045" }}>Top Questions</h1>
      <div className="space-y-0">
        {questions.map((q, i) => (
          <div key={i} className="flex gap-4 py-4" style={{ borderBottom: "1px solid #e3e6e8" }}>
            <div className="flex flex-col items-center gap-1 shrink-0" style={{ width: "70px" }}>
              <span className="text-sm" style={{ color: "#6a737c" }}>{q.votes} votes</span>
              <span className="px-2 py-0.5 rounded text-xs border" style={{ borderColor: "#2f6f44", color: "#2f6f44" }}>
                {q.answers} answers
              </span>
              <span className="text-xs" style={{ color: "#6a737c" }}>{q.views} views</span>
            </div>
            <div>
              <a className="text-base cursor-pointer hover:opacity-80" style={{ color: "#0074cc" }}>{q.title}</a>
              <div className="flex gap-1 mt-2">
                {q.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-xs cursor-pointer"
                    style={{ backgroundColor: "#e1ecf4", color: "#39739d" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocsPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px" }}>
      <div className="mb-6 pb-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
        <span className="text-xs uppercase px-2 py-1 rounded" style={{ backgroundColor: "#e8f5e9", color: "#2e7d32" }}>
          Sprint 14 — Active
        </span>
        <h1 className="text-2xl mt-3" style={{ color: "#1f2937" }}>Friction Companion — Sprint Planning</h1>
        <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Last edited by Haley Potter · 2 hours ago</p>
      </div>

      <h2 className="text-lg mb-3" style={{ color: "#1f2937" }}>Sprint Goals</h2>
      <ul className="space-y-2 mb-6" style={{ color: "#374151" }}>
        <li className="flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked className="rounded" /> Deploy overlay v2 to staging
        </li>
        <li className="flex items-center gap-2 text-sm">
          <input type="checkbox" defaultChecked className="rounded" /> Implement tactile strike animation
        </li>
        <li className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="rounded" /> Fix digital moss particle drift on retina displays
        </li>
        <li className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="rounded" /> Add breathing visualizer recovery mode
        </li>
        <li className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="rounded" /> Wire Settings app toggles to overlay effects
        </li>
      </ul>

      <h2 className="text-lg mb-3" style={{ color: "#1f2937" }}>Discussion Notes</h2>
      <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: "#f9fafb" }}>
        <p className="text-sm" style={{ color: "#374151" }}>
          <strong>Miami:</strong> The progressive vignette threshold at 0.95 is too aggressive.
          Users report it feels jarring. Proposal: add a 5-second fade-in ramp.
        </p>
      </div>
      <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: "#f9fafb" }}>
        <p className="text-sm" style={{ color: "#374151" }}>
          <strong>Arya:</strong> Agreed. Also, the taper ambient warmth should respect the user&apos;s
          color temperature preference. Some users run f.lux and the double-warming is too much.
        </p>
      </div>

      <h2 className="text-lg mb-3" style={{ color: "#1f2937" }}>Metrics</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Avg Focus Duration", value: "47 min", delta: "+12%" },
          { label: "Context Switches / Day", value: "8.3", delta: "-23%" },
          { label: "FigMake Iterations", value: "47", delta: "+∞" },
        ].map(m => (
          <div key={m.label} className="p-4 rounded-lg border" style={{ borderColor: "#e5e7eb" }}>
            <div className="text-xs mb-1" style={{ color: "#6b7280" }}>{m.label}</div>
            <div className="text-xl" style={{ color: "#1f2937" }}>{m.value}</div>
            <div className="text-xs mt-1" style={{ color: m.delta.startsWith("+") ? "#059669" : "#dc2626" }}>
              {m.delta} vs last sprint
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PAGES: Page[] = [
  {
    url: "github.com/friction-labs",
    title: "friction-labs · GitHub",
    favicon: "🐙",
    content: <GitHubPage />,
  },
  {
    url: "stackoverflow.com/questions",
    title: "Top Questions - Stack Overflow",
    favicon: "📋",
    content: <StackOverflowPage />,
  },
  {
    url: "docs.google.com/friction-sprint-14",
    title: "Sprint 14 Planning - Google Docs",
    favicon: "📄",
    content: <DocsPage />,
  },
];

const BOOKMARKS = [
  { name: "GitHub", url: "github.com/friction-labs" },
  { name: "Stack Overflow", url: "stackoverflow.com/questions" },
  { name: "Sprint Docs", url: "docs.google.com/friction-sprint-14" },
  { name: "Figma", url: "figma.com" },
  { name: "Vercel", url: "vercel.com" },
  { name: "MDN", url: "developer.mozilla.org" },
];

export function ChromeApp() {
  const [tabs, setTabs] = useState(PAGES.map((p, i) => ({ ...p, id: i })));
  const [activeTabId, setActiveTabId] = useState(0);
  const [url, setUrl] = useState(PAGES[0].url);

  const activePage = tabs.find(t => t.id === activeTabId);

  const switchTab = (id: number) => {
    setActiveTabId(id);
    const tab = tabs.find(t => t.id === id);
    if (tab) setUrl(tab.url);
  };

  const closeTab = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = tabs.filter(t => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id && remaining.length > 0) {
      switchTab(remaining[remaining.length - 1].id);
    }
  };

  const navigateToBookmark = (bookmarkUrl: string) => {
    const page = PAGES.find(p => p.url === bookmarkUrl);
    if (page) {
      setUrl(page.url);
      const existing = tabs.find(t => t.url === page.url);
      if (existing) {
        setActiveTabId(existing.id);
      } else {
        const newTab = { ...page, id: Date.now() };
        setTabs(prev => [...prev, newTab]);
        setActiveTabId(newTab.id);
      }
    }
  };

  return (
    <div className="size-full flex flex-col" style={{ backgroundColor: "#ffffff" }}>
      {/* Tab Bar */}
      <div className="flex items-end gap-0 px-2 pt-1 shrink-0" style={{ backgroundColor: "#dee1e6", height: "38px" }}>
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg cursor-pointer group max-w-[200px]"
            style={{
              backgroundColor: tab.id === activeTabId ? "#ffffff" : "transparent",
              fontSize: "12px",
              color: "#5f6368",
            }}
          >
            <span className="shrink-0">{tab.favicon}</span>
            <span className="truncate">{tab.title}</span>
            <button
              onClick={(e) => closeTab(tab.id, e)}
              className="shrink-0 opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-200 cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button className="p-1.5 rounded hover:bg-[#c8cad0] ml-1 mb-1 cursor-pointer">
          <Plus size={14} style={{ color: "#5f6368" }} />
        </button>
      </div>

      {/* Address Bar */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 shrink-0"
        style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #dadce0" }}
      >
        <ArrowLeft size={18} className="cursor-pointer" style={{ color: "#5f6368" }} />
        <ArrowRight size={18} style={{ color: "#5f6368", opacity: 0.4 }} />
        <RotateCw size={16} className="cursor-pointer" style={{ color: "#5f6368" }} />

        <div className="flex-1 flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: "#f1f3f4" }}>
          <Lock size={14} style={{ color: "#5f6368" }} />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: "#202124" }}
          />
          <Star size={14} style={{ color: "#5f6368" }} className="cursor-pointer" />
        </div>

        <ChevronDown size={16} style={{ color: "#5f6368" }} />
      </div>

      {/* Bookmarks Bar */}
      <div
        className="flex items-center gap-1 px-4 py-1 shrink-0"
        style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #eeeeee", height: "28px" }}
      >
        {BOOKMARKS.map(bm => (
          <button
            key={bm.name}
            onClick={() => navigateToBookmark(bm.url)}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs cursor-pointer hover:bg-gray-100"
            style={{ color: "#5f6368" }}
          >
            <Bookmark size={10} />
            {bm.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: "#ffffff" }}>
        {activePage?.content || (
          <div className="flex items-center justify-center h-full" style={{ color: "#5f6368" }}>
            <div className="text-center">
              <Search size={48} className="mx-auto mb-4" style={{ color: "#dadce0" }} />
              <p className="text-lg" style={{ color: "#202124" }}>Navigate to a page</p>
              <p className="text-sm">Use the bookmarks bar or type a URL</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}