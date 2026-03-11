import { EvidenceChain, EvidenceStep, IntentRequest } from "./types";

export function createEvidenceChain(intent: IntentRequest, chainId?: string): EvidenceChain {
  const id = chainId ?? `chain-${Date.now()}`;
  return {
    chain_id: id,
    evidence_step_id: id,
    intent_request: intent,
    steps: [],
  };
}

export function createEvidenceStep(input: {
  evidence_step_id?: string;
  parent_step_ids?: string[];
  type: EvidenceStep["type"];
  capability_id: string;
  input?: string;
  output?: string;
  parameters?: Record<string, unknown>;
  node_id?: string;
}): EvidenceStep {
  return {
    evidence_step_id: input.evidence_step_id ?? `ev-step-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
    parent_step_ids: input.parent_step_ids ?? [],
    timestamp: new Date().toISOString(),
    type: input.type,
    capability_id: input.capability_id,
    input: input.input ?? "",
    output: input.output ?? "",
    parameters: input.parameters ?? {},
    node_id: input.node_id ?? "uci.local.node",
  };
}

export function appendEvidenceStep(chain: EvidenceChain, step: EvidenceStep): EvidenceChain {
  chain.steps.push(step);
  return chain;
}
