import { NextResponse } from 'next/server';
import { replayRun } from '@/lib/uci/replay';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { evidence_chain_id } = body;

    if (!evidence_chain_id) {
      return NextResponse.json({ error: 'evidence_chain_id is required' }, { status: 400 });
    }

    const result = await replayRun(evidence_chain_id);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
