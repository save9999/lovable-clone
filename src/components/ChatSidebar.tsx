"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Sparkles, User, ChevronDown, Lightbulb } from "lucide-react";
import { Message } from "@/lib/types";

const QUICK_PROMPTS = [
  "Ajoute un mode sombre",
  "Ajoute un formulaire de contact",
  "Améliore le design de la page d'accueil",
  "Ajoute une barre de navigation responsive",
  "Crée une page de connexion",
  "Ajoute des animations de transition",
];

function MessageContent({ content }: { content: string }) {
  const hasCode = content.includes("```");
  const [expanded, setExpanded] = useState(false);
  if (hasCode && !expanded) {
    const beforeCode = content.split("```")[0].trim();
    const summary = beforeCode || "Code généré dans l'éditeur →";
    return (
      <div>
        <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
          {summary.slice(0, 220)}{summary.length > 220 ? "..." : ""}
        </p>
        <button onClick={() => setExpanded(true)} className="mt-2 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
          <ChevronDown size={11} /> Voir la réponse complète
        </button>
      </div>
    );
  }
  if (content.length > 400 && !expanded) {
    return (
      <div>
        <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
          {content.slice(0, 300)}...
        </p>
        <button onClick={() => setExpanded(true)} className="mt-1 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
          <ChevronDown size={11} /> Voir plus
        </button>
      </div>
    );
  }
  return <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{content}</p>;
}

interface ChatSidebarProps {
  messages: Message[];
  onSend: (content: string) => void;
  isLoading: boolean;
  hasFiles: boolean;
}

export default function ChatSidebar({ messages, onSend, isLoading, hasFiles }: ChatSidebarProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--bg-secondary)" }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-light)" }}>
          <Sparkles size={12} style={{ color: "#00d4ff" }} />
        </div>
        <span className="text-sm font-semibold font-mono tracking-wider neon-cyan">J.A.R.V.I.S</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ background: "rgba(0,212,255,0.08)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)" }}>
          CLAUDE 4.6
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--accent-light)", border: "1px solid rgba(0,212,255,0.2)" }}>
              <Sparkles size={20} style={{ color: "#00d4ff" }} />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1">Prêt à construire</h3>
            <p className="text-xs leading-relaxed max-w-[180px]" style={{ color: "var(--text-muted)" }}>
              Décris l&apos;application que tu veux créer et je génère le code complet
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in">
            {msg.role === "user" ? (
              <div className="flex items-start gap-2 justify-end">
                <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tr-sm text-sm text-white" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,80,160,0.25))", border: "1px solid rgba(0,212,255,0.3)" }}>
                  {msg.content}
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "var(--bg-tertiary)" }}>
                  <User size={11} style={{ color: "var(--text-muted)" }} />
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "var(--accent-light)" }}>
                  <Sparkles size={11} style={{ color: "#00d4ff" }} />
                </div>
                <div className="max-w-[85%] px-3 py-2.5 rounded-2xl rounded-tl-sm" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}>
                  <MessageContent content={msg.content} />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2 animate-fade-in">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "var(--accent-light)" }}>
              <Sparkles size={11} style={{ color: "#00d4ff" }} />
            </div>
            <div className="px-4 py-3.5 rounded-2xl rounded-tl-sm" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}>
              <div className="dot-pulse"><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      {hasFiles && showSuggestions && (
        <div className="px-3 pb-2 animate-fade-in border-t pt-2" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-col gap-1">
            {QUICK_PROMPTS.map((prompt) => (
              <button key={prompt} onClick={() => { setInput(prompt); setShowSuggestions(false); textareaRef.current?.focus(); }}
                className="text-left text-xs px-3 py-1.5 rounded-lg transition-all hover:text-white"
                style={{ color: "var(--text-secondary)", background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 flex-shrink-0 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="rounded-xl transition-all" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={hasFiles ? "Modifie, améliore, ajoute..." : "Décris ce que tu veux créer..."}
            rows={2}
            className="w-full bg-transparent text-sm resize-none outline-none leading-relaxed px-3 pt-3 pb-1"
            style={{ color: "var(--text-primary)", caretColor: "#00d4ff" }}
          />
          <div className="flex items-center justify-between px-3 pb-2">
            {hasFiles ? (
              <button onClick={() => setShowSuggestions(!showSuggestions)}
                className="flex items-center gap-1 text-[10px] transition-colors"
                style={{ color: showSuggestions ? "#00d4ff" : "var(--text-muted)" }}>
                <Lightbulb size={11} /> Idées
              </button>
            ) : <span />}
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90"
              style={{
                background: input.trim() && !isLoading ? "linear-gradient(135deg, #00d4ff, #ffb800)" : "var(--bg-hover)",
                color: input.trim() && !isLoading ? "white" : "var(--text-muted)",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
              }}>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
