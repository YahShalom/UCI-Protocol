import { CapabilityDescriptor } from "../uci/types";

async function execute(inputs: Record<string, unknown>): Promise<{ status: string }> {
  const path = typeof inputs.path === "string" ? inputs.path : "";
  if (!path) {
    throw new Error("file.delete requires a string path");
  }
  return { status: "deleted" };
}

export const capability: CapabilityDescriptor = {
  spec_version: "1.0",
  capability_id: "uci:local:file.delete",
  namespace: "uci.local",
  publisher: { id: "did:web:uci.local", name: "UCI Reference" },
  description: "Delete a file from disk",
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
      status: { type: "string" },
    },
  },
  bridge_metadata: {
    mcp_tool_name: "default_api.delete_file",
  },
  execute,
};
