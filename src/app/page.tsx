"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Message, FileNode } from "@/lib/types";
import { generateId, extractFilesFromResponse, getLanguageFromFilename } from "@/lib/utils";
import LandingPage from "@/components/LandingPage";
import EditorLayout from "@/components/EditorLayout";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  const handleSend = useCallback(
    async (content: string) => {
      if (!hasStarted) setHasStarted(true);

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setIsLoading(true);

      if (!projectName && messages.length === 0) {
        const words = content.split(" ").slice(0, 5).join(" ");
        setProjectName(words.length > 40 ? words.substring(0, 40) + "..." : words);
      }

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            isUpdate: messages.length > 0,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Erreur de génération");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        const assistantMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: "",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") break;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.text) {
                    fullContent += parsed.text;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantMsg.id ? { ...m, content: fullContent } : m
                      )
                    );
                  }
                  if (parsed.error) throw new Error(parsed.error);
                } catch {}
              }
            }
          }
        }

        const extracted = extractFilesFromResponse(fullContent);
        if (extracted.length > 0) {
          if (messages.length === 0) {
            setFiles(extracted);
            setActiveFile(extracted[0].path);
          } else {
            setFiles((prev) => {
              const updated = [...prev];
              extracted.forEach((newFile) => {
                const idx = updated.findIndex((f) => f.path === newFile.path);
                if (idx >= 0) updated[idx] = newFile;
                else updated.push(newFile);
              });
              return updated;
            });
          }
        }
      } catch (err) {
        const error = err as Error;
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: "assistant",
            content: `Erreur : ${error.message}\n\nVérifie que ta clé ANTHROPIC_API_KEY est bien configurée dans .env.local`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, projectName, hasStarted]
  );

  const handleFileUpdate = (path: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.path === path ? { ...f, content, language: getLanguageFromFilename(f.name) } : f
      )
    );
  };

  const handleNewProject = () => {
    setMessages([]);
    setFiles([]);
    setActiveFile(null);
    setProjectName("");
    setHasStarted(false);
  };

  if (!hasStarted) {
    return <LandingPage onStart={handleSend} />;
  }

  return (
    <EditorLayout
      messages={messages}
      files={files}
      activeFile={activeFile}
      isLoading={isLoading}
      projectName={projectName}
      onSend={handleSend}
      onSelectFile={setActiveFile}
      onFileUpdate={handleFileUpdate}
      onNewProject={handleNewProject}
    />
  );
}
