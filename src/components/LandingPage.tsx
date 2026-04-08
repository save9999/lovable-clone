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
  "CREA — v4.1.0 INITIALISÉ",
  "Chargement modules IA… OK",
  "Connexion serveurs Claude… OK",
  "Interface holographique… ACTIVE",
  "Prêt à créer.",
];

const DEMO_CODE_LINES = [
  { text: "import { useState } from 'react';", delay: 0 },
  { text: "", delay: 200 },
  { text: "export default function App() {", delay: 400 },
  { text: "  const [tasks, setTasks] = useState([]);", delay: 600 },
  { text: "  const [input, setInput] = useState('');", delay: 800 },
  { text: "", delay: 1000 },
  { text: "  const addTask = () => {", delay: 1200 },
  { text: "    setTasks([...tasks, {", delay: 1400 },
  { text: "      id: Date.now(),", delay: 1600 },
  { text: "      text: input,", delay: 1800 },
  { text: "      done: false", delay: 2000 },
  { text: "    }]);", delay: 2200 },
  { text: "    setInput('');", delay: 2400 },
  { text: "  };", delay: 2600 },
];

const STEPS = [
  { num: "01", title: "DÉCRIS", desc: "Explique ton app en langage naturel. Pas besoin de coder.", icon: "⌨" },
  { num: "02", title: "GÉNÈRE", desc: "Claude analyse et génère le code complet en quelques secondes.", icon: "⚡" },
  { num: "03", title: "DÉPLOIE", desc: "Prévisualise, itère, puis déploie en 1 clic sur Vercel.", icon: "🚀" },
];

