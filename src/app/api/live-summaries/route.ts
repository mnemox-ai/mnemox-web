import { NextResponse } from 'next/server';
import { fetchAllStrategySummaries } from '@/lib/live-data';

export const revalidate = 60;

export async function GET() {
  try {
    const summaries = await fetchAllStrategySummaries();
    return NextResponse.json(summaries);
  } catch (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[live-summaries]', error instanceof Error ? error.message : error);
    }
    return NextResponse.json({ error: 'Failed to fetch strategy summaries' }, { status: 500 });
  }
}
