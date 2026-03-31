import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { role, content } = await req.json();
  const message = await prisma.message.create({
    data: { projectId: params.id, role, content },
  });

  return NextResponse.json(message);
}
