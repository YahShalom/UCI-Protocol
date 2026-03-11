import { createEvidenceChain, createEvidenceStep, appendEvidenceStep } from '@/lib/uci/evidence';
import { signEvidenceStep, verifyEvidenceStep } from '@/lib/uci/kernel/crypto';

describe('EvidenceChain Integrity', () => {
  it('should create and verify a signed evidence chain', async () => {
    const chain = createEvidenceChain("test-run", "test-intent");
    const step = createEvidenceStep(chain, "test-capability", {}, "output");
    const signedStep = await signEvidenceStep(step, "test-key"); // Replace with a real key in a real scenario
    appendEvidenceStep(chain, signedStep);

    const isVerified = await verifyEvidenceStep(signedStep, "test-key"); // Replace with a real key
    expect(isVerified).toBe(true);
  });
});
