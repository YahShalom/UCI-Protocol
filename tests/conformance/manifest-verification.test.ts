import { verifyManifest } from '@/lib/uci/kernel/crypto';
import { sign, verify } from '@/lib/uci/kernel/crypto';

describe('Manifest Verification', () => {
  it('should correctly verify a signed manifest', async () => {
    const manifest = {
      capability_id: "test-capability:1.0",
      // ... other manifest fields
    };
    const signature = await sign(JSON.stringify(manifest), "test-key"); // Replace with a real key
    const signedManifest = { ...manifest, signature };

    const isVerified = await verifyManifest(signedManifest, "test-key"); // Replace with a real key
    expect(isVerified).toBe(true);
  });
});
