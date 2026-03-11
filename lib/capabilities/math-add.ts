import { CapabilityDescriptor } from "../uci/types";

async function execute(inputs: Record<string, unknown>): Promise<{ result: number }> {
  const a = Number(inputs.a);
  const b = Number(inputs.b);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    throw new Error("math.add requires numeric inputs 'a' and 'b'");
  }

  return { result: a + b };
}

export const capability: CapabilityDescriptor = {
  spec_version: "1.0",
  capability_id: "uci:local:math.add",
  namespace: "uci.local",
  publisher: { id: "did:web:uci.local", name: "UCI Reference" },
  description: "A simple capability that adds two numbers.",
  trust: {
    verification_status: "verified",
    verification_method: "manual",
  },
  inputs_schema: {
    type: "object",
    properties: {
      a: { type: "number" },
      b: { type: "number" },
    },
    required: ["a", "b"],
  },
  outputs_schema: {
    type: "object",
    properties: {
      result: { type: "number" },
    },
  },
  execute,
};
