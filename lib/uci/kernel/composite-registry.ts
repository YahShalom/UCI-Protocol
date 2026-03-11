
import { SignedCapabilityManifest } from "../types";
import { CapabilityRegistry, CapabilityImplementation } from "./types";

/**
 * A meta-registry that allows for querying multiple registries in a specified order.
 * This is the foundation for a federated capability discovery system.
 */
export class CompositeRegistry implements CapabilityRegistry {
  private readonly registries: CapabilityRegistry[];

  constructor(registries: CapabilityRegistry[]) {
    this.registries = registries;
  }

  async getCapabilityManifest(capabilityId: string): Promise<SignedCapabilityManifest | null> {
    for (const registry of this.registries) {
      const manifest = await registry.getCapabilityManifest(capabilityId);
      if (manifest) {
        return manifest;
      }
    }
    return null;
  }

  async getCapabilityImplementation(capabilityId: string): Promise<CapabilityImplementation | null> {
    for (const registry of this.registries) {
      const implementation = await registry.getCapabilityImplementation(capabilityId);
      if (implementation) {
        return implementation;
      }
    }
    return null;
  }

  async getCapabilityManifests(): Promise<SignedCapabilityManifest[]> {
    const allManifests: SignedCapabilityManifest[] = [];
    for (const registry of this.registries) {
      const manifests = await registry.getCapabilityManifests();
      allManifests.push(...manifests);
    }
    // Note: This could result in duplicates if the same capability is in multiple registries.
    // A production implementation might want to de-duplicate based on capability_id.
    return allManifests;
  }

  async registerCapability(
    manifest: SignedCapabilityManifest, 
    implementation: CapabilityImplementation
  ): Promise<void> {
    // By default, registration only happens on the first registry (assumed to be the "local" one).
    // This logic could be customized for more advanced federation scenarios.
    if (this.registries.length > 0) {
      await this.registries[0].registerCapability(manifest, implementation);
    } else {
      throw new Error("Cannot register capability: no registries have been configured.");
    }
  }
}
