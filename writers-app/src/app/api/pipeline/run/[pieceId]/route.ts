import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { pieceId: string } }
) {
  try {
    const { pieceId } = params;

    // Import the pipeline ONLY when the endpoint is called
    const { runPipelineOnPiece } = await import("@/services/agents");

    await runPipelineOnPiece(pieceId);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed" }, { status: 500 });
  }
}

