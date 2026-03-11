import { NextResponse } from "next/server";
import { IntentRequest } from "@/lib/uci/types";
import { UCIKernelImpl } from "@/lib/uci/kernel";
import { v4 as uuidv4 } from "uuid";

const kernel = new UCIKernelImpl();

export async function POST(req: Request) {
  const body = await req.json();
  const toolName = typeof body.toolName === "string" ? body.toolName : "";
  const normalizedTool = toolName.replace("default_api.", "").replace("_", ".");
  const capability_id = normalizedTool === "read_file"
    ? "uci:local:file.read"
    : normalizedTool === "write_file"
    ? "uci:local:file.write"
    : normalizedTool === "delete_file"
    ? "uci:local:file.delete"
    : normalizedTool === "list_files"
    ? "uci:local:directory.list"
    : `uci:local:${normalizedTool}`;

  const intentRequest: IntentRequest = {
    request_id: uuidv4(),
    capability_id,
    parameters: typeof body.parameters === "object" && body.parameters !== null ? body.parameters : {},
  };

  const result = await kernel.execute(intentRequest);
  return NextResponse.json(result);
}
