"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, GitBranch as GithubIcon, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        setError(d.error || "Erreur lors de l'inscription");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email, password, redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
            <Sparkles size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">LovableAI</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {mode === "login" ? "Connecte-toi à ton compte" : "Crée ton compte gratuitement"}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Nom</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Ton prénom"
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                  style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
                  onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="toi@exemple.com" required
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
                onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all pr-11"
                  style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
                  onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)", opacity: loading ? 0.7 : 1 }}>
              {loading && <Loader2 size={15} className="animate-spin" />}
              {mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          {process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>ou</span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              </div>
              <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
                <GithubIcon size={16} />
                Continuer avec GitHub
              </button>
            </>
          )}

          <p className="text-center text-xs mt-5" style={{ color: "var(--text-muted)" }}>
            {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              style={{ color: "#a78bfa" }} className="font-medium hover:underline">
              {mode === "login" ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
