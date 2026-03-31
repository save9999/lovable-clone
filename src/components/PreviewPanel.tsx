"use client";

import { FileNode } from "@/lib/types";
import { RefreshCw, Monitor, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { buildReactPreview } from "@/lib/buildReactPreview";

export default function PreviewPanel({ files }: { files: FileNode[] }) {
  const [isMobile, setIsMobile] = useState(false);
  const [key, setKey] = useState(0);
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (files.length > 0) {
      setHtml(buildReactPreview(files));
      setKey((k) => k + 1);
    }
  }, [files]);

  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-center space-y-2">
          <div className="text-4xl">🖥️</div>
          <p className="text-sm font-medium text-white">Preview live</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Apparaît après génération</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* Browser chrome */}
      <div className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md text-xs"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
            localhost:3000
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMobile(false)}
            className="p-1.5 rounded-md transition-all"
            style={{ background: !isMobile ? "var(--bg-hover)" : "transparent", color: !isMobile ? "white" : "var(--text-muted)", border: !isMobile ? "1px solid var(--border-light)" : "1px solid transparent" }}>
            <Monitor size={13} />
          </button>
          <button onClick={() => setIsMobile(true)}
            className="p-1.5 rounded-md transition-all"
            style={{ background: isMobile ? "var(--bg-hover)" : "transparent", color: isMobile ? "white" : "var(--text-muted)", border: isMobile ? "1px solid var(--border-light)" : "1px solid transparent" }}>
            <Smartphone size={13} />
          </button>
          <button onClick={() => setKey((k) => k + 1)}
            className="p-1.5 rounded-md ml-1 transition-all"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Preview iframe */}
      <div className="flex-1 overflow-hidden flex items-center justify-center"
        style={{ background: "#050509", padding: isMobile ? "16px" : "0" }}>
        <div className="overflow-hidden h-full"
          style={{
            width: isMobile ? "390px" : "100%",
            borderRadius: isMobile ? "24px" : "0",
            boxShadow: isMobile ? "0 0 0 1px #1e1e2e, 0 32px 64px rgba(0,0,0,0.8)" : "none",
          }}>
          <iframe
            key={key}
            srcDoc={html}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
