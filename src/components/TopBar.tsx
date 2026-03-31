"use client";

import { Sparkles, Download, Trash2, Code2 } from "lucide-react";
import { FileNode } from "@/lib/types";

interface TopBarProps {
  projectName: string;
  files: FileNode[];
  onClear: () => void;
  onDownload: () => void;
}

export default function TopBar({ projectName, files, onClear, onDownload }: TopBarProps) {
  return (
    <div className="h-12 bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center justify-between px-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <span className="font-bold text-white text-sm">LovableAI</span>
        {projectName && (
          <>
            <span className="text-gray-700 text-sm">/</span>
            <span className="text-gray-400 text-sm">{projectName}</span>
          </>
        )}
      </div>

      {/* Stats */}
      {files.length > 0 && (
        <div className="flex items-center gap-1.5">
          <Code2 size={12} className="text-gray-600" />
          <span className="text-xs text-gray-600">{files.length} fichier{files.length > 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1">
        {files.length > 0 && (
          <>
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <Download size={13} />
              Exporter
            </button>
            <button
              onClick={onClear}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-red-400 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <Trash2 size={13} />
              Effacer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
