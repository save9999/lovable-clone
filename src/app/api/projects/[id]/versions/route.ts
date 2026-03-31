import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const versions = await prisma.version.findMany({
    where: { projectId: params.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json(versions);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { label, filesJson } = await req.json();
  const version = await prisma.version.create({
    data: { projectId: params.id, label, filesJson },
  });

  return NextResponse.json(version);
}
