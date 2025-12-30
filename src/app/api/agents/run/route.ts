import { NextRequest, NextResponse } from "next/server";
import { runArchivistOnPiece, runPlacementOnPiece, runRepurposerOnPiece } from "@/services/agents";

/**
 * Run all agents on a piece
 * POST /api/agents/run
 * Body: { pieceId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { pieceId } = await request.json();

    if (!pieceId) {
      return NextResponse.json(
        { error: "pieceId is required" },
        { status: 400 }
      );
    }

    // Run agents in sequence
    console.log(`Running Archivist on piece ${pieceId}...`);
    const archivistResult = await runArchivistOnPiece(pieceId);

    console.log(`Running Placement on piece ${pieceId}...`);
    const placementResult = await runPlacementOnPiece(pieceId);

    console.log(`Running Repurposer on piece ${pieceId}...`);
    const repurposerResult = await runRepurposerOnPiece(pieceId);

    return NextResponse.json({
      success: true,
      results: {
        archivist: archivistResult,
        placement: placementResult,
        repurposer: repurposerResult,
      },
    });
  } catch (error: any) {
    console.error("Agent run error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to run agents" },
      { status: 500 }
    );
  }
}
