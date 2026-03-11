import { SignedCapabilityManifest } from "../types";
import { getCapabilityDescriptor, listSignedCapabilityManifests } from "../manifests";
import { CapabilityImplementation, CapabilityRegistry } from "./types";

export class LocalRegistry implements CapabilityRegistry {
  async getCapabilityManifest(capabilityId: string): Promise<SignedCapabilityManifest | null> {
    return getSignedCapabilityManifestOrNull(capabilityId);
  }

  async getCapabilityImplementation(capabilityId: string): Promise<CapabilityImplementation | null> {
    const descriptor = getCapabilityDescriptor(capabilityId);
    return descriptor?.execute ?? null;
  }

  async getCapabilityManifests(): Promise<SignedCapabilityManifest[]> {
    return listSignedCapabilityManifests();
  }

  async registerCapability(_manifest: SignedCapabilityManifest, _implementation: CapabilityImplementation): Promise<void> {
    return;
  }
}

function getSignedCapabilityManifestOrNull(capabilityId: string): SignedCapabilityManifest | null {
  const manifest = listSignedCapabilityManifests().find((item) => {
    const payload = JSON.parse(Buffer.from(item.payload, "base64url").toString("utf8"));
    return payload.capability_id === capabilityId;
  });
  return manifest ?? null;
}
