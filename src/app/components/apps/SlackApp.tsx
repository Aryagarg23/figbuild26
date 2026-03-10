/**
 * SLACK APP
 *
 * Full Slack simulation with channels, DMs, threads, reactions,
 * user status indicators, typing indicator, and message composer.
 */

import { useState } from "react";
import { Hash, Send, AtSign, Smile, Paperclip, ChevronDown, Circle, MessageSquare, Plus, Bell, Search, Users } from "lucide-react";

interface Message {
  id: number;
  user: string;
  avatar: string;
  time: string;
  text: string;
  reactions?: { emoji: string; count: number; reacted: boolean }[];
  thread?: { count: number; lastReply: string };
}

interface Channel {
  id: string;
  name: string;
  unread: number;
  description?: string;
}

interface DM {
  id: string;
  name: string;
  avatar: string;
  status: "active" | "away" | "offline";
  unread: number;
}

const CHANNELS: Channel[] = [
  { id: "engineering", name: "engineering", unread: 3, description: "All engineering discussion. Code reviews, architecture, bugs." },
  { id: "friction-dev", name: "friction-dev", unread: 5, description: "Friction companion app — FigBuild 2026" },
  { id: "general", name: "general", unread: 0, description: "Team-wide announcements and vibes" },
  { id: "design", name: "design", unread: 1, description: "Design reviews, Dune aesthetic, brutalist tactile direction" },
  { id: "random", name: "random", unread: 0, description: "Non-work conversations and Haley's freakoff corner" },
  { id: "standup", name: "standup", unread: 0, description: "Daily async standups — FigBuild sprint" },
];

const DMS: DM[] = [
  { id: "arya", name: "Arya Garg", avatar: "AG", status: "active", unread: 1 },
  { id: "miami", name: "Miami Celentana", avatar: "MC", status: "active", unread: 0 },
  { id: "haley", name: "Haley Potter", avatar: "HP", status: "away", unread: 0 },
  { id: "figmake", name: "FigMake Agent", avatar: "🔷", status: "active", unread: 0 },
];

