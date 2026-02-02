import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { generateContentStarter, formatPostsAsText } from "@/services/contentStarter";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    // If no webhook secret configured, skip verification (for testing)
    let event: Stripe.Event;
    
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } else {
      // Parse event directly (testing mode)
      event = JSON.parse(body);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const auditApplicationId = session.metadata?.auditApplicationId;
      
      if (auditApplicationId) {
        console.log(`Processing payment for audit application: ${auditApplicationId}`);
        
        // Update the audit application status to paid
        const auditApp = await prisma.auditApplication.update({
          where: { id: auditApplicationId },
          data: { 
            status: "paid",
            notes: `Payment completed. Stripe Session: ${session.id}. Payment Intent: ${session.payment_intent}`,
          },
        });

        console.log(`✓ Payment confirmed for ${auditApp.email}`);

        // Generate the 30 LinkedIn posts immediately
        try {
          console.log(`Generating Content Starter for ${auditApp.email}...`);
          
          const output = await generateContentStarter(
            auditApp.name,
            auditApp.email,
            auditApp.contentSample
          );

          const textContent = formatPostsAsText(output);

          // Store the generated content
          await prisma.auditApplication.update({
            where: { id: auditApplicationId },
            data: {
              status: "completed",
              notes: `Generated ${output.posts.length} LinkedIn posts at ${output.generatedAt}`,
              pdfUrl: JSON.stringify(output), // Store full output
            },
          });

          console.log(`✓ Generated ${output.posts.length} posts for ${auditApp.email}`);
          
          // TODO: Send email to customer with their content
          // For now, content is stored and can be retrieved via admin
          
        } catch (genError) {
          console.error("Content generation error:", genError);
          await prisma.auditApplication.update({
            where: { id: auditApplicationId },
            data: {
              status: "generation_failed",
              notes: `Payment succeeded but generation failed: ${genError instanceof Error ? genError.message : "Unknown error"}`,
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
