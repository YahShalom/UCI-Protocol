import { NextResponse } from "next/server";
import { listSignedCapabilityManifests } from "@/lib/uci/manifests";

export async function GET() {
  return NextResponse.json({
    protocol: "uci",
    version: "0.1",
    manifests: listSignedCapabilityManifests(),
  });
}
