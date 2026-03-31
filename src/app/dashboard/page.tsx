"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Sparkles, Plus, LogOut, Trash2, ExternalLink,
  Code2, MessageSquare, Calendar, MoreHorizontal, Pencil
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

const GRADIENTS = [
  "linear-gradient(135deg, #7c3aed, #db2777)",
  "linear-gradient(135deg, #2563eb, #7c3aed)",
  "linear-gradient(135deg, #059669, #2563eb)",
  "linear-gradient(135deg, #d97706, #db2777)",
  "linear-gradient(135deg, #dc2626, #d97706)",
  "linear-gradient(135deg, #0891b2, #059669)",
];

function getGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash) + id.charCodeAt(i);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function timeAgo(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}j`;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => { setProjects(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

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

  const deleteProject = async (id: string) => {
    if (!confirm("Supprimer ce projet ?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const renameProject = async (id: string) => {
    if (!editName.trim()) return;
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, name: editName } : p));
    setEditingId(null);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Navbar */}
      <nav className="border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm"
        style={{ borderColor: "var(--border)", background: "rgba(10,10,15,0.9)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-bold text-white">LovableAI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            {session?.user?.name || session?.user?.email}
          </span>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
            <LogOut size={13} />
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Mes projets</h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {projects.length} projet{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={createProject} disabled={creatingNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
            <Plus size={16} />
            Nouveau projet
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map((i) => (
              <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: "var(--bg-secondary)" }} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "var(--bg-secondary)" }}>
              <Sparkles size={28} style={{ color: "var(--text-muted)" }} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Aucun projet</h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Crée ton premier projet et génère une app web complète
            </p>
            <button onClick={createProject}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
              style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
              Commencer maintenant
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div key={project.id}
                className="rounded-2xl overflow-hidden cursor-pointer group transition-all"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                onClick={() => router.push(`/projects/${project.id}`)}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}>

                {/* Thumbnail */}
                <div className="h-28 relative" style={{ background: getGradient(project.id) }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code2 size={32} className="text-white opacity-30" />
                  </div>
                  {project.vercelUrl && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>
                      ✓ Déployé
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    {editingId === project.id ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => renameProject(project.id)}
                        onKeyDown={(e) => { if (e.key === "Enter") renameProject(project.id); if (e.key === "Escape") setEditingId(null); }}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-semibold text-white bg-transparent border-b outline-none flex-1"
                        style={{ borderColor: "#7c3aed" }}
                      />
                    ) : (
                      <h3 className="text-sm font-semibold text-white truncate flex-1">{project.name}</h3>
                    )}

                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setEditingId(project.id); setEditName(project.name); }}
                        className="p-1 rounded hover:bg-white/10 transition-colors">
                        <Pencil size={12} style={{ color: "var(--text-muted)" }} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }}
                        className="p-1 rounded hover:bg-red-500/10 transition-colors">
                        <Trash2 size={12} className="text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <Code2 size={11} /> {project._count.files} fichiers
                    </span>
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      <MessageSquare size={11} /> {project._count.messages}
                    </span>
                    <span className="flex items-center gap-1 text-xs ml-auto" style={{ color: "var(--text-muted)" }}>
                      <Calendar size={11} /> {timeAgo(project.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
