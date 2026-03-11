import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    protocol: "uci",
    version: "0.1",
    evidence_format: "uci-dag-v0",
    manifests_endpoint: "/api/uci/manifests",
    registry_endpoint: "/api/uci/registry",
    replay_endpoint: "/api/uci/replay",
    resolve_endpoint: "/api/uci/resolve",
    federation_support: true,
    remote_resolution_support: true,
    capability_trust_support: true,
    signed_manifests_support: true,
    trust_verification_methods: [
      "manual",
      "domain_verification",
      "cryptographic"
    ]
  });
}
