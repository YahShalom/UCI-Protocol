import { getCapability } from "@/lib/uci/registry";

export async function executeLocalCapability(
  capabilityId: string,
  args: Record<string, unknown>
) {
  const capability = await getCapability(capabilityId);

  if (!capability) {
    return {
      ok: false,
      output: null,
      trace: [
        {
          step_id: "lookup",
          parent_step_ids: [],
          kind: "capability_lookup",
          detail: `Unknown tool: ${capabilityId}`,
        },
      ],
    };
  }

  try {
    const output = await capability.execute(args);
    return {
      ok: true,
      output,
      trace: [
        {
          step_id: "execute",
          parent_step_ids: ["lookup"],
          kind: "execution",
          detail: `Executed local ${capabilityId}`,
        },
      ],
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown execution error";
    return {
      ok: false,
      output: null,
      trace: [
        {
          step_id: "execute",
          parent_step_ids: ["lookup"],
          kind: "execution",
          detail: `Error executing ${capabilityId}: ${message}`,
        },
      ],
    };
  }
}