const MESSAGES: Record<string, Message[]> = {
  "engineering": [
    {
      id: 1, user: "Arya Garg", avatar: "AG", time: "2:47 AM",
      text: "Blank screen bug found — `MirrorPage.tsx` was referencing `InsightCard` but the import got dropped somewhere around iteration 4. Re-added the import, app renders again.",
      reactions: [{ emoji: "🎉", count: 3, reacted: false }, { emoji: "🙏", count: 2, reacted: true }],
      thread: { count: 4, lastReply: "FigMake Agent replied 20m ago" },
    },
    {
      id: 2, user: "FigMake Agent", avatar: "🔷", time: "2:52 AM",
      text: "That was my fault — when I rewrote the five fake OS apps with richer UIs, I accidentally dropped the InsightCard import during a large file regeneration. The error pointed to line 195 but the file only had 153 lines, which confirmed it was a stale cache issue.",
      reactions: [{ emoji: "💯", count: 1, reacted: false }],
    },
    {
      id: 3, user: "Arya Garg", avatar: "AG", time: "3:15 AM",
      text: "Next bug: infinite re-render loop in `FrictionKeyboard`. The `useEffect` that syncs biometrics → keyboard state was firing endlessly because `setResistance`/`setRGBMode` in KeyboardContext were unstable refs. Fixed with `useCallback` + equality guards.",
      reactions: [{ emoji: "🔥", count: 4, reacted: true }, { emoji: "🐛", count: 2, reacted: false }],
    },
    {
      id: 4, user: "Miami Celentana", avatar: "MC", time: "8:30 AM",
      text: "Can't believe we're debugging at 3 AM the night before submission 😂 The keyboard lethargy system looks incredible though. Ghost key flickers at high fatigue is *chef's kiss*.",
      reactions: [{ emoji: "😂", count: 3, reacted: true }, { emoji: "🫡", count: 2, reacted: false }],
    },
    {
      id: 5, user: "you", avatar: "YO", time: "9:02 AM",
      text: "The `WindowManagerContext` useRef fix for z-index tracking was critical too. Nested setState calls were causing cascading re-renders when dragging windows. Switched to a ref and the whole desktop feels solid now.",
      reactions: [{ emoji: "👍", count: 2, reacted: false }],
    },
  ],
  "friction-dev": [
    {
      id: 10, user: "Haley Potter", avatar: "HP", time: "Yesterday",
      text: "Research dump: Wiehler et al. 2022 — prolonged cognitive work causes glutamate buildup in the lateral prefrontal cortex. This is the neuroscience backbone for our taper intervention. After ~90 min of sustained deep work, cognitive output drops 40%.",
      reactions: [{ emoji: "🧠", count: 4, reacted: true }],
      thread: { count: 7, lastReply: "Arya replied 2h ago" },
    },
    {
      id: 11, user: "Miami Celentana", avatar: "MC", time: "Yesterday",
      text: "Brutalist Tactile aesthetic is locked in. Dark matte black, amber/orange glowing text, JetBrains Mono. Haley's Dune reference sealed it — the Bene Gesserit had such deep body control they could control their own metabolism. That's basically what Friction does for cognitive load.",
      reactions: [{ emoji: "🔥", count: 5, reacted: true }],
    },
    {
      id: 12, user: "FigMake Agent", avatar: "🔷", time: "Yesterday",
      text: "Persona simulation engine is working. Three personas (Claudia, Perplexous, Charlie) each with scripted `simulationScript` arrays, biometric timelines, and story beats. The timeline scrubber reconciliation uses snapshots so you can scrub backwards without state bugs.",
      reactions: [{ emoji: "🎨", count: 3, reacted: false }],
    },
    {
      id: 13, user: "Arya Garg", avatar: "AG", time: "10:15 AM",
      text: "Just counted — we have 47 unused shadcn `ui/` components from the initial scaffold. Should clean those up but... deadline is in 12 hours. Ship it. 🚢",
      reactions: [{ emoji: "🚢", count: 4, reacted: true }],
    },
    {
      id: 14, user: "Haley Potter", avatar: "HP", time: "10:30 AM",
      text: "The product doc is on version 4 now (`friction-product-doc-4.md`). Added the LC-NE system research — tonic vs phasic norepinephrine modes map perfectly to our exploitation vs exploration states. Also added the Van Dongen effect for Charlie's persona (subjective fatigue plateaus while objective performance declines).",
    },
  ],
  "general": [
    {
      id: 20, user: "Miami Celentana", avatar: "MC", time: "Yesterday",
      text: "📢 FigBuild 2026 deadline: Monday March 9th @ 11:00 PM EST. We need the demo video (3-5 min), Figma Slides with embedded prototypes, and all team members verified with school email.",
      thread: { count: 8, lastReply: "3 people replied" },
    },
    {
      id: 21, user: "Haley Potter", avatar: "HP", time: "Yesterday",
      text: "Judges are from Meta, Microsoft, Spotify, and Google. The heavy Spotify presence hints that emotional storytelling and personality in design will stand out. Our brutalist aesthetic should absolutely differentiate us.",
      reactions: [{ emoji: "✨", count: 3, reacted: true }],
    },
  ],
  "design": [
    {
      id: 30, user: "Miami Celentana", avatar: "MC", time: "Yesterday",
      text: "Seven overlay effects for the Friction sidebar: progressive vignette, digital moss, recovery breathing ring, tactile strike ripple, ambient warmth, brightness dim, and the peripheral flicker. All driven by biometric thresholds. 🎨",
      reactions: [{ emoji: "🙌", count: 4, reacted: true }, { emoji: "✨", count: 3, reacted: false }],
    },
    {
      id: 31, user: "Haley Potter", avatar: "HP", time: "9:00 AM",
      text: "The keyboard lethargy visualization is a storytelling goldmine. Judges can literally FEEL the fatigue building — keys slow down, ghost-presses flicker, labels blur, the whole board sags. It's the physical-digital bridge we've been talking about.",
    },
  ],
  "random": [
    {
      id: 40, user: "Haley Potter", avatar: "HP", time: "Yesterday",
      text: "HALEY'S FREAKOFF CORNER: In Dune, the Bene Gesserit had such deep control over their bodies they could control things like metabolism speed, sleep cycles, even choosing the sex of their child. I'm using this as inspo for things that seem impossible — it also comes with a FIRE aesthetic 🔥",
      reactions: [{ emoji: "🧠", count: 6, reacted: true }, { emoji: "🪱", count: 3, reacted: false }],
    },
    {
      id: 41, user: "Miami Celentana", avatar: "MC", time: "Yesterday",
      text: "MC brain dump: what if the inflection in people's voices determines stress level? Or hormonal tracking to reset stress patterns? The brain lighting up in response to ads — dangerous data in corporate hands, but psychologists could use it for addiction recovery...",
      reactions: [{ emoji: "🤯", count: 4, reacted: true }],
    },
  ],
  "standup": [
    {
      id: 50, user: "StandupBot", avatar: "🤖", time: "8:00 AM",
      text: "🌅 FigBuild 2026 — Final day! What's done, what's left, any blockers?",
    },
    {
      id: 51, user: "Arya Garg", avatar: "AG", time: "8:15 AM",
      text: "**Done:** Fixed blank screen bug, infinite loop fix, keyboard lethargy system synced to biometric panel.\n**Today:** Easter eggs in fake apps, final polish, demo video.\n**Blockers:** Sleep deprivation 😴",
    },
    {
      id: 52, user: "Miami Celentana", avatar: "MC", time: "8:22 AM",
      text: "**Done:** Finalized brutalist tactile design system, overlay effects, Figma slides structure.\n**Today:** Demo video capture, presentation narrative.\n**Blockers:** Need Haley's research citations for the science slides.",
    },
    {
      id: 53, user: "Haley Potter", avatar: "HP", time: "8:35 AM",
      text: "**Done:** Product doc v4, LC-NE research integration, persona stories, rubric self-check.\n**Today:** Final research citations, demo script, review submission checklist.\n**Blockers:** None — let's ship this 🚀",
    },
  ],
  // DMs
  "arya": [
    { id: 100, user: "Arya Garg", avatar: "AG", time: "3:20 AM", text: "The `temperature` field in KeyboardContext was completely unread. I just wired it up — derives from fatigue (0 → +4°C), shows a thermometer readout and heat-haze glow at keyboard edges. Peltier cooler simulation complete." },
    { id: 101, user: "you", avatar: "YO", time: "3:22 AM", text: "Perfect. That was on the outstanding items list. How many iterations are we at now with FigMake?" },
    { id: 102, user: "Arya Garg", avatar: "AG", time: "3:23 AM", text: "Lost count honestly. The CHANGELOG.md has every change with backtrack instructions though. Architecture map is at the top. Whole thing is a living document of the build process." },
  ],
  "miami": [
    { id: 110, user: "Miami Celentana", avatar: "MC", time: "Yesterday", text: "The horizontal split layout is working great — left side neural interface simulator with the biometric sliders + persona cards + keyboard, right side fake OS with the six draggable apps. Exactly what we specced." },
    { id: 111, user: "you", avatar: "YO", time: "Yesterday", text: "Agreed. The macOS-style dock with high z-index was a good call — it stays accessible even over fullscreen windows now." },
  ],
  "haley": [
    { id: 120, user: "Haley Potter", avatar: "HP", time: "Yesterday", text: "Added three concrete use cases to the product doc: Claudia the Freelancer (The Taper), Perplexous the PhD Student (Digital Moss), Charlie the Solo Lawyer (Hard Intercept). Each demonstrates a different Friction intervention." },
  ],
  "figmake": [
    { id: 130, user: "FigMake Agent", avatar: "🔷", time: "3:00 AM", text: "I've been tracking all changes in the CHANGELOG. Current architecture: 5 context providers (Biometric, Keyboard, Persona, Session, WindowManager), 13 fake apps, 3 persona profiles with simulation scripts, 7 overlay effects. The biggest lesson: never regenerate a large file without checking imports." },
    { id: 131, user: "you", avatar: "YO", time: "3:05 AM", text: "Ha. The InsightCard incident. At least it taught us about stale cache debugging — error pointed to line 195 in a 153-line file." },
    { id: 132, user: "FigMake Agent", avatar: "🔷", time: "3:06 AM", text: "And the useCallback fix for KeyboardContext is a pattern I'll remember. Unstable function refs in context providers + useEffect = infinite render loops. Classic React footgun. 🔫" },
  ],
};

