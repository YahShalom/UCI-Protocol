import { NextResponse } from "next/server";
import { IntentRequest } from "@/lib/uci/types";
import { resolveIntent } from "@/lib/uci/resolver";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Partial<IntentRequest>;
    if (!body.capability_id) {
      return NextResponse.json({ error: "Missing capability_id" }, { status: 400 });
    }
    const intentRequest: IntentRequest = {
      request_id: body.request_id,
      capability_id: body.capability_id,
      parameters: body.parameters ?? {},
      policy: body.policy,
    };
    const plan = await resolveIntent(intentRequest);
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Resolve failed" }, { status: 500 });
  }
}
