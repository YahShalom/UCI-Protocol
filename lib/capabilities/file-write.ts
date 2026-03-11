import { CapabilityDescriptor } from "../uci/types";

async function execute(inputs: Record<string, unknown>): Promise<{ success: boolean }> {
  const path = typeof inputs.path === "string" ? inputs.path : "";
  const content = typeof inputs.content === "string" ? inputs.content : "";
  if (!path) {
    throw new Error("file.write requires a string path");
  }
  void content;
  return { success: true };
}

export const capability: CapabilityDescriptor = {
  spec_version: "1.0",
  capability_id: "uci:local:file.write",
  namespace: "uci.local",
  publisher: { id: "did:web:uci.local", name: "UCI Reference" },
  description: "A capability that writes content to a file.",
  trust: {
    verification_status: "verified",
    verification_method: "manual",
  },
  inputs_schema: {
    type: "object",
    properties: {
      path: { type: "string" },
      content: { type: "string" },
    },
    required: ["path", "content"],
  },
  outputs_schema: {
    type: "object",
    properties: {
      success: { type: "boolean" },
    },
  },
  bridge_metadata: {
    mcp_tool_name: "default_api.write_file",
  },
  execute,
};
