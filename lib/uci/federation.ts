import { RemoteCapabilityDescriptor } from "./types";

const remoteCatalog: RemoteCapabilityDescriptor[] = [
  {
    capability_id: "vendor.image.generate",
    remote_node_url: "https://example-node.com",
    discovery_url: "https://example-node.com/.well-known/uci",
    version: "1.0",
    publisher: {
      org_id: "vendor-org",
      name: "Vendor Inc.",
    },
    trust: {
      verification_status: "verified",
      verification_method: "manual",
    },
  },
];

export async function resolveRemoteCapability(
  capabilityId: string
): Promise<RemoteCapabilityDescriptor | undefined> {
  return remoteCatalog.find((c) => c.capability_id === capabilityId);
}

export async function fetchRemoteDiscoveryDocument(
  discoveryUrl: string
): Promise<Record<string, unknown>> {
  return {
    protocol: "uci",
    version: "0.1",
    discovery_url: discoveryUrl,
    capabilities: [
      {
        capability_id: "vendor.image.generate",
        description: "Generates an image from a prompt.",
      },
    ],
  };
}
