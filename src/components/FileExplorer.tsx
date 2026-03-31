"use client";

import { FileNode } from "@/lib/types";
import { FileCode, FileText, File, FolderOpen, Folder } from "lucide-react";

interface FileExplorerProps {
  files: FileNode[];
  activeFile: string | null;
  onSelectFile: (path: string) => void;
}

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  const colors: Record<string, string> = {
    ts: "#3b82f6", tsx: "#3b82f6", js: "#eab308", jsx: "#eab308",
    css: "#ec4899", scss: "#ec4899", json: "#f59e0b",
    md: "#9ca3af", html: "#f97316", py: "#22c55e", sh: "#a78bfa",
  };
  const color = colors[ext || ""] || "#6b7280";
  if (["ts", "tsx", "js", "jsx"].includes(ext || ""))
    return <FileCode size={13} style={{ color }} />;
  return <File size={13} style={{ color }} />;
}

function groupByDirectory(files: FileNode[]) {
  const groups: Record<string, FileNode[]> = {};
  files.forEach((file) => {
    const parts = file.path.split("/");
    const dir = parts.length > 1 ? parts.slice(0, -1).join("/") : "";
    if (!groups[dir]) groups[dir] = [];
    groups[dir].push(file);
  });
  return groups;
}

export default function FileExplorer({ files, activeFile, onSelectFile }: FileExplorerProps) {
  const groups = groupByDirectory(files);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <div className="px-3 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Fichiers
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {files.length === 0 ? (
          <div className="px-3 py-6 text-center">
            <File size={20} className="mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Aucun fichier</p>
          </div>
        ) : (
          Object.entries(groups).map(([dir, dirFiles]) => (
            <div key={dir}>
              {dir && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 mt-1">
                  <Folder size={12} style={{ color: "#eab308" }} />
                  <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    {dir.split("/").pop()}
                  </span>
                </div>
              )}
              {dirFiles.map((file) => {
                const isActive = activeFile === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => onSelectFile(file.path)}
                    className="w-full flex items-center gap-2 py-1.5 text-xs transition-all text-left"
                    style={{
                      paddingLeft: dir ? "28px" : "12px",
                      paddingRight: "12px",
                      background: isActive ? "var(--accent-light)" : "transparent",
                      color: isActive ? "white" : "var(--text-secondary)",
                      borderLeft: isActive ? "2px solid #7c3aed" : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "var(--bg-hover)";
                        e.currentTarget.style.color = "white";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }
                    }}
                  >
                    {getFileIcon(file.name)}
                    <span className="truncate">{file.name}</span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
