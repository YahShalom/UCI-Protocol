import { ExecutionPlan, IntentRequest } from "./types";
import { getCapability } from "./registry";
import { resolveRemoteCapability } from "./federation";
import { checkPolicy } from "./policy";

export async function resolveIntent(intentRequest: IntentRequest): Promise<ExecutionPlan> {
  if (intentRequest.policy) {
    const policyDecision = checkPolicy(intentRequest, intentRequest.policy);
    if (policyDecision.decision === "DENY") {
      throw new Error(`Policy violation: ${policyDecision.reason}`);
    }
  }

  const local = await getCapability(intentRequest.capability_id);

  if (local) {
    return {
      plan_id: intentRequest.request_id ?? `plan-${Date.now()}`,
      steps: [
        {
          step_id: "step-1",
          capability: intentRequest.capability_id,
          inputs: intentRequest.parameters,
          execution_mode: "local",
        },
      ],
    };
  }

  const remote = await resolveRemoteCapability(intentRequest.capability_id);
  if (remote) {
    return {
      plan_id: intentRequest.request_id ?? `plan-${Date.now()}`,
      steps: [
        {
          step_id: "step-1",
          capability: intentRequest.capability_id,
          inputs: intentRequest.parameters,
          execution_mode: "remote",
          remote_node_url: remote.remote_node_url,
        },
      ],
    };
  }

  return {
    plan_id: intentRequest.request_id ?? `plan-${Date.now()}`,
    steps: [
      {
        step_id: "step-1",
        capability: intentRequest.capability_id,
        inputs: intentRequest.parameters,
        execution_mode: "local",
      },
    ],
  };
}
