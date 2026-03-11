import { CapabilityDescriptor } from "../uci/types";

async function execute(inputs: Record<string, unknown>): Promise<{ greeting: string }> {
  const name = typeof inputs.name === "string" ? inputs.name : "World";
  return { greeting: `Hello, ${name}!` };
}

export const capability: CapabilityDescriptor = {
  spec_version: "1.0",
  capability_id: "uci:local:hello-world",
  namespace: "uci.local",
  publisher: { id: "did:web:uci.local", name: "UCI Reference" },
  description: "A simple capability that returns a greeting.",
  trust: {
    verification_status: "verified",
    verification_method: "manual",
  },
  inputs_schema: {
    type: "object",
    properties: {
      name: { type: "string" },
    },
    required: ["name"],
  },
  outputs_schema: {
    type: "object",
    properties: {
      greeting: { type: "string" },
    },
  },
  execute,
};
