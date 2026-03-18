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
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
