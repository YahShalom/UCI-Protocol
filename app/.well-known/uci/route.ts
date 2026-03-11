import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    uci_version: "1.0.0",
    capabilities_url: "/api/uci/manifests",
    replay_url: "/api/uci/replay",
    runtimes_url: "/api/uci/runtimes",
    marketplace_url: "/api/uci/marketplace",
  });
}