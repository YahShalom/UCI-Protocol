import { createHash } from "crypto";
import { CapabilityManifest, CapabilityTrustProfile, SignedCapabilityManifest } from "./types";
import { getTrustRoot, isTrustedPublisher } from "./trustRoot";

export function signManifestPayload(payload: string, keyId: string): string {
  return createHash("sha256").update(`${payload}:${keyId}`).digest("base64url");
}

export function decodeProtectedHeader(manifest: SignedCapabilityManifest): { alg?: string; key_id?: string; typ?: string } {
  const encoded = manifest.signatures[0]?.protected;
  if (!encoded) return {};
  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return {};
  }
}

export function verifyCapabilityPublisher(publisherId: string, keyId?: string): boolean {
  return isTrustedPublisher(publisherId, keyId);
}

export function validatePublisherDomain(domain: string): boolean {
  return getTrustRoot().some((entry) => entry.domain === domain);
}

export function evaluateCapabilityTrust(trust: CapabilityTrustProfile): "trusted" | "unverified" {
  if (trust.verification_status === "verified" || trust.verification_status === "official") {
    return "trusted";
  }
  return "unverified";
}

export function verifyManifest(manifest: SignedCapabilityManifest, trustProfile?: CapabilityTrustProfile): CapabilityManifest {
  const payload = JSON.parse(Buffer.from(manifest.payload, "base64url").toString("utf8")) as CapabilityManifest;
  const header = decodeProtectedHeader(manifest);
  const expected = signManifestPayload(manifest.payload, header.key_id ?? "");
  const actual = manifest.signatures[0]?.signature;
  const trustedPublisher = verifyCapabilityPublisher(payload.publisher.id, header.key_id);
  const effectiveTrust = trustProfile ?? payload.trust ?? {};

  if (header.alg && header.alg !== "mock-sha256") {
    throw new Error(`Unsupported manifest algorithm: ${header.alg}`);
  }

  if (actual !== expected && actual !== "unsigned") {
    throw new Error(`Invalid manifest signature for ${payload.capability_id}`);
  }

  payload.trust = {
    ...effectiveTrust,
    verification_status: trustedPublisher ? "verified" : (payload.trust?.verification_status ?? "unverified"),
    verification_method: payload.trust?.verification_method ?? (trustedPublisher ? "manual" : "manual"),
    trusted_publishers: getTrustRoot(),
    publisher_signature: actual,
  };

  return payload;
}
