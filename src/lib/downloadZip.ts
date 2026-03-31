import JSZip from "jszip";
import { FileNode } from "./types";

export async function downloadProjectZip(files: FileNode[], projectName: string) {
  const zip = new JSZip();
  const safeZipName = projectName.replace(/\s+/g, "-").toLowerCase() || "project";

  files.forEach((file) => {
    zip.file(file.path, file.content);
  });

  // Ajouter .gitignore si absent
  if (!files.find((f) => f.name === ".gitignore")) {
    zip.file(".gitignore", "node_modules/\n.next/\n.env.local\n");
  }

  // Ajouter package.json si absent
  if (!files.find((f) => f.name === "package.json")) {
    const pkg = {
      name: safeZipName,
      version: "0.1.0",
      private: true,
      scripts: { dev: "next dev", build: "next build", start: "next start" },
      dependencies: {
        next: "^14.0.0",
        react: "^18.0.0",
        "react-dom": "^18.0.0",
      },
      devDependencies: {
        typescript: "^5.0.0",
        "@types/react": "^18.0.0",
        "@types/node": "^20.0.0",
        tailwindcss: "^3.0.0",
      },
    };
    zip.file("package.json", JSON.stringify(pkg, null, 2));
  }

  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeZipName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
