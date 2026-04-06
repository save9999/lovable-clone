"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, ChevronDown, Menu, X, BarChart3, ShoppingCart, MessageSquare, Layout, Layers, Globe, Camera, Briefcase, Music, Dumbbell, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

/* ── Navigation ── */
const NAV_ITEMS = ["Solutions", "Resources", "Enterprise", "Pricing", "Community", "Security"];

const TEMPLATES = [
  { icon: BarChart3,    label: "Analytics Dashboard",   color: "from-blue-500 to-indigo-600",    desc: "SaaS dashboard with KPIs and charts" },
  { icon: ShoppingCart, label: "E-commerce Store",      color: "from-emerald-500 to-teal-600",   desc: "Product grid with cart and checkout" },
  { icon: Camera,       label: "Photographer Portfolio", color: "from-rose-500 to-pink-600",     desc: "Creative portfolio with gallery" },
  { icon: MessageSquare,label: "Chat Application",      color: "from-violet-500 to-purple-600",  desc: "Real-time chat with conversations" },
  { icon: Briefcase,    label: "Job Board",             color: "from-amber-500 to-orange-600",   desc: "Job listings with filters and search" },
  { icon: Music,        label: "Music Player",          color: "from-cyan-500 to-blue-600",      desc: "Streaming interface with playlists" },
  { icon: Dumbbell,     label: "Fitness Tracker",       color: "from-red-500 to-rose-600",       desc: "Workout plans and progress tracking" },
  { icon: BookOpen,     label: "Learning Platform",     color: "from-teal-500 to-emerald-600",   desc: "Courses with video and quizzes" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Start with an idea",
    desc: "Describe your app in plain English — a quick prompt is all it takes to get started.",
    color: "bg-blue-50 border-blue-100",
  },
  {
    step: "02",
    title: "Watch it come to life",
    desc: "Lovable instantly generates a fully functional app with clean, production-ready code.",
    color: "bg-violet-50 border-violet-100",
  },
  {
    step: "03",
    title: "Refine and ship",
    desc: "Edit, add features, and deploy — your app goes live with one click.",
    color: "bg-emerald-50 border-emerald-100",
  },
];

const COMPANIES = ["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Industries", "Wayne Enterprises"];

const STATS = [
  { value: "1M+",   label: "projects built" },
  { value: "50k+",  label: "projects per day" },
  { value: "10M+",  label: "monthly visits" },
];

const FOOTER_LINKS = {
  Company:   ["About", "Blog", "Careers", "Press", "Contact"],
  Product:   ["Features", "Pricing", "Changelog", "Roadmap", "Status"],
  Resources: ["Docs", "Tutorials", "Templates", "Community", "GitHub"],
  Legal:     ["Privacy", "Terms", "Security", "Cookies"],
  Community: ["Discord", "Reddit", "X / Twitter", "YouTube", "LinkedIn"],
};

const SUGGESTIONS = [
  { icon: BarChart3,    label: "Analytics dashboard", prompt: "A SaaS analytics dashboard with sidebar, KPI stats, revenue charts and recent users table" },
  { icon: ShoppingCart, label: "E-commerce store",    prompt: "An e-commerce store with product grid, filters, sidebar cart and checkout page" },
  { icon: MessageSquare,label: "Chat app",            prompt: "A real-time chat app with conversation list, message bubbles and typing indicator" },
  { icon: Layout,       label: "SaaS landing",        prompt: "A SaaS landing page with animated hero, features section, 3-plan pricing and footer" },
  { icon: Layers,       label: "Task manager",        prompt: "A kanban task manager with drag & drop columns, labels and due dates" },
  { icon: Globe,        label: "Creative portfolio",  prompt: "A developer portfolio with animations, project grid and contact form" },
];

