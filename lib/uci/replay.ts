import { ReplayMismatch, ReplayResult, EvidenceChain, EvidenceStep } from "./types";
import { runCapability } from "./engine";

const replayStore = new Map<string, EvidenceChain>();

export function storeEvidenceChain(runId: string, chain: EvidenceChain): void {
  replayStore.set(runId, chain);
}

export function getStoredEvidenceChain(runId: string): EvidenceChain | null {
  return replayStore.get(runId) ?? null;
}

function parseJsonRecord(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null ? parsed as Record<string, unknown> : { value: parsed };
  } catch {
    return {};
  }
}

export async function replayRun(runId: string): Promise<ReplayResult> {
  const chain = getStoredEvidenceChain(runId);
  if (!chain) {
    return { run_id: runId, replay_status: "ERROR", steps_replayed: 0, mismatches: [{ step_id: "not-found", expected: {}, actual: {} }] };
  }

  const mismatches: ReplayMismatch[] = [];
  let stepsReplayed = 0;

  for (const step of chain.steps) {
    if (step.type !== "CAPABILITY_EXECUTION") continue;
    stepsReplayed += 1;
    try {
      const actual = await runCapability(step.capability_id, step.parameters);
      const expected = parseJsonRecord(step.output);
      const actualRecord = typeof actual === "object" && actual !== null ? actual as Record<string, unknown> : { value: actual };
      if (JSON.stringify(expected) !== JSON.stringify(actualRecord)) {
        mismatches.push({ step_id: step.evidence_step_id, expected, actual: actualRecord });
      }
    } catch (error) {
      mismatches.push({
        step_id: step.evidence_step_id,
        expected: parseJsonRecord(step.output),
        actual: { error: error instanceof Error ? error.message : "Unknown replay error" },
      });
    }
  }

  return {
    run_id: runId,
    replay_status: mismatches.length === 0 ? "MATCH" : "MISMATCH",
    steps_replayed: stepsReplayed,
    mismatches,
  };
}
