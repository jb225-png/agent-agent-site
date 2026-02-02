import { NextRequest, NextResponse } from "next/server";
import { generateContentStarter, formatPostsForEmail, formatPostsAsText } from "@/services/contentStarter";
import { prisma } from "@/lib/db";

/**
 * POST /api/generate-starter
 * Generate 30 LinkedIn posts for a Content Starter purchase
 * Called after successful Stripe payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auditApplicationId, sendEmail = true } = body;

    if (!auditApplicationId) {
      return NextResponse.json(
        { error: "Missing auditApplicationId" },
        { status: 400 }
      );
    }

    // Get the audit application (which has the customer's content)
    const auditApp = await prisma.auditApplication.findUnique({
      where: { id: auditApplicationId },
    });

    if (!auditApp) {
      return NextResponse.json(
        { error: "Audit application not found" },
        { status: 404 }
      );
    }

    if (auditApp.status !== "paid" && auditApp.status !== "processing") {
      return NextResponse.json(
        { error: "Order not paid or already processed" },
        { status: 400 }
      );
    }

    // Update status to processing
    await prisma.auditApplication.update({
      where: { id: auditApplicationId },
      data: { status: "processing" },
    });

    console.log(`Generating Content Starter for ${auditApp.email}...`);

    // Generate the 30 LinkedIn posts
    const output = await generateContentStarter(
      auditApp.name,
      auditApp.email,
      auditApp.contentSample
    );

    // Format for delivery
    const htmlContent = formatPostsForEmail(output);
    const textContent = formatPostsAsText(output);

    // Store the generated content (for reference, not in main library)
    await prisma.auditApplication.update({
      where: { id: auditApplicationId },
      data: {
        status: "completed",
        notes: `Generated ${output.posts.length} LinkedIn posts at ${output.generatedAt}. Content stored in pdfUrl field.`,
        pdfUrl: JSON.stringify(output), // Store full output as JSON
      },
    });

    console.log(`✓ Generated ${output.posts.length} posts for ${auditApp.email}`);

    // TODO: Send email with content
    // For now, return the content directly
    
    return NextResponse.json({
      success: true,
      message: `Generated ${output.posts.length} LinkedIn posts`,
      customerEmail: auditApp.email,
      postsCount: output.posts.length,
      // Include content for testing
      preview: output.posts.slice(0, 3), // First 3 posts as preview
      textContent, // Full text version
    });
    
  } catch (error) {
    console.error("Generate starter error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to generate content", details: errorMessage },
      { status: 500 }
    );
  }
}
