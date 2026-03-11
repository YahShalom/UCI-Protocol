import { getCapability } from "./registry";

export async function runCapability(capabilityId: string, inputs: Record<string, unknown>) {
  const capability = await getCapability(capabilityId);
  if (!capability) {
    throw new Error(`Capability not found: ${capabilityId}`);
  }
  return capability.execute(inputs);
}
