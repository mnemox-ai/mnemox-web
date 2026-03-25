import { NextResponse } from 'next/server';
import turso from '@/lib/turso';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 min ISR cache

export async function GET() {
  try {
    // Weekly volume (last 12 weeks)
    const weeklyResult = await turso.execute(
      "SELECT strftime('%Y-W%W', created_at) as week, COUNT(*) as count FROM score_history GROUP BY week ORDER BY week"
    );
    const weekly_volume = weeklyResult.rows.slice(-12).map((r) => ({
      week: String(r.week),
      count: Number(r.count),
    }));

    // Top keywords (parse JSON from keywords column, limited to recent 500 rows)
    const kwResult = await turso.execute({
      sql: 'SELECT keywords FROM score_history ORDER BY created_at DESC LIMIT ?',
      args: [500],
    });
    const freq: Record<string, number> = {};
    for (const row of kwResult.rows) {
      try {
        const kws = JSON.parse(String(row.keywords));
        if (Array.isArray(kws)) {
          for (const kw of kws) {
            if (typeof kw === 'string' && kw.trim()) {
              const key = kw.trim().toLowerCase();
              freq[key] = (freq[key] || 0) + 1;
            }
          }
        }
      } catch {
        // skip malformed JSON
      }
    }
    const top_keywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([keyword, count]) => ({ keyword, count }));

    // Country distribution
    const countryResult = await turso.execute(
      "SELECT country, COUNT(*) as count FROM query_log WHERE country IS NOT NULL GROUP BY country ORDER BY count DESC"
    );
    const countries = countryResult.rows.map((r) => ({
      country: String(r.country),
      count: Number(r.count),
    }));

    // Trending ideas (recent high scores)
    const trendingResult = await turso.execute({
      sql: 'SELECT idea_text, score, created_at FROM score_history WHERE score >= ? ORDER BY created_at DESC LIMIT ?',
      args: [60, 10],
    });
    const trending_ideas = trendingResult.rows.map((r) => {
      const text = String(r.idea_text ?? '');
      return {
        idea_text: text.length > 60 ? text.slice(0, 60) + '...' : text,
        score: Number(r.score),
        created_at: String(r.created_at),
      };
    });

    // Total ideas
    const totalResult = await turso.execute('SELECT COUNT(*) as cnt FROM score_history');
    const total_ideas = Number(totalResult.rows[0]?.cnt ?? 0);

    return NextResponse.json({
      weekly_volume,
      top_keywords,
      countries,
      trending_ideas,
      total_ideas,
      total_countries: countries.length,
    });
  } catch (error) {
    console.error('[api/pulse]', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to fetch pulse data' }, { status: 500 });
  }
}
