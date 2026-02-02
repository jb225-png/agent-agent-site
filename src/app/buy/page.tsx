"use client";

import { useState } from "react";
import Link from "next/link";

// BUY PAGE - Simple checkout, content drop comes AFTER payment
// Brand: Deep Blue (#1E3A8A), Teal (#0D9488), Amber (#F59E0B)

export default function BuyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const isFormValid = name.trim() !== "" && email.trim() !== "";

  const handleCheckout = async () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/audit" className="text-gray-500 hover:text-[#1E3A8A] text-sm flex items-center gap-1">
            ← Back to overview
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Form - Left Side */}
          <div className="md:col-span-3">
            <div className="bg-white border border-gray-200 p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Get Your 30 LinkedIn Posts
              </h1>
              <p className="text-gray-600 mb-8">
                One-time payment. Drop your content after checkout.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block font-medium mb-2 text-gray-900">Your Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] focus:outline-none transition-colors"
                    placeholder="Jane Smith"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-900">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] focus:outline-none transition-colors"
                    placeholder="jane@example.com"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    We&apos;ll send your content calendar to this email.
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!isFormValid || isLoading}
                  className="w-full bg-[#0D9488] text-white py-4 text-lg font-semibold hover:bg-[#0D9488]/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Processing..." : "Continue to Payment — $39"}
                </button>

                <p className="text-center text-sm text-gray-500">
                  🔒 Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="md:col-span-2">
            <div className="bg-white border border-gray-200 p-6 shadow-sm sticky top-6">
              <h2 className="font-bold text-lg text-gray-900 mb-4">Order Summary</h2>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="font-semibold text-gray-900">30 LinkedIn Posts</h3>
                <p className="text-sm text-gray-600">One-time purchase</p>
              </div>

              <ul className="space-y-3 text-sm text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-0.5">✓</span>
                  <span>30 platform-ready LinkedIn posts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-0.5">✓</span>
                  <span>30-day publishing calendar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-0.5">✓</span>
                  <span>Mix of stories, insights, how-tos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-0.5">✓</span>
                  <span>Delivered in minutes</span>
                </li>
              </ul>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#0D9488]">$39</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#1E3A8A]/5 border border-[#1E3A8A]/20">
                <p className="text-sm text-gray-700 font-medium mb-2">How it works:</p>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. Complete payment</li>
                  <li>2. Drop your content (podcast, blog, notes)</li>
                  <li>3. Get 30 posts delivered in minutes</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
