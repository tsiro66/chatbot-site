import React, { useState, useRef, useEffect, type ReactElement } from "react";

// --- Types & Interfaces ---

type Role = "ai" | "user";

interface ChatMessage {
  id: number;
  role: Role;
  text: string;
  time: string;
}

// --- Constants & Utilities ---

const INITIAL_MESSAGE: ChatMessage = {
  id: 1,
  role: "ai",
  text: "Καλησπέρα, πως μπορώ να σε βοηθήσω;",
  time: formatTime(),
};

// The pre-programmed conversation to showcase
const CONVERSATION_SCRIPT: Omit<ChatMessage, "id" | "time">[] = [
  { role: "user", text: "Πότε είναι ανοιχτή η επιχείρηση σας;" },
  { role: "ai", text: "Η επιχείρηση μας είναι ανοιχτή απο τις 9:00 εώς τις 18:00 Δευτέρα εώς Παρασκευή." },
  { role: "user", text: "Μπορώ να κάνω μια κράτηση τώρα;" },
  { role: "ai", text: "Φυσικά! Ποια μέρα θα ήθελες να κάνεις κράτηση;" },
  { role: "user", text: "Αύριο" },
  { role: "ai", text: "Αύριο οι διαθέσιμες ώρες είναι 15:30, 16:00 και 17:00" },
  { role: "user", text: "Κλείσε μου μία κράτηση για τις 16:00" },
  { role: "ai", text: "Καταχωρήθηκε η κράτηση σου για αύριο στις 16:00!" }
];

function formatTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// --- Sub-components ---

interface RoleProps {
  role: Role;
}

function Avatar({ role }: RoleProps): ReactElement {
  const isAi = role === "ai";
  return (
    <div
      className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[11px] font-medium
        ${isAi
          ? "bg-neutral-100 text-neutral-500 border border-neutral-200"
          : "bg-neutral-950 text-white"
        }`}
    >
      {isAi ? "AI" : "U"}
    </div>
  );
}

function Message({ msg }: { msg: ChatMessage }): ReactElement {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-2 w-[80%] ${isUser ? "self-end flex-row-reverse" : "self-start"}`}>
      <Avatar role={msg.role} />
      <div>
        <p className={`text-[11px] text-neutral-400 mt-1 ${isUser ? "text-right" : "text-left"}`}>
          {msg.time}
        </p>
        <div
          className={`px-5 py-2 text-sm leading-relaxed
            ${isUser
              ? "bg-neutral-950 text-white rounded-[20px_4px_20px_20px]"
              : "bg-neutral-100 text-neutral-900 border border-neutral-200 rounded-[4px_20px_20px_20px]"
            }`}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator(): ReactElement {
  return (
    <div className="flex gap-2 self-start w-[80%]">
      <Avatar role="ai" />
      <div className="px-3 py-3 bg-neutral-100 border border-neutral-200 rounded-[4px_14px_14px_14px] flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
          />
        ))}
      </div>
    </div>
  );
}

// --- Main Component ---

export default function ShowcaseChat(): ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on message change or typing status change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Showcase sequence logic
  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const playNextMessage = () => {
      if (currentIndex >= CONVERSATION_SCRIPT.length) return;

      const nextMsg = CONVERSATION_SCRIPT[currentIndex];

      const addMessageToState = () => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: nextMsg.role,
            text: nextMsg.text,
            time: formatTime(),
          },
        ]);
        currentIndex++;
        
        // Schedule next message
        const pauseBeforeNext = nextMsg.role === "user" ? 800 : 1500;
        timeoutId = setTimeout(playNextMessage, pauseBeforeNext);
      };

      if (nextMsg.role === "ai") {
        // AI takes time to type
        setIsTyping(true);
        const typingDuration = 1000 + Math.random() * 800; // 1s to 1.8s
        
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          addMessageToState();
        }, typingDuration);
      } else {
        // User messages appear almost instantly (simulated pacing)
        addMessageToState();
      }
    };

    // Start showcase after 1.5 seconds
    timeoutId = setTimeout(playNextMessage, 1500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex flex-col h-100 w-4xl mx-auto bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
      
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 bg-white">
        <div className="w-8 h-8 rounded-full bg-neutral-950 flex items-center justify-center">
          <span className="text-white text-xs font-medium">AI</span>
        </div>
        <div>
          <h2 className="text-start text-sm font-semibold text-neutral-900">AI βοηθός</h2>
          <p className="text-start text-xs text-neutral-400">Αυτόματη παρουσίαση</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-green-500 tracking-wider" />
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <Message key={msg.id} msg={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </main>

      {/* Disabled Input Area */}
      <footer className="border-t border-neutral-200 px-3 py-3 flex items-end gap-2 bg-neutral-50">
        <div className="flex-1 bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-400 min-h-9.5 flex items-center cursor-not-allowed">
          Δεν μπορείς να στείλεις μηνύματα σε αυτή την επίδειξη.
        </div>
        <button
          disabled
          className="w-9 h-9 rounded-full bg-neutral-300 flex items-center justify-center shrink-0 cursor-not-allowed"
          aria-label="Send disabled"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 12V4M4 8l4-4 4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </footer>
    </div>
  );
}