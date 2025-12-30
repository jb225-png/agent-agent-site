import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Dynamic import to avoid build-time issues
    const { prisma } = await import("@/lib/db");

    // Try the exact query the library page uses
    const pieces = await prisma.piece.findMany({
      include: {
        archivistTags: true,
        placement: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Library query successful",
      pieceCount: pieces.length,
      pieces: pieces.map(p => ({
        id: p.id,
        title: p.title,
        wordCount: p.wordCount,
        hasArchivistTags: !!p.archivistTags,
        hasPlacement: !!p.placement,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    }, { status: 500 });
  }
}
