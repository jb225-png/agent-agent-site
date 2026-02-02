"use client";

import { useState } from "react";
import Link from "next/link";

// BUY PAGE - $997 Content Starter (No-call checkout)
// Brand: Deep Blue (#1E3A8A), Teal (#0D9488), Amber (#F59E0B)

interface FormData {
  name: string;
  email: string;
  businessName: string;
  contentSample: string;
}

export default function BuyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    businessName: "",
    contentSample: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = 
    formData.name.trim() !== "" && 
    formData.email.trim() !== "" && 
    formData.contentSample.length >= 200;

  const handleCheckout = async () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe Checkout
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
                Get Your Content Starter Pack
              </h1>
              <p className="text-gray-600 mb-8">
                Fill in your details and paste your content. We&apos;ll deliver your 30-day content calendar within 48 hours.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block font-medium mb-2 text-gray-900">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] focus:outline-none transition-colors"
                    placeholder="Jane Smith"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-900">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] focus:outline-none transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-900">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] focus:outline-none transition-colors"
                    placeholder="Smith Coaching"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2 text-gray-900">
                    Your Content *
                  </label>
                  <p className="text-sm text-gray-500 mb-2">
                    Paste a podcast transcript, blog post, video script, or any content you want repurposed.
                  </p>
                  <textarea
                    value={formData.contentSample}
                    onChange={(e) => updateField("contentSample", e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] focus:outline-none h-48 resize-none font-mono text-sm transition-colors"
                    placeholder="Paste your content here..."
                  />
                  <div className="flex justify-between mt-2">
                    <p className="text-sm text-gray-500">
                      Minimum 200 characters
                    </p>
                    <p className={`text-sm ${formData.contentSample.length >= 200 ? "text-[#0D9488]" : "text-gray-500"}`}>
                      {formData.contentSample.length} characters
                      {formData.contentSample.length >= 200 && " ✓"}
                    </p>
                  </div>
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
                <h3 className="font-semibold text-gray-900">Content Starter Pack</h3>
                <p className="text-sm text-gray-600">One-time purchase</p>
              </div>

              <ul className="space-y-3 text-sm text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-0.5">✓</span>
                  <span>20-30 platform-ready content pieces</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-0.5">✓</span>
                  <span>30-day publishing calendar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-0.5">✓</span>
                  <span>30 LinkedIn posts ready to copy-paste</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-0.5">✓</span>
                  <span>Delivered in 48 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D9488] mt-0.5">✓</span>
                  <span>Notion workspace you keep forever</span>
                </li>
              </ul>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#0D9488]">$39</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">How it works:</span> After payment, our AI agents analyze your content and generate your complete content calendar. You&apos;ll receive an email with your Notion workspace within 48 hours.
                </p>
              </div>

              <p className="mt-4 text-xs text-gray-400 text-center">
                All sales final. Refund requests reviewed on a case-by-case basis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
