import { NextResponse } from 'next/server';
import { fetchAllStrategySummaries } from '@/lib/live-data';

export const revalidate = 60;

export async function GET() {
  try {
    const summaries = await fetchAllStrategySummaries();
    return NextResponse.json(summaries);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
