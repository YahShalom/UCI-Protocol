import { CapabilityDescriptor, CapabilityTrustProfile, EvidenceChain, IntentRequest, Outcome, PolicyDecision } from "../types";
import { checkPolicy } from "../policy";
import { verifyManifest, signEvidenceStep, generateKeyPair } from "./crypto";
import { LocalRegistry } from "./registry";
import { CapabilityRegistry, ExecutionResult, UCIKernel } from "./types";
import { createEvidenceChain, createEvidenceStep, appendEvidenceStep } from "../evidence";
import { resolveIntent } from "../resolver";
import { storeEvidenceChain } from "../store";
import nacl from "tweetnacl";
import { Buffer } from "buffer";

const DEFAULT_TRUST_PROFILE: CapabilityTrustProfile = {
  verification_status: "verified",
  verification_method: "manual",
  trusted_publishers: [
    {
      publisher_id: "did:web:uci.local",
      key_id: "uci-local-key-1",
      verification_method: "manual",
      public_key: "uci-local-public-key",
      domain: "uci.local",
    },
  ],
};

const keyPair = nacl.sign.keyPair();
const publicKey = Buffer.from(keyPair.publicKey).toString("base64url");
const privateKey = Buffer.from(keyPair.secretKey).toString("base64url");

const DEFAULT_SIGNING_KEY = { kty: "OKP", crv: "Ed25519", x: publicKey, d: privateKey };

export class UCIKernelImpl implements UCIKernel {
  private readonly registry: CapabilityRegistry;
  private readonly trustProfile: CapabilityTrustProfile;
  private readonly signingKey: Record<string, string>;

  constructor(
    registry: CapabilityRegistry = new LocalRegistry(),
    trustProfile: CapabilityTrustProfile = DEFAULT_TRUST_PROFILE,
    signingKey: Record<string, string> = DEFAULT_SIGNING_KEY
  ) {
    this.registry = registry;
    this.trustProfile = trustProfile;
    this.signingKey = signingKey;
  }

  getRegistry(): CapabilityRegistry {
    return this.registry;
  }

  async execute(intent: IntentRequest): Promise<ExecutionResult> {
    const runId = intent.request_id ?? `run-${Date.now()}`;
    const evidenceChain = createEvidenceChain(intent, runId);

    try {
      const plan = await resolveIntent(intent);
      appendEvidenceStep(evidenceChain, await this.signedStep(createEvidenceStep({
        type: "PLAN_RESOLUTION",
        capability_id: intent.capability_id,
        input: JSON.stringify(intent),
        output: JSON.stringify(plan),
        parameters: intent.parameters,
      })));

      let finalResult: unknown = null;
      let parentId = evidenceChain.steps[evidenceChain.steps.length - 1]?.evidence_step_id ?? evidenceChain.chain_id;

      for (const plannedStep of plan.steps) {
        if (plannedStep.execution_mode === "remote" && plannedStep.remote_node_url) {
          appendEvidenceStep(evidenceChain, await this.signedStep(createEvidenceStep({
            parent_step_ids: [parentId],
            type: "REMOTE_RESOLUTION",
            capability_id: plannedStep.capability,
            input: JSON.stringify(plannedStep.inputs),
            output: JSON.stringify({ remote_node_url: plannedStep.remote_node_url, resolved: true }),
            parameters: plannedStep.inputs,
          })));
          parentId = evidenceChain.steps[evidenceChain.steps.length - 1].evidence_step_id;
          finalResult = { remote_execution_planned: true, remote_node_url: plannedStep.remote_node_url, capability_id: plannedStep.capability };
          continue;
        }

        const { descriptor, execute } = await this.getAndVerifyCapability(plannedStep.capability);
        appendEvidenceStep(evidenceChain, await this.signedStep(createEvidenceStep({
          parent_step_ids: [parentId],
          type: "SYSTEM_LOG",
          capability_id: plannedStep.capability,
          input: JSON.stringify({ lookup: plannedStep.capability }),
          output: JSON.stringify({ resolved: true }),
          parameters: plannedStep.inputs,
        })));
        parentId = evidenceChain.steps[evidenceChain.steps.length - 1].evidence_step_id;

        const policyDecision = this.enforcePolicy(descriptor, intent);
        appendEvidenceStep(evidenceChain, await this.signedStep(createEvidenceStep({
          parent_step_ids: [parentId],
          type: "POLICY_CHECK",
          capability_id: plannedStep.capability,
          input: JSON.stringify(policyDecision),
          output: JSON.stringify({ decision: policyDecision.decision }),
          parameters: plannedStep.inputs,
        })));
        parentId = evidenceChain.steps[evidenceChain.steps.length - 1].evidence_step_id;

        if (policyDecision.decision === "DENY") {
          const deniedOutcome: Outcome = {
            outcome_id: `out-denied-${runId}`,
            status: "DENIED",
            error: `Policy violation: ${policyDecision.reason}`,
          };
          storeEvidenceChain(runId, evidenceChain);
          return { outcome: deniedOutcome, evidenceChain };
        }

        finalResult = await execute(plannedStep.inputs);
        appendEvidenceStep(evidenceChain, await this.signedStep(createEvidenceStep({
          parent_step_ids: [parentId],
          type: "CAPABILITY_EXECUTION",
          capability_id: plannedStep.capability,
          input: JSON.stringify(plannedStep.inputs),
          output: JSON.stringify(finalResult),
          parameters: plannedStep.inputs,
        })));
        parentId = evidenceChain.steps[evidenceChain.steps.length - 1].evidence_step_id;
      }

      const outcome: Outcome = {
        outcome_id: `out-${runId}`,
        status: "SUCCESS",
        result: finalResult,
      };
      storeEvidenceChain(runId, evidenceChain);
      return { outcome, evidenceChain };
    } catch (error) {
      const outcome: Outcome = {
        outcome_id: `out-error-${runId}`,
        status: "ERROR",
        error: error instanceof Error ? error.message : "Unknown execution error",
      };
      storeEvidenceChain(runId, evidenceChain);
      return { outcome, evidenceChain };
    }
  }

  private async getAndVerifyCapability(capabilityId: string): Promise<{ descriptor: CapabilityDescriptor; execute: (params: Record<string, unknown>) => Promise<unknown> }> {
    const signedManifest = await this.registry.getCapabilityManifest(capabilityId);
    if (!signedManifest) {
      throw new Error(`Capability manifest not found in registry: ${capabilityId}`);
    }

    const descriptor = await verifyManifest(signedManifest, this.trustProfile);
    const execute = await this.registry.getCapabilityImplementation(capabilityId);
    if (!execute) {
      throw new Error(`Capability implementation not found in registry: ${capabilityId}`);
    }

    return { descriptor, execute };
  }

  private enforcePolicy(capability: CapabilityDescriptor, intent: IntentRequest): PolicyDecision {
    if (!intent.policy) {
      return {
        decision: "ALLOW",
        reason: "No policy specified.",
      };
    }
    return checkPolicy(intent, intent.policy) ?? {
      decision: "ALLOW",
      reason: "No applicable policy.",
    };
  }

  private async signedStep(step: ReturnType<typeof createEvidenceStep>) {
    return { ...step, signature: await signEvidenceStep(step, this.signingKey) };
  }
}
