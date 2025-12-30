import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Initialize database tables
 * Run once after deploying with Postgres
 *
 * Access: GET /api/init-db
 */
export async function GET(request: NextRequest) {
  try {
    // Try to query the database to check if tables exist
    const count = await prisma.piece.count();

    return NextResponse.json({
      success: true,
      message: "Database is ready!",
      pieceCount: count,
    });
  } catch (error: any) {
    // If error, likely tables don't exist
    if (error.code === "P2021" || error.message.includes("relation")) {
      return NextResponse.json({
        success: false,
        error: "Database tables not initialized. Run: npx prisma db push",
        details: error.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: false,
      error: "Database connection error",
      details: error.message,
    }, { status: 500 });
  }
}
