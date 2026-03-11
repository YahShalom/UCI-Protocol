'use client'

import { प्रमाण } from "@/lib/pramaan/pramaan";
import { Capability, runCapability } from "@/lib/uci/capability";
import { EvidenceChain, EvidenceStep } from "@/lib/uci/evidence";

/**
 * A constant representing the context of a replay operation.
 */
export const REPLAY_CONTEXT = "replay";

/**
 * Represents the result of a replay mismatch, detailing the step, expected output, and actual output.
 */
export interface ReplayMismatch {
    step_id: string;
    expected: Record<string, unknown>;
    actual: Record<string, unknown>;
}

/**
 * Represents the outcome of a replay, including the status and any mismatches found.
 */
export interface ReplayResult {
    replay_status: "MATCH" | "MISMATCH";
    mismatches: ReplayMismatch[];
}

export function parseJsonRecord(json: string | object): Record<string, unknown> {
    if (typeof json === 'string') {
        try {
            return JSON.parse(json);
        } catch {
            return { value: json };
        }
    }
    return json as Record<string, unknown>;
}


export async function replayEvidenceChain(chain: EvidenceChain): Promise<ReplayResult> {
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
        replay_status: mismatches.length === 0 ? "MATCH" : "MISMATCH",
        mismatches,
    };
}