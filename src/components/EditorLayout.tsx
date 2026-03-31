"use client";

import { useState } from "react";
import { Message, FileNode } from "@/lib/types";
import ChatSidebar from "@/components/ChatSidebar";
import FileExplorer from "@/components/FileExplorer";
import CodeEditor from "@/components/CodeEditor";
import PreviewPanel from "@/components/PreviewPanel";
import {
  Sparkles, Plus, Eye, Code2, LayoutPanelLeft,
  Download, ChevronLeft, GitBranch, Rocket
} from "lucide-react";

type RightView = "preview" | "code" | "split";

interface EditorLayoutProps {
  messages: Message[];
  files: FileNode[];
  activeFile: string | null;
  isLoading: boolean;
  projectName: string;
  onSend: (content: string) => void;
  onSelectFile: (path: string) => void;
  onFileUpdate: (path: string, content: string) => void;
  onNewProject: () => void;
}

export default function EditorLayout({
  messages, files, activeFile, isLoading, projectName,
  onSend, onSelectFile, onFileUpdate, onNewProject,
}: EditorLayoutProps) {
  const [rightView, setRightView] = useState<RightView>("split");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeFileData = files.find((f) => f.path === activeFile) || null;

  const handleDownload = () => {
    const content = files.map((f) => `// === ${f.path} ===\n${f.content}`).join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName || "project"}-code.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Top navbar */}
      <header
        className="h-12 flex items-center justify-between px-4 flex-shrink-0"
        style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}
      >
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onNewProject}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
              <Sparkles size={13} className="text-white" />
            </div>
          </button>

          <div className="h-4 w-px flex-shrink-0" style={{ background: "var(--border-light)" }} />

          <div className="flex items-center gap-1.5 min-w-0">
            <GitBranch size={13} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
            <span className="text-sm font-medium truncate" style={{ color: "var(--text-secondary)" }}>
              {projectName || "Nouveau projet"}
            </span>
          </div>
        </div>

        {/* Center — view switcher */}
        <div
          className="flex items-center gap-0.5 p-0.5 rounded-lg"
          style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)" }}
        >
          {(["preview", "split", "code"] as RightView[]).map((v) => {
            const icons = { preview: Eye, split: LayoutPanelLeft, code: Code2 };
            const labels = { preview: "Preview", split: "Split", code: "Code" };
            const Icon = icons[v];
            const active = rightView === v;
            return (
              <button
                key={v}
                onClick={() => setRightView(v)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all"
                style={{
                  background: active ? "var(--bg-hover)" : "transparent",
                  color: active ? "white" : "var(--text-muted)",
                  border: active ? "1px solid var(--border-light)" : "1px solid transparent",
                }}
              >
                <Icon size={12} />
                {labels[v]}
              </button>
            );
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {files.length > 0 && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <Download size={12} />
              Exporter
            </button>
          )}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-white"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
          >
            <Rocket size={12} />
            Déployer
          </button>
          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            <Plus size={12} />
            Nouveau
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat sidebar */}
        <div
          className="flex-shrink-0 transition-all duration-200 overflow-hidden"
          style={{ width: sidebarOpen ? "320px" : "0px", borderRight: "1px solid var(--border)" }}
        >
          <ChatSidebar
            messages={messages}
            onSend={onSend}
            isLoading={isLoading}
            hasFiles={files.length > 0}
          />
        </div>

        {/* Toggle sidebar */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-4 h-8 flex items-center justify-center rounded-r transition-all"
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--border)",
            borderLeft: "none",
            color: "var(--text-muted)",
            left: sidebarOpen ? "320px" : "0px",
          }}
        >
          <ChevronLeft size={12} style={{ transform: sidebarOpen ? "" : "rotate(180deg)" }} />
        </button>

        {/* Right area */}
        <div className="flex-1 flex overflow-hidden">
          {/* File explorer (always shown in code/split view) */}
          {(rightView === "code" || rightView === "split") && (
            <div
              className="w-48 flex-shrink-0"
              style={{ borderRight: "1px solid var(--border)" }}
            >
              <FileExplorer
                files={files}
                activeFile={activeFile}
                onSelectFile={onSelectFile}
              />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 flex overflow-hidden">
            {rightView === "preview" && (
              <PreviewPanel files={files} />
            )}
            {rightView === "code" && (
              <CodeEditor file={activeFileData} onUpdate={onFileUpdate} />
            )}
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
  );
}
