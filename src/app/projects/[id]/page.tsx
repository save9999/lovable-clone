"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Message, FileNode } from "@/lib/types";
import { generateId, extractFilesFromResponse, getLanguageFromFilename } from "@/lib/utils";
import EditorLayout from "@/components/EditorLayout";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projectName, setProjectName] = useState("Chargement...");
  const [vercelUrl, setVercelUrl] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Charger le projet
  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setProjectName(data.name);
        setVercelUrl(data.vercelUrl || "");
        setGithubRepo(data.githubRepo || "");
        if (data.files?.length) {
          setFiles(data.files);
          setActiveFile(data.files[0].path);
        }
        if (data.messages?.length) {
          setMessages(
            data.messages.map((m: { id: string; role: string; content: string; createdAt: string }) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              timestamp: new Date(m.createdAt),
            }))
          );
        }
      });
  }, [id]);

  // Auto-save des fichiers avec debounce
  const saveFiles = useCallback(
    (filesToSave: FileNode[]) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        fetch(`/api/projects/${id}/files`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files: filesToSave }),
        }).catch(() => {});
      }, 1500);
    },
    [id]
  );

  const handleSend = useCallback(
    async (content: string) => {
      const userMsg: Message = { id: generateId(), role: "user", content, timestamp: new Date() };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setIsLoading(true);

      // Sauvegarder le message utilisateur
      fetch(`/api/projects/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user", content }),
      }).catch(() => {});

      // Mettre à jour le nom du projet si c'est le premier message
      if (messages.length === 0) {
        const newName = content.split(" ").slice(0, 6).join(" ").substring(0, 50);
        setProjectName(newName);
        fetch(`/api/projects/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName }),
        }).catch(() => {});
      }

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
            isUpdate: files.length > 0,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Erreur de génération");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        const assistantMsg: Message = { id: generateId(), role: "assistant", content: "", timestamp: new Date() };
        setMessages((prev) => [...prev, assistantMsg]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const lines = decoder.decode(value).split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") break;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.text) {
                    fullContent += parsed.text;
                    setMessages((prev) => prev.map((m) => m.id === assistantMsg.id ? { ...m, content: fullContent } : m));
                  }
                  if (parsed.error) throw new Error(parsed.error);
                } catch {}
              }
            }
          }
        }

        // Sauvegarder message assistant
        fetch(`/api/projects/${id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "assistant", content: fullContent }),
        }).catch(() => {});

        // Extraire et sauvegarder les fichiers
        const extracted = extractFilesFromResponse(fullContent);
        if (extracted.length > 0) {
          let newFiles: FileNode[];
          if (files.length === 0) {
            newFiles = extracted;
            setFiles(newFiles);
            setActiveFile(extracted[0].path);
          } else {
            newFiles = [...files];
            extracted.forEach((f) => {
              const idx = newFiles.findIndex((e) => e.path === f.path);
              if (idx >= 0) newFiles[idx] = f;
              else newFiles.push(f);
            });
            setFiles(newFiles);
          }
          saveFiles(newFiles);
        }
      } catch (err) {
        const error = err as Error;
        setMessages((prev) => [...prev, {
          id: generateId(), role: "assistant",
          content: `❌ Erreur : ${error.message}`,
          timestamp: new Date(),
        }]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, files, id, saveFiles]
  );

  const handleFileUpdate = useCallback((path: string, content: string) => {
    setFiles((prev) => {
      const updated = prev.map((f) =>
        f.path === path ? { ...f, content, language: getLanguageFromFilename(f.name) } : f
      );
      saveFiles(updated);
      return updated;
    });
  }, [saveFiles]);

  const handleNewProject = () => {
    window.location.href = "/dashboard";
  };

  return (
    <EditorLayout
      projectId={id}
      messages={messages}
      files={files}
      activeFile={activeFile}
      isLoading={isLoading}
      projectName={projectName}
      vercelUrl={vercelUrl}
      githubRepo={githubRepo}
      onSend={handleSend}
      onSelectFile={setActiveFile}
      onFileUpdate={handleFileUpdate}
      onNewProject={handleNewProject}
      onFilesChange={setFiles}
    />
  );
}
