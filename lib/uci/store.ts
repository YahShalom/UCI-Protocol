import { EvidenceChain } from './evidence';

const evidenceChainStore: Map<string, EvidenceChain> = new Map();

export function storeEvidenceChain(id: string, chain: EvidenceChain): void {
  evidenceChainStore.set(id, chain);
}

export function getEvidenceChain(id: string): EvidenceChain | undefined {
  return evidenceChainStore.get(id);
}
