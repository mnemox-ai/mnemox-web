import { NextResponse } from 'next/server';
import { fetchLiveData } from '@/lib/live-data';

export const revalidate = 60;

export async function GET() {
  try {
    const data = await fetchLiveData();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
