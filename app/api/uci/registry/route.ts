import { NextResponse } from "next/server";
import { listCapabilityDescriptors } from "@/lib/uci/manifests";

export async function GET() {
  return NextResponse.json({
    protocol: "uci",
    version: "0.1",
    capabilities: listCapabilityDescriptors().map((capability) => ({
      capability_id: capability.capability_id,
      namespace: capability.namespace,
      publisher: capability.publisher,
      description: capability.description,
      trust: capability.trust,
    })),
  });
}
