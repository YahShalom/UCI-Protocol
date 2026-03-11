import { NextResponse } from "next/server";
import { IntentRequest } from "@/lib/uci/types";
import { runCapability } from "@/lib/uci/engine";

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<IntentRequest>;
  const capabilityId = body.capability_id ?? "";
  const inputs = body.parameters ?? {};

  if (!capabilityId) {
    return NextResponse.json({ ok: false, error: "Missing capability_id" }, { status: 400 });
  }

  const result = await runCapability(capabilityId, inputs);
  return NextResponse.json({ result });
}
