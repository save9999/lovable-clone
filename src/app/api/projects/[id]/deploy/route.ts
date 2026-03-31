import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const token = process.env.VERCEL_TOKEN;
  if (!token) return NextResponse.json({ error: "VERCEL_TOKEN manquant dans .env.local" }, { status: 400 });

  const { files } = await req.json();
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  const projectName = project.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  try {
    const payload = {
      name: projectName,
      files: files.map((f: { path: string; content: string }) => ({
        file: f.path,
        data: f.content,
        encoding: "utf-8",
      })),
      projectSettings: { framework: "nextjs" },
      target: "production",
    };

    const res = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Erreur Vercel");

    const deployUrl = `https://${data.url}`;
    await prisma.project.update({ where: { id: params.id }, data: { vercelUrl: deployUrl } });

    return NextResponse.json({ ok: true, url: deployUrl, deploymentId: data.id });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
