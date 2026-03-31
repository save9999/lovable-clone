import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLanguageFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    css: "css",
    html: "html",
    json: "json",
    md: "markdown",
    py: "python",
    sh: "shell",
    sql: "sql",
  };
  return map[ext || ""] || "plaintext";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function extractFilesFromResponse(content: string) {
  const files: { name: string; content: string; language: string; path: string }[] = [];
  const fileRegex = /```(\w+)?\s*\/\/\s*([^\n]+)\n([\s\S]*?)```/g;
  const fileRegex2 = /### File:\s*([^\n]+)\n```(\w+)?\n([\s\S]*?)```/g;

  let match;
  while ((match = fileRegex.exec(content)) !== null) {
    const [, lang, path, code] = match;
    files.push({
      name: path.split("/").pop() || path,
      content: code.trim(),
      language: lang || getLanguageFromFilename(path),
      path,
    });
  }

  while ((match = fileRegex2.exec(content)) !== null) {
    const [, path, lang, code] = match;
    files.push({
      name: path.split("/").pop() || path,
      content: code.trim(),
      language: lang || getLanguageFromFilename(path),
      path,
    });
  }

  return files;
}
