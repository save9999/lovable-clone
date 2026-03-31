"use client";

import { History, RotateCcw } from "lucide-react";

interface VersionEntry {
  files: unknown[];
  label: string;
  timestamp: Date;
}

interface VersionPanelProps {
  history: VersionEntry[];
  cursor: number;
  onRestore: (idx: number) => void;
}

export default function VersionPanel({ history, cursor, onRestore }: VersionPanelProps) {
  if (history.length === 0) {
    return (
      <div className="h-full flex flex-col" style={{ background: "var(--bg-primary)" }}>
        <div className="px-3 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Versions</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <History size={20} className="mx-auto mb-2" style={{ color: "var(--text-muted)" }} />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Aucune version</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--bg-primary)" }}>
      <div className="px-3 py-2.5 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Versions ({history.length})
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {[...history].reverse().map((v, reverseIdx) => {
          const idx = history.length - 1 - reverseIdx;
          const isActive = idx === cursor;
          return (
            <div
              key={idx}
              className="flex items-start gap-2 px-3 py-2.5 cursor-pointer transition-all"
              style={{
                background: isActive ? "var(--accent-light)" : "transparent",
                borderLeft: isActive ? "2px solid #7c3aed" : "2px solid transparent",
              }}
              onClick={() => onRestore(idx)}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: isActive ? "rgba(124,58,237,0.3)" : "var(--bg-tertiary)" }}>
                <RotateCcw size={11} style={{ color: isActive ? "#a78bfa" : "var(--text-muted)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs truncate" style={{ color: isActive ? "white" : "var(--text-secondary)" }}>
                  {v.label || `Version ${idx + 1}`}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {v.files.length} fichier{v.files.length > 1 ? "s" : ""} · {
                    new Date(v.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                  }
                </p>
              </div>
              {isActive && (
                <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>
                  actif
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
