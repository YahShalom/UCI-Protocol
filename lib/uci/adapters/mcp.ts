import { AdapterResult, CapabilityDescriptor } from "../types";

export interface MCPToolSchema {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

export function convertToCapability(tool: MCPToolSchema): AdapterResult {
  const normalizedId = tool.name.replace(/^default_api\./, "").replace(/_/g, ".");
  const capability: CapabilityDescriptor = {
    spec_version: "1.0",
    capability_id: `uci:mcp:${normalizedId}`,
    namespace: "uci.mcp",
    publisher: { id: "did:web:uci.local", name: "UCI MCP Adapter" },
    description: tool.description ?? `Imported MCP tool ${tool.name}`,
    inputs_schema: tool.inputSchema ?? { type: "object", additionalProperties: true },
    outputs_schema: { type: "object", additionalProperties: true },
    trust: { verification_status: "manual", verification_method: "manual" },
    bridge_metadata: { mcp_tool_name: tool.name },
    execute: async () => {
      throw new Error(`MCP adapter imported descriptor ${tool.name} is metadata-only in v0.1`);
    },
  };

  return {
    capability,
    source: "mcp",
  };
}
