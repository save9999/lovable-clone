"use client";

import { useState, useEffect, useRef } from "react";

interface LandingPageProps {
  onStart: (prompt: string) => void;
}

const SUGGESTIONS = [
  "Une app de gestion de tâches moderne",
  "Un dashboard analytique avec graphiques",
  "Un site e-commerce avec panier",
  "Une app météo avec animations",
  "Un portfolio personnel futuriste",
  "Un chat en temps réel",
];

const BOOT_LINES = [
  "JARVIS — v4.1.0 INITIALISÉ",
  "Chargement modules IA… OK",
  "Connexion serveurs Claude… OK",
  "Interface holographique… ACTIVE",
  "Prêt à créer.",
];

export default function LandingPage({ onStart }: LandingPageProps) {
  const [input, setInput] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Boot sequence
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setBootLine(i);
      if (i >= BOOT_LINES.length) {
        clearInterval(timer);
        setTimeout(() => setBooted(true), 400);
      }
    }, 300);
    return () => clearInterval(timer);
  }, []);

  // Rotate suggestions
  useEffect(() => {
    const t = setInterval(() => {
      setActiveSuggestion((p) => (p + 1) % SUGGESTIONS.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = () => {
    const text = input.trim() || SUGGESTIONS[activeSuggestion];
    if (text) onStart(text);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen hud-grid relative overflow-hidden flex flex-col">
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl"
          style={{ background: "radial-gradient(circle, #ffb800 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full opacity-6 blur-3xl"
          style={{ background: "radial-gradient(circle, #00ff9d 0%, transparent 70%)" }}
        />
      </div>

      {/* Scanline */}
      <div className="scanline absolute inset-0 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: "rgba(0,212,255,0.1)" }}>
        <div className="flex items-center gap-3">
          {/* Arc Reactor Logo */}
          <div className="relative w-9 h-9">
            <div
              className="absolute inset-0 rounded-full animate-arc-pulse"
              style={{ background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)" }}
            />
            <div
              className="relative w-full h-full rounded-full border flex items-center justify-center"
              style={{ borderColor: "rgba(0,212,255,0.5)", background: "rgba(0,20,40,0.9)" }}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ background: "radial-gradient(circle, #00d4ff, #0080ff)", boxShadow: "0 0 10px #00d4ff" }}
              />
            </div>
          </div>
          <div>
            <span className="font-black text-lg tracking-wider neon-cyan" style={{ fontFamily: "monospace" }}>
              J.A.R.V.I.S
            </span>
            <span className="ml-2 text-xs" style={{ color: "rgba(0,212,255,0.5)", fontFamily: "monospace" }}>
              BUILD v4.1
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/login"
            className="btn-arc px-4 py-2 rounded text-xs"
          >
            CONNEXION
          </a>
        </div>
      </header>

      {/* Boot sequence overlay */}
      {!booted && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center" style={{ background: "#010608" }}>
          <div className="relative mb-8">
            <div
              className="w-24 h-24 rounded-full animate-arc-pulse"
              style={{ background: "radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%)" }}
            />
            <div
              className="absolute inset-2 rounded-full border-2 flex items-center justify-center animate-spin-slow"
              style={{ borderColor: "rgba(0,212,255,0.3)", borderTopColor: "#00d4ff" }}
            />
            <div
              className="absolute inset-4 rounded-full flex items-center justify-center"
              style={{ background: "radial-gradient(circle, #00d4ff, #0050a0)", boxShadow: "0 0 30px #00d4ff" }}
            />
          </div>
          <div className="font-mono text-sm space-y-2 w-72">
            {BOOT_LINES.slice(0, bootLine).map((line, i) => (
              <div key={i} className="flex items-center gap-2 animate-fade-in">
                <span style={{ color: "#00ff9d" }}>▶</span>
                <span style={{ color: "rgba(200,240,255,0.8)" }}>{line}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className={`relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 transition-opacity duration-500 ${booted ? "opacity-100" : "opacity-0"}`}>

        {/* Status badge */}
        <div className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full" style={{ border: "1px solid rgba(0,255,157,0.3)", background: "rgba(0,255,157,0.05)" }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: "#00ff9d", boxShadow: "0 0 6px #00ff9d" }} />
          <span className="text-xs font-mono" style={{ color: "#00ff9d" }}>SYSTÈME OPÉRATIONNEL — IA EN LIGNE</span>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4" style={{ fontFamily: "monospace" }}>
            <span className="neon-cyan">DÉCRIS</span>{" "}
            <span style={{ color: "rgba(200,240,255,0.3)" }}>TON</span>
            <br />
            <span style={{ color: "#ffb800", textShadow: "0 0 20px rgba(255,184,0,0.6), 0 0 60px rgba(255,184,0,0.3)" }}>
              APPLICATION
            </span>
          </h1>
          <p className="text-base md:text-lg" style={{ color: "rgba(122,184,212,0.7)" }}>
            JARVIS génère le code complet en quelques secondes.
          </p>
        </div>

        {/* Input area */}
        <div className="w-full max-w-2xl mt-8">
          <div
            className="hud-box rounded-xl p-1 relative"
            style={{ boxShadow: "0 0 40px rgba(0,212,255,0.08)" }}
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4" style={{ borderTop: "2px solid #00d4ff", borderLeft: "2px solid #00d4ff" }} />
            <div className="absolute top-0 right-0 w-4 h-4" style={{ borderTop: "2px solid #00d4ff", borderRight: "2px solid #00d4ff" }} />
            <div className="absolute bottom-0 left-0 w-4 h-4" style={{ borderBottom: "2px solid #00d4ff", borderLeft: "2px solid #00d4ff" }} />
            <div className="absolute bottom-0 right-0 w-4 h-4" style={{ borderBottom: "2px solid #00d4ff", borderRight: "2px solid #00d4ff" }} />

            <div className="rounded-lg p-4" style={{ background: "rgba(0,8,16,0.8)" }}>
              <div className="flex items-start gap-3">
                <span className="mt-1 text-xs font-mono animate-pulse-glow" style={{ color: "#00d4ff" }}>▶</span>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder={SUGGESTIONS[activeSuggestion]}
                  rows={3}
                  className="flex-1 resize-none bg-transparent outline-none text-base"
                  style={{
                    color: "#c8f0ff",
                    caretColor: "#00d4ff",
                    fontFamily: "monospace",
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,212,255,0.1)" }}>
                <span className="text-xs font-mono" style={{ color: "rgba(0,212,255,0.4)" }}>
                  ENTRÉE pour lancer · SHIFT+ENTRÉE pour nouvelle ligne
                </span>
                <button
                  onClick={handleSubmit}
                  className="btn-arc-gold px-5 py-2 rounded-lg flex items-center gap-2"
                >
                  <span>CRÉER</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="px-3 py-1.5 rounded text-xs font-mono transition-all"
                style={{
                  border: `1px solid ${i === activeSuggestion ? "rgba(0,212,255,0.4)" : "rgba(0,212,255,0.1)"}`,
                  background: i === activeSuggestion ? "rgba(0,212,255,0.08)" : "transparent",
                  color: i === activeSuggestion ? "#00d4ff" : "rgba(122,184,212,0.5)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats HUD */}
        <div className="flex gap-8 mt-16">
          {[
            { label: "APPS CRÉÉES", value: "12,847", color: "#00d4ff" },
            { label: "LIGNES DE CODE", value: "4.2M", color: "#ffb800" },
            { label: "TEMPS MOYEN", value: "8 SEC", color: "#00ff9d" },
          ].map((stat) => (
            <div key={stat.label} className="text-center hud-box px-6 py-4 rounded-lg">
              <div className="text-2xl font-black font-mono" style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}50` }}>
                {stat.value}
              </div>
              <div className="text-xs font-mono mt-1" style={{ color: "rgba(122,184,212,0.4)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-12 max-w-3xl w-full">
          {[
            { icon: "⚡", title: "INSTANTANÉ", desc: "Code généré en quelques secondes" },
            { icon: "👁", title: "PRÉVISUALISATION", desc: "Voir le résultat en direct" },
            { icon: "🚀", title: "DÉPLOIEMENT", desc: "Mise en ligne en 1 clic" },
          ].map((f) => (
            <div
              key={f.title}
              className="hud-box rounded-xl p-5 text-center"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="text-xs font-black font-mono mb-1" style={{ color: "#00d4ff" }}>{f.title}</div>
              <div className="text-xs" style={{ color: "rgba(122,184,212,0.5)" }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center border-t" style={{ borderColor: "rgba(0,212,255,0.06)" }}>
        <span className="text-xs font-mono" style={{ color: "rgba(0,212,255,0.2)" }}>
          J.A.R.V.I.S — JUST A RATHER VERY INTELLIGENT SYSTEM — BUILD v4.1.0
        </span>
      </footer>
    </div>
  );
}
