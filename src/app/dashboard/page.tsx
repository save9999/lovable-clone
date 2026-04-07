"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Sparkles, Plus, LogOut, Trash2, Code2, MessageSquare,
  Clock, Pencil, Search, GitBranch, Loader2
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description?: string;
  updatedAt: string;
  createdAt: string;
  vercelUrl?: string;
  githubRepo?: string;
  _count: { files: number; messages: number };
}

function timeAgo(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `il y a ${Math.floor(diff / 86400)}j`;
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => { setProjects(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const createProject = async () => {
    setCreatingNew(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Nouveau projet" }),
    });
    const project = await res.json();
    setCreatingNew(false);
    router.push(`/projects/${project.id}`);
  };

  const deleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Supprimer ce projet définitivement ?")) return;
    setDeletingId(id);
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  const renameProject = async (id: string) => {
    if (!editName.trim()) { setEditingId(null); return; }
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, name: editName } : p));
    setEditingId(null);
  };

  const avatar = (session?.user?.name || session?.user?.email || "U")[0].toUpperCase();

  return (
    <div className="min-h-screen hud-grid" style={{ background: "#020811", color: "#c8f0ff" }}>
      {/* Glow background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ background: "radial-gradient(circle, #00d4ff, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-4 blur-3xl"
          style={{ background: "radial-gradient(circle, #ffb800, transparent)" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md" style={{ borderBottom: "1px solid rgba(0,212,255,0.1)", background: "rgba(2,8,17,0.9)" }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-4">
            <div className="relative w-7 h-7">
              <div className="absolute inset-0 rounded-full animate-arc-pulse" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.3), transparent)" }} />
              <div className="relative w-full h-full rounded-full flex items-center justify-center" style={{ background: "radial-gradient(circle, #00d4ff, #004080)", boxShadow: "0 0 10px rgba(0,212,255,0.5)" }}>
                <Sparkles size={12} className="text-white" />
              </div>
            </div>
            <span className="font-black text-sm tracking-widest font-mono neon-cyan">J.A.R.V.I.S</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(0,212,255,0.4)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un projet..."
              className="w-full pl-8 pr-4 py-1.5 text-sm rounded-lg outline-none transition-colors font-mono"
              style={{
                background: "rgba(0,20,40,0.6)",
                border: "1px solid rgba(0,212,255,0.15)",
                color: "#c8f0ff",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.15)"}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={createProject}
              disabled={creatingNew}
              className="btn-arc-gold flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm"
            >
              {creatingNew ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              NOUVEAU
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg transition-colors group"
              style={{ border: "1px solid rgba(0,212,255,0.1)" }}
              title="Se déconnecter"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "radial-gradient(circle, rgba(0,212,255,0.3), rgba(0,80,160,0.3))", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}>
                {avatar}
              </div>
              <LogOut size={13} style={{ color: "rgba(0,212,255,0.4)" }} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-black font-mono tracking-wider" style={{ color: "#00d4ff", textShadow: "0 0 20px rgba(0,212,255,0.4)" }}>
              MES PROJETS
            </h1>
            <p className="text-xs font-mono mt-0.5" style={{ color: "rgba(0,212,255,0.4)" }}>
              {loading ? "CHARGEMENT..." : `${projects.length} PROJET${projects.length !== 1 ? "S" : ""} ACTIF${projects.length !== 1 ? "S" : ""}`}
            </p>
          </div>
        </div>

        {/* Skeleton loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,212,255,0.1)", background: "rgba(0,15,30,0.8)" }}>
                <div className="h-32 shimmer-dark" />
                <div className="p-4 space-y-2">
                  <div className="h-4 shimmer-dark rounded w-3/4" />
                  <div className="h-3 shimmer-dark rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full animate-arc-pulse" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.15), transparent)" }} />
              <div className="absolute inset-2 rounded-full border-2 animate-spin-slow" style={{ borderColor: "rgba(0,212,255,0.2)", borderTopColor: "#00d4ff" }} />
              <div className="absolute inset-5 rounded-full flex items-center justify-center" style={{ background: "rgba(0,20,40,0.8)" }}>
                <Sparkles size={16} style={{ color: "#00d4ff" }} />
              </div>
            </div>
            <h2 className="text-lg font-black font-mono neon-cyan mb-2">AUCUN PROJET</h2>
            <p className="text-sm mb-8 max-w-xs" style={{ color: "rgba(122,184,212,0.6)" }}>
              Décris ton application et JARVIS génère le code complet en quelques secondes
            </p>
            <button
              onClick={createProject}
              disabled={creatingNew}
              className="btn-arc-gold flex items-center gap-2 px-6 py-3 rounded-xl text-base"
            >
              {creatingNew ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              CRÉER UN PROJET
            </button>
          </div>
        )}

        {/* No search results */}
        {!loading && projects.length > 0 && filtered.length === 0 && (
          <div className="text-center py-20">
            <Search size={32} className="mx-auto mb-3" style={{ color: "rgba(0,212,255,0.2)" }} />
            <p style={{ color: "rgba(122,184,212,0.5)" }}>Aucun projet pour &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {/* Projects grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="group rounded-xl overflow-hidden cursor-pointer transition-all duration-200 relative"
                style={{
                  border: "1px solid rgba(0,212,255,0.12)",
                  background: "rgba(0,12,24,0.8)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,212,255,0.35)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,212,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,212,255,0.12)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-3 h-3" style={{ borderTop: "1px solid rgba(0,212,255,0.5)", borderLeft: "1px solid rgba(0,212,255,0.5)" }} />
                <div className="absolute top-0 right-0 w-3 h-3" style={{ borderTop: "1px solid rgba(0,212,255,0.5)", borderRight: "1px solid rgba(0,212,255,0.5)" }} />
                <div className="absolute bottom-0 left-0 w-3 h-3" style={{ borderBottom: "1px solid rgba(0,212,255,0.5)", borderLeft: "1px solid rgba(0,212,255,0.5)" }} />
                <div className="absolute bottom-0 right-0 w-3 h-3" style={{ borderBottom: "1px solid rgba(0,212,255,0.5)", borderRight: "1px solid rgba(0,212,255,0.5)" }} />

                {/* Thumbnail */}
                <div className="h-28 relative flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(0,30,60,0.8), rgba(0,10,25,0.9))" }}>
                  <div className="absolute inset-0 hud-grid opacity-50" />
                  <Code2 size={24} style={{ color: "rgba(0,212,255,0.2)" }} />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {project.vercelUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono" style={{ background: "rgba(0,255,157,0.1)", color: "#00ff9d", border: "1px solid rgba(0,255,157,0.3)" }}>
                        ● LIVE
                      </span>
                    )}
                    {project.githubRepo && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono" style={{ background: "rgba(0,212,255,0.1)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.2)" }}>
                        <GitBranch size={8} /> GIT
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingId(project.id); setEditName(project.name); }}
                      className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                      style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}
                    >
                      <Pencil size={11} style={{ color: "#00d4ff" }} />
                    </button>
                    <button
                      onClick={(e) => deleteProject(project.id, e)}
                      className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                      style={{ background: "rgba(255,56,96,0.1)", border: "1px solid rgba(255,56,96,0.2)" }}
                    >
                      {deletingId === project.id
                        ? <Loader2 size={11} style={{ color: "#ff3860" }} className="animate-spin" />
                        : <Trash2 size={11} style={{ color: "#ff3860" }} />
                      }
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3" style={{ borderTop: "1px solid rgba(0,212,255,0.08)" }}>
                  {editingId === project.id ? (
                    <input
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => renameProject(project.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") renameProject(project.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-sm font-mono bg-transparent outline-none pb-0.5 mb-2"
                      style={{ color: "#c8f0ff", borderBottom: "1px solid #00d4ff" }}
                    />
                  ) : (
                    <h3 className="text-sm font-medium truncate mb-1.5 font-mono" style={{ color: "#c8f0ff" }}>{project.name}</h3>
                  )}

                  <div className="flex items-center gap-3 text-[11px] font-mono" style={{ color: "rgba(0,212,255,0.4)" }}>
                    <span className="flex items-center gap-1">
                      <Code2 size={10} /> {project._count.files}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={10} /> {project._count.messages}
                    </span>
                    <span className="flex items-center gap-1 ml-auto">
                      <Clock size={10} /> {timeAgo(project.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new */}
            <button
              onClick={createProject}
              disabled={creatingNew}
              className="rounded-xl overflow-hidden transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-[200px] relative"
              style={{
                border: "1px dashed rgba(0,212,255,0.2)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)";
                e.currentTarget.style.background = "rgba(0,212,255,0.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}>
                {creatingNew ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              </div>
              <span className="text-xs font-mono" style={{ color: "rgba(0,212,255,0.5)" }}>NOUVEAU PROJET</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
