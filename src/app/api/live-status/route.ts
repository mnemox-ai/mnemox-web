import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveData, STRATEGIES } from '@/lib/live-data';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const strategy = request.nextUrl.searchParams.get('strategy') ?? 'strategy_e';

  if (!(strategy in STRATEGIES)) {
    return NextResponse.json({ error: `Unknown strategy: ${strategy}` }, { status: 400 });
  }

  try {
    const data = await fetchLiveData(strategy);
    return NextResponse.json(data);
  } catch (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[live-status]', error instanceof Error ? error.message : error);
    }
    return NextResponse.json({ error: 'Failed to fetch live data' }, { status: 500 });
  }
}
