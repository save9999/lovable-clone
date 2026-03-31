export interface FileNode {
  name: string;
  content: string;
  language: string;
  path: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: FileNode[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface GeneratedCode {
  files: FileNode[];
  explanation: string;
}
