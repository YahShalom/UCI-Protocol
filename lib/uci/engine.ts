
import { getCapability } from "./registry";
import { ExecutionPlan, IntentRequest, Outcome } from "./types";

export async function runCapability(capabilityId: string, inputs: Record<string, unknown>) {
  const capability = await getCapability(capabilityId);
  if (!capability) {
    throw new Error(`Capability not found: ${capabilityId}`);
  }
  return capability.execute(inputs);
}

export async function executePlan(plan: ExecutionPlan, intentRequest: IntentRequest): Promise<Outcome[]> {
  const outcomes: Outcome[] = [];
  for (const step of plan.steps) {
    if (step.execution_mode === "remote" && step.remote_node_url) {
      const response = await fetch(`${step.remote_node_url}/api/uci/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...intentRequest, capability_id: step.capability, parameters: step.inputs }),
      });
      const outcome = await response.json();
      outcomes.push(outcome);
    } else {
      const result = await runCapability(step.capability, step.inputs);
      outcomes.push({
        outcome_id: `outcome-${Date.now()}`,
        status: "SUCCESS",
        result,
      });
    }
  }
  return outcomes;
}
