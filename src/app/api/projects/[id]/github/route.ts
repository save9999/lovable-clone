import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Octokit } from "@octokit/rest";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const token = process.env.GITHUB_ACCESS_TOKEN;
  if (!token) return NextResponse.json({ error: "GITHUB_ACCESS_TOKEN manquant dans .env.local" }, { status: 400 });

  const { files } = await req.json();
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

  const octokit = new Octokit({ auth: token });
  const repoName = project.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  try {
    let repoOwner: string;
    let repoFullName: string;

    // Créer le repo si pas existant
    if (!project.githubRepo) {
      const { data: user } = await octokit.users.getAuthenticated();
      repoOwner = user.login;
      try {
        await octokit.repos.createForAuthenticatedUser({
          name: repoName,
          description: project.description || `Généré avec LovableAI`,
          auto_init: true,
          private: false,
        });
      } catch {
        // Repo déjà existant
      }
      repoFullName = repoName;

      await prisma.project.update({
        where: { id: params.id },
        data: { githubRepo: repoFullName, githubOwner: repoOwner },
      });
    } else {
      repoOwner = project.githubOwner!;
      repoFullName = project.githubRepo!;
    }

    // Attendre que le repo soit initialisé
    await new Promise((r) => setTimeout(r, 1500));

    // Push chaque fichier
    for (const file of files) {
      let sha: string | undefined;
      try {
        const { data } = await octokit.repos.getContent({
          owner: repoOwner, repo: repoFullName, path: file.path,
        });
        sha = (data as { sha: string }).sha;
      } catch {}

      await octokit.repos.createOrUpdateFileContents({
        owner: repoOwner,
        repo: repoFullName,
        path: file.path,
        message: `Update ${file.path} via LovableAI`,
        content: Buffer.from(file.content).toString("base64"),
        sha,
      });
    }

    const repoUrl = `https://github.com/${repoOwner}/${repoFullName}`;
    return NextResponse.json({ ok: true, repoUrl, owner: repoOwner, repo: repoFullName });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
