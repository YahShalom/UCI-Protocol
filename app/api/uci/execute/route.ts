import { NextResponse } from "next/server";
import { IntentRequest } from "@/lib/uci/types";
import { UCIKernelImpl } from "@/lib/uci/kernel";

const kernel = new UCIKernelImpl();

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<IntentRequest>;
    const intentRequest: IntentRequest = {
      request_id: body.request_id,
      capability_id: body.capability_id ?? "",
      parameters: body.parameters ?? {},
      policy: body.policy,
    };

    if (!intentRequest.capability_id) {
      return NextResponse.json({ ok: false, error: "Protocol Violation: Missing capability_id" }, { status: 400 });
    }

    const result = await kernel.execute(intentRequest);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "UCI execution failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
