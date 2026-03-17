import { NextResponse } from 'next/server';

export const revalidate = 3600; // cache 1 hour

async function getStarCount(repo: string): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/repos/mnemox-ai/${repo}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  const [ideaReality, tradememory] = await Promise.all([
    getStarCount('idea-reality-mcp'),
    getStarCount('tradememory-protocol'),
  ]);

  return NextResponse.json({
    idea_reality: ideaReality,
    tradememory,
    combined: ideaReality + tradememory,
  });
}
