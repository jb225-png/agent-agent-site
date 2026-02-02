import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET() {
  const key = process.env.STRIPE_SECRET_KEY;
  
  // Check if key exists
  if (!key) {
    return NextResponse.json({ 
      error: "No STRIPE_SECRET_KEY found",
      keyExists: false 
    });
  }
  
  // Check key format
  const keyPrefix = key.substring(0, 15);
  const keyLength = key.length;
  
  try {
    const stripe = new Stripe(key);
    
    // Try to list products (simple API call)
    const products = await stripe.products.list({ limit: 1 });
    
    return NextResponse.json({ 
      success: true,
      keyExists: true,
      keyPrefix,
      keyLength,
      stripeConnected: true,
      productsFound: products.data.length
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown";
    return NextResponse.json({ 
      error: errorMessage,
      keyExists: true,
      keyPrefix,
      keyLength,
      stripeConnected: false
    });
  }
}
