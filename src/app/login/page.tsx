"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowUp } from "lucide-react";

const TYPEWRITER_PHRASES = [
  "Ask Lovable to build a SaaS dashboard",
  "Ask Lovable to build an e-commerce store",
  "Ask Lovable to build a portfolio site",
  "Ask Lovable to build a chat application",
  "Ask Lovable to build a task manager",
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
    <span>
      {displayed}
      <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-middle" />
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
        setError(d.error || "Registration failed");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Incorrect email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: "#fcfbf8" }}>

      {/* ── LEFT: Form ── */}
      <div className="flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 mb-10">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-gray-900">Lovable</span>
          </a>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-8">
            {mode === "login" ? "Log in" : "Create account"}
          </h1>

          {/* OAuth buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-black/5"
              style={{ borderColor: "rgba(0,0,0,0.12)", color: "#0a0a0a", background: "white" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-black/5"
              style={{ borderColor: "rgba(0,0,0,0.12)", color: "#0a0a0a", background: "white" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
            <span className="text-xs" style={{ color: "#9ca3af" }}>Or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
          </div>

          {/* Email form */}
          {step === "email" ? (
            <form onSubmit={handleEmailContinue} className="space-y-3">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#374151" }}>Name</label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                    style={{ background: "white", border: "1px solid rgba(0,0,0,0.12)", color: "#0a0a0a" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.4)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#374151" }}>Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  style={{ background: "white", border: "1px solid rgba(0,0,0,0.12)", color: "#0a0a0a" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
                style={{ background: "#0a0a0a", color: "#fcfbf8" }}
              >
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-xl mb-1" style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
                <span className="text-sm flex-1 truncate" style={{ color: "#374151" }}>{email}</span>
                <button type="button" onClick={() => setStep("email")} className="text-xs underline" style={{ color: "#9ca3af" }}>Change</button>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#374151" }}>Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required autoFocus
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all pr-11"
                    style={{ background: "white", border: "1px solid rgba(0,0,0,0.12)", color: "#0a0a0a" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.4)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#9ca3af" }}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-xs px-3 py-2 rounded-lg" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: "#0a0a0a", color: "#fcfbf8" }}>
                {loading && <Loader2 size={14} className="animate-spin" />}
                {mode === "login" ? "Log in" : "Create account"}
              </button>
            </form>
          )}

          {/* Switch mode */}
          <p className="text-center text-xs mt-5" style={{ color: "#9ca3af" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setStep("email"); }}
              className="font-medium hover:underline"
              style={{ color: "#0a0a0a" }}
            >
              {mode === "login" ? "Create your account" : "Log in"}
            </button>
          </p>

          {mode === "login" && (
            <p className="text-center text-xs mt-2" style={{ color: "#9ca3af" }}>
              SSO available on{" "}
              <a href="/pricing" className="underline hover:opacity-70" style={{ color: "#9ca3af" }}>
                Business and Enterprise plans
              </a>
            </p>
          )}
        </div>
      </div>

      {/* ── RIGHT: Decorative panel ── */}
      <div className="hidden lg:flex relative overflow-hidden" style={{ background: "#f0ede5" }}>
        {/* Animated pulse blobs */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-pulse-glow"
            style={{ background: "radial-gradient(circle, rgba(180,160,120,0.3) 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full animate-pulse-glow"
            style={{ background: "radial-gradient(circle, rgba(140,120,90,0.2) 0%, transparent 70%)", animationDelay: "2s" }}
          />
        </div>

        {/* Floating chat box */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div
            className="w-full max-w-sm rounded-2xl shadow-xl overflow-hidden"
            style={{ background: "#fcfbf8", border: "1px solid rgba(0,0,0,0.08)" }}
          >
            <div className="p-4 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-md bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">L</span>
                </div>
                <span className="text-xs font-medium text-gray-900">Lovable</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                <TypewriterText />
              </p>
            </div>
            <div className="p-3">
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm"
                style={{ borderColor: "rgba(0,0,0,0.1)", background: "white" }}
              >
                <span className="flex-1 text-xs text-gray-400">Ask Lovable to build...</span>
                <div className="w-6 h-6 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <ArrowUp size={11} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