interface LandingPageProps {
  onStart: (prompt: string) => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [input, setInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    <div className="min-h-screen flex flex-col" style={{ background: "#fcfbf8", color: "#0a0a0a" }}>

      {/* ══ NAVBAR ══ */}
      <header
        className="sticky top-0 z-50 transition-all duration-200"
        style={{
          background: scrolled ? "rgba(252,251,248,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight">Lovable</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                className="flex items-center gap-0.5 px-3 py-1.5 text-sm rounded-lg transition-colors hover:bg-black/5"
                style={{ color: "#3d3d3d" }}
              >
                {item}
                {(item === "Solutions" || item === "Resources") && (
                  <ChevronDown size={12} className="ml-0.5 opacity-50" />
                )}
              </button>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-1.5 text-sm rounded-lg transition-colors hover:bg-black/5"
              style={{ color: "#3d3d3d" }}
            >
              Log in
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-1.5 text-sm font-medium rounded-lg transition-colors"
              style={{ background: "#0a0a0a", color: "#fcfbf8" }}
            >
              Get started
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden ml-auto p-2 rounded-lg hover:bg-black/5 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-black/6 bg-[#fcfbf8] px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button key={item} className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-black/5 transition-colors" style={{ color: "#3d3d3d" }}>
                {item}
              </button>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={() => router.push("/login")} className="flex-1 py-2 text-sm rounded-lg border border-black/10 transition-colors hover:bg-black/5" style={{ color: "#3d3d3d" }}>
                Log in
              </button>
              <button onClick={() => router.push("/login")} className="flex-1 py-2 text-sm font-medium rounded-lg transition-colors" style={{ background: "#0a0a0a", color: "#fcfbf8" }}>
                Get started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ══ HERO ══ */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-12">
        <h1 className="text-center font-semibold tracking-tight leading-[1.1] mb-5" style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", color: "#0a0a0a" }}>
          Build something <span style={{ fontStyle: "italic" }}>Lovable</span>
        </h1>

        <p className="text-center mb-8 max-w-md text-base leading-relaxed" style={{ color: "#6b7280" }}>
          Create apps and websites by chatting with AI
        </p>

        {/* Input box */}
        <div className="w-full max-w-2xl">
          <div
            className="rounded-2xl border bg-white shadow-sm overflow-hidden"
            style={{ borderColor: "rgba(0,0,0,0.1)" }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask Lovable to build..."
              rows={3}
              className="w-full bg-transparent text-sm resize-none outline-none leading-relaxed p-4"
              style={{ color: "#0a0a0a", caretColor: "#0a0a0a" }}
              autoFocus
            />
            <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <span className="text-xs" style={{ color: "#9ca3af" }}>
                ↵ to send · Shift+↵ for new line
              </span>
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: input.trim() ? "#0a0a0a" : "rgba(0,0,0,0.06)",
                  color: input.trim() ? "#fcfbf8" : "#9ca3af",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                }}
              >
                Build
                <ArrowUp size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center max-w-2xl">
          {SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
            <button
              key={label}
              onClick={() => {
                setInput(prompt);
                textareaRef.current?.focus();
                if (textareaRef.current) {
                  textareaRef.current.style.height = "auto";
                  textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
                }
              }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all hover:border-black/20 hover:bg-black/5"
              style={{ borderColor: "rgba(0,0,0,0.1)", color: "#6b7280", background: "white" }}
            >
              <Icon size={11} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ══ SOCIAL PROOF ══ */}
      <section className="py-10 border-y" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <p className="text-center text-xs font-medium mb-6 tracking-widest uppercase" style={{ color: "#9ca3af" }}>
          Teams from top companies build with Lovable
        </p>
        <div className="flex items-center justify-center gap-8 flex-wrap px-6">
          {COMPANIES.map((name) => (
            <span key={name} className="text-sm font-medium" style={{ color: "#c4c4bc" }}>
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight mb-3" style={{ color: "#0a0a0a" }}>
            AI App Builder
          </h2>
          <p className="text-base max-w-sm mx-auto" style={{ color: "#6b7280" }}>
            Go from idea to production in three steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOW_IT_WORKS.map(({ step, title, desc, color }) => (
            <div
              key={step}
              className={`rounded-2xl border p-6 ${color}`}
            >
              <span className="text-xs font-bold tracking-widest" style={{ color: "#9ca3af" }}>{step}</span>
              <h3 className="text-base font-semibold mt-3 mb-2" style={{ color: "#0a0a0a" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TEMPLATE GALLERY ══ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight" style={{ color: "#0a0a0a" }}>
            Discover templates
          </h2>
          <button className="text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-60" style={{ color: "#0a0a0a" }}>
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TEMPLATES.map(({ icon: Icon, label, color, desc }) => (
            <button
              key={label}
              onClick={() => onStart(`Build a ${label.toLowerCase()}: ${desc}`)}
              className="group text-left rounded-2xl border overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 bg-white"
              style={{ borderColor: "rgba(0,0,0,0.08)" }}
            >
              <div className={`h-28 bg-gradient-to-br ${color} flex items-center justify-center relative`}>
                <Icon size={28} className="text-white/80" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate" style={{ color: "#0a0a0a" }}>{label}</p>
                <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "#9ca3af" }}>{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="py-16 border-y" style={{ background: "#f5f4f0", borderColor: "rgba(0,0,0,0.06)" }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-center text-2xl font-semibold mb-10 tracking-tight" style={{ color: "#0a0a0a" }}>
            Lovable in numbers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="text-4xl font-bold tracking-tight" style={{ color: "#0a0a0a" }}>{value}</div>
                <div className="text-sm mt-1" style={{ color: "#6b7280" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight mb-4" style={{ color: "#0a0a0a" }}>
          Ready to build?
        </h2>
        <p className="text-base mb-8" style={{ color: "#6b7280" }}>
          Join over a million developers shipping apps with AI
        </p>
        <button
          onClick={() => router.push("/login")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: "#0a0a0a", color: "#fcfbf8" }}
        >
          Get started for free
        </button>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t" style={{ borderColor: "rgba(0,0,0,0.06)", background: "#f5f4f0" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Top row */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-20">
            {/* Brand */}
            <div className="flex-shrink-0 max-w-[200px]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">L</span>
                </div>
                <span className="font-semibold text-sm">Lovable</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#9ca3af" }}>
                Build apps and websites by chatting with AI
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 flex-1">
              {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                <div key={category}>
                  <p className="text-xs font-semibold mb-3 tracking-wide uppercase" style={{ color: "#0a0a0a" }}>{category}</p>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-xs transition-colors hover:text-gray-900" style={{ color: "#9ca3af" }}>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            <p className="text-xs" style={{ color: "#9ca3af" }}>
              © {new Date().getFullYear()} Lovable. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {["Discord", "X", "GitHub", "YouTube"].map((s) => (
                <a key={s} href="#" className="text-xs transition-colors hover:text-gray-900" style={{ color: "#9ca3af" }}>{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
