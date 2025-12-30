import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import("@/lib/db");

    // Try to query the database
    const count = await prisma.piece.count();

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      pieceCount: count,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      stack: error.stack,
    }, { status: 500 });
  }
}
