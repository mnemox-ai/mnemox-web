import { ImageResponse } from 'next/og';
import { API_BASE } from '@/lib/config';

export const runtime = 'nodejs';
export const revalidate = 3600;

function scoreColor(score: number): string {
  if (score < 30) return '#00ff88';
  if (score <= 60) return '#00e5ff';
  return '#ff3366';
}

function gapColor(status: string): string {
  if (status === 'blue_ocean') return '#00ff88';
  if (status === 'moderate') return '#00e5ff';
  return '#ff3366';
}

function gapLabel(status: string): string {
  if (status === 'blue_ocean') return 'Blue Ocean';
  if (status === 'moderate') return 'Moderate';
  return 'Competitive';
}

/** Personality-driven verdict — this is what people share */
function verdict(score: number): { text: string; sub: string } {
  if (score <= 15) return { text: 'Ghost Town', sub: 'Uncharted territory' };
  if (score <= 30) return { text: 'Early Signal', sub: 'Low competition, high potential' };
  if (score <= 45) return { text: 'Rising Niche', sub: 'Emerging market opportunity' };
  if (score <= 60) return { text: 'Getting Crowded', sub: 'Differentiation is key' };
  if (score <= 75) return { text: 'Validated', sub: 'Proven demand exists' };
  if (score <= 90) return { text: 'Red Ocean', sub: 'Highly competitive space' };
  return { text: 'Shark Tank', sub: 'Dominated by incumbents' };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ hash: string }> },
) {
  const { hash } = await params;
  const url = new URL(request.url);
  const scoreOverride = url.searchParams.get('score');

  if (!/^[a-f0-9]+$/.test(hash)) {
    return new Response('Invalid hash', { status: 400 });
  }

  let data: {
    idea_text?: string;
    score: number;
    percentile: number;
    total_ideas: number;
    gap_status: string;
    date: string;
  };

  try {
    const res = await fetch(`${API_BASE}/api/badge-data/${hash}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    data = await res.json();
    // Override score with query param if provided (fixes stale score from old scans)
    if (scoreOverride && !isNaN(Number(scoreOverride))) {
      data.score = Math.max(0, Math.min(100, Number(scoreOverride)));
    }
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #04060b 0%, #0d1b2a 40%, #0b1120 100%)',
            color: '#6a6a80',
            fontSize: '36px',
          }}
        >
          Badge unavailable
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: { 'Cache-Control': 'public, max-age=3600' },
      },
    );
  }

  const sc = scoreColor(data.score);
  const gc = gapColor(data.gap_status);
  const gl = gapLabel(data.gap_status);
  const vd = verdict(data.score);
  const ideaText = (data.idea_text ?? '').slice(0, 50) + ((data.idea_text?.length ?? 0) > 50 ? '...' : '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #04060b 0%, #0a1628 35%, #0d1b2a 65%, #0b1120 100%)',
          padding: '48px 56px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow effects */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${sc}15 0%, transparent 70%)`,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #00e5ff10 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '4px',
              }}
            >
              MNEMOX
            </span>
            <span
              style={{
                fontSize: '12px',
                color: '#00e5ff',
                letterSpacing: '3px',
                border: '1px solid #00e5ff40',
                padding: '4px 12px',
                borderRadius: '12px',
              }}
            >
              REALITY CHECK
            </span>
          </div>
          <span
            style={{
              fontSize: '14px',
              color: gc,
              background: `${gc}15`,
              padding: '6px 18px',
              borderRadius: '16px',
              border: `1px solid ${gc}30`,
              fontWeight: 600,
            }}
          >
            {gl}
          </span>
        </div>

        {/* Idea text */}
        {ideaText && (
          <div style={{ display: 'flex', marginTop: '28px' }}>
            <span
              style={{
                fontSize: '18px',
                color: '#8a8aa0',
                fontStyle: 'italic',
                lineHeight: 1.4,
              }}
            >
              &ldquo;{ideaText}&rdquo;
            </span>
          </div>
        )}

        {/* Center: Score + Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            gap: '60px',
          }}
        >
          {/* Score circle area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '140px',
                fontWeight: 700,
                color: sc,
                lineHeight: 1,
                fontFamily: 'monospace',
                textShadow: `0 0 60px ${sc}40`,
              }}
            >
              {data.score}
            </span>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: sc,
                marginTop: '8px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {vd.text}
            </span>
            <span
              style={{
                fontSize: '14px',
                color: '#6a6a80',
                marginTop: '4px',
                letterSpacing: '1px',
              }}
            >
              {vd.sub}
            </span>
          </div>

          {/* Right stats */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '12px 20px',
                borderRadius: '12px',
                border: '1px solid #1a1a28',
                background: '#0b112040',
              }}
            >
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#00e5ff' }}>
                Top {data.percentile}%
              </span>
              <span style={{ fontSize: '13px', color: '#6a6a80' }}>
                of {data.total_ideas.toLocaleString()} ideas scanned
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '12px',
                border: '1px solid #1a1a28',
                background: '#0b112040',
              }}
            >
              <span style={{ fontSize: '13px', color: '#6a6a80' }}>
                Scanned GitHub, HN, npm, PyPI, PH
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            borderTop: '1px solid #1a1a28',
            paddingTop: '16px',
          }}
        >
          <span style={{ fontSize: '15px', color: '#ffffff', fontWeight: 500 }}>
            Check your idea free at mnemox.ai/check
          </span>
          <span style={{ fontSize: '14px', color: '#6a6a80' }}>Validated by Mnemox AI</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, max-age=3600' },
    },
  );
}
