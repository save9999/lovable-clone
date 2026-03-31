"use client";

import { FileNode } from "@/lib/types";
import { RefreshCw, Monitor, Smartphone, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

function buildPreview(files: FileNode[]): string {
  const htmlFile = files.find((f) => f.path.endsWith(".html"));
  const cssFile = files.find((f) => f.path.endsWith(".css") && !f.path.includes("globals"));
  const mainFile = files.find(
    (f) => f.name === "page.tsx" || f.name === "App.tsx" || f.name === "index.tsx"
  );

  if (htmlFile) return htmlFile.content;

  let customCSS = cssFile?.content || "";

  const fileListHTML = files
    .map(
      (f) =>
        `<div class="file-chip"><span class="dot" style="background:${extColor(f.name)}"></span>${f.name}</div>`
    )
    .join("");

  const mainPreview = mainFile
    ? `<div class="code-block">${mainFile.content
        .substring(0, 1000)
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}${mainFile.content.length > 1000 ? "\n// ..." : ""}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Preview</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0a0a0f; color:#f1f1f5; font-family:-apple-system,sans-serif; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; }
  .card { background:#111118; border:1px solid #1e1e2e; border-radius:16px; padding:32px; max-width:600px; width:100%; }
  .badge { display:inline-flex; align-items:center; gap:6px; background:rgba(124,58,237,0.15); color:#a78bfa; border:1px solid rgba(124,58,237,0.3); border-radius:999px; padding:4px 12px; font-size:12px; font-weight:500; margin-bottom:20px; }
  .icon { width:56px; height:56px; border-radius:16px; background:linear-gradient(135deg,#7c3aed,#db2777); display:flex; align-items:center; justify-content:center; font-size:28px; margin-bottom:20px; }
  h2 { font-size:22px; font-weight:700; color:white; margin-bottom:8px; }
  p { font-size:14px; color:#9191a8; line-height:1.6; margin-bottom:20px; }
  .files { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px; }
  .file-chip { display:inline-flex; align-items:center; gap:6px; background:#16161f; border:1px solid #1e1e2e; border-radius:8px; padding:4px 10px; font-size:12px; color:#9191a8; }
  .dot { width:6px; height:6px; border-radius:50%; display:inline-block; }
  .code-block { background:#0d0d14; border:1px solid #1e1e2e; border-radius:10px; padding:16px; font-family:monospace; font-size:11px; color:#7c7c9a; white-space:pre-wrap; overflow:auto; max-height:240px; line-height:1.5; }
  .cmd { background:#16161f; border:1px solid #1e1e2e; border-radius:8px; padding:10px 14px; font-family:monospace; font-size:12px; color:#10b981; }
  ${customCSS}
</style>
</head>
<body>
<div class="card">
  <div class="badge">✨ Code généré avec succès</div>
  <div class="icon">🚀</div>
  <h2>${files.length} fichier${files.length > 1 ? "s" : ""} généré${files.length > 1 ? "s" : ""}</h2>
  <p>Lance le serveur de développement pour voir ton application complète. La preview interactive apparaît ici pour les fichiers HTML purs.</p>
  <div class="files">${fileListHTML}</div>
  ${mainPreview}
  <div style="margin-top:16px">
    <div class="cmd">$ npm run dev → http://localhost:3000</div>
  </div>
</div>
</body>
</html>`;
}

function extColor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const colors: Record<string, string> = {
    ts: "#3b82f6", tsx: "#3b82f6", js: "#eab308", jsx: "#eab308",
    css: "#ec4899", json: "#f59e0b", md: "#6b7280", html: "#f97316",
  };
  return colors[ext || ""] || "#6b7280";
}

export default function PreviewPanel({ files }: { files: FileNode[] }) {
  const [isMobile, setIsMobile] = useState(false);
  const [key, setKey] = useState(0);
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (files.length > 0) {
      setHtml(buildPreview(files));
      setKey((k) => k + 1);
    }
  }, [files]);

  if (files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-center space-y-3">
          <div className="text-4xl">🖥️</div>
          <p className="text-sm font-medium text-white">Preview</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Apparaît après génération</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* Browser chrome */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#ef4444" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-md text-xs"
            style={{ background: "var(--bg-tertiary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            <span>localhost:3000</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMobile(false)}
            className="p-1.5 rounded-md transition-all"
            style={{
              background: !isMobile ? "var(--bg-hover)" : "transparent",
              color: !isMobile ? "white" : "var(--text-muted)",
              border: !isMobile ? "1px solid var(--border-light)" : "1px solid transparent",
            }}
          >
            <Monitor size={13} />
          </button>
          <button
            onClick={() => setIsMobile(true)}
            className="p-1.5 rounded-md transition-all"
            style={{
              background: isMobile ? "var(--bg-hover)" : "transparent",
              color: isMobile ? "white" : "var(--text-muted)",
              border: isMobile ? "1px solid var(--border-light)" : "1px solid transparent",
            }}
          >
            <Smartphone size={13} />
          </button>
          <button
            onClick={() => setKey((k) => k + 1)}
            className="p-1.5 rounded-md ml-1 transition-all"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Preview iframe */}
      <div
        className="flex-1 overflow-hidden flex items-center justify-center"
        style={{ background: "#050509", padding: isMobile ? "16px" : "0" }}
      >
        <div
          className="overflow-hidden h-full"
          style={{
            width: isMobile ? "390px" : "100%",
            borderRadius: isMobile ? "24px" : "0",
            boxShadow: isMobile ? "0 0 0 1px #1e1e2e, 0 32px 64px rgba(0,0,0,0.8)" : "none",
          }}
        >
          <iframe
            key={key}
            srcDoc={html}
            className="w-full h-full border-0"
            sandbox="allow-scripts"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
}
