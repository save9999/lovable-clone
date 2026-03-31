"use client";

import { useState, useCallback } from "react";
import { FileNode } from "@/lib/types";

interface VersionEntry {
  files: FileNode[];
  activeFile: string | null;
  label: string;
  timestamp: Date;
}

export function useVersionHistory(projectId?: string) {
  const [history, setHistory] = useState<VersionEntry[]>([]);
  const [cursor, setCursor] = useState(-1);

  const push = useCallback(
    (files: FileNode[], activeFile: string | null, label: string) => {
      const entry: VersionEntry = { files, activeFile, label, timestamp: new Date() };

      setHistory((prev) => {
        const newHistory = [...prev.slice(0, cursor + 1), entry];
        setCursor(newHistory.length - 1);
        return newHistory;
      });

      // Persister en DB si projectId
      if (projectId) {
        fetch(`/api/projects/${projectId}/versions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label, filesJson: JSON.stringify(files) }),
        }).catch(() => {});
      }
    },
    [cursor, projectId]
  );

  const undo = useCallback(() => {
    if (cursor > 0) setCursor((c) => c - 1);
  }, [cursor]);

  const redo = useCallback(() => {
    if (cursor < history.length - 1) setCursor((c) => c + 1);
  }, [cursor, history.length]);

  const restoreVersion = useCallback((idx: number) => {
    if (idx >= 0 && idx < history.length) setCursor(idx);
  }, [history.length]);

  return {
    current: history[cursor] ?? null,
    history,
    cursor,
    push,
    undo,
    redo,
    restoreVersion,
    canUndo: cursor > 0,
    canRedo: cursor < history.length - 1,
  };
}
