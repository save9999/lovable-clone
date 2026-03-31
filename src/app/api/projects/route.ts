import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const projects = await prisma.project.findMany({
    where: { userId },
    include: { _count: { select: { files: true, messages: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const { name, description } = await req.json();
  const project = await prisma.project.create({
    data: { name: name || "Nouveau projet", description, userId },
  });

  return NextResponse.json(project);
}
