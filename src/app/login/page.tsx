"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowUp } from "lucide-react";

const TYPEWRITER_PHRASES = [
  "Demande à JARVIS de créer un dashboard SaaS",
  "Demande à JARVIS de créer une boutique e-commerce",
  "Demande à JARVIS de créer un portfolio futuriste",
  "Demande à JARVIS de créer une app de chat",
  "Demande à JARVIS de créer un gestionnaire de tâches",
];

function TypewriterText() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = TYPEWRITER_PHRASES[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < phrase.length) {
      timeout = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 40);
    } else if (!deleting && displayed.length === phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 20);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % TYPEWRITER_PHRASES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, phraseIdx]);

  return (
    <span style={{ color: "#7ab8d4" }}>
      {displayed}
      <span className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse" style={{ background: "#00d4ff" }} />
    </span>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStep("password");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Erreur d'inscription");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 hud-grid" style={{ background: "#020811" }}>

      {/* ── LEFT: Form ── */}
      <div className="flex flex-col items-center justify-center px-8 py-12 relative">
        {/* Left glow */}
        <div className="absolute top-1/3 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }} />

        <div className="w-full max-w-sm relative z-10">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 mb-10">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full animate-arc-pulse" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.3), transparent)" }} />
              <div className="relative w-full h-full rounded-full flex items-center justify-center" style={{ background: "radial-gradient(circle, #00d4ff, #004080)", boxShadow: "0 0 15px rgba(0,212,255,0.5)" }}>
                <span className="text-white text-xs font-black">J</span>
              </div>
            </div>
            <span className="font-black text-sm tracking-widest font-mono neon-cyan">J.A.R.V.I.S</span>
          </a>

          <h1 className="text-2xl font-black font-mono mb-1" style={{ color: "#c8f0ff" }}>
            {mode === "login" ? "CONNEXION" : "CRÉER UN COMPTE"}
          </h1>
          <p className="text-xs font-mono mb-8" style={{ color: "rgba(0,212,255,0.4)" }}>
            {mode === "login" ? "SYSTÈME D'ACCÈS SÉCURISÉ" : "INITIALISATION COMPTE UTILISATEUR"}
          </p>

          {/* OAuth buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-mono font-medium transition-all"
              style={{ border: "1px solid rgba(0,212,255,0.2)", color: "#c8f0ff", background: "rgba(0,20,40,0.5)" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.5)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              CONTINUER AVEC GOOGLE
            </button>

            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-mono font-medium transition-all"
              style={{ border: "1px solid rgba(0,212,255,0.2)", color: "#c8f0ff", background: "rgba(0,20,40,0.5)" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.5)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              CONTINUER AVEC GITHUB
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(0,212,255,0.1)" }} />
            <span className="text-xs font-mono" style={{ color: "rgba(0,212,255,0.3)" }}>OU</span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,212,255,0.1)" }} />
          </div>

          {/* Email form */}
          {step === "email" ? (
            <form onSubmit={handleEmailContinue} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(0,212,255,0.6)" }}>PRÉNOM</label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Votre prénom"
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all font-mono"
                    style={{ background: "rgba(0,20,40,0.6)", border: "1px solid rgba(0,212,255,0.2)", color: "#c8f0ff" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(0,212,255,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,212,255,0.2)")}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(0,212,255,0.6)" }}>EMAIL</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com" required
                  className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all font-mono"
                  style={{ background: "rgba(0,20,40,0.6)", border: "1px solid rgba(0,212,255,0.2)", color: "#c8f0ff" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,212,255,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(0,212,255,0.2)")}
                />
              </div>
              <button
                type="submit"
                className="btn-arc-gold w-full py-2.5 rounded-lg text-sm font-mono"
              >
                CONTINUER →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 p-3 rounded-lg mb-1"
                style={{ background: "rgba(0,20,40,0.4)", border: "1px solid rgba(0,212,255,0.1)" }}>
                <span className="text-sm flex-1 truncate font-mono" style={{ color: "#7ab8d4" }}>{email}</span>
                <button type="button" onClick={() => setStep("email")} className="text-xs font-mono underline" style={{ color: "rgba(0,212,255,0.5)" }}>MODIFIER</button>
              </div>
              <div>
                <label className="block text-xs font-mono mb-1.5" style={{ color: "rgba(0,212,255,0.6)" }}>MOT DE PASSE</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required autoFocus
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all pr-11 font-mono"
                    style={{ background: "rgba(0,20,40,0.6)", border: "1px solid rgba(0,212,255,0.2)", color: "#c8f0ff" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(0,212,255,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,212,255,0.2)")}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "rgba(0,212,255,0.5)" }}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-xs px-3 py-2 rounded-lg font-mono" style={{ background: "rgba(255,56,96,0.08)", border: "1px solid rgba(255,56,96,0.2)", color: "#ff3860" }}>
                  ⚠ {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="btn-arc-gold w-full py-2.5 rounded-lg text-sm font-mono flex items-center justify-center gap-2 disabled:opacity-60">
                {loading && <Loader2 size={14} className="animate-spin" />}
                {mode === "login" ? "CONNEXION" : "CRÉER LE COMPTE"}
              </button>
            </form>
          )}

          {/* Switch mode */}
          <p className="text-center text-xs mt-5 font-mono" style={{ color: "rgba(0,212,255,0.35)" }}>
            {mode === "login" ? "Pas de compte ? " : "Déjà un compte ? "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setStep("email"); }}
              className="font-bold hover:underline"
              style={{ color: "#00d4ff" }}
            >
              {mode === "login" ? "CRÉER UN COMPTE" : "CONNEXION"}
            </button>
          </p>
        </div>
      </div>

      {/* ── RIGHT: JARVIS HUD Preview ── */}
      <div className="hidden lg:flex relative overflow-hidden" style={{ background: "#010608", borderLeft: "1px solid rgba(0,212,255,0.08)" }}>
        <div className="absolute inset-0 hud-grid opacity-50" />
        <div className="absolute inset-0 scanline" />

        {/* Glow */}
        <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }} />

        {/* Floating JARVIS HUD panel */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="w-full max-w-sm relative">
            {/* Corner brackets */}
            <div className="absolute -top-2 -left-2 w-6 h-6" style={{ borderTop: "2px solid #00d4ff", borderLeft: "2px solid #00d4ff" }} />
            <div className="absolute -top-2 -right-2 w-6 h-6" style={{ borderTop: "2px solid #00d4ff", borderRight: "2px solid #00d4ff" }} />
            <div className="absolute -bottom-2 -left-2 w-6 h-6" style={{ borderBottom: "2px solid #00d4ff", borderLeft: "2px solid #00d4ff" }} />
            <div className="absolute -bottom-2 -right-2 w-6 h-6" style={{ borderBottom: "2px solid #00d4ff", borderRight: "2px solid #00d4ff" }} />

            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,212,255,0.2)", background: "rgba(0,10,20,0.9)", backdropFilter: "blur(20px)" }}>
              {/* Header */}
              <div className="p-4" style={{ borderBottom: "1px solid rgba(0,212,255,0.1)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "radial-gradient(circle, #00d4ff, #004080)", boxShadow: "0 0 8px rgba(0,212,255,0.5)" }}>
                    <span className="text-white text-[9px] font-black">J</span>
                  </div>
                  <span className="text-xs font-mono font-bold neon-cyan">J.A.R.V.I.S</span>
                  <span className="ml-auto flex items-center gap-1 text-[10px] font-mono" style={{ color: "#00ff9d" }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: "#00ff9d", display: "inline-block" }} />
                    EN LIGNE
                  </span>
                </div>
                <p className="text-sm font-mono leading-relaxed">
                  <TypewriterText />
                </p>
              </div>

              {/* Fake prompt bar */}
              <div className="p-3">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                  style={{ border: "1px solid rgba(0,212,255,0.15)", background: "rgba(0,20,40,0.5)" }}>
                  <span className="text-xs font-mono animate-pulse-glow" style={{ color: "#00d4ff" }}>▶</span>
                  <span className="flex-1 text-xs font-mono" style={{ color: "rgba(0,212,255,0.3)" }}>Décris ton application...</span>
                  <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #00d4ff, #ffb800)" }}>
                    <ArrowUp size={11} className="text-black" />
                  </div>
                </div>
              </div>

              {/* Status lines */}
              <div className="px-4 pb-4 space-y-2">
                {["MODULES IA — ACTIFS", "GÉNÉRATION CODE — PRÊTE", "DÉPLOIEMENT — DISPONIBLE"].map((line, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-mono">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? "#00ff9d" : i === 1 ? "#00d4ff" : "#ffb800", boxShadow: `0 0 4px ${i === 0 ? "#00ff9d" : i === 1 ? "#00d4ff" : "#ffb800"}` }} />
                    <span style={{ color: "rgba(122,184,212,0.5)" }}>{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
