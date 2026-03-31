"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Sparkles, User, Bot } from "lucide-react";
import { Message } from "@/lib/types";

interface ChatSidebarProps {
  messages: Message[];
  onSend: (content: string) => void;
  isLoading: boolean;
  hasFiles: boolean;
}

export default function ChatSidebar({ messages, onSend, isLoading, hasFiles }: ChatSidebarProps) {
  const [input, setInput] = useState("");
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--bg-secondary)" }}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-light)" }}>
          <Sparkles size={12} style={{ color: "#a78bfa" }} />
        </div>
        <span className="text-sm font-semibold text-white">Assistant</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
          Sonnet 4.6
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in">
            {msg.role === "user" ? (
              <div className="flex items-start gap-2 justify-end">
                <div
                  className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tr-sm text-sm"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white" }}
                >
                  {msg.content}
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "var(--bg-hover)" }}>
                  <User size={12} style={{ color: "var(--text-secondary)" }} />
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "var(--accent-light)" }}>
                  <Sparkles size={12} style={{ color: "#a78bfa" }} />
                </div>
                <div
                  className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tl-sm text-xs leading-relaxed"
                  style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                >
                  {msg.content.length > 300
                    ? msg.content.substring(0, 300) + "\n\n[Code généré dans l'éditeur →]"
                    : msg.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2 animate-fade-in">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "var(--accent-light)" }}>
              <Sparkles size={12} style={{ color: "#a78bfa" }} />
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-tl-sm"
              style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
            >
              <div className="dot-pulse flex gap-1.5">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 flex-shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="rounded-xl p-2 transition-all"
          style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
          onFocus={() => {}}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={hasFiles ? "Modifie l'app..." : "Décris ce que tu veux créer..."}
            rows={2}
            className="w-full bg-transparent text-sm resize-none outline-none leading-relaxed"
            style={{ color: "var(--text-primary)", caretColor: "#7c3aed" }}
          />
          <div className="flex justify-end mt-1">
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: input.trim() && !isLoading ? "linear-gradient(135deg, #7c3aed, #db2777)" : "var(--bg-hover)",
                color: input.trim() && !isLoading ? "white" : "var(--text-muted)",
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
              }}
            >
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
