
import { createHash } from "crypto";
import { CapabilityDescriptor, CapabilityManifest, CapabilityTrustProfile, EvidenceStep, SignedCapabilityManifest } from "../types";
import { verifyManifest as verifyTrustManifest } from "../trust";
import nacl from "tweetnacl";
import { Buffer } from "buffer";

export async function generateKeyPair(): Promise<{ publicKey: Record<string, string>; privateKey: Record<string, string> }> {
  const keyPair = nacl.sign.keyPair();
  const publicKey = Buffer.from(keyPair.publicKey).toString("base64url");
  const privateKey = Buffer.from(keyPair.secretKey).toString("base64url");

  return {
    publicKey: { kty: "OKP", crv: "Ed25519", x: publicKey },
    privateKey: { kty: "OKP", crv: "Ed25519", d: privateKey },
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

export async function signManifest(manifest: CapabilityManifest, privateKey: { d: string }): Promise<SignedCapabilityManifest> {
  const payload = Buffer.from(JSON.stringify(manifest)).toString("base64url");
  const signature = nacl.sign.detached(
    Buffer.from(payload, "base64url"),
    Buffer.from(privateKey.d, "base64url")
  );

  return {
    payload,
    signatures: [
      {
        protected: Buffer.from(JSON.stringify({ alg: "EdDSA", key_id: "local" })).toString("base64url"),
        signature: Buffer.from(signature).toString("base64url"),
      },
    ],
  };
}

export async function signEvidenceStep(
  step: Omit<EvidenceStep, "signature">,
  privateKey: Record<string, string>
): Promise<string> {
  const keyMaterial = privateKey.d ?? "uci-local-private-key";
  return createHash("sha256").update(JSON.stringify(step) + keyMaterial).digest("base64url");
}
