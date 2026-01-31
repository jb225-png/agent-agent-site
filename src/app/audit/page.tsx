"use client";

import { useState } from "react";
import Link from "next/link";

const CALENDLY_URL = "https://calendly.com/rbb-outreach/new-meeting";

const revenueRanges = [
  "Under $100k",
  "$100k - $250k",
  "$250k - $500k",
  "$500k - $1M",
  "$1M - $3M",
  "$3M - $5M",
  "$5M+",
];

const niches = [
  "Executive Coaching",
  "Business Coaching",
  "Leadership Development",
  "Sales Coaching",
  "Life Coaching",
  "Career Coaching",
  "Health & Wellness Coaching",
  "Mindset / Performance",
  "Other",
];

const painPoints = [
  "I spend too much time creating content",
  "My content is scattered everywhere",
  "I don't know what to post or when",
  "I'm not getting results from my content",
  "I can't afford a full-time marketing person",
  "I start strong but can't stay consistent",
  "I have great ideas but no system to capture them",
];

export default function AuditPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    niche: "",
    otherNiche: "",
    revenue: "",
    contentLinks: "",
    painPoints: [] as string[],
    otherPain: "",
    currentProcess: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePainPointToggle = (point: string) => {
    setFormData((prev) => ({
      ...prev,
      painPoints: prev.painPoints.includes(point)
        ? prev.painPoints.filter((p) => p !== point)
        : [...prev.painPoints, point],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save the audit request
      await fetch("/api/audit/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setIsSubmitted(true);
      
      // Redirect to Calendly after short delay
      setTimeout(() => {
        window.location.href = CALENDLY_URL;
      }, 2000);
    } catch (error) {
      console.error("Error submitting audit:", error);
      // Still redirect to Calendly even if save fails
      window.location.href = CALENDLY_URL;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-2xl font-bold mb-4">You're In!</h1>
          <p className="text-gray-600 mb-6">
            Redirecting you to book your free audit call...
          </p>
          <p className="text-sm text-gray-400">
            Not redirecting?{" "}
            <a href={CALENDLY_URL} className="text-black underline">
              Click here
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-black">
            ← Back
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-3">Free Content Audit</h1>
          <p className="text-lg text-gray-600">
            We'll analyze your content and show you how to save $2,000-6,000/month 
            while getting better results.
          </p>
        </div>

        {/* What You Get */}
        <div className="mb-10 p-6 bg-gray-50 border border-gray-200">
          <h2 className="font-semibold mb-4">What You'll Get (Free):</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Complete audit of your existing content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>Gap analysis — what's missing from your content strategy</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>90-day content calendar (what to post, when, where)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>3-5 sample repurposed pieces from YOUR content</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600">✓</span>
              <span>30-minute strategy call to walk through everything</span>
            </li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">About You</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Coaching Niche *</label>
              <select
                required
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black bg-white"
              >
                <option value="">Select your niche...</option>
                {niches.map((niche) => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>
              {formData.niche === "Other" && (
                <input
                  type="text"
                  value={formData.otherNiche}
                  onChange={(e) => setFormData({ ...formData, otherNiche: e.target.value })}
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  placeholder="Describe your niche"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Annual Revenue *</label>
              <select
                required
                value={formData.revenue}
                onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black bg-white"
              >
                <option value="">Select range...</option>
                {revenueRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Content Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Your Content</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Links to 5-10 pieces of your content *
              </label>
              <p className="text-xs text-gray-500 mb-2">
                LinkedIn posts, podcast episodes, YouTube videos, blog posts — anything you've created
              </p>
              <textarea
                required
                value={formData.contentLinks}
                onChange={(e) => setFormData({ ...formData, contentLinks: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black h-32"
                placeholder="Paste links here, one per line..."
              />
            </div>
          </div>

          {/* Pain Points */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Your Challenges</h3>
            
            <div>
              <label className="block text-sm font-medium mb-3">
                What's frustrating you about content? (Select all that apply)
              </label>
              <div className="space-y-2">
                {painPoints.map((point) => (
                  <label key={point} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.painPoints.includes(point)}
                      onChange={() => handlePainPointToggle(point)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{point}</span>
                  </label>
                ))}
              </div>
              <input
                type="text"
                value={formData.otherPain}
                onChange={(e) => setFormData({ ...formData, otherPain: e.target.value })}
                className="w-full mt-3 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                placeholder="Other challenges..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                How do you currently handle content?
              </label>
              <textarea
                value={formData.currentProcess}
                onChange={(e) => setFormData({ ...formData, currentProcess: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black h-24"
                placeholder="Do you have a VA? Marketing manager? Do it yourself? Outsource to an agency?"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-black text-white font-semibold rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? "Submitting..." : "Get My Free Audit →"}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              After submitting, you'll book a 30-minute call to review your audit together.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
