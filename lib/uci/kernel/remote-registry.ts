
import { SignedCapabilityManifest } from "../types";
import { CapabilityRegistry, CapabilityImplementation } from "./types";

/**
 * A mock implementation of a remote registry.
 * In a real-world scenario, this class would use a fetch-like API to query a remote UCI endpoint.
 * It only deals with manifests, as implementations are always local or proxied.
 */
export class RemoteRegistry implements CapabilityRegistry {
  private readonly remoteManifests = new Map<string, SignedCapabilityManifest>();
  private readonly endpoint: string;

  constructor(endpoint: string, initialManifests: SignedCapabilityManifest[] = []) {
    this.endpoint = endpoint;
    for (const manifest of initialManifests) {
        const manifestData = JSON.parse(Buffer.from(manifest.payload, 'base64url').toString());
        const capabilityId = manifestData.capability_id;
        if (capabilityId) {
            this.remoteManifests.set(capabilityId, manifest);
        }
    }
  }

  async getCapabilityManifest(capabilityId: string): Promise<SignedCapabilityManifest | null> {
    // In a real implementation, this would be an HTTP call:
    // const response = await fetch(`${this.endpoint}/capabilities/${capabilityId}`);
    console.log(`Searching remote registry at ${this.endpoint} for ${capabilityId}`);
    return this.remoteManifests.get(capabilityId) || null;
  }

  async getCapabilityImplementation(capabilityId: string): Promise<CapabilityImplementation | null> {
    // A remote registry, by definition, does not have local implementations.
    // A more advanced system could return a proxy object that makes a remote call,
    // but for this phase, we explicitly return null.
    console.log(`Implementation for ${capabilityId} not available in remote registry at ${this.endpoint}.`);
    return null;
  }

  async getCapabilityManifests(): Promise<SignedCapabilityManifest[]> {
    // In a real implementation, this would be:
    // const response = await fetch(`${this.endpoint}/capabilities`);
    return Array.from(this.remoteManifests.values());
  }

  async registerCapability(
    manifest: SignedCapabilityManifest, 
    implementation: CapabilityImplementation
  ): Promise<void> {
    // Registration against a remote registry is not supported in this model.
    // You would need a different mechanism (e.g., a specific publishing API).
    throw new Error("Cannot register a capability to a remote registry directly.");
  }
}
