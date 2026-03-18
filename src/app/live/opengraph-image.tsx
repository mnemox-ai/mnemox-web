import { ImageResponse } from 'next/og';
import { fetchAllStrategySummaries } from '@/lib/live-data';

export const runtime = 'nodejs';
export const revalidate = 300; // 5 min cache
export const alt = 'Live Strategies Dashboard - Mnemox AI';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  let strategyCount = '—';
  let winRate = '—';
  let totalTrades = '—';
  let paperTrades = '—';

  try {
    const summaries = await fetchAllStrategySummaries();
    strategyCount = `${summaries.length}`;
    const total = summaries.reduce((s, x) => s + x.stats.total_trades, 0);
    const paper = summaries.reduce((s, x) => s + x.stats.total_paper, 0);
    const weightedWr =
      total > 0
        ? summaries.reduce((s, x) => s + x.stats.win_rate * x.stats.total_trades, 0) / total
        : 0;
    winRate = `${(weightedWr * 100).toFixed(1)}%`;
    totalTrades = `${total}`;
    paperTrades = `${paper}`;
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
          background: 'linear-gradient(135deg, #04060b 0%, #0d1b2a 40%, #0b1120 100%)',
          padding: '60px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow — top right */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        {/* Background glow — bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Top bar: Logo + Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#00e5ff',
                letterSpacing: '3px',
                fontFamily: 'monospace',
              }}
            >
              MNEMOX
            </span>
            <span style={{ fontSize: '28px', color: '#6a6a80' }}>.</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.3)',
              borderRadius: '24px',
              padding: '8px 20px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#00ff88',
                boxShadow: '0 0 12px rgba(0,255,136,0.6)',
                display: 'flex',
              }}
            />
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#00ff88',
                letterSpacing: '2px',
              }}
            >
              LIVE
            </span>
          </div>
        </div>

        {/* Main title area */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '40px',
            flex: 1,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span
              style={{
                fontSize: '52px',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.1,
              }}
            >
              {strategyCount !== '—' ? `${strategyCount} Strategies Live` : 'Live Strategies'}
            </span>
            <span
              style={{
                fontSize: '28px',
                color: '#00e5ff',
                fontWeight: 500,
              }}
            >
              Evolution Engine
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '16px',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '1px',
              }}
            >
              BTCUSDT · 1H · Statistically validated strategies
            </span>
          </div>
        </div>

        {/* Stats cards */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          {/* Strategies */}
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
              {strategyCount}
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
              Strategies
            </span>
          </div>

          {/* Win Rate */}
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
              {winRate}
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
              Win Rate
            </span>
          </div>

          {/* Total Trades */}
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
                color: '#ffffff',
                fontFamily: 'monospace',
              }}
            >
              {totalTrades}
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
              Total Trades
            </span>
          </div>

          {/* Paper Trades */}
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
              {paperTrades}
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
              Paper Trades
            </span>
          </div>
        </div>

        {/* Bottom accent bar + URL */}
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
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '1px',
              }}
            >
              www.mnemox.ai/live
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.2)',
              }}
            >
              Powered by TradeMemory Protocol
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
