import { NextResponse } from "next/server";
import { replayRun } from "@/lib/uci/replay";

export async function POST(req: Request) {
  try {
    const body = await req.json() as { run_id?: string };
    if (!body.run_id) {
      return NextResponse.json({ error: "Missing run_id" }, { status: 400 });
    }
    const result = await replayRun(body.run_id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Replay failed" }, { status: 500 });
  }
}
