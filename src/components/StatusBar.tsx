"use client";

import { FileNode } from "@/lib/types";
import { GitBranch, Zap, CheckCircle2, ExternalLink } from "lucide-react";

interface StatusBarProps {
  activeFile: FileNode | null;
  fileCount: number;
  isGenerating: boolean;
  vercelUrl?: string;
  canUndo: boolean;
  canRedo: boolean;
}

export default function StatusBar({ activeFile, fileCount, isGenerating, vercelUrl, canUndo, canRedo }: StatusBarProps) {
  return (
    <div
      className="h-6 flex items-center justify-between px-4 flex-shrink-0 text-xs select-none"
      style={{ background: "#0a0a10", borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <GitBranch size={11} />
          <span>main</span>
        </div>
        {isGenerating && (
          <div className="flex items-center gap-1.5" style={{ color: "#a78bfa" }}>
            <Zap size={11} className="animate-pulse" />
            <span>Génération en cours...</span>
          </div>
        )}
        {!isGenerating && fileCount > 0 && (
          <div className="flex items-center gap-1.5" style={{ color: "#10b981" }}>
            <CheckCircle2 size={11} />
            <span>{fileCount} fichier{fileCount > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {activeFile && (
          <>
            <span>{activeFile.language}</span>
            <span>UTF-8</span>
            <span style={{ color: "#a78bfa" }}>{activeFile.name}</span>
          </>
        )}
        {vercelUrl && (
          <a href={vercelUrl} target="_blank" rel="noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
            style={{ color: "#10b981" }}>
            <ExternalLink size={10} />
            {vercelUrl.replace("https://", "")}
          </a>
        )}
        <span>LovableAI</span>
      </div>
    </div>
  );
}
