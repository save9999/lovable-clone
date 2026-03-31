"use client";

import { useRef } from "react";
import { FileNode } from "@/lib/types";
import { X } from "lucide-react";

interface FileTabsProps {
  openTabs: string[];
  activeFile: string | null;
  files: FileNode[];
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
}

function getTabColor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const colors: Record<string, string> = {
    ts: "#3b82f6", tsx: "#3b82f6", js: "#eab308", jsx: "#eab308",
    css: "#ec4899", json: "#f59e0b", md: "#9ca3af", html: "#f97316",
  };
  return colors[ext || ""] || "#6b7280";
}

export default function FileTabs({ openTabs, activeFile, files, onSelect, onClose }: FileTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  if (openTabs.length === 0) return null;

  return (
    <div
      ref={scrollRef}
      onWheel={handleWheel}
      className="flex items-end overflow-x-auto flex-shrink-0"
      style={{
        background: "var(--bg-primary)",
        borderBottom: "1px solid var(--border)",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {openTabs.map((path) => {
        const file = files.find((f) => f.path === path);
        if (!file) return null;
        const isActive = path === activeFile;
        const color = getTabColor(file.name);

        return (
          <div
            key={path}
            onClick={() => onSelect(path)}
            className="flex items-center gap-2 px-4 py-2.5 cursor-pointer flex-shrink-0 group relative transition-all"
            style={{
              background: isActive ? "var(--bg-secondary)" : "transparent",
              color: isActive ? "white" : "var(--text-muted)",
              borderRight: "1px solid var(--border)",
              borderBottom: isActive ? "2px solid #7c3aed" : "2px solid transparent",
              marginBottom: "-1px",
              fontSize: "12px",
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.background = "var(--bg-hover)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.background = "transparent";
            }}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="max-w-32 truncate">{file.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(path); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/10 flex-shrink-0"
            >
              <X size={10} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
