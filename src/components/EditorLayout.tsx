"use client";

import { useState, useCallback } from "react";
import { Message, FileNode } from "@/lib/types";
import ChatSidebar from "@/components/ChatSidebar";
import FileExplorer from "@/components/FileExplorer";
import CodeEditor from "@/components/CodeEditor";
import PreviewPanel from "@/components/PreviewPanel";
import FileTabs from "@/components/FileTabs";
import StatusBar from "@/components/StatusBar";
import VersionPanel from "@/components/VersionPanel";
import { useResizable } from "@/hooks/useResizable";
import { useVersionHistory } from "@/hooks/useVersionHistory";
import { downloadProjectZip } from "@/lib/downloadZip";
import {
  Sparkles, Plus, Eye, Code2, LayoutPanelLeft, Download,
  Rocket, RotateCcw, RotateCw, GitBranch as GithubIcon, ArrowLeft, History,
  Loader2, CheckCircle2, ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";

type RightView = "preview" | "code" | "split";
type SidebarTab = "files" | "versions";

interface EditorLayoutProps {
  projectId?: string;
  messages: Message[];
  files: FileNode[];
  activeFile: string | null;
  isLoading: boolean;
  projectName: string;
  vercelUrl?: string;
  githubRepo?: string;
  onSend: (content: string) => void;
  onSelectFile: (path: string) => void;
  onFileUpdate: (path: string, content: string) => void;
  onNewProject: () => void;
  onFilesChange?: (files: FileNode[]) => void;
}

export default function EditorLayout({
  projectId, messages, files, activeFile, isLoading, projectName,
  vercelUrl: initialVercelUrl, githubRepo: initialGithubRepo,
  onSend, onSelectFile, onFileUpdate, onNewProject, onFilesChange,
}: EditorLayoutProps) {
  const router = useRouter();
  const [rightView, setRightView] = useState<RightView>("split");
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("files");
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [deploying, setDeploying] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [deployUrl, setDeployUrl] = useState(initialVercelUrl || "");
  const [githubUrl, setGithubUrl] = useState(initialGithubRepo ? `https://github.com/${initialGithubRepo}` : "");
  const [deployMsg, setDeployMsg] = useState("");

  const { width: chatWidth, onMouseDown: onChatResize } = useResizable(320, 240, 520);
  const { width: explorerWidth, onMouseDown: onExplorerResize } = useResizable(180, 140, 320);

  const versionHistory = useVersionHistory(projectId);
  const activeFileData = files.find((f) => f.path === activeFile) || null;

  // Gérer les tabs ouvertes
  const handleSelectFile = useCallback((path: string) => {
    setOpenTabs((prev) => (prev.includes(path) ? prev : [...prev, path]));
    onSelectFile(path);
  }, [onSelectFile]);

  const handleCloseTab = useCallback((path: string) => {
    setOpenTabs((prev) => {
      const next = prev.filter((p) => p !== path);
      if (path === activeFile && next.length > 0) onSelectFile(next[next.length - 1]);
      return next;
    });
  }, [activeFile, onSelectFile]);

  // Restaurer une version
  const handleRestoreVersion = useCallback((idx: number) => {
    versionHistory.restoreVersion(idx);
    const version = versionHistory.history[idx];
    if (version && onFilesChange) {
      onFilesChange(version.files as FileNode[]);
      if (version.activeFile) onSelectFile(version.activeFile);
    }
  }, [versionHistory, onFilesChange, onSelectFile]);

  const handleDownload = () => downloadProjectZip(files, projectName);

  const handleDeploy = async () => {
    if (!projectId) return;
    setDeploying(true);
    setDeployMsg("");
    try {
      const res = await fetch(`/api/projects/${projectId}/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });
      const data = await res.json();
      if (data.ok) {
        setDeployUrl(data.url);
        setDeployMsg(`✓ Déployé sur ${data.url}`);
      } else {
        setDeployMsg(`✗ ${data.error}`);
      }
    } catch (err) {
      setDeployMsg("Erreur de déploiement");
    }
    setDeploying(false);
  };

  const handleGithubSync = async () => {
    if (!projectId) return;
    setSyncing(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });
      const data = await res.json();
      if (data.ok) setGithubUrl(data.repoUrl);
    } catch {}
    setSyncing(false);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Topbar */}
      <header className="h-11 flex items-center justify-between px-3 flex-shrink-0"
        style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>

        {/* Left */}
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => router.push("/dashboard")}
            className="p-1.5 rounded-md transition-colors flex-shrink-0"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
            <ArrowLeft size={14} />
          </button>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="text-sm font-medium text-white truncate max-w-48">{projectName || "Nouveau projet"}</span>

          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5 ml-2">
            <button onClick={() => handleRestoreVersion(versionHistory.cursor - 1)}
              disabled={!versionHistory.canUndo}
              className="p-1 rounded transition-all"
              style={{ color: versionHistory.canUndo ? "var(--text-secondary)" : "var(--text-muted)", opacity: versionHistory.canUndo ? 1 : 0.4 }}>
              <RotateCcw size={13} />
            </button>
            <button onClick={() => handleRestoreVersion(versionHistory.cursor + 1)}
              disabled={!versionHistory.canRedo}
              className="p-1 rounded transition-all"
              style={{ color: versionHistory.canRedo ? "var(--text-secondary)" : "var(--text-muted)", opacity: versionHistory.canRedo ? 1 : 0.4 }}>
              <RotateCw size={13} />
            </button>
          </div>
        </div>

        {/* Center — View switcher */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg"
          style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}>
          {(["preview", "split", "code"] as RightView[]).map((v) => {
            const icons = { preview: Eye, split: LayoutPanelLeft, code: Code2 };
            const labels = { preview: "Preview", split: "Split", code: "Code" };
            const Icon = icons[v];
            const active = rightView === v;
            return (
              <button key={v} onClick={() => setRightView(v)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all"
                style={{
                  background: active ? "var(--bg-hover)" : "transparent",
                  color: active ? "white" : "var(--text-muted)",
                  border: active ? "1px solid var(--border-light)" : "1px solid transparent",
                }}>
                <Icon size={11} />
                {labels[v]}
              </button>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          {deployMsg && (
            <span className="text-xs px-2 py-1 rounded-md"
              style={{ color: deployMsg.startsWith("✓") ? "#10b981" : "#f87171", background: "var(--bg-tertiary)" }}>
              {deployMsg}
            </span>
          )}

          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
              style={{ color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <CheckCircle2 size={12} />
              GitHub
            </a>
          )}

          {files.length > 0 && (
            <>
              <button onClick={handleGithubSync} disabled={syncing}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                {syncing ? <Loader2 size={12} className="animate-spin" /> : <GithubIcon size={12} />}
                Sync GitHub
              </button>
              <button onClick={handleDownload}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                <Download size={12} />
                .zip
              </button>
              <button onClick={handleDeploy} disabled={deploying}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all"
                style={{ background: deploying ? "#6d28d9" : "linear-gradient(135deg, #7c3aed, #db2777)" }}>
                {deploying ? <Loader2 size={12} className="animate-spin" /> : <Rocket size={12} />}
                Déployer
              </button>
            </>
          )}
          <button onClick={onNewProject}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-all"
            style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            <Plus size={12} />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat sidebar (redimensionnable) */}
        <div className="flex-shrink-0 flex overflow-hidden"
          style={{ width: chatWidth, borderRight: "1px solid var(--border)" }}>
          <ChatSidebar messages={messages} onSend={onSend} isLoading={isLoading} hasFiles={files.length > 0} />
        </div>

        {/* Drag handle chat */}
        <div
          onMouseDown={onChatResize}
          className="w-1 flex-shrink-0 cursor-col-resize transition-colors hover:bg-purple-500/30"
          style={{ background: "var(--border)" }}
        />

        {/* Right area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left panel (file explorer + version panel) */}
          {(rightView === "code" || rightView === "split") && (
            <>
              <div className="flex-shrink-0 flex flex-col overflow-hidden"
                style={{ width: explorerWidth, borderRight: "1px solid var(--border)" }}>

                {/* Tabs */}
                <div className="flex flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
                  {(["files", "versions"] as SidebarTab[]).map((tab) => {
                    const icons = { files: Code2, versions: History };
                    const Icon = icons[tab];
                    return (
                      <button key={tab} onClick={() => setSidebarTab(tab)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs transition-all"
                        style={{
                          color: sidebarTab === tab ? "white" : "var(--text-muted)",
                          borderBottom: sidebarTab === tab ? "1px solid #7c3aed" : "1px solid transparent",
                          marginBottom: "-1px",
                          background: "transparent",
                        }}>
                        <Icon size={11} />
                        {tab === "files" ? "Fichiers" : "Versions"}
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 overflow-hidden">
                  {sidebarTab === "files" ? (
                    <FileExplorer files={files} activeFile={activeFile} onSelectFile={handleSelectFile} />
                  ) : (
                    <VersionPanel history={versionHistory.history} cursor={versionHistory.cursor} onRestore={handleRestoreVersion} />
                  )}
                </div>
              </div>

              {/* Drag handle explorer */}
              <div
                onMouseDown={onExplorerResize}
                className="w-1 flex-shrink-0 cursor-col-resize transition-colors hover:bg-purple-500/30"
                style={{ background: "var(--border)" }}
              />
            </>
          )}

          {/* Main editor area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* File tabs */}
            <FileTabs
              openTabs={openTabs}
              activeFile={activeFile}
              files={files}
              onSelect={onSelectFile}
              onClose={handleCloseTab}
            />

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {rightView === "preview" && <PreviewPanel files={files} />}
              {rightView === "code" && <CodeEditor file={activeFileData} onUpdate={onFileUpdate} />}
              {rightView === "split" && (
                <>
                  <div className="flex-1 overflow-hidden" style={{ borderRight: "1px solid var(--border)" }}>
                    <CodeEditor file={activeFileData} onUpdate={onFileUpdate} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <PreviewPanel files={files} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <StatusBar
        activeFile={activeFileData}
        fileCount={files.length}
        isGenerating={isLoading}
        vercelUrl={deployUrl}
        canUndo={versionHistory.canUndo}
        canRedo={versionHistory.canRedo}
      />
    </div>
  );
}
