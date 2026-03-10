/**
 * MAIL APP
 *
 * Full Gmail-style email client with folders, compose modal, reply,
 * starred messages, rich email body, and attachment indicators.
 */

import { useState } from "react";
import {
  Mail, Star, Send, Inbox, Archive, Trash2, Tag, Paperclip,
  Reply, Forward, MoreHorizontal, Search, Pencil, ChevronDown,
  Clock, AlertCircle, X,
} from "lucide-react";

interface Email {
  id: number;
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  time: string;
  preview: string;
  body: string;
  unread: boolean;
  starred: boolean;
  labels: string[];
  hasAttachment: boolean;
  folder: "inbox" | "starred" | "sent" | "archive" | "trash";
}

const EMAILS: Email[] = [
  {
    id: 1,
    from: "Arya Garg",
    fromEmail: "arya@frictionlabs.dev",
    to: "me",
    subject: "Re: Infinite render loop — KeyboardContext fix",
    time: "3:30 AM",
    preview: "The useCallback + equality guard fix is deployed. All four setters stable now...",
    body: `Hey team,

The useCallback + equality guard fix is deployed. All four setters in KeyboardContext are now stable refs — setResistance, setRGBMode, setBinaural, setTemperature.

The root cause: each setter was an inline arrow function in the provider, creating new refs on every render. FrictionKeyboard's useEffect had them in its dependency array, so every state update → new refs → effect fires → more state updates → infinite loop.

Pattern to remember: ALWAYS wrap context setters in useCallback with [] deps when they'll be used in consumer useEffects.

Also wired up the temperature field — derives from fatigue (0 to +4°C), shows thermometer readout and heat-haze glow at keyboard edges.

— Arya`,
    unread: true,
    starred: true,
    labels: ["Engineering"],
    hasAttachment: false,
    folder: "inbox",
  },
  {
    id: 2,
    from: "FigMake Agent",
    fromEmail: "agent@figma.com",
    to: "friction-team",
    subject: "Submission Reminder — 12 hours remaining",
    time: "9:00 AM",
    preview: "Your FigBuild 2026 submission is due Monday March 9th @ 11:00 PM EST...",
    body: `Hi Friction Labs team,

This is a reminder that your FigBuild 2026 submission is due:

Deadline: Monday, March 9th @ 11:00 PM EST

Required deliverables:
1. Demo video (3-5 minutes)
2. Figma Slides with embedded Figma Make prototypes
3. All team members verified with school-issued email

Judges from Meta, Microsoft, Spotify, and Google will evaluate:
- Problem-Solution Fit
- Innovation & Creativity
- Design Execution & UX
- Craft & Intentionality
- Storytelling & Presentation

Good luck!
— FigMake Agent`,
    unread: true,
    starred: false,
    labels: [],
    hasAttachment: false,
    folder: "inbox",
  },
  {
    id: 3,
    from: "Miami Celentana",
    fromEmail: "miami@frictionlabs.dev",
    to: "me",
    subject: "Brutalist Tactile direction — final aesthetic decisions",
    time: "Yesterday",
    preview: "Locked in the design language. Dark matte black, amber/orange glowing text...",
    body: `Hey,

Locked in the Brutalist Tactile design language:

- Dark matte black backgrounds (#0a0a0a → #1a1a1a)
- Amber/orange glowing text (var(--friction-accent-amber))
- JetBrains Mono everywhere
- Dune-inspired (Haley's Bene Gesserit reference sealed it)
- Seven signature overlay effects driven by biometric thresholds

The horizontal split layout is exactly right — left side Neural Interface Simulator with biometric sliders, persona cards, draggable timeline, and keyboard; right side fake OS with the six draggable app windows launchable from the dock.

Re: the dock z-index fix — great call making it stay above fullscreen windows. That was driving me crazy during testing.

— Miami`,
    unread: false,
    starred: false,
    labels: ["Design"],
    hasAttachment: true,
    folder: "inbox",
  },
  {
    id: 4,
    from: "Haley Potter",
    fromEmail: "haley@frictionlabs.dev",
    to: "friction-team",
    subject: "Product doc v4 — LC-NE research + Van Dongen effect",
    time: "Yesterday",
    preview: "Updated friction-product-doc-4.md with the neuroscience backbone...",
    body: `Team,

Updated friction-product-doc-4.md with the full neuroscience backbone:

1. Wiehler et al. 2022 — glutamate buildup in lateral prefrontal cortex after sustained cognitive work. This is why our taper triggers at ~90 minutes.

2. LC-NE system (locus coeruleus-norepinephrine) — tonic vs phasic modes map to exploitation vs exploration. When effort exceeds reward, people shift from focused exploitation to distracted exploration. We detect this transition.

3. Van Dongen effect — subjective fatigue perception plateaus while objective performance continues to decline. This is Charlie's persona story: he doesn't FEEL tired, but he IS making errors. That's why we need the Hard Intercept.

4. Default Mode Network — activity is lowered during flow states (Ulrich et al., 2014). We track this indirectly through focus + engagement metrics.

Three concrete use cases matching the rubric:
- Claudia (freelancer) → The Taper
- Perplexous (PhD student) → Digital Moss / Flow Preservation
- Charlie (solo lawyer) → The Hard Intercept

— Haley

P.S. HALEY'S FREAKOFF CORNER: the Bene Gesserit controlled their own metabolism. We're basically building that but for cognitive load. 🪱`,
    unread: false,
    starred: true,
    labels: ["Research"],
    hasAttachment: true,
    folder: "inbox",
  },
  {
    id: 5,
    from: "FigMake Agent",
    fromEmail: "agent@figma.com",
    to: "friction-team",
    subject: "Build session recap — architecture & lessons learned",
    time: "3:15 AM",
    preview: "Current architecture: 5 context providers, 13 fake apps, 3 persona profiles...",
    body: `Build session recap:

Current architecture:
- 5 context providers: Biometric, Keyboard, Persona, Session, WindowManager
- 13 fake apps (VSCode, Chrome, Mail, Calendar, Slack, Spotify, Finder, Notes, Calculator, Terminal, Settings, Friction, FrictionOverlay)
- 3 persona profiles with simulation scripts + timeline snapshots
- 7 overlay effects in the Friction sidebar
- Keyboard lethargy system: ghost keys, label blur, board sag, temperature glow

Key bugs fixed tonight:
1. Blank screen: Missing InsightCard import in MirrorPage (my fault — dropped during large file rewrite)
2. Infinite loop: Unstable context setter refs in KeyboardContext → wrapped in useCallback + equality guards
3. Z-index wars: WindowManagerContext switched from setState to useRef for tracking

Outstanding items:
- 47 unused shadcn ui/ components (won't fix before deadline)
- Settings app Friction toggles not wired to overlay context
- pages/ directory should consolidate into components/apps/

Lesson: never regenerate a large file without checking all imports. The stale cache made debugging extra confusing — error line 195 in a 153-line file.

— FigMake Agent`,
    unread: false,
    starred: true,
    labels: ["Engineering"],
    hasAttachment: false,
    folder: "inbox",
  },
  {
    id: 6,
    from: "Notion",
    fromEmail: "notify@notion.so",
    to: "me",
    subject: "3 updates in Friction Labs Workspace",
    time: "Mar 8",
    preview: "Haley Potter edited 'Product Doc v4', Miami Celentana commented on 'Design System'...",
    body: `3 new updates in your Friction Labs workspace:

1. Haley Potter edited "Product Doc v4" (LC-NE research section)
2. Miami Celentana commented on "Brutalist Tactile Design System"
3. New page created: "FigBuild 2026 Submission Checklist"

View in Notion →`,
    unread: false,
    starred: false,
    labels: [],
    hasAttachment: false,
    folder: "inbox",
  },
];

