import { CapabilityDescriptor } from "../uci/types";

async function execute(inputs: Record<string, unknown>): Promise<{ content: string }> {
  const path = typeof inputs.path === "string" ? inputs.path : "";
  if (!path) {
    throw new Error("file.read requires a string path");
  }
  return { content: `Mock read from ${path}` };
}

export const capability: CapabilityDescriptor = {
  spec_version: "1.0",
  capability_id: "uci:local:file.read",
  namespace: "uci.local",
  publisher: { id: "did:web:uci.local", name: "UCI Reference" },
  description: "A capability that reads the contents of a file.",
  trust: {
    verification_status: "verified",
    verification_method: "manual",
  },
  inputs_schema: {
    type: "object",
    properties: {
      path: { type: "string" },
    },
    required: ["path"],
  },
  outputs_schema: {
    type: "object",
    properties: {
      content: { type: "string" },
    },
  },
  bridge_metadata: {
    mcp_tool_name: "default_api.read_file",
  },
  execute,
};
