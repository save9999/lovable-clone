"use client";

import { useEffect, useState } from "react";
import { FileNode } from "@/lib/types";
import { Copy, Check } from "lucide-react";

interface CodeEditorProps {
  file: FileNode | null;
  onUpdate?: (path: string, content: string) => void;
}

export default function CodeEditor({ file, onUpdate }: CodeEditorProps) {
  const [copied, setCopied] = useState(false);
  const [MonacoEditor, setMonacoEditor] = useState<React.ComponentType<{
    height: string;
    language: string;
    value: string;
    onChange?: (value: string | undefined) => void;
    theme: string;
    options: object;
  }> | null>(null);

  useEffect(() => {
    import("@monaco-editor/react").then((mod) => setMonacoEditor(() => mod.default));
  }, []);

  const handleCopy = async () => {
    if (!file) return;
    await navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-center space-y-3">
          <div className="text-3xl">📄</div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Sélectionne un fichier</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* Tab bar */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="px-3 py-1 rounded-md text-xs font-mono flex items-center gap-1.5"
            style={{ background: "var(--bg-tertiary)", color: "#a78bfa", border: "1px solid var(--border-light)" }}
          >
            {file.path}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all"
          style={{ color: "var(--text-muted)", background: "transparent" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "var(--bg-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
        >
          {copied ? <Check size={12} style={{ color: "#10b981" }} /> : <Copy size={12} />}
          <span style={{ color: copied ? "#10b981" : undefined }}>{copied ? "Copié !" : "Copier"}</span>
        </button>
      </div>

      {/* Editor */}
      <div className="flex-1">
        {MonacoEditor ? (
          <MonacoEditor
            height="100%"
            language={file.language}
            value={file.content}
            onChange={(value) => onUpdate?.(file.path, value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              tabSize: 2,
              renderLineHighlight: "line",
              fontFamily: "JetBrains Mono, Fira Code, Consolas, monospace",
              fontLigatures: true,
              padding: { top: 12, bottom: 12 },
              smoothScrolling: true,
              cursorBlinking: "smooth",
            }}
          />
        ) : (
          <pre className="p-4 text-xs overflow-auto h-full font-mono leading-relaxed whitespace-pre-wrap" style={{ color: "#e2e8f0" }}>
            {file.content}
          </pre>
        )}
      </div>
    </div>
  );
}