const LABEL_COLORS: Record<string, string> = {
  Engineering: "#4285f4",
  Design: "#ea4335",
  Research: "#34a853",
  GitHub: "#24292f",
};

const FOLDERS = [
  { id: "inbox" as const, name: "Inbox", icon: Inbox, count: 2 },
  { id: "starred" as const, name: "Starred", icon: Star, count: 0 },
  { id: "sent" as const, name: "Sent", icon: Send, count: 0 },
  { id: "archive" as const, name: "Archive", icon: Archive, count: 0 },
  { id: "trash" as const, name: "Trash", icon: Trash2, count: 0 },
];

export function MailApp() {
  const [emails, setEmails] = useState(EMAILS);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(EMAILS[0]);
  const [activeFolder, setActiveFolder] = useState<string>("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeTo, setComposeTo] = useState("");
  const [composeBody, setComposeBody] = useState("");

  const filteredEmails = emails
    .filter(e => activeFolder === "starred" ? e.starred : e.folder === activeFolder)
    .filter(e =>
      searchQuery === "" ||
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.from.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const toggleStar = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEmails(prev => prev.map(em => em.id === id ? { ...em, starred: !em.starred } : em));
  };

  const selectEmail = (email: Email) => {
    setSelectedEmail(email);
    if (email.unread) {
      setEmails(prev => prev.map(em => em.id === email.id ? { ...em, unread: false } : em));
    }
  };

  return (
    <div className="size-full flex" style={{ backgroundColor: "#ffffff" }}>
      {/* Sidebar */}
      <div className="w-52 flex flex-col border-r shrink-0" style={{ borderColor: "#e5e7eb" }}>
        <div className="p-3">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm cursor-pointer shadow-md"
            style={{ backgroundColor: "#c2e7ff", color: "#001d35" }}
          >
            <Pencil size={16} />
            Compose
          </button>
        </div>
        <div className="flex-1 px-2">
          {FOLDERS.map(folder => {
            const Icon = folder.icon;
            const count = folder.id === "inbox"
              ? emails.filter(e => e.folder === "inbox" && e.unread).length
              : folder.id === "starred"
              ? emails.filter(e => e.starred).length
              : 0;
            return (
              <button
                key={folder.id}
                onClick={() => { setActiveFolder(folder.id); setSelectedEmail(null); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-full text-sm cursor-pointer mb-0.5"
                style={{
                  backgroundColor: activeFolder === folder.id ? "#d3e3fd" : "transparent",
                  color: activeFolder === folder.id ? "#001d35" : "#444746",
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{folder.name}</span>
                </div>
                {count > 0 && (
                  <span className="text-xs" style={{ color: activeFolder === folder.id ? "#001d35" : "#444746" }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Email List */}
      <div
        className="flex flex-col border-r shrink-0"
        style={{ width: "320px", borderColor: "#e5e7eb" }}
      >
        {/* Search */}
        <div className="p-3">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full"
            style={{ backgroundColor: "#edf2fc" }}
          >
            <Search size={16} style={{ color: "#444746" }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mail"
              className="flex-1 bg-transparent border-none outline-none text-sm"
              style={{ color: "#1f1f1f" }}
            />
          </div>
        </div>

        {/* Email items */}
        <div className="flex-1 overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full" style={{ color: "#5f6368" }}>
              <Inbox size={32} className="mb-2" style={{ color: "#dadce0" }} />
              <p className="text-sm">No messages</p>
            </div>
          ) : (
            filteredEmails.map(email => (
              <div
                key={email.id}
                onClick={() => selectEmail(email)}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", email.subject);
                  e.dataTransfer.effectAllowed = "copy";
                }}
                className="px-4 py-3 cursor-pointer border-b"
                style={{
                  borderColor: "#f1f3f4",
                  backgroundColor: selectedEmail?.id === email.id
                    ? "#d3e3fd"
                    : email.unread
                    ? "#edf2fc"
                    : "transparent",
                }}
              >
                <div className="flex items-start gap-2">
                  <button onClick={(e) => toggleStar(email.id, e)} className="mt-0.5 shrink-0 cursor-pointer">
                    <Star
                      size={16}
                      fill={email.starred ? "#f9ab00" : "none"}
                      style={{ color: email.starred ? "#f9ab00" : "#c4c7c5" }}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <span className="text-sm truncate" style={{ color: "#1f1f1f", fontWeight: email.unread ? 600 : 400 }}>
                        {email.from}
                      </span>
                      <span className="text-xs shrink-0 ml-2" style={{ color: "#5f6368" }}>{email.time}</span>
                    </div>
                    <div className="text-sm mb-0.5 truncate" style={{ color: "#1f1f1f", fontWeight: email.unread ? 600 : 400 }}>
                      {email.subject}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs truncate" style={{ color: "#5f6368" }}>
                        {email.preview}
                      </span>
                      {email.hasAttachment && <Paperclip size={10} className="shrink-0" style={{ color: "#5f6368" }} />}
                    </div>
                    {email.labels.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {email.labels.map(label => (
                          <span
                            key={label}
                            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs"
                            style={{ backgroundColor: `${LABEL_COLORS[label] || "#666"}15`, color: LABEL_COLORS[label] || "#666" }}
                          >
                            <Tag size={8} />
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Email Detail */}
      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <>
            {/* Email Header */}
            <div className="p-6 border-b" style={{ borderColor: "#e5e7eb" }}>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-xl" style={{ color: "#1f1f1f" }}>{selectedEmail.subject}</h1>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                    <Archive size={18} style={{ color: "#5f6368" }} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                    <Trash2 size={18} style={{ color: "#5f6368" }} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                    <MoreHorizontal size={18} style={{ color: "#5f6368" }} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: "#1a73e8" }}
                >
                  {selectedEmail.from[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm" style={{ color: "#1f1f1f" }}>{selectedEmail.from}</span>
                    <span className="text-xs" style={{ color: "#5f6368" }}>&lt;{selectedEmail.fromEmail}&gt;</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "#5f6368" }}>
                    to {selectedEmail.to}
                    <ChevronDown size={12} />
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs shrink-0" style={{ color: "#5f6368" }}>
                  <Clock size={12} />
                  {selectedEmail.time}
                </div>
              </div>

              {selectedEmail.hasAttachment && (
                <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg" style={{ backgroundColor: "#f1f3f4" }}>
                  <Paperclip size={14} style={{ color: "#5f6368" }} />
                  <span className="text-xs" style={{ color: "#5f6368" }}>1 attachment</span>
                </div>
              )}
            </div>

            {/* Email Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <pre
                className="whitespace-pre-wrap text-sm"
                style={{ color: "#1f1f1f", fontFamily: "inherit", lineHeight: "1.6" }}
              >
                {selectedEmail.body}
              </pre>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 p-4 border-t" style={{ borderColor: "#e5e7eb" }}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm cursor-pointer hover:bg-gray-50" style={{ borderColor: "#dadce0", color: "#1f1f1f" }}>
                <Reply size={16} /> Reply
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm cursor-pointer hover:bg-gray-50" style={{ borderColor: "#dadce0", color: "#1f1f1f" }}>
                <Forward size={16} /> Forward
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center" style={{ color: "#5f6368" }}>
            <Mail size={48} className="mb-3" style={{ color: "#dadce0" }} />
            <p className="text-sm">Select a message to read</p>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div
          className="absolute bottom-4 right-4 flex flex-col rounded-t-xl shadow-2xl overflow-hidden"
          style={{
            width: "480px",
            height: "400px",
            backgroundColor: "#ffffff",
            border: "1px solid #dadce0",
            zIndex: 100,
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-2 text-sm"
            style={{ backgroundColor: "#404040", color: "#ffffff" }}
          >
            <span>New Message</span>
            <button onClick={() => setShowCompose(false)} className="cursor-pointer">
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 flex flex-col p-3 gap-2">
            <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: "#e5e7eb" }}>
              <span className="text-sm" style={{ color: "#5f6368" }}>To</span>
              <input
                type="text"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{ color: "#1f1f1f" }}
              />
            </div>
            <div className="flex items-center gap-2 border-b pb-2" style={{ borderColor: "#e5e7eb" }}>
              <span className="text-sm" style={{ color: "#5f6368" }}>Subject</span>
              <input
                type="text"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{ color: "#1f1f1f" }}
              />
            </div>
            <textarea
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm resize-none"
              style={{ color: "#1f1f1f" }}
              placeholder="Write your message..."
            />
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-t" style={{ borderColor: "#e5e7eb" }}>
            <button
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm text-white cursor-pointer"
              style={{ backgroundColor: "#0b57d0" }}
              onClick={() => setShowCompose(false)}
            >
              <Send size={14} /> Send
            </button>
            <button
              onClick={() => setShowCompose(false)}
              className="p-2 rounded cursor-pointer hover:bg-gray-100"
            >
              <Trash2 size={16} style={{ color: "#5f6368" }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}