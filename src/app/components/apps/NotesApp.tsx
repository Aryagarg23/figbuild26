/**
 * NOTES APP
 * 
 * Rich note-taking app with folder structure, markdown-style editing,
 * formatting toolbar, and multiple notes.
 */

import { useState } from "react";
import { FileText, FolderOpen, Plus, Bold, Italic, List, Trash2, Search, Pin, GripVertical } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  pinned: boolean;
  lastEdited: string;
}

const INITIAL_NOTES: Note[] = [
  {
    id: "1",
    title: "Focus Session Log",
    content: "## March 9, 2026\n\nDeep work session: 2h 45m\n- Focus peaked at 0.91 during code review\n- Fatigue rose sharply after hour 2\n- Taper ambient activated at 1:50\n\n### Observations\nThe progressive vignette was too aggressive. Need to tune the threshold from 0.95 to 0.92 for smoother transitions.\n\n### Next Session\n- Try 90-min blocks with 15-min breaks\n- Disable Slack notifications entirely",
    folder: "Work",
    pinned: true,
    lastEdited: "Just now",
  },
  {
    id: "2",
    title: "Friction Design Notes",
    content: "# Brutalist Tactile Aesthetic\n\n## Core Principles\n- Dark matte black backgrounds (#0a0e14)\n- Amber/orange glowing text (#ffa726)\n- JetBrains Mono everywhere\n- Dune-inspired environmental cues\n\n## Color Palette\n- Primary: #ffa726 (Amber)\n- Accent: #ff6b00 (Deep Orange)\n- Surface: #141925\n- Border: #2a3f5f",
    folder: "Work",
    pinned: false,
    lastEdited: "2h ago",
  },
  {
    id: "3",
    title: "Meeting Notes - Sprint 14",
    content: "# Sprint 14 Planning\n\nAttendees: Sarah, Alex, Mike\n\n## Action Items\n- [ ] Implement breathing visualizer\n- [ ] Fix digital moss particle drift\n- [ ] Test fluid time boundary on mobile\n- [x] Deploy overlay v2 to staging\n\n## Discussion\nTeam agreed to prioritize cognitive load reduction features over new UI polish this sprint.",
    folder: "Work",
    pinned: false,
    lastEdited: "Yesterday",
  },
  {
    id: "4",
    title: "Book Notes: Deep Work",
    content: "# Deep Work - Cal Newport\n\n## Key Takeaways\n\n1. **Rule #1**: Work Deeply\n   - Decide on your depth philosophy\n   - Ritualize: where, how long, rules, support\n\n2. **Rule #2**: Embrace Boredom\n   - Don't take breaks from distraction\n   - Take breaks from focus instead\n\n3. **Rule #3**: Quit Social Media\n   - Apply the craftsman approach to tool selection\n\n> \"The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.\"",
    folder: "Personal",
    pinned: true,
    lastEdited: "3 days ago",
  },
  {
    id: "5",
    title: "Grocery List",
    content: "- Oat milk\n- Avocados\n- Sourdough bread\n- Coffee beans (dark roast)\n- Hummus\n- Spinach\n- Chicken breast\n- Rice",
    folder: "Personal",
    pinned: false,
    lastEdited: "1 week ago",
  },
];

