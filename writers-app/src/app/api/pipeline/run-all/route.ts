import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    // Lazy import prevents Next from evaluating the pipeline during build
    const { runPipelineOnAll } = await import("@/services/agents");

    await runPipelineOnAll();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Pipeline error:", error);
    return NextResponse.json(
      { error: error?.message || "Pipeline failed" },
      { status: 500 }
    );
  }
}
