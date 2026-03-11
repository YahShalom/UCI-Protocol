import { NextResponse } from 'next/server';
import { replayEvidenceChain } from '@/lib/uci/replay';
import { getEvidenceChain } from '@/lib/uci/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { evidence_chain_id } = body;

    if (!evidence_chain_id) {
      return NextResponse.json({ error: 'evidence_chain_id is required' }, { status: 400 });
    }

    const chain = await getEvidenceChain(evidence_chain_id);
    if (!chain) {
      return NextResponse.json({ error: 'Evidence chain not found' }, { status: 404 });
    }

    const result = await replayEvidenceChain(chain);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
