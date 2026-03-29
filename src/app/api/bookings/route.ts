import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';

const VALID_PLATFORMS = ['mt5', 'binance', 'ib', 'other'];
const VALID_TIERS = ['audit', 'system', 'warroom', 'unsure'];
const TIER_LABELS: Record<string, string> = {
  audit: 'Decision Audit Trail ($5K)',
  system: 'AI Trading System ($20K)',
  warroom: 'AI War Room ($50K+)',
  unsure: 'Not Sure Yet',
};
const PLATFORM_LABELS: Record<string, string> = {
  mt5: 'MetaTrader 5',
  binance: 'Binance',
  ib: 'Interactive Brokers',
  other: 'Other',
};

function hashIP(ip: string): string {
  return createHash('sha256').update(ip + (process.env.IP_HASH_SALT || 'mnemox')).digest('hex').slice(0, 16);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, platform, service_tier, description } = body;

    // Validation
    if (!name || !email || !platform || !service_tier || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const trimmedName = String(name).trim().slice(0, 100);
    const trimmedEmail = String(email).trim().slice(0, 200);
    const trimmedDesc = String(description).trim().slice(0, 500);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (!VALID_PLATFORMS.includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    if (!VALID_TIERS.includes(service_tier)) {
      return NextResponse.json({ error: 'Invalid service tier' }, { status: 400 });
    }

    // IP hash for rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    const ipHash = hashIP(ip);

    // Rate limit via Supabase (3 per day per IP)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const today = new Date().toISOString().slice(0, 10);

      // Count today's submissions from this IP
      const countRes = await fetch(
        `${supabaseUrl}/rest/v1/service_inquiries?ip_hash=eq.${ipHash}&created_at=gte.${today}T00:00:00Z&select=id`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );

      if (countRes.ok) {
        const rows = await countRes.json();
        if (Array.isArray(rows) && rows.length >= 3) {
          return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
        }
      }

      // Insert
      const insertRes = await fetch(`${supabaseUrl}/rest/v1/service_inquiries`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          platform,
          service_tier,
          description: trimmedDesc,
          ip_hash: ipHash,
        }),
      });

      if (!insertRes.ok) {
        console.error('Supabase insert failed:', insertRes.status, await insertRes.text());
      }
    }

    // Discord webhook notification
    const webhookUrl = process.env.DISCORD_SERVICES_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [
            {
              title: '🔔 New Service Inquiry',
              color: 0x00e5ff,
              fields: [
                { name: 'Name', value: trimmedName, inline: true },
                { name: 'Email', value: trimmedEmail, inline: true },
                { name: 'Platform', value: PLATFORM_LABELS[platform] || platform, inline: true },
                { name: 'Service Tier', value: TIER_LABELS[service_tier] || service_tier, inline: true },
                { name: 'Description', value: trimmedDesc.slice(0, 1024) },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      }).catch((err) => {
        console.error('Discord webhook failed:', err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Booking API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
