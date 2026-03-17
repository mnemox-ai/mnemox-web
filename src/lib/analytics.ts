/** Funnel analytics — lightweight event buffer with flush to API */

const API_BASE = 'https://idea-reality-mcp.onrender.com';
const FLUSH_INTERVAL = 10_000; // 10s
const MAX_BUFFER = 50;

interface FunnelEvent {
  event: string;
  ts: number;
  session_id: string;
  meta?: Record<string, string | number | boolean>;
}

let sessionId: string | null = null;
let buffer: FunnelEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

function getSessionId(): string {
  if (sessionId) return sessionId;
  try {
    const stored = sessionStorage.getItem('ir_session_id');
    if (stored) { sessionId = stored; return stored; }
  } catch { /* ignore */ }
  sessionId = crypto.randomUUID();
  try { sessionStorage.setItem('ir_session_id', sessionId); } catch { /* ignore */ }
  return sessionId;
}

export function trackEvent(event: string, meta?: Record<string, string | number | boolean>) {
  buffer.push({ event, ts: Date.now(), session_id: getSessionId(), meta });

  if (buffer.length >= MAX_BUFFER) {
    flushEvents();
  }

  if (!flushTimer) {
    flushTimer = setInterval(flushEvents, FLUSH_INTERVAL);
  }
}

export function flushEvents() {
  if (buffer.length === 0) return;
  const batch = [...buffer];
  buffer = [];

  // Fire-and-forget
  fetch(`${API_BASE}/api/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: batch }),
  }).catch(() => {
    // Put back on failure (best effort)
    buffer = [...batch, ...buffer].slice(-MAX_BUFFER);
  });
}

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushEvents();
  });
}
