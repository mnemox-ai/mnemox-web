import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Check If Your Startup Idea Already Exists (Before You Build)',
  description:
    'Five methods to validate whether someone already built your app idea — from manual GitHub searches to automated MCP tools that scan 6 databases in parallel.',
  openGraph: {
    title: 'How to Check If Your Startup Idea Already Exists (Before You Build)',
    description:
      'Five methods to validate whether someone already built your app idea — from manual searches to automated scanning.',
    url: 'https://www.mnemox.ai/blog/check-startup-idea',
    type: 'article',
    publishedTime: '2026-03-22T00:00:00Z',
  },
  alternates: {
    canonical: 'https://www.mnemox.ai/blog/check-startup-idea',
  },
  other: {
    'application-ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'How to Check If Your Startup Idea Already Exists (Before You Build)',
      datePublished: '2026-03-22',
      author: { '@type': 'Organization', name: 'Mnemox AI', url: 'https://mnemox.ai' },
      publisher: { '@type': 'Organization', name: 'Mnemox AI', url: 'https://mnemox.ai' },
    }),
  },
};

const methods = [
  {
    name: 'GitHub Search',
    effort: 'Low',
    time: '5–15 min',
    coverage: 'Open source only',
    pros: 'Free, shows star counts and recent activity',
    cons: 'Misses closed-source products, SaaS, and mobile apps. Keyword-dependent — you might miss repos that solve the same problem with different terminology.',
  },
  {
    name: 'Product Hunt Browse',
    effort: 'Medium',
    time: '10–20 min',
    coverage: 'Launched products',
    pros: 'Shows real products with upvotes, launch dates, and maker profiles',
    cons: 'Only covers products that launched on PH. Many developer tools never launch there. Search is limited.',
  },
  {
    name: 'App Store / Play Store',
    effort: 'Low',
    time: '5–10 min',
    coverage: 'Mobile apps',
    pros: 'Rating counts show market validation',
    cons: 'Irrelevant for developer tools, CLIs, APIs, or backend services.',
  },
  {
    name: 'Ask ChatGPT / Claude',
    effort: 'Low',
    time: '1 min',
    coverage: 'General knowledge',
    pros: 'Fast, conversational',
    cons: 'No live data. LLMs hallucinate competitors that do not exist. Cannot tell you how many repos or packages are out there. No trend data.',
  },
  {
    name: 'idea-reality-mcp (automated)',
    effort: 'None (agent runs it)',
    time: '3–15 sec',
    coverage: 'GitHub + HN + npm + PyPI + Product Hunt + Stack Overflow',
    pros: 'Scans 6 databases in parallel. Returns a 0–100 score with evidence, trend detection, and pivot suggestions. Runs inside your AI agent automatically.',
    cons: 'Focused on software/developer ideas. Less useful for physical products or niche B2B SaaS.',
    highlight: true,
  },
];

export default function CheckStartupIdea() {
  return (
    <div className="prose-invert max-w-none">
      <time className="text-xs text-txt-dim">2026-03-22</time>
      <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
        How to Check If Your Startup Idea Already Exists (Before You Build)
      </h1>

      <p className="mt-6 text-txt-dim leading-relaxed">
        You have an idea for a developer tool. Before you spend weeks building it, you should check
        if someone already built it. This sounds obvious, but most developers skip this step —
        especially when using AI coding agents that start generating code immediately.
      </p>
      <p className="mt-4 text-txt-dim leading-relaxed">
        Y Combinator co-founder Paul Graham has a famous essay on the topic: founders often
        build solutions looking for problems. The fix is simple — search first, build second.
        Here are five methods, from manual to fully automated.
      </p>

      <h2 className="mt-12 mb-6 font-display text-2xl font-semibold">Five methods compared</h2>

      <div className="space-y-4">
        {methods.map((m) => (
          <div
            key={m.name}
            className={`rounded-xl border p-5 ${
              m.highlight ? 'border-cyan bg-cyan/5' : 'border-border bg-bg-card'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-mono text-sm font-semibold text-txt">{m.name}</h3>
              <span className="rounded-full bg-bg px-2 py-0.5 text-[10px] text-txt-dim">
                {m.effort} effort
              </span>
              <span className="rounded-full bg-bg px-2 py-0.5 text-[10px] text-txt-dim">{m.time}</span>
            </div>
            <p className="mt-2 text-sm text-txt-dim">Coverage: {m.coverage}</p>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <span className="text-neon-green">+</span>{' '}
                <span className="text-txt-dim">{m.pros}</span>
              </div>
              <div>
                <span className="text-red-400">−</span>{' '}
                <span className="text-txt-dim">{m.cons}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-12 mb-6 font-display text-2xl font-semibold">The real problem: your AI agent never searches</h2>

      <p className="text-txt-dim leading-relaxed">
        Manual searches work — if you remember to do them. The problem is that AI coding agents
        (Claude Code, Cursor, Copilot Workspace) start building the moment you describe your idea.
        They never pause to check if the idea already exists.
      </p>
      <p className="mt-4 text-txt-dim leading-relaxed">
        This is exactly what{' '}
        <Link href="/check" className="text-cyan hover:underline">
          idea-reality-mcp
        </Link>{' '}
        solves. It is an MCP server — a tool your agent can call. Add one line to your agent
        config, and every new project starts with an automatic reality check:
      </p>

      <div className="mt-6 rounded-xl border border-border bg-bg-card p-5">
        <p className="mb-3 text-xs text-txt-dim">Add to your CLAUDE.md or .cursorrules:</p>
        <code className="text-sm text-cyan">
          When starting a new project, use the idea_check MCP tool to check if similar projects already exist.
        </code>
      </div>

      <h2 className="mt-12 mb-6 font-display text-2xl font-semibold">What a good result looks like</h2>

      <div className="rounded-xl border border-border bg-bg-card p-5 font-mono text-sm">
        <p className="text-txt-dim">You: &quot;AI code review tool&quot;</p>
        <p className="mt-3 text-txt-dim">idea_check →</p>
        <p className="text-cyan">├── reality_signal: 92/100</p>
        <p className="text-cyan">├── trend: accelerating ↗</p>
        <p className="text-cyan">├── GitHub repos: 847</p>
        <p className="text-cyan">├── Top competitor: reviewdog (9,094 ⭐)</p>
        <p className="text-cyan">├── npm packages: 56</p>
        <p className="text-cyan">└── Verdict: HIGH — find a niche fast</p>
      </div>

      <p className="mt-6 text-txt-dim leading-relaxed">
        A score of 92 does not mean &quot;do not build.&quot; It means the space is crowded — you need
        a specific angle. The pivot suggestions help you find that angle.
      </p>

      <h2 className="mt-12 mb-6 font-display text-2xl font-semibold">Try it now</h2>

      <p className="text-txt-dim leading-relaxed">
        <Link href="/check" className="text-cyan hover:underline">
          Try idea-reality-mcp in your browser
        </Link>{' '}
        — free, no signup. Or install locally:
      </p>

      <div className="mt-4 rounded-xl border border-border bg-bg-card p-5">
        <code className="text-sm text-cyan">pip install idea-reality-mcp</code>
      </div>

      <hr className="my-12 border-border" />

      <p className="text-sm text-txt-dim">
        Built by{' '}
        <Link href="/" className="text-cyan hover:underline">
          Mnemox AI
        </Link>
        . We build open-source MCP servers for trading memory and idea validation.
      </p>
    </div>
  );
}
