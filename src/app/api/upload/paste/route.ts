import { NextRequest, NextResponse } from "next/server";
import { ingestText } from "@/services/ingestion";

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

    const result = await ingestText(content, title || "paste");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Paste upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
