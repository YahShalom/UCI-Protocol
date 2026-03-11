import { EvidenceChain, IntentRequest, Outcome, SignedCapabilityManifest } from "../types";

export type CapabilityImplementation = (params: Record<string, unknown>) => Promise<unknown>;

export interface CapabilityRegistry {
  getCapabilityManifest(capabilityId: string): Promise<SignedCapabilityManifest | null>;
  getCapabilityImplementation(capabilityId: string): Promise<CapabilityImplementation | null>;
  getCapabilityManifests(): Promise<SignedCapabilityManifest[]>;
  registerCapability(manifest: SignedCapabilityManifest, implementation: CapabilityImplementation): Promise<void>;
}

export interface ExecutionResult {
  outcome: Outcome;
  evidenceChain: EvidenceChain;
}

export interface UCIKernel {
  execute(intent: IntentRequest): Promise<ExecutionResult>;
  getRegistry(): CapabilityRegistry;
}
