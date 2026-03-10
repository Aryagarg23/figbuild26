/**
 * FINDER APP
 * 
 * macOS-style file manager with navigation, icon/list view toggle,
 * breadcrumb trail, and file info panel.
 */

import { useState } from "react";
import { ChevronRight, Grid, List, Folder, FileText, Image, Music, Film, Code, Archive, HardDrive, ArrowLeft, ArrowRight, Info } from "lucide-react";

interface FileItem {
  name: string;
  type: "folder" | "file";
  icon: "folder" | "code" | "image" | "music" | "video" | "text" | "archive";
  size?: string;
  modified?: string;
  children?: FileItem[];
}

const FILE_TREE: FileItem[] = [
  {
    name: "Documents", type: "folder", icon: "folder", modified: "Today", children: [
      { name: "project-brief.pdf", type: "file", icon: "text", size: "2.4 MB", modified: "Mar 8" },
      { name: "sprint-notes.md", type: "file", icon: "code", size: "12 KB", modified: "Mar 7" },
      { name: "budget-2026.xlsx", type: "file", icon: "text", size: "156 KB", modified: "Mar 5" },
      { name: "design-spec.fig", type: "file", icon: "image", size: "8.7 MB", modified: "Mar 4" },
    ]
  },
  {
    name: "Projects", type: "folder", icon: "folder", modified: "Today", children: [
      {
        name: "friction-app", type: "folder", icon: "folder", modified: "Today", children: [
          { name: "src/", type: "folder", icon: "folder", modified: "Today" },
          { name: "package.json", type: "file", icon: "code", size: "1.2 KB", modified: "Today" },
          { name: "tsconfig.json", type: "file", icon: "code", size: "542 B", modified: "Mar 6" },
          { name: "README.md", type: "file", icon: "text", size: "3.1 KB", modified: "Mar 5" },
          { name: "vite.config.ts", type: "file", icon: "code", size: "380 B", modified: "Mar 4" },
        ]
      },
      {
        name: "ml-pipeline", type: "folder", icon: "folder", modified: "Mar 3", children: [
          { name: "model.py", type: "file", icon: "code", size: "14 KB", modified: "Mar 3" },
          { name: "train.py", type: "file", icon: "code", size: "8.2 KB", modified: "Mar 2" },
          { name: "requirements.txt", type: "file", icon: "text", size: "245 B", modified: "Feb 28" },
        ]
      },
    ]
  },
  {
    name: "Downloads", type: "folder", icon: "folder", modified: "Yesterday", children: [
      { name: "app-installer.dmg", type: "file", icon: "archive", size: "245 MB", modified: "Mar 7" },
      { name: "screenshot-2026.png", type: "file", icon: "image", size: "1.8 MB", modified: "Mar 6" },
      { name: "presentation.key", type: "file", icon: "text", size: "52 MB", modified: "Mar 5" },
    ]
  },
  {
    name: "Music", type: "folder", icon: "folder", modified: "Mar 1", children: [
      { name: "focus-playlist.m3u", type: "file", icon: "music", size: "1 KB", modified: "Mar 1" },
      { name: "ambient-mix.mp3", type: "file", icon: "music", size: "64 MB", modified: "Feb 28" },
    ]
  },
  {
    name: "Pictures", type: "folder", icon: "folder", modified: "Feb 20", children: [
      { name: "wallpapers/", type: "folder", icon: "folder", modified: "Feb 20" },
      { name: "screenshots/", type: "folder", icon: "folder", modified: "Feb 18" },
    ]
  },
  { name: ".gitconfig", type: "file", icon: "code", size: "342 B", modified: "Jan 15" },
  { name: ".zshrc", type: "file", icon: "code", size: "1.1 KB", modified: "Feb 10" },
];

const ICON_MAP: Record<string, React.ComponentType<{ size: number; style?: React.CSSProperties }>> = {
  folder: Folder,
  code: Code,
  image: Image,
  music: Music,
  video: Film,
  text: FileText,
  archive: Archive,
};

