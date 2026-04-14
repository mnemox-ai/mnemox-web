import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { API_BASE } from '@/lib/config';

function hashIP(ip: string): string {
  return createHash('sha256').update(ip + (process.env.IP_HASH_SALT || 'mnemox')).digest('hex').slice(0, 16);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, ideaHash, score, ideaText } = body;

    // Validation
    const trimmedEmail = String(email || '').trim().slice(0, 200);
    const trimmedIdea = String(ideaText || '').trim().slice(0, 500);

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // IP hash
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    const ipHash = hashIP(ip);

    // 1. Save subscriber to Render backend (Turso)
    await fetch(`${API_BASE}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: trimmedEmail,
        idea_hash: ideaHash || '',
      }),
    }).catch(() => {});

    // 2. Trigger report generation (fire-and-forget, don't block response)
    const reportPromise = fetch(`${API_BASE}/api/unlock-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idea_text: trimmedIdea,
        language: 'en',
      }),
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        return data.report_id as string | undefined;
      }
      return undefined;
    }).catch(() => undefined);

    // 3. Discord webhook notification (don't block)
    const webhookUrl = process.env.DISCORD_SERVICES_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: '\u{1F4E7} New Idea Check Subscriber',
            color: 0x00e5ff,
            fields: [
              { name: 'Email', value: trimmedEmail, inline: true },
              { name: 'Score', value: String(score ?? '?'), inline: true },
              { name: 'Idea', value: trimmedIdea.slice(0, 200) || '(empty)' },
              { name: 'IP Hash', value: ipHash.slice(0, 8), inline: true },
            ],
            timestamp: new Date().toISOString(),
          }],
        }),
      }).catch(() => {});
    }

    // 4. Send email with report link via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const reportId = await reportPromise;
      const reportUrl = reportId
        ? `${API_BASE}/report/${reportId}/pdf`
        : `https://mnemox.ai/check`;

      const ideaPreview = trimmedIdea.length > 40
        ? trimmedIdea.slice(0, 40) + '...'
        : trimmedIdea || 'your idea';

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Mnemox AI <noreply@mnemox.ai>',
          to: [trimmedEmail],
          subject: `Your Idea Reality Report: ${ideaPreview}`,
          html: `
            <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 24px; color: #e0e0e8; margin: 0;">Idea Reality Report</h1>
                <p style="color: #6a6a80; font-size: 14px; margin-top: 8px;">Your pre-build reality check is ready.</p>
              </div>

              <div style="background: #0b1120; border: 1px solid #1a1a28; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <p style="color: #6a6a80; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Reality Signal</p>
                <p style="font-size: 48px; font-weight: bold; color: ${score >= 60 ? '#ff3366' : score >= 30 ? '#ffaa00' : '#00ff88'}; margin: 0;">${score ?? '?'}</p>
                <p style="color: #6a6a80; font-size: 13px; margin-top: 8px;">${trimmedIdea}</p>
              </div>

              ${reportId ? `
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="${reportUrl}" style="display: inline-block; background: #00e5ff; color: #000; font-weight: 700; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 15px;">
                  Download Full Report
                </a>
                <p style="color: #6a6a80; font-size: 12px; margin-top: 12px;">Includes competitor breakdown, market gaps, and pivot strategies.</p>
              </div>
              ` : `
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="https://mnemox.ai/check" style="display: inline-block; background: #00e5ff; color: #000; font-weight: 700; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-size: 15px;">
                  Check Another Idea
                </a>
              </div>
              `}

              <div style="text-align: center; border-top: 1px solid #1a1a28; padding-top: 20px;">
                <p style="color: #3a3a50; font-size: 11px;">
                  Mnemox AI &mdash; Tools for AI agents<br/>
                  <a href="https://mnemox.ai" style="color: #3a3a50;">mnemox.ai</a>
                </p>
              </div>
            </div>
          `,
        }),
      }).catch((err) => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Resend email failed:', err);
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Subscribe API error:', err);
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
