import { NextResponse } from "next/server";
import { listMarketplaceCapabilities } from "@/lib/uci/marketplace";

export async function GET() {
  const capabilities = listMarketplaceCapabilities();
  return NextResponse.json(capabilities);
}
