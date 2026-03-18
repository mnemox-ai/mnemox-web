import { NextResponse } from 'next/server';
import { fetchAllStrategySummaries } from '@/lib/live-data';

export const revalidate = 60;

export async function GET() {
  try {
    const summaries = await fetchAllStrategySummaries();
    return NextResponse.json(summaries);
  } catch (error) {
    console.error('[live-summaries]', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to fetch strategy summaries' }, { status: 500 });
  }
}
