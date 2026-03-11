import { createHash } from "crypto";
import { CapabilityDescriptor, CapabilityManifest, CapabilityTrustProfile, EvidenceStep, SignedCapabilityManifest } from "../types";
import { verifyManifest as verifyTrustManifest } from "../trust";

export async function generateKeyPair(): Promise<{ publicKey: Record<string, string>; privateKey: Record<string, string> }> {
  return {
    publicKey: { kty: "OKP", crv: "Ed25519", x: "uci-local-public-key" },
    privateKey: { kty: "OKP", crv: "Ed25519", d: "uci-local-private-key" },
  };
}

export async function verifyManifest(
  signedManifest: SignedCapabilityManifest,
  trustProfile: CapabilityTrustProfile
): Promise<CapabilityDescriptor> {
  const manifest = verifyTrustManifest(signedManifest, trustProfile) as CapabilityManifest;
  return {
    ...manifest,
    execute: async () => {
      throw new Error(`Implementation missing for ${manifest.capability_id}`);
    },
  };
}

export async function signEvidenceStep(
  step: Omit<EvidenceStep, "signature">,
  privateKey: Record<string, string>
): Promise<string> {
  const keyMaterial = privateKey.d ?? "uci-local-private-key";
  return createHash("sha256").update(JSON.stringify(step) + keyMaterial).digest("base64url");
}
