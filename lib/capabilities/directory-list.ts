import { CapabilityDescriptor } from "../uci/types";

async function execute(inputs: Record<string, unknown>): Promise<{ files: string[] }> {
  const path = typeof inputs.path === "string" ? inputs.path : ".";
  return { files: [`${path}/example.txt`] };
}

export const capability: CapabilityDescriptor = {
  spec_version: "1.0",
  capability_id: "uci:local:directory.list",
  namespace: "uci.local",
  publisher: { id: "did:web:uci.local", name: "UCI Reference" },
  description: "List files in a directory",
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
      files: {
        type: "array",
        items: { type: "string" },
      },
    },
  },
  bridge_metadata: {
    mcp_tool_name: "default_api.list_files",
  },
  execute,
};
