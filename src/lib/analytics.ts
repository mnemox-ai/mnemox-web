/** Funnel analytics — lightweight event buffer with flush to API */

import { API_BASE } from './config';

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
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let listenerAttached = false;

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

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushEvents();
    if (buffer.length > 0) scheduleFlush();
  }, FLUSH_INTERVAL);
}

export function trackEvent(event: string, meta?: Record<string, string | number | boolean>) {
  buffer.push({ event, ts: Date.now(), session_id: getSessionId(), meta });

  if (buffer.length >= MAX_BUFFER) {
    flushEvents();
  } else {
    scheduleFlush();
  }

  // Attach visibility listener once, lazily
  if (!listenerAttached && typeof window !== 'undefined') {
    listenerAttached = true;
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushEvents();
    });
  }
}

export function flushEvents() {
  if (buffer.length === 0) return;
  const batch = [...buffer];
  buffer = [];

  fetch(`${API_BASE}/api/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events: batch }),
  }).catch(() => {
    buffer = [...batch, ...buffer].slice(-MAX_BUFFER);
  });
}
