import { NextResponse } from 'next/server';

export async function GET() {
  const metadata = {
    protocol_version: "0.1",
    endpoints: {
      execute: "/api/uci/execute",
      resolve: "/api/uci/resolve",
      registry: "/api/uci/registry",
      manifests: "/api/uci/manifests",
      discovery: "/.well-known/uci",
      replay: "/api/uci/replay",
      marketplace: "/api/uci/marketplace",
      runtimes: "/api/uci/runtimes",
    }
  };

  return NextResponse.json(metadata);
}
