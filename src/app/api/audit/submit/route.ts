import { NextRequest, NextResponse } from "next/server";

async function getPrisma() {
  const { prisma } = await import("@/lib/db");
  return prisma;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      niche,
      otherNiche,
      revenue,
      contentLinks,
      painPoints,
      otherPain,
      currentProcess,
    } = body;

    const prisma = await getPrisma();

    // Use the existing AuditApplication model
    const audit = await prisma.auditApplication.create({
      data: {
        name,
        email,
        revenue,
        contentTypes: [niche === "Other" ? otherNiche : niche],
        platforms: painPoints || [],
        biggestChallenge: [
          ...(painPoints || []),
          otherPain,
          currentProcess,
        ].filter(Boolean).join("\n\n"),
        contentSample: contentLinks || "",
        status: "pending",
        calendarBooked: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Audit request saved",
      auditId: audit.id,
    });
  } catch (error) {
    console.error("Audit submission error:", error);
    return NextResponse.json(
      { error: "Failed to save audit request" },
      { status: 500 }
    );
  }
}
