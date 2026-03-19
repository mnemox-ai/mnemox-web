import { ImageResponse } from 'next/og';

const API_BASE = 'https://idea-reality-mcp.onrender.com';

export const runtime = 'nodejs';
export const revalidate = 300;
export const alt = 'Idea Pulse - Startup Idea Trends | Mnemox AI';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  let totalScans = '—';
  let countries = '—';
  let topKeyword = '—';
  let weeklyVolume = '—';

  try {
    const res = await fetch(`${API_BASE}/api/pulse`, { next: { revalidate: 300 } });
    if (res.ok) {
      const data = await res.json();
      totalScans = `${data.total_scans ?? data.weekly_volume ?? '—'}`;
      countries = `${data.countries?.length ?? data.country_distribution?.length ?? '—'}`;
      if (data.top_keywords?.length) {
        const rawKw = String(data.top_keywords[0].keyword ?? data.top_keywords[0].name ?? '—');
        topKeyword = rawKw.replace(/<[^>]*>/g, '').slice(0, 30);
      }
      weeklyVolume = `${data.weekly_volume ?? '—'}`;
    }
  } catch {
    // fallback to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #04060b 0%, #0d1b2a 50%, #0b1120 100%)',
          padding: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow — top right (cyan) */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(0,229,255,0.2) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        {/* Background glow — bottom left (green) */}
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(0,255,136,0.2) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top bar: MNEMOX + IDEA PULSE badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '3px',
              fontFamily: 'monospace',
            }}
          >
            MNEMOX
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(0,229,255,0.1)',
              border: '1px solid rgba(0,229,255,0.3)',
              borderRadius: '24px',
              padding: '8px 20px',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#00e5ff',
                letterSpacing: '2px',
              }}
            >
              IDEA PULSE
            </span>
          </div>
        </div>

        {/* Center: Main title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '40px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
            }}
          >
            Startup Idea Trends
          </span>
        </div>

        {/* 4 stat boxes */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          {/* Total Scans */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px 40px',
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: '44px',
                fontWeight: 700,
                color: '#00e5ff',
                fontFamily: 'monospace',
              }}
            >
              {totalScans}
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginTop: '8px',
              }}
            >
              Total Scans
            </span>
          </div>

          {/* Countries */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px 40px',
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: '44px',
                fontWeight: 700,
                color: '#00ff88',
                fontFamily: 'monospace',
              }}
            >
              {countries}
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginTop: '8px',
              }}
            >
              Countries
            </span>
          </div>

          {/* Top Keyword */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px 40px',
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#ffffff',
                fontFamily: 'monospace',
              }}
            >
              {topKeyword}
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginTop: '8px',
              }}
            >
              Top Keyword
            </span>
          </div>

          {/* This Week */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px 40px',
              flex: 1,
            }}
          >
            <span
              style={{
                fontSize: '44px',
                fontWeight: 700,
                color: '#00e5ff',
                fontFamily: 'monospace',
              }}
            >
              {weeklyVolume}
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                marginTop: '8px',
              }}
            >
              This Week
            </span>
          </div>
        </div>

        {/* Bottom: URL + Powered by */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '32px',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, #00e5ff, rgba(0,229,255,0.1), transparent)',
              display: 'flex',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                color: '#6a6a80',
                letterSpacing: '1px',
              }}
            >
              mnemox.ai/pulse
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.2)',
              }}
            >
              Powered by Mnemox AI
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
