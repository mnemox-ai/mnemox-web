import { ImageResponse } from 'next/og';
import { API_BASE } from '@/lib/config';

export const runtime = 'nodejs';
export const revalidate = 3600;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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

export default async function Image({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;

  let data: { idea_text?: string; score: number; percentile: number; gap_status: string; created_at?: string };

  try {
    const res = await fetch(`${API_BASE}/api/badge-data/${hash}`);
    if (!res.ok) throw new Error(`API ${res.status}`);
    data = await res.json();
  } catch {
    data = { score: 0, percentile: 0, gap_status: 'moderate' };
  }

  const sc = scoreColor(data.score);
  const gc = gapColor(data.gap_status);
  const gapLabel = data.gap_status === 'blue_ocean' ? 'Blue Ocean' : data.gap_status === 'moderate' ? 'Moderate' : 'Competitive';
  const ideaText = (data.idea_text ?? '').slice(0, 60) + ((data.idea_text?.length ?? 0) > 60 ? '...' : '');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #04060b 0%, #0d1b2a 40%, #0b1120 100%)',
          padding: '50px 60px',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#ffffff', letterSpacing: '3px' }}>MNEMOX</span>
          <span style={{ fontSize: '16px', color: '#00e5ff', letterSpacing: '2px' }}>REALITY CHECK</span>
        </div>

        {/* Idea text */}
        {ideaText && (
          <div style={{ display: 'flex', marginTop: '30px' }}>
            <span style={{ fontSize: '20px', color: '#6a6a80', fontStyle: 'italic' }}>
              &quot;{ideaText}&quot;
            </span>
          </div>
        )}

        {/* Center score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <span style={{ fontSize: '140px', fontWeight: 700, color: sc, lineHeight: 1, fontFamily: 'monospace' }}>
            {data.score}
          </span>
          <span style={{ fontSize: '24px', color: '#6a6a80', marginTop: '4px', letterSpacing: '4px' }}>
            REALITY SCORE
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <span style={{ fontSize: '22px', color: '#00e5ff', fontWeight: 600 }}>
              Top {data.percentile}%
            </span>
            <span
              style={{
                fontSize: '16px',
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span style={{ fontSize: '18px', color: '#ffffff', fontWeight: 500 }}>
            Check your idea at mnemox.ai/check
          </span>
          <span style={{ fontSize: '16px', color: '#6a6a80' }}>Validated by Mnemox</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
