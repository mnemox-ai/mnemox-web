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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hash: string }> },
) {
  const { hash } = await params;

  if (!/^[a-f0-9]+$/.test(hash)) {
    return new Response('Invalid hash', { status: 400 });
  }

  let data: {
    score: number;
    percentile: number;
    gap_status: string;
    date: string;
  };

  try {
    const res = await fetch(`${API_BASE}/api/badge-data/${hash}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    data = await res.json();
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
  const gapLabel =
    data.gap_status === 'blue_ocean'
      ? 'Blue Ocean'
      : data.gap_status === 'moderate'
        ? 'Moderate'
        : 'Competitive';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #04060b 0%, #0d1b2a 40%, #0b1120 100%)',
          padding: '60px',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <span
            style={{
              fontSize: '24px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '3px',
            }}
          >
            MNEMOX
          </span>
          <span style={{ fontSize: '20px', color: '#6a6a80' }}>{String(data.date ?? '').replace(/<[^>]*>/g, '').slice(0, 20)}</span>
        </div>

        {/* Center score */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: '120px',
              fontWeight: 700,
              color: sc,
              lineHeight: 1,
              fontFamily: 'monospace',
            }}
          >
            {data.score}
          </span>
          <span
            style={{
              fontSize: '28px',
              color: '#6a6a80',
              marginTop: '8px',
              letterSpacing: '2px',
            }}
          >
            Reality Score
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '20px',
            }}
          >
            <span style={{ fontSize: '24px', color: '#00e5ff', fontWeight: 600 }}>
              Top {data.percentile}%
            </span>
            <span
              style={{
                fontSize: '18px',
                color: gc,
                background: `${gc}20`,
                padding: '6px 16px',
                borderRadius: '20px',
                border: `1px solid ${gc}40`,
              }}
            >
              {gapLabel}
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <span style={{ fontSize: '18px', color: '#ffffff', fontWeight: 500 }}>
            Validated by Mnemox
          </span>
          <span style={{ fontSize: '18px', color: '#6a6a80' }}>mnemox.ai/check</span>
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
