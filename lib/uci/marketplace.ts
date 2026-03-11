import { MarketplaceCapability } from "./types";

export const marketplaceCatalog: MarketplaceCapability[] = [
  {
    capability_id: "uci:local:math.add",
    version: "1.0.0",
    publisher: {
      org_id: "uci-core",
      name: "UCI Reference",
    },
    category: "math",
    description: "Add two numbers",
    tags: ["math", "utility"],
    pricing: { model: "free" },
    trust: { verification_status: "verified" },
    discovery: { public: true },
  },
  {
    capability_id: "uci:local:hello-world",
    version: "1.0.0",
    publisher: {
      org_id: "uci-core",
      name: "UCI Reference",
    },
    category: "demo",
    description: "Example hello world capability",
    tags: ["demo"],
    pricing: { model: "free" },
    trust: { verification_status: "verified" },
    discovery: { public: true },
  },
];

export function listMarketplaceCapabilities(): MarketplaceCapability[] {
  return marketplaceCatalog;
}

export function getMarketplaceCapability(capabilityId: string): MarketplaceCapability | undefined {
  return marketplaceCatalog.find((c) => c.capability_id === capabilityId);
}
