import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getProject(id: string, userId: string) {
  return prisma.project.findFirst({ where: { id, userId } });
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const project = await prisma.project.findFirst({
    where: { id: params.id, userId },
    include: { files: true, messages: { orderBy: { createdAt: "asc" } }, versions: { orderBy: { createdAt: "desc" }, take: 20 } },
  });

  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const project = await getProject(params.id, userId);
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  const data = await req.json();
  const updated = await prisma.project.update({
    where: { id: params.id },
    data: { name: data.name, description: data.description, vercelUrl: data.vercelUrl, githubRepo: data.githubRepo, githubOwner: data.githubOwner },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const project = await getProject(params.id, userId);
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
