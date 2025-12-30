import { NextRequest, NextResponse } from "next/server";
import { runPipelineOnPiece } from "@/services/agents";

export async function POST(
  request: NextRequest,
  { params }: { params: { pieceId: string } }
) {
  try {
    const { pieceId } = params;
    const result = await runPipelineOnPiece(pieceId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Pipeline error:", error);
    return NextResponse.json(
      { error: error.message || "Pipeline failed" },
      { status: 500 }
    );
  }
}
