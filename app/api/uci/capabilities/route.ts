import { NextResponse } from "next/server";
import { UCIKernelImpl } from "@/lib/uci/kernel";

const kernel = new UCIKernelImpl();

export async function GET() {
  const registry = kernel.getRegistry();
  const capabilities = await registry.getCapabilityManifests();

  return NextResponse.json({
    protocol: "uci",
    version: "0.1.0",
    capabilities,
  });
}
