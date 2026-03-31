"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Sparkles, Zap, Code2, Globe, Layers } from "lucide-react";

const EXAMPLES = [
  "Un dashboard analytics avec graphiques en temps réel",
  "Une app de gestion de tâches avec drag & drop",
  "Une landing page SaaS avec pricing et animations",
  "Un clone de Twitter avec feed et notifications",
  "Un formulaire de réservation avec calendrier interactif",
  "Un portfolio développeur avec animations 3D",
];

const FEATURES = [
  { icon: Zap, label: "Génération instantanée", desc: "Code complet en quelques secondes" },
  { icon: Code2, label: "Stack moderne", desc: "Next.js · TypeScript · Tailwind" },
  { icon: Globe, label: "Prêt à déployer", desc: "Vercel, Railway, en 1 clic" },
  { icon: Layers, label: "Éditable", desc: "Modifie chaque fichier en live" },
];

interface LandingPageProps {
  onStart: (prompt: string) => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [input, setInput] = useState("");
  const [exampleIdx, setExampleIdx] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIdx((i) => (i + 1) % EXAMPLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    onStart(input.trim());
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
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-base tracking-tight">LovableAI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-md" style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            Claude Sonnet 4.6
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-medium" style={{ background: "var(--accent-light)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}>
          <Sparkles size={12} />
          Propulsé par Claude Sonnet 4.6
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-center tracking-tight mb-4 leading-tight">
          <span className="text-white">Crée n'importe quelle</span>
          <br />
          <span className="gradient-text">app web en secondes</span>
        </h1>

        <p className="text-center mb-10 max-w-md" style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: "1.6" }}>
          Décris ce que tu veux construire, l'IA génère le code complet,<br />
          fonctionnel et prêt à déployer.
        </p>

        {/* Input box */}
        <div className="w-full max-w-2xl">
          <div
            className="relative rounded-2xl p-1"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(219,39,119,0.4))" }}
          >
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder={`Ex : "${EXAMPLES[exampleIdx]}"`}
                rows={3}
                className="w-full bg-transparent text-white text-base resize-none outline-none leading-relaxed"
                style={{ color: "var(--text-primary)", caretColor: "#7c3aed" }}
                autoFocus
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Entrée pour générer · Shift+Entrée pour nouvelle ligne
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all"
                  style={{
                    background: input.trim() ? "linear-gradient(135deg, #7c3aed, #db2777)" : "var(--bg-hover)",
                    color: input.trim() ? "white" : "var(--text-muted)",
                    cursor: input.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  <span>Générer</span>
                  <ArrowUp size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick examples */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center max-w-2xl">
          {EXAMPLES.slice(0, 4).map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setInput(ex);
                textareaRef.current?.focus();
              }}
              className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{
                background: "var(--bg-tertiary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = "rgba(124,58,237,0.5)";
                (e.target as HTMLElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = "var(--border)";
                (e.target as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-16 w-full max-w-2xl">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center p-4 rounded-xl"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: "var(--accent-light)" }}>
                <Icon size={16} style={{ color: "#a78bfa" }} />
              </div>
              <span className="text-xs font-semibold text-white mb-1">{label}</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
