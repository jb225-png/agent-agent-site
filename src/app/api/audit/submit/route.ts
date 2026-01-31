import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/audit/submit
// Receives audit application, stores it, and triggers pipeline

interface AuditSubmission {
  name: string;
  email: string;
  businessName?: string;
  website?: string;
  revenue: string;
  contentTypes: string[];
  platforms: string[];
  biggestChallenge?: string;
  contentSample: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AuditSubmission = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.revenue || !body.contentSample) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (body.contentSample.length < 200) {
      return NextResponse.json(
        { error: "Content sample too short" },
        { status: 400 }
      );
    }

    // Store the audit application
    // Note: You may need to add AuditApplication model to schema
    const audit = await prisma.auditApplication.create({
      data: {
        name: body.name,
        email: body.email,
        businessName: body.businessName || null,
        website: body.website || null,
        revenue: body.revenue,
        contentTypes: body.contentTypes,
        platforms: body.platforms,
        biggestChallenge: body.biggestChallenge || null,
        contentSample: body.contentSample,
        status: "pending",
      },
    });

    // Create a Piece from the content sample to run through pipeline
    const piece = await prisma.piece.create({
      data: {
        title: `Audit: ${body.name} - ${body.businessName || "Sample"}`,
        body: body.contentSample,
        source: "audit_submission",
        wordCount: body.contentSample.split(/\s+/).length,
      },
    });

    // Link piece to audit application
    await prisma.auditApplication.update({
      where: { id: audit.id },
      data: { pieceId: piece.id },
    });

    // Optionally: trigger pipeline automatically
    // For now, we'll run it manually or via a separate endpoint

    return NextResponse.json({
      success: true,
      auditId: audit.id,
      pieceId: piece.id,
      message: "Audit application received. We'll process your content and send results.",
    });
  } catch (error) {
    console.error("Audit submission error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
