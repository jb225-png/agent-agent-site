import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { renderToBuffer } from "@react-pdf/renderer";
import { AuditPDF, AuditData } from "@/lib/pdf/audit-template";
import React from "react";

// GET /api/audit/generate-pdf?auditId=xxx
// Generates a PDF audit report from pipeline results

export async function GET(request: NextRequest) {
  try {
    const auditId = request.nextUrl.searchParams.get("auditId");
    
    if (!auditId) {
      return NextResponse.json(
        { error: "auditId required" },
        { status: 400 }
      );
    }

    // Fetch the audit application
    const audit = await prisma.auditApplication.findUnique({
      where: { id: auditId },
    });

    if (!audit) {
      return NextResponse.json(
        { error: "Audit not found" },
        { status: 404 }
      );
    }

    if (!audit.pieceId) {
      return NextResponse.json(
        { error: "No content piece associated with this audit" },
        { status: 400 }
      );
    }

    // Fetch the piece with all pipeline results
    const piece = await prisma.piece.findUnique({
      where: { id: audit.pieceId },
      include: {
        archivistTags: true,
        placement: true,
        repurposeOutputs: true,
      },
    });

    if (!piece) {
      return NextResponse.json(
        { error: "Piece not found" },
        { status: 404 }
      );
    }

    // Check if pipeline has run
    if (!piece.archivistTags || !piece.placement) {
      return NextResponse.json(
        { error: "Pipeline has not completed for this piece" },
        { status: 400 }
      );
    }

    // Build the audit data from pipeline results
    const archivistTags = piece.archivistTags;
    const placement = piece.placement;
    const repurposeOutputs = piece.repurposeOutputs;

    // Parse JSON fields safely
    const themes = safeJsonParse<string[]>(archivistTags.themesJson, []);
    const keyInsights = safeJsonParse<string[]>(archivistTags.keyInsightsJson, []);
    const secondaryPlatforms = safeJsonParse<string[]>(placement.secondaryPlatformsJson, []);

    // Build sample outputs from repurpose results
    const sampleOutputs = repurposeOutputs.slice(0, 5).map((output) => {
      const content = safeJsonParse<{ text?: string; content?: string }>(output.contentJson, {});
      return {
        platform: output.platform,
        format: output.format,
        content: content.text || content.content || JSON.stringify(content).slice(0, 500),
      };
    });

    // Generate calendar preview (mock for now - would come from Executive agent)
    const calendarPreview = generateCalendarPreview(repurposeOutputs);

    // Identify gaps
    const gaps = identifyGaps(audit.platforms, placement.primaryPlatform, secondaryPlatforms);

    const auditData: AuditData = {
      clientName: audit.name,
      businessName: audit.businessName || undefined,
      email: audit.email,
      platforms: audit.platforms,
      contentTypes: audit.contentTypes,
      
      // From Archivist
      themes: themes.slice(0, 5),
      contentType: archivistTags.contentType,
      qualityBand: archivistTags.qualityBand,
      keyInsights: keyInsights.slice(0, 4),
      
      // From Placement
      primaryPlatform: placement.primaryPlatform,
      secondaryPlatforms: secondaryPlatforms,
      contentPotential: placement.contentPotential,
      
      // Sample outputs
      sampleOutputs,
      
      // Calendar
      calendarPreview,
      
      // Gaps
      gaps,
      
      generatedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    // Generate PDF
    const pdfElement = React.createElement(AuditPDF, { data: auditData });
    const pdfBuffer = await renderToBuffer(pdfElement as any);

    // Update audit with completion status
    await prisma.auditApplication.update({
      where: { id: auditId },
      data: { status: "completed" },
    });

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="audit-${audit.name.replace(/\s+/g, "-").toLowerCase()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

// Helper: Safe JSON parse
function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Helper: Generate calendar preview from repurpose outputs
function generateCalendarPreview(
  outputs: { platform: string; format: string }[]
): { date: string; platform: string; contentType: string }[] {
  const calendar: { date: string; platform: string; contentType: string }[] = [];
  const today = new Date();
  
  // Distribute outputs across 30 days
  const platformRotation = ["LinkedIn", "Twitter", "LinkedIn", "Email", "Instagram"];
  
  for (let i = 0; i < 15; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + (i * 2) + 1);
    
    const output = outputs[i % outputs.length];
    const platform = output?.platform || platformRotation[i % platformRotation.length];
    const contentType = output?.format || "Post";
    
    calendar.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      platform,
      contentType,
    });
  }
  
  return calendar;
}

// Helper: Identify content gaps
function identifyGaps(
  wantedPlatforms: string[],
  primaryPlatform: string,
  secondaryPlatforms: string[]
): string[] {
  const gaps: string[] = [];
  const coveredPlatforms = [primaryPlatform, ...secondaryPlatforms].map((p) =>
    p.toLowerCase()
  );
  
  for (const wanted of wantedPlatforms) {
    if (!coveredPlatforms.some((p) => p.includes(wanted.toLowerCase()))) {
      gaps.push(`${wanted} content could be developed with additional source material`);
    }
  }
  
  // Add generic gaps
  if (gaps.length === 0) {
    gaps.push("Consider adding video content for higher engagement");
    gaps.push("Email sequences could nurture leads more effectively");
  }
  
  return gaps.slice(0, 3);
}
