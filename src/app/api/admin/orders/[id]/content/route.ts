import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.auditApplication.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.pdfUrl) {
      return NextResponse.json({ error: "No content generated yet" }, { status: 404 });
    }

    // Parse the stored JSON content
    const content = JSON.parse(order.pdfUrl);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        name: order.name,
        email: order.email,
        status: order.status,
        createdAt: order.createdAt,
      },
      content,
    });
  } catch (error) {
    console.error("Error fetching order content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}
