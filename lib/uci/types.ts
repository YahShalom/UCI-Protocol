export interface Publisher {
  id: string;
  name: string;
  org_id?: string;
  origin?: string;
}

export interface TrustRootEntry {
  publisher_id: string;
  key_id: string;
  verification_method: "manual" | "domain_verification" | "cryptographic";
  public_key?: string;
  domain?: string;
}

export interface CapabilityTrustProfile {
  verification_status?: "verified" | "official" | "unverified" | "manual";
  verification_method?: "manual" | "domain_verification" | "cryptographic" | string;
  publisher_signature?: string;
  evidence_profile?: string;
  trusted_publishers?: TrustRootEntry[];
}

export interface CapabilityManifest {
  spec_version: string;
  capability_id: string;
  namespace: string;
  publisher: Publisher;
  description: string;
  inputs_schema: Record<string, unknown>;
  outputs_schema: Record<string, unknown>;
  trust?: CapabilityTrustProfile;
}

export interface SignedCapabilityManifest {
  payload: string;
  signatures: {
    protected: string;
    signature: string;
  }[];
}

export interface PolicyDecision {
  decision: "ALLOW" | "DENY";
  reason: string;
}

export interface StringConstraint {
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  equals?: string;
  matchesRegex?: string;
}

export interface ParameterConstraints {
  [parameterName: string]: StringConstraint;
}

export interface PolicyConstraints {
  allowed_capabilities?: string[];
  parameterConstraints?: ParameterConstraints;
  [key: string]: unknown;
}

export interface PolicyEnvelope {
  constraints: PolicyConstraints;
}

export interface IntentRequest {
  request_id?: string;
  capability_id: string;
  parameters: Record<string, unknown>;
  policy?: PolicyEnvelope;
}

export interface CapabilityDescriptor extends CapabilityManifest {
  execute: (params: Record<string, unknown>) => Promise<unknown>;
  bridge_metadata?: {
    mcp_tool_name?: string;
    [key: string]: unknown;
  };
}

export interface EvidenceStep {
  evidence_step_id: string;
  parent_step_ids: string[];
  timestamp: string;
  type: "POLICY_CHECK" | "CAPABILITY_EXECUTION" | "SYSTEM_LOG" | "PLAN_RESOLUTION" | "REMOTE_RESOLUTION" | "REPLAY";
  capability_id: string;
  input: string;
  output: string;
  parameters: Record<string, unknown>;
  node_id?: string;
  signature?: string;
}

export interface EvidenceChain {
  chain_id: string;
  evidence_step_id?: string; // legacy compatibility
  intent_request: IntentRequest;
  steps: EvidenceStep[];
}

export interface Outcome {
  outcome_id: string;
  status: "SUCCESS" | "ERROR" | "DENIED";
  result?: unknown;
  error?: string;
}

export interface ExecutionPlanStep {
  step_id: string;
  capability: string;
  inputs: Record<string, unknown>;
  execution_mode?: "local" | "remote";
  remote_node_url?: string;
}

export interface ExecutionPlan {
  plan_id: string;
  steps: ExecutionPlanStep[];
}

export interface ReplayMismatch {
  step_id: string;
  expected: Record<string, unknown>;
  actual: Record<string, unknown>;
}

export interface ReplayResult {
  run_id: string;
  replay_status: "MATCH" | "MISMATCH" | "ERROR";
  steps_replayed: number;
  mismatches: ReplayMismatch[];
}

export interface RemoteCapabilityDescriptor {
  capability_id: string;
  remote_node_url: string;
  discovery_url: string;
  version: string;
  publisher: {
    org_id: string;
    name: string;
  };
  trust: CapabilityTrustProfile;
}

export interface MarketplaceCapability {
  capability_id: string;
  version: string;
  publisher: {
    org_id: string;
    name: string;
  };
  category: string;
  description: string;
  tags?: string[];
  pricing?: {
    model: string;
    amount?: number;
    currency?: string;
  };
  trust?: CapabilityTrustProfile;
  discovery?: {
    public?: boolean;
    marketplace_tags?: string[];
  };
}

export interface AdapterResult {
  capability: CapabilityDescriptor;
  source: string;
}