const FOLDERS = ["All Notes", "Work", "Personal"];

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [selectedNote, setSelectedNote] = useState<Note>(INITIAL_NOTES[0]);
  const [selectedFolder, setSelectedFolder] = useState("All Notes");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes
    .filter(n => selectedFolder === "All Notes" || n.folder === selectedFolder)
    .filter(n => searchQuery === "" || n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      folder: selectedFolder === "All Notes" ? "Work" : selectedFolder,
      pinned: false,
      lastEdited: "Just now",
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
  };

  const updateNote = (field: "title" | "content", value: string) => {
    const updated = { ...selectedNote, [field]: value, lastEdited: "Just now" };
    setSelectedNote(updated);
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n));
  };

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
    if (selectedNote.id === id) setSelectedNote(prev => ({ ...prev, pinned: !prev.pinned }));
  };

  const deleteNote = (id: string) => {
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    if (selectedNote.id === id && remaining.length > 0) setSelectedNote(remaining[0]);
  };

  const insertFormatting = (prefix: string, suffix?: string) => {
    updateNote("content", selectedNote.content + prefix + (suffix || ""));
  };

  return (
    <div className="size-full flex" style={{ backgroundColor: "#fefefe" }}>
      {/* Folder Sidebar */}
      <div className="w-44 flex flex-col border-r" style={{ borderColor: "#e5e5e5", backgroundColor: "#f5f5f5" }}>
        <div className="p-3">
          <div className="text-xs uppercase mb-2" style={{ color: "#999", letterSpacing: "0.05em" }}>Folders</div>
          {FOLDERS.map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm text-left cursor-pointer mb-0.5"
              style={{
                backgroundColor: selectedFolder === folder ? "#e8e8e8" : "transparent",
                color: selectedFolder === folder ? "#000" : "#666",
              }}
            >
              <FolderOpen size={14} />
              {folder}
            </button>
          ))}
        </div>
        <div className="mt-auto p-3 border-t" style={{ borderColor: "#e5e5e5" }}>
          <div className="text-xs" style={{ color: "#999" }}>{notes.length} notes</div>
        </div>
      </div>

      {/* Note List */}
      <div className="w-64 flex flex-col border-r" style={{ borderColor: "#e5e5e5" }}>
        <div className="p-3 flex items-center gap-2 border-b" style={{ borderColor: "#e5e5e5" }}>
          <div className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded" style={{ backgroundColor: "#f0f0f0" }}>
            <Search size={14} style={{ color: "#999" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="flex-1 bg-transparent border-none outline-none text-xs"
              style={{ color: "#333" }}
            />
          </div>
          <button onClick={addNote} className="p-1.5 rounded cursor-pointer hover:bg-gray-100">
            <Plus size={16} style={{ color: "#666" }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedNote(note)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", note.title);
                e.dataTransfer.effectAllowed = "copy";
              }}
              className="p-3 border-b cursor-pointer group"
              style={{
                borderColor: "#eee",
                backgroundColor: selectedNote.id === note.id ? "#fff8e1" : "transparent",
              }}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-1">
                  <GripVertical size={10} className="opacity-0 group-hover:opacity-40 shrink-0 transition-opacity" style={{ color: "#999", cursor: "grab" }} />
                  {note.pinned && <Pin size={10} style={{ color: "#ffa726" }} />}
                  <span className="text-sm" style={{ color: "#202124" }}>{note.title}</span>
                </div>
              </div>
              <div className="text-xs line-clamp-2 mb-1" style={{ color: "#888" }}>
                {note.content.replace(/[#*\[\]]/g, "").slice(0, 80)}
              </div>
              <div className="text-xs" style={{ color: "#bbb" }}>{note.lastEdited}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-4 py-2 border-b" style={{ borderColor: "#e5e5e5" }}>
          <button onClick={() => insertFormatting("**", "**")} className="p-1.5 rounded cursor-pointer hover:bg-gray-100">
            <Bold size={14} style={{ color: "#666" }} />
          </button>
          <button onClick={() => insertFormatting("_", "_")} className="p-1.5 rounded cursor-pointer hover:bg-gray-100">
            <Italic size={14} style={{ color: "#666" }} />
          </button>
          <button onClick={() => insertFormatting("\n- ")} className="p-1.5 rounded cursor-pointer hover:bg-gray-100">
            <List size={14} style={{ color: "#666" }} />
          </button>
          <div className="flex-1" />
          <button onClick={() => togglePin(selectedNote.id)} className="p-1.5 rounded cursor-pointer hover:bg-gray-100">
            <Pin size={14} style={{ color: selectedNote.pinned ? "#ffa726" : "#999" }} />
          </button>
          <button onClick={() => deleteNote(selectedNote.id)} className="p-1.5 rounded cursor-pointer hover:bg-gray-100">
            <Trash2 size={14} style={{ color: "#cc4444" }} />
          </button>
        </div>

        {/* Title */}
        <div className="px-6 pt-4">
          <input
            type="text"
            value={selectedNote.title}
            onChange={(e) => updateNote("title", e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xl"
            style={{ color: "#202124" }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-3">
          <textarea
            value={selectedNote.content}
            onChange={(e) => updateNote("content", e.target.value)}
            className="w-full h-full resize-none bg-transparent border-none outline-none text-sm"
            style={{ color: "#333", lineHeight: "1.7" }}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}