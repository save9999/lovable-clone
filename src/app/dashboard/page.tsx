"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Sparkles, Plus, LogOut, Trash2, Code2, MessageSquare,
  Clock, Pencil, Search, ExternalLink, GitBranch, Loader2
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
  "from-violet-600 to-pink-600",
  "from-blue-600 to-violet-600",
  "from-emerald-600 to-blue-600",
  "from-orange-600 to-pink-600",
  "from-red-600 to-orange-600",
  "from-cyan-600 to-emerald-600",
  "from-indigo-600 to-cyan-600",
  "from-pink-600 to-rose-600",
];

function getGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash) + id.charCodeAt(i);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
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
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-violet-500 to-pink-500 flex-shrink-0">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-bold text-[15px]">Lovable</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-8 pr-4 py-1.5 text-sm rounded-lg bg-zinc-900 border border-white/8 text-white placeholder:text-zinc-600 outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* New project */}
            <button
              onClick={createProject}
              disabled={creatingNew}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:opacity-60"
            >
              {creatingNew ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              Nouveau
            </button>

            {/* User menu */}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg hover:bg-zinc-800 transition-colors group"
              title="Se déconnecter"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                {avatar}
              </div>
              <span className="text-sm text-zinc-400 group-hover:text-white transition-colors hidden sm:block">
                {session?.user?.name || session?.user?.email?.split("@")[0]}
              </span>
              <LogOut size={13} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Mes projets</h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              {loading ? "Chargement..." : `${projects.length} projet${projects.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {/* Skeleton loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-white/5 bg-zinc-900 overflow-hidden animate-pulse">
                <div className="h-32 bg-zinc-800" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-white/10">
              <Sparkles size={28} className="text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Aucun projet</h2>
            <p className="text-sm text-zinc-500 mb-6 max-w-xs">
              Crée ton premier projet et génère une app web complète en quelques secondes
            </p>
            <button
              onClick={createProject}
              disabled={creatingNew}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors"
            >
              {creatingNew ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Créer un projet
            </button>
          </div>
        )}

        {/* No search results */}
        {!loading && projects.length > 0 && filtered.length === 0 && (
          <div className="text-center py-20">
            <Search size={32} className="mx-auto text-zinc-700 mb-3" />
            <p className="text-zinc-500">Aucun projet trouvé pour &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {/* Projects grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="group rounded-xl border border-white/8 bg-zinc-900 overflow-hidden cursor-pointer hover:border-violet-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-200"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                {/* Thumbnail */}
                <div className={`h-32 relative bg-gradient-to-br ${getGradient(project.id)}`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code2 size={28} className="text-white/30" />
                  </div>
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {project.vercelUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30">
                        ✓ Live
                      </span>
                    )}
                    {project.githubRepo && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-white/70 ring-1 ring-white/20">
                        <GitBranch size={8} /> Git
                      </span>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingId(project.id); setEditName(project.name); }}
                      className="w-6 h-6 rounded-md bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
                    >
                      <Pencil size={11} className="text-white" />
                    </button>
                    <button
                      onClick={(e) => deleteProject(project.id, e)}
                      className="w-6 h-6 rounded-md bg-black/40 hover:bg-red-500/60 flex items-center justify-center transition-colors"
                    >
                      {deletingId === project.id
                        ? <Loader2 size={11} className="text-white animate-spin" />
                        : <Trash2 size={11} className="text-white" />
                      }
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
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
                      className="w-full text-sm font-medium text-white bg-transparent border-b border-violet-500 outline-none pb-0.5 mb-2"
                    />
                  ) : (
                    <h3 className="text-sm font-medium text-white truncate mb-1.5">{project.name}</h3>
                  )}

                  <div className="flex items-center gap-3 text-[11px] text-zinc-600">
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
          </div>
        )}
      </main>
    </div>
  );
}
