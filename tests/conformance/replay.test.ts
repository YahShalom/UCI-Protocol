import { replayEvidenceChain } from '@/lib/uci/replay';
import { createEvidenceChain, createEvidenceStep, appendEvidenceStep } from '@/lib/uci/evidence';

describe('Replay Correctness', () => {
  it('should correctly replay a simple evidence chain', async () => {
    const chain = createEvidenceChain("replay-test", "test-intent");
    const step1 = createEvidenceStep(chain, "string-manipulation-utility:1.0", { input: "hello" }, JSON.stringify({ output: "HELLO" }));
    appendEvidenceStep(chain, step1);

    const result = await replayEvidenceChain(chain);
    expect(result.replay_status).toBe("MATCH");
  });

  it('should detect a mismatch during replay', async () => {
    const chain = createEvidenceChain("replay-mismatch-test", "test-intent");
    const step1 = createEvidenceStep(chain, "string-manipulation-utility:1.0", { input: "hello" }, JSON.stringify({ output: "goodbye" }));
    appendEvidenceStep(chain, step1);

    const result = await replayEvidenceChain(chain);
    expect(result.replay_status).toBe("MISMATCH");
  });
});
