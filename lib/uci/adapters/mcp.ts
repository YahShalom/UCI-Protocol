
import { AdapterResult, CapabilityDescriptor, Outcome } from "../types";

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
    execute: async (params: Record<string, unknown>): Promise<Outcome> => {
      // This is a placeholder for the actual MCP tool execution.
      // In a real implementation, this would call the MCP tool and return the result.
      console.log(`Executing MCP tool ${tool.name} with params:`, params);
      return {
        outcome_id: `outcome-${Date.now()}`,
        status: "SUCCESS",
        result: { message: "MCP tool executed successfully" },
      };
    },
  };

  return {
    capability,
    source: "mcp",
  };
}
