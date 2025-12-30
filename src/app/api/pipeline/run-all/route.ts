import { NextRequest, NextResponse } from "next/server";
import { runPipelineOnAll } from "@/services/agents";

export async function POST(request: NextRequest) {
  try {
    await runPipelineOnAll();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Pipeline error:", error);
    return NextResponse.json(
      { error: error.message || "Pipeline failed" },
      { status: 500 }
    );
  }
}
