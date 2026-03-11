
import { RemoteCapabilityDescriptor, RemoteNodeDescriptor } from "./types";

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
): Promise<RemoteNodeDescriptor> {
  const response = await fetch(discoveryUrl.replace("node", "localhost"));
  const discoveryDocument = await response.json();

  return {
    protocol: discoveryDocument.protocol,
    version: discoveryDocument.version,
    discovery_url: discoveryDocument.discovery_url,
    capabilities_endpoint: discoveryDocument.capabilities_endpoint,
    execute_endpoint: discoveryDocument.execute_endpoint,
    resolve_endpoint: discoveryDocument.resolve_endpoint,
    registry_endpoint: discoveryDocument.registry_endpoint,
  };
}
