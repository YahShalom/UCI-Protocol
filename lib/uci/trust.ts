
import { createHash } from "crypto";
import { CapabilityManifest, CapabilityTrustProfile, SignedCapabilityManifest } from "./types";
import { getTrustRoot, isTrustedPublisher } from "./trustRoot";
import nacl from "tweetnacl";
import { Buffer } from "buffer";

export function verifyManifestSignature(manifest: SignedCapabilityManifest, signature: string, publicKey: string): boolean {
  const payload = manifest.payload;
  return nacl.sign.detached.verify(
    Buffer.from(payload, "base64url"),
    Buffer.from(signature, "base64url"),
    Buffer.from(publicKey, "base64url")
  );
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
  const signature = manifest.signatures[0]?.signature;
  const trustedPublisher = verifyCapabilityPublisher(payload.publisher.id, header.key_id);
  const effectiveTrust = trustProfile ?? payload.trust ?? {};

  let signatureValid = false;
  if (signature && signature !== "unsigned" && header.alg === "EdDSA") {
    // Assuming a way to get the public key from the keyId
    // This is a placeholder for the actual public key retrieval mechanism
    const publicKey = ""; // Replace with actual public key
    signatureValid = verifyManifestSignature(manifest, signature, publicKey);
  } else if (signature === "unsigned" || (header.alg === "mock-sha256" && signature)) {
    signatureValid = true; // For unsigned manifests or mock signatures
  }

  if (!signatureValid) {
    throw new Error(`Invalid manifest signature for ${payload.capability_id}`);
  }

  payload.trust = {
    ...effectiveTrust,
    verification_status: trustedPublisher ? "verified" : (payload.trust?.verification_status ?? "unverified"),
    verification_method: payload.trust?.verification_method ?? (trustedPublisher ? "manual" : "manual"),
    trusted_publishers: getTrustRoot(),
    publisher_signature: signature,
  };

  return payload;
}
