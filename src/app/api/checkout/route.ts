import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Helper to count words
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, businessName, contentSample } = body;

    // Validate required fields
    if (!name || !email || !contentSample) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First, create the audit application to store the content
    const auditApp = await prisma.auditApplication.create({
      data: {
        name,
        email,
        businessName: businessName || null,
        revenue: "$997 Purchase", // Mark as purchase
        contentTypes: ["purchase"],
        platforms: [],
        contentSample,
        status: "pending_payment",
      },
    });

    // Create Stripe Checkout Session
    const baseUrl = "https://agent-agent-gilt.vercel.app";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Content Starter Pack",
              description: "30-day content calendar with 20-30 platform-ready pieces",
            },
            unit_amount: 3900, // $39.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/buy/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/buy`,
      customer_email: email,
      metadata: {
        auditApplicationId: auditApp.id,
        name,
        email,
        businessName: businessName || "",
      },
    });

    // Update the audit application with the Stripe session ID
    await prisma.auditApplication.update({
      where: { id: auditApp.id },
      data: { 
        notes: `Stripe Session: ${session.id}`,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to create checkout session", details: errorMessage },
      { status: 500 }
    );
  }
}
