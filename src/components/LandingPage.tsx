"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Sparkles, Zap, Code2, Globe, Layers, BarChart3, ShoppingCart, MessageSquare, Layout } from "lucide-react";
import { useRouter } from "next/navigation";

const SUGGESTIONS = [
  { icon: BarChart3, label: "Dashboard analytics", prompt: "Un dashboard analytics SaaS avec sidebar, stats KPI, graphiques de revenus et table d'utilisateurs récents" },
  { icon: ShoppingCart, label: "E-commerce store", prompt: "Une boutique e-commerce avec grille de produits, filtres, panier sidebar et page checkout" },
  { icon: MessageSquare, label: "Chat app", prompt: "Une application de chat en temps réel avec liste de conversations, bulles de messages et indicateur de frappe" },
  { icon: Layout, label: "Landing SaaS", prompt: "Une landing page SaaS avec hero animé, section features, pricing 3 plans et footer" },
  { icon: Layers, label: "Gestion de tâches", prompt: "Un kanban board de gestion de tâches avec colonnes drag & drop, labels et dates d'échéance" },
  { icon: Globe, label: "Portfolio créatif", prompt: "Un portfolio développeur créatif avec animations, projets en grille et formulaire de contact" },
];

const ROTATING_WORDS = ["dashboards", "landing pages", "apps SaaS", "e-commerce", "chat apps", "portfolios"];

interface LandingPageProps {
  onStart: (prompt: string) => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [input, setInput] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [fadeWord, setFadeWord] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeWord(false);
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
        setFadeWord(true);
      }, 300);
    }, 2500);
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
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] rounded-full bg-pink-600/5 blur-[100px]" />
      </div>

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-pink-500">
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-bold text-white text-[15px] tracking-tight">Lovable</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Se connecter
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-1.5 text-sm font-medium rounded-lg bg-white text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            S&apos;inscrire
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-8 text-xs font-medium bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
          <Sparkles size={11} />
          Alimenté par Claude Sonnet 4.6
        </div>

        {/* Heading */}
        <h1 className="text-center font-bold tracking-tight leading-[1.1] mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>
          <span className="text-white">Construis des </span>
          <span
            className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent transition-opacity duration-300"
            style={{ opacity: fadeWord ? 1 : 0 }}
          >
            {ROTATING_WORDS[wordIdx]}
          </span>
          <br />
          <span className="text-white">en quelques secondes</span>
        </h1>

        <p className="text-center text-zinc-400 mb-10 max-w-lg text-lg leading-relaxed">
          Décris ce que tu veux créer. L&apos;IA génère le code complet,<br className="hidden sm:block" />
          fonctionnel et prêt à déployer.
        </p>

        {/* Input */}
        <div className="w-full max-w-2xl">
          <div className="relative rounded-2xl p-px bg-gradient-to-br from-violet-500/50 via-pink-500/30 to-transparent">
            <div className="rounded-[15px] bg-zinc-900 border border-white/5 p-4">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Décris l'app que tu veux créer..."
                rows={3}
                className="w-full bg-transparent text-white text-base resize-none outline-none leading-relaxed placeholder:text-zinc-600"
                style={{ caretColor: "#8b5cf6" }}
                autoFocus
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <span className="text-xs text-zinc-600">
                  ↵ Entrée pour générer &nbsp;·&nbsp; Shift+↵ pour nouvelle ligne
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all active:scale-95"
                  style={{
                    background: input.trim()
                      ? "linear-gradient(135deg, #7c3aed, #db2777)"
                      : "rgba(255,255,255,0.05)",
                    color: input.trim() ? "white" : "#52525b",
                    cursor: input.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  Générer
                  <ArrowUp size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 mt-5 justify-center max-w-2xl">
          {SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
            <button
              key={label}
              onClick={() => {
                setInput(prompt);
                textareaRef.current?.focus();
                textareaRef.current && (textareaRef.current.style.height = "auto");
                textareaRef.current && (textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px");
              }}
              className="group flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/8 bg-zinc-900 text-zinc-400 hover:text-white hover:border-violet-500/40 hover:bg-zinc-800 transition-all"
            >
              <Icon size={11} className="group-hover:text-violet-400 transition-colors" />
              {label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-16 text-center">
          {[
            { value: "10k+", label: "Projets créés" },
            { value: "< 30s", label: "Génération moyenne" },
            { value: "98%", label: "Satisfaction" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">{value}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 px-6 flex items-center justify-between">
        <span className="text-xs text-zinc-600">© 2025 Lovable Clone · Propulsé par Anthropic Claude</span>
        <div className="flex items-center gap-4">
          <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors text-xs">GitHub</a>
          <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors text-xs">Twitter</a>
        </div>
      </footer>
    </div>
  );
}
