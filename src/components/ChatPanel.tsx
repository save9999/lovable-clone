"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/types";

interface ChatPanelProps {
  messages: Message[];
  onSend: (content: string) => void;
  isLoading: boolean;
  hasProject: boolean;
}

export default function ChatPanel({
  messages,
  onSend,
  isLoading,
  hasProject,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  return (
    <div className="flex flex-col h-full bg-[#111] border-r border-[#222]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#222]">
        <Sparkles size={18} className="text-purple-400" />
        <span className="font-semibold text-sm text-white">LovableAI</span>
        <span className="text-xs text-gray-500 ml-auto">Claude Sonnet 4.6</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Que veux-tu créer ?</h2>
              <p className="text-gray-500 text-sm mt-1 max-w-xs">
                Décris ton application et je génère le code complet
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
              {[
                "Un dashboard analytics avec graphiques",
                "Une app todo avec drag & drop",
                "Un formulaire de contact avec validation",
                "Une landing page SaaS moderne",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="text-left text-xs bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] rounded-lg px-3 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                msg.role === "user"
                  ? "bg-purple-600 text-white rounded-br-sm"
                  : "bg-[#1a1a1a] text-gray-200 rounded-bl-sm border border-[#2a2a2a]"
              )}
            >
              {msg.role === "assistant" ? (
                <div className="whitespace-pre-wrap leading-relaxed text-xs">
                  {msg.content.length > 500
                    ? msg.content.substring(0, 500) + "\n\n[... code généré dans l'éditeur ...]"
                    : msg.content}
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Loader2 size={14} className="animate-spin text-purple-400" />
                <span>Génération en cours...</span>
              </div>
              <div className="flex gap-1 mt-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full dot-1" />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full dot-2" />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full dot-3" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-[#222]">
        <div className="flex items-end gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-2 focus-within:border-purple-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={
              hasProject
                ? "Décris une modification..."
                : "Décris l'app que tu veux créer..."
            }
            rows={1}
            className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 resize-none outline-none py-1 px-1 max-h-[200px]"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-2 rounded-lg transition-all",
              input.trim() && !isLoading
                ? "bg-purple-600 hover:bg-purple-500 text-white"
                : "bg-[#2a2a2a] text-gray-600 cursor-not-allowed"
            )}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">
          Entrée pour envoyer · Shift+Entrée pour nouvelle ligne
        </p>
      </div>
    </div>
  );
}