const STATUS_COLORS: Record<string, string> = {
  active: "#44b553",
  away: "#e8912d",
  offline: "#8b8b8b",
};

export function SlackApp() {
  const [currentChannel, setCurrentChannel] = useState("engineering");
  const [message, setMessage] = useState("");
  const [channelType, setChannelType] = useState<"channel" | "dm">("channel");
  const [showChannelInfo, setShowChannelInfo] = useState(false);

  const messages = MESSAGES[currentChannel] || [];
  const currentChannelData = CHANNELS.find(c => c.id === currentChannel);
  const currentDMData = DMS.find(d => d.id === currentChannel);
  const displayName = channelType === "channel"
    ? `# ${currentChannelData?.name || currentChannel}`
    : currentDMData?.name || currentChannel;

  return (
    <div className="size-full flex" style={{ backgroundColor: "#ffffff" }}>
      {/* Sidebar */}
      <div className="w-60 flex flex-col shrink-0" style={{ backgroundColor: "#3f0e40" }}>
        {/* Workspace header */}
        <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base">Friction Labs</h2>
            <ChevronDown size={16} style={{ color: "rgba(255,255,255,0.7)" }} />
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Circle size={8} fill="#44b553" stroke="none" />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Active</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {/* Quick Actions */}
          <div className="px-3 mb-3 space-y-0.5">
            <button className="w-full flex items-center gap-2 px-2 py-1 rounded text-sm text-left cursor-pointer hover:bg-[rgba(255,255,255,0.1)]" style={{ color: "rgba(255,255,255,0.8)" }}>
              <MessageSquare size={16} /> Threads
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-1 rounded text-sm text-left cursor-pointer hover:bg-[rgba(255,255,255,0.1)]" style={{ color: "rgba(255,255,255,0.8)" }}>
              <Bell size={16} /> Activity
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-1 rounded text-sm text-left cursor-pointer hover:bg-[rgba(255,255,255,0.1)]" style={{ color: "rgba(255,255,255,0.8)" }}>
              <Search size={16} /> Search
            </button>
          </div>

          {/* Channels */}
          <div className="px-3 mb-1">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
                Channels
              </span>
              <Plus size={14} style={{ color: "rgba(255,255,255,0.5)" }} className="cursor-pointer" />
            </div>
          </div>
          {CHANNELS.map(channel => (
            <button
              key={channel.id}
              onClick={() => { setCurrentChannel(channel.id); setChannelType("channel"); }}
              className="w-full flex items-center justify-between px-4 py-1 cursor-pointer mb-0.5"
              style={{
                backgroundColor: currentChannel === channel.id && channelType === "channel" ? "#1164a3" : "transparent",
                color: currentChannel === channel.id && channelType === "channel"
                  ? "#ffffff"
                  : channel.unread > 0
                  ? "#ffffff"
                  : "rgba(255,255,255,0.7)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <Hash size={14} />
                <span className="text-sm" style={{ fontWeight: channel.unread > 0 ? 700 : 400 }}>
                  {channel.name}
                </span>
              </div>
              {channel.unread > 0 && (
                <span
                  className="w-5 h-5 rounded flex items-center justify-center text-xs"
                  style={{ backgroundColor: "#e01e5a", color: "#ffffff" }}
                >
                  {channel.unread}
                </span>
              )}
            </button>
          ))}

          {/* DMs */}
          <div className="px-3 mt-4 mb-1">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>
                Direct Messages
              </span>
              <Plus size={14} style={{ color: "rgba(255,255,255,0.5)" }} className="cursor-pointer" />
            </div>
          </div>
          {DMS.map(dm => (
            <button
              key={dm.id}
              onClick={() => { setCurrentChannel(dm.id); setChannelType("dm"); }}
              className="w-full flex items-center justify-between px-4 py-1 cursor-pointer mb-0.5"
              style={{
                backgroundColor: currentChannel === dm.id && channelType === "dm" ? "#1164a3" : "transparent",
                color: currentChannel === dm.id && channelType === "dm"
                  ? "#ffffff"
                  : dm.unread > 0
                  ? "#ffffff"
                  : "rgba(255,255,255,0.7)",
              }}
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center text-xs"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#ffffff" }}
                  >
                    {dm.avatar[0]}
                  </div>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border"
                    style={{
                      backgroundColor: STATUS_COLORS[dm.status],
                      borderColor: "#3f0e40",
                    }}
                  />
                </div>
                <span className="text-sm" style={{ fontWeight: dm.unread > 0 ? 700 : 400 }}>
                  {dm.name}
                </span>
              </div>
              {dm.unread > 0 && (
                <span
                  className="w-5 h-5 rounded flex items-center justify-center text-xs"
                  style={{ backgroundColor: "#e01e5a", color: "#ffffff" }}
                >
                  {dm.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Channel Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ borderColor: "#e5e5e5" }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg" style={{ color: "#1d1c1d" }}>
                {displayName}
              </span>
              {channelType === "dm" && currentDMData && (
                <Circle
                  size={8}
                  fill={STATUS_COLORS[currentDMData.status]}
                  stroke="none"
                />
              )}
            </div>
            {channelType === "channel" && currentChannelData?.description && (
              <p className="text-xs mt-0.5" style={{ color: "#616061" }}>
                {currentChannelData.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChannelInfo(!showChannelInfo)}
              className="p-1.5 rounded hover:bg-gray-100 cursor-pointer"
            >
              <Users size={18} style={{ color: "#616061" }} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full" style={{ color: "#616061" }}>
              <MessageSquare size={32} className="mb-2" style={{ color: "#e0e0e0" }} />
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">Be the first to say something!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", msg.text.slice(0, 80));
                  e.dataTransfer.effectAllowed = "copy";
                }}
                className="mb-4 group hover:bg-[#f8f8f8] -mx-3 px-3 py-1 rounded cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0"
                    style={{
                      backgroundColor: msg.user === "you" ? "#007a5a" : msg.avatar === "🔷" ? "#e8eaed" : "#4a154b",
                      color: msg.avatar === "🔷" ? "#1d1c1d" : "#ffffff",
                    }}
                  >
                    {msg.avatar === "🔷" ? "🔷" : msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="font-bold text-sm" style={{ color: "#1d1c1d" }}>
                        {msg.user === "you" ? "You" : msg.user}
                      </span>
                      <span className="text-xs" style={{ color: "#616061" }}>
                        {msg.time}
                      </span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap" style={{ color: "#1d1c1d", lineHeight: "1.5" }}>
                      {msg.text.split(/(```[\s\S]*?```|`[^`]+`|@\w+)/g).map((part, pi) => {
                        if (part.startsWith("```")) {
                          return (
                            <pre
                              key={pi}
                              className="my-2 px-3 py-2 rounded text-xs overflow-x-auto"
                              style={{ backgroundColor: "#f8f8f8", border: "1px solid #e5e5e5", fontFamily: "JetBrains Mono, monospace" }}
                            >
                              {part.replace(/```\n?/g, "")}
                            </pre>
                          );
                        }
                        if (part.startsWith("`")) {
                          return (
                            <code
                              key={pi}
                              className="px-1 py-0.5 rounded text-xs"
                              style={{ backgroundColor: "#f0e0e0", color: "#e01e5a" }}
                            >
                              {part.replace(/`/g, "")}
                            </code>
                          );
                        }
                        if (part.startsWith("@")) {
                          return (
                            <span
                              key={pi}
                              className="px-1 rounded cursor-pointer"
                              style={{ backgroundColor: "#e8f5fa", color: "#1264a3" }}
                            >
                              {part}
                            </span>
                          );
                        }
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return <strong key={pi}>{part.replace(/\*\*/g, "")}</strong>;
                        }
                        return <span key={pi}>{part}</span>;
                      })}
                    </div>

                    {/* Reactions */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex gap-1 mt-1.5">
                        {msg.reactions.map((r, ri) => (
                          <button
                            key={ri}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs cursor-pointer border"
                            style={{
                              backgroundColor: r.reacted ? "#e8f5fa" : "#f8f8f8",
                              borderColor: r.reacted ? "#1264a3" : "#e5e5e5",
                              color: "#1d1c1d",
                            }}
                          >
                            {r.emoji} {r.count}
                          </button>
                        ))}
                        <button
                          className="flex items-center px-1.5 py-0.5 rounded-full text-xs cursor-pointer border opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ borderColor: "#e5e5e5", backgroundColor: "#f8f8f8" }}
                        >
                          <Smile size={12} style={{ color: "#616061" }} />
                        </button>
                      </div>
                    )}

                    {/* Thread indicator */}
                    {msg.thread && (
                      <button
                        className="flex items-center gap-2 mt-1.5 px-2 py-1 rounded cursor-pointer hover:bg-white border"
                        style={{ borderColor: "transparent" }}
                      >
                        <MessageSquare size={12} style={{ color: "#1264a3" }} />
                        <span className="text-xs" style={{ color: "#1264a3" }}>
                          {msg.thread.count} replies
                        </span>
                        <span className="text-xs" style={{ color: "#616061" }}>
                          {msg.thread.lastReply}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="px-5 pb-4 shrink-0">
          <div
            className="flex items-start gap-2 px-4 py-3 rounded-lg border"
            style={{ borderColor: "#868686" }}
          >
            <div className="flex items-center gap-1 pt-0.5 shrink-0">
              <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                <Plus size={18} style={{ color: "#616061" }} />
              </button>
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${displayName}`}
              className="flex-1 bg-transparent border-none outline-none text-sm"
              style={{ color: "#1d1c1d" }}
            />
            <div className="flex items-center gap-1 pt-0.5 shrink-0">
              <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                <AtSign size={18} style={{ color: "#616061" }} />
              </button>
              <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                <Paperclip size={18} style={{ color: "#616061" }} />
              </button>
              <button className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                <Smile size={18} style={{ color: "#616061" }} />
              </button>
              <button
                className="p-1.5 rounded cursor-pointer"
                style={{
                  backgroundColor: message.trim() ? "#007a5a" : "transparent",
                  color: message.trim() ? "#ffffff" : "#616061",
                }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}