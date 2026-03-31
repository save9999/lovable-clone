import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { files } = await req.json();

  // Supprimer anciens fichiers et recréer
  await prisma.file.deleteMany({ where: { projectId: params.id } });
  await prisma.file.createMany({
    data: files.map((f: { name: string; path: string; content: string; language: string }) => ({
      projectId: params.id,
      name: f.name,
      path: f.path,
      content: f.content,
      language: f.language,
    })),
  });

  await prisma.project.update({ where: { id: params.id }, data: { updatedAt: new Date() } });

  return NextResponse.json({ ok: true });
}
