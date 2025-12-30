import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // 🔑 Lazy import: only load ingestion when endpoint is actually called
    const { ingestText } = await import("@/services/ingestion");

    const result = await ingestText(content, title || "paste");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Paste upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}