export default function LandingPage({ onStart }: LandingPageProps) {
  const [input, setInput] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [booted, setBooted] = useState(false);
  const [bootLine, setBootLine] = useState(0);
  const [visibleCodeLines, setVisibleCodeLines] = useState(0);
  const [revealedSections, setRevealedSections] = useState<Set<string>>(new Set());
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

  // Animated code demo
  useEffect(() => {
    if (!booted) return;
    const timer = setInterval(() => {
      setVisibleCodeLines((p) => {
        if (p >= DEMO_CODE_LINES.length) return 0;
        return p + 1;
      });
    }, 250);
    return () => clearInterval(timer);
  }, [booted]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section");
            if (id) setRevealedSections((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [booted]);

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

  const isRevealed = (id: string) => revealedSections.has(id);

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
              CREA
            </span>
            <span className="ml-2 text-xs" style={{ color: "rgba(0,212,255,0.5)", fontFamily: "monospace" }}>
              BUILD v4.1
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/login" className="btn-arc px-4 py-2 rounded text-xs">CONNEXION</a>
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
      <main className={`relative z-10 flex-1 flex flex-col items-center transition-opacity duration-500 ${booted ? "opacity-100" : "opacity-0"}`}>

        {/* ─── Hero Section ─────────────────────────────────────── */}
        <section className="w-full flex flex-col items-center px-6 pt-16 pb-12">
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
            <p className="text-base md:text-lg max-w-lg mx-auto" style={{ color: "rgba(122,184,212,0.7)" }}>
              CREA génère le code complet en quelques secondes. De l&apos;idée au déploiement.
            </p>
          </div>

          {/* Input area */}
          <div className="w-full max-w-2xl mt-8">
            <div className="hud-box rounded-xl p-1 relative" style={{ boxShadow: "0 0 40px rgba(0,212,255,0.08)" }}>
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
                    style={{ color: "#c8f0ff", caretColor: "#00d4ff", fontFamily: "monospace" }}
                  />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,212,255,0.1)" }}>
                  <span className="text-xs font-mono" style={{ color: "rgba(0,212,255,0.4)" }}>
                    ENTRÉE pour lancer · SHIFT+ENTRÉE pour nouvelle ligne
                  </span>
                  <button onClick={handleSubmit} className="btn-arc-gold px-5 py-2 rounded-lg flex items-center gap-2">
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
                  className="px-3 py-1.5 rounded text-xs font-mono transition-all duration-300"
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
        </section>

        {/* ─── Live Code Preview ────────────────────────────────── */}
        <section
          data-section="code-preview"
          className="w-full max-w-4xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-6 items-stretch"
          style={{
            opacity: isRevealed("code-preview") ? 1 : 0,
            transform: isRevealed("code-preview") ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Code panel */}
          <div className="flex-1 hud-box rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(0,212,255,0.1)" }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff3860" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffb800" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#00ff9d" }} />
              </div>
              <span className="text-[10px] font-mono ml-2" style={{ color: "rgba(0,212,255,0.4)" }}>App.tsx</span>
            </div>
            <div className="p-4 font-mono text-sm leading-6 min-h-[260px]" style={{ background: "rgba(0,4,10,0.9)" }}>
              {DEMO_CODE_LINES.slice(0, visibleCodeLines).map((line, i) => (
                <div key={i} className="animate-fade-in flex">
                  <span className="w-6 text-right mr-4 select-none" style={{ color: "rgba(0,212,255,0.2)", fontSize: "11px" }}>{i + 1}</span>
                  <span style={{
                    color: line.text.includes("import") || line.text.includes("export") || line.text.includes("const") || line.text.includes("function")
                      ? "#00d4ff"
                      : line.text.includes("'") || line.text.includes('"')
                      ? "#00ff9d"
                      : line.text.includes("//")
                      ? "rgba(122,184,212,0.4)"
                      : "#c8f0ff",
                  }}>
                    {line.text || "\u00A0"}
                  </span>
                </div>
              ))}
              {visibleCodeLines < DEMO_CODE_LINES.length && (
                <span className="inline-block w-2 h-4 ml-10 animate-pulse-glow" style={{ background: "#00d4ff" }} />
              )}
            </div>
          </div>

          {/* Preview panel */}
          <div className="flex-1 hud-box rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid rgba(0,212,255,0.1)" }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff3860" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ffb800" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#00ff9d" }} />
              </div>
              <span className="text-[10px] font-mono ml-2" style={{ color: "rgba(0,212,255,0.4)" }}>Preview</span>
            </div>
            <div className="p-6 min-h-[260px] flex flex-col justify-center" style={{ background: "rgba(0,4,10,0.5)" }}>
              {/* Simulated app preview */}
              <div className="rounded-lg p-4" style={{ background: "rgba(0,20,40,0.8)", border: "1px solid rgba(0,212,255,0.15)" }}>
                <div className="text-sm font-mono mb-3" style={{ color: "#00d4ff" }}>Mes Tâches</div>
                <div className="space-y-2">
                  {["Réviser les maths", "Terminer le projet React", "Appeler le client"].map((task, i) => (
                    <div
                      key={task}
                      className="flex items-center gap-3 p-2 rounded"
                      style={{
                        background: "rgba(0,212,255,0.05)",
                        border: "1px solid rgba(0,212,255,0.1)",
                        opacity: visibleCodeLines > i * 3 + 4 ? 1 : 0.3,
                        transition: "opacity 0.5s ease",
                      }}
                    >
                      <div className="w-4 h-4 rounded border" style={{
                        borderColor: i === 0 ? "#00ff9d" : "rgba(0,212,255,0.3)",
                        background: i === 0 ? "rgba(0,255,157,0.2)" : "transparent",
                      }} />
                      <span className="text-xs font-mono" style={{
                        color: i === 0 ? "rgba(200,240,255,0.4)" : "#c8f0ff",
                        textDecoration: i === 0 ? "line-through" : "none",
                      }}>{task}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 h-7 rounded" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }} />
                  <div className="h-7 px-3 rounded flex items-center justify-center text-[10px] font-mono" style={{ background: "rgba(255,184,0,0.15)", border: "1px solid rgba(255,184,0,0.3)", color: "#ffb800" }}>+</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats HUD ───────────────────────────────────────── */}
        <section className="flex flex-wrap gap-6 md:gap-8 justify-center px-6 py-8">
          {[
            { label: "APPS CRÉÉES", value: "12,847", color: "#00d4ff" },
            { label: "LIGNES DE CODE", value: "4.2M", color: "#ffb800" },
            { label: "TEMPS MOYEN", value: "8 SEC", color: "#00ff9d" },
          ].map((stat) => (
            <div key={stat.label} className="text-center hud-box px-6 py-4 rounded-lg">
              <div className="text-2xl font-black font-mono" style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}50` }}>
                {stat.value}
              </div>
              <div className="text-[10px] font-mono mt-1" style={{ color: "rgba(122,184,212,0.4)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* ─── How it works ────────────────────────────────────── */}
        <section
          data-section="steps"
          className="w-full max-w-4xl mx-auto px-6 py-16"
          style={{
            opacity: isRevealed("steps") ? 1 : 0,
            transform: isRevealed("steps") ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2 className="text-center text-lg font-black font-mono tracking-widest mb-12" style={{ color: "#00d4ff", textShadow: "0 0 15px rgba(0,212,255,0.4)" }}>
            COMMENT ÇA MARCHE
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="hud-box rounded-xl p-6 text-center relative group"
                style={{
                  transitionDelay: `${i * 150}ms`,
                  opacity: isRevealed("steps") ? 1 : 0,
                  transform: isRevealed("steps") ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="text-[10px] font-mono mb-1" style={{ color: "rgba(255,184,0,0.6)" }}>{step.num}</div>
                <div className="text-sm font-black font-mono mb-2 neon-cyan">{step.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: "rgba(122,184,212,0.6)" }}>{step.desc}</div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-lg" style={{ color: "rgba(0,212,255,0.2)" }}>→</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── Features ────────────────────────────────────────── */}
        <section
          data-section="features"
          className="w-full max-w-4xl mx-auto px-6 py-12"
          style={{
            opacity: isRevealed("features") ? 1 : 0,
            transform: isRevealed("features") ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "⚡",
                title: "INSTANTANÉ",
                desc: "Code complet généré en quelques secondes par Claude AI. React, TypeScript, Tailwind — prêt à l'emploi.",
                color: "#00d4ff",
              },
              {
                icon: "👁",
                title: "PRÉVISUALISATION",
                desc: "Visualise le résultat en direct. Itère en temps réel avec l'IA. Modifie, améliore, recommence.",
                color: "#ffb800",
              },
              {
                icon: "🚀",
                title: "DÉPLOIEMENT",
                desc: "Deploy Vercel en 1 clic. Sync GitHub automatique. Télécharge en .zip. Ton projet, ta propriété.",
                color: "#00ff9d",
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="hud-box rounded-xl p-6 text-center hover:scale-[1.02] transition-transform duration-300"
                style={{
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="text-xs font-black font-mono mb-2" style={{ color: f.color, textShadow: `0 0 10px ${f.color}40` }}>
                  {f.title}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: "rgba(122,184,212,0.5)" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─────────────────────────────────────────────── */}
        <section className="w-full max-w-2xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-black font-mono tracking-tight mb-4" style={{ fontFamily: "monospace" }}>
            <span style={{ color: "rgba(200,240,255,0.8)" }}>PRÊT À</span>{" "}
            <span style={{ color: "#ffb800", textShadow: "0 0 15px rgba(255,184,0,0.5)" }}>CRÉER</span>
            <span style={{ color: "rgba(200,240,255,0.8)" }}> ?</span>
          </h2>
          <p className="text-sm mb-8" style={{ color: "rgba(122,184,212,0.5)" }}>
            Gratuit. Sans carte bancaire. Sans limite de créativité.
          </p>
          <button onClick={handleSubmit} className="btn-arc-gold px-8 py-3.5 rounded-xl text-base flex items-center gap-3 mx-auto">
            <span>COMMENCER MAINTENANT</span>
            <span>→</span>
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center border-t" style={{ borderColor: "rgba(0,212,255,0.06)" }}>
        <span className="text-xs font-mono" style={{ color: "rgba(0,212,255,0.2)" }}>
          CREA — JUST A RATHER VERY INTELLIGENT SYSTEM — BUILD v4.1.0
        </span>
      </footer>
    </div>
  );
}
