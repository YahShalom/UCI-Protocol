import { getCapabilityDescriptor, listCapabilityDescriptors } from "./manifests";

export async function getCapability(capabilityId: string) {
  return getCapabilityDescriptor(capabilityId) ?? null;
}

export async function getCapabilities() {
  return listCapabilityDescriptors();
}