const COLOR_MAP: Record<string, string> = {
  folder: "#64b5f6",
  code: "#81c784",
  image: "#f06292",
  music: "#ba68c8",
  video: "#4dd0e1",
  text: "#90a4ae",
  archive: "#ffb74d",
};

const SIDEBAR_ITEMS = [
  { name: "Recents", icon: "🕐" },
  { name: "Desktop", icon: "🖥️" },
  { name: "Documents", icon: "📄" },
  { name: "Downloads", icon: "⬇️" },
  { name: "Applications", icon: "🚀" },
];

export function FinderApp() {
  const [path, setPath] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [navHistory, setNavHistory] = useState<string[][]>([[]]);
  const [navIndex, setNavIndex] = useState(0);

  const getCurrentItems = (): FileItem[] => {
    let items = FILE_TREE;
    for (const segment of path) {
      const found = items.find(i => i.name === segment);
      if (found?.children) items = found.children;
      else return [];
    }
    return items;
  };

  const navigateTo = (newPath: string[]) => {
    const newHistory = [...navHistory.slice(0, navIndex + 1), newPath];
    setNavHistory(newHistory);
    setNavIndex(newHistory.length - 1);
    setPath(newPath);
    setSelectedItem(null);
  };

  const goBack = () => {
    if (navIndex > 0) {
      setNavIndex(navIndex - 1);
      setPath(navHistory[navIndex - 1]);
      setSelectedItem(null);
    }
  };

  const goForward = () => {
    if (navIndex < navHistory.length - 1) {
      setNavIndex(navIndex + 1);
      setPath(navHistory[navIndex + 1]);
      setSelectedItem(null);
    }
  };

  const openItem = (item: FileItem) => {
    if (item.type === "folder") {
      navigateTo([...path, item.name]);
    } else {
      setSelectedItem(item);
    }
  };

  const items = getCurrentItems();

  return (
    <div className="size-full flex" style={{ backgroundColor: "#ffffff" }}>
      {/* Sidebar */}
      <div className="w-44 flex flex-col border-r" style={{ borderColor: "#e5e5e5", backgroundColor: "#f6f6f6" }}>
        <div className="p-3">
          <div className="text-xs uppercase mb-2" style={{ color: "#999", letterSpacing: "0.05em" }}>Favorites</div>
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.name}
              onClick={() => {
                if (item.name === "Desktop") navigateTo([]);
                else {
                  const found = FILE_TREE.find(f => f.name === item.name);
                  if (found) navigateTo([item.name]);
                }
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left cursor-pointer mb-0.5 hover:bg-[#e8e8e8]"
              style={{ color: "#333" }}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
          <div className="text-xs uppercase mt-4 mb-2" style={{ color: "#999", letterSpacing: "0.05em" }}>Devices</div>
          <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left cursor-pointer hover:bg-[#e8e8e8]" style={{ color: "#333" }}>
            <HardDrive size={14} style={{ color: "#999" }} />
            Macintosh HD
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-3 py-2 border-b" style={{ borderColor: "#e5e5e5", backgroundColor: "#fafafa" }}>
          <button onClick={goBack} className="p-1 rounded cursor-pointer hover:bg-gray-100" style={{ opacity: navIndex > 0 ? 1 : 0.3 }}>
            <ArrowLeft size={16} style={{ color: "#555" }} />
          </button>
          <button onClick={goForward} className="p-1 rounded cursor-pointer hover:bg-gray-100" style={{ opacity: navIndex < navHistory.length - 1 ? 1 : 0.3 }}>
            <ArrowRight size={16} style={{ color: "#555" }} />
          </button>
          
          {/* Breadcrumb */}
          <div className="flex-1 flex items-center gap-1 text-sm" style={{ color: "#555" }}>
            <button onClick={() => navigateTo([])} className="cursor-pointer hover:underline">Home</button>
            {path.map((segment, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight size={12} />
                <button onClick={() => navigateTo(path.slice(0, i + 1))} className="cursor-pointer hover:underline">{segment}</button>
              </span>
            ))}
          </div>

          <button onClick={() => setViewMode("grid")} className="p-1.5 rounded cursor-pointer" style={{ backgroundColor: viewMode === "grid" ? "#e0e0e0" : "transparent" }}>
            <Grid size={14} style={{ color: "#555" }} />
          </button>
          <button onClick={() => setViewMode("list")} className="p-1.5 rounded cursor-pointer" style={{ backgroundColor: viewMode === "list" ? "#e0e0e0" : "transparent" }}>
            <List size={14} style={{ color: "#555" }} />
          </button>
          <button onClick={() => setShowInfo(!showInfo)} className="p-1.5 rounded cursor-pointer" style={{ backgroundColor: showInfo ? "#e0e0e0" : "transparent" }}>
            <Info size={14} style={{ color: "#555" }} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* File Area */}
          <div className="flex-1 overflow-y-auto p-3">
            {items.length === 0 ? (
              <div className="flex items-center justify-center h-full" style={{ color: "#999" }}>
                <span className="text-sm">This folder is empty</span>
              </div>
            ) : viewMode === "list" ? (
              <div>
                <div className="grid grid-cols-[1fr_80px_100px] gap-2 px-3 py-1 text-xs mb-1" style={{ color: "#999" }}>
                  <span>Name</span>
                  <span>Size</span>
                  <span>Modified</span>
                </div>
                {items.map((item) => {
                  const IconComp = ICON_MAP[item.icon] || FileText;
                  return (
                    <div
                      key={item.name}
                      onClick={() => setSelectedItem(item)}
                      onDoubleClick={() => openItem(item)}
                      className="grid grid-cols-[1fr_80px_100px] gap-2 px-3 py-2 rounded text-sm cursor-pointer"
                      style={{
                        backgroundColor: selectedItem?.name === item.name ? "#e3f2fd" : "transparent",
                        color: "#333",
                      }}
                      onMouseEnter={(e) => { if (selectedItem?.name !== item.name) e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
                      onMouseLeave={(e) => { if (selectedItem?.name !== item.name) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <div className="flex items-center gap-2">
                        <IconComp size={16} style={{ color: COLOR_MAP[item.icon] }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-xs" style={{ color: "#999" }}>{item.size || "—"}</span>
                      <span className="text-xs" style={{ color: "#999" }}>{item.modified}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-4 p-2">
                {items.map((item) => {
                  const IconComp = ICON_MAP[item.icon] || FileText;
                  return (
                    <div
                      key={item.name}
                      onClick={() => setSelectedItem(item)}
                      onDoubleClick={() => openItem(item)}
                      className="flex flex-col items-center gap-1 p-3 rounded-lg cursor-pointer"
                      style={{ backgroundColor: selectedItem?.name === item.name ? "#e3f2fd" : "transparent" }}
                    >
                      <IconComp size={40} style={{ color: COLOR_MAP[item.icon] }} />
                      <span className="text-xs text-center truncate w-full" style={{ color: "#333" }}>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Panel */}
          {showInfo && selectedItem && (
            <div className="w-52 border-l p-4 flex flex-col items-center gap-3" style={{ borderColor: "#e5e5e5", backgroundColor: "#fafafa" }}>
              {(() => { const IC = ICON_MAP[selectedItem.icon] || FileText; return <IC size={48} style={{ color: COLOR_MAP[selectedItem.icon] }} />; })()}
              <div className="text-sm text-center" style={{ color: "#333" }}>{selectedItem.name}</div>
              <div className="w-full space-y-2 mt-2">
                <div className="flex justify-between text-xs">
                  <span style={{ color: "#999" }}>Type</span>
                  <span style={{ color: "#333" }}>{selectedItem.type === "folder" ? "Folder" : "File"}</span>
                </div>
                {selectedItem.size && (
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#999" }}>Size</span>
                    <span style={{ color: "#333" }}>{selectedItem.size}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span style={{ color: "#999" }}>Modified</span>
                  <span style={{ color: "#333" }}>{selectedItem.modified}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="px-4 py-1.5 border-t text-xs" style={{ borderColor: "#e5e5e5", color: "#999", backgroundColor: "#fafafa" }}>
          {items.length} items{selectedItem ? ` — "${selectedItem.name}" selected` : ""}
        </div>
      </div>
    </div>
  );
}
