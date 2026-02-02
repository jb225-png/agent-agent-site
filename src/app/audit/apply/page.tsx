"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// FREE AUDIT APPLICATION FORM
// Brand: Deep Blue (#1E3A8A), Teal (#0D9488), Amber (#F59E0B)

interface FormData {
  name: string;
  email: string;
  businessName: string;
  website: string;
  revenue: string;
  contentTypes: string[];
  biggestChallenge: string;
  contentSample: string;
}

const REVENUE_OPTIONS = [
  "Under $100k",
  "$100k - $250k",
  "$250k - $500k",
  "$500k - $1M",
  "$1M+",
];

const CONTENT_TYPE_OPTIONS = [
  "Podcast transcripts",
  "Blog posts",
  "Webinar transcripts",
  "Course content",
  "Notes/outlines",
  "Other written content",
];

export default function AuditApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    businessName: "",
    website: "",
    revenue: "",
    contentTypes: [],
    biggestChallenge: "",
    contentSample: "",
  });

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: "contentTypes", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Save the submission in background (don't wait for it)
      fetch("/api/audit/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          platforms: ["LinkedIn"],
        }),
      }).catch(console.error);
      
      // Redirect to results page with content
      const params = new URLSearchParams({
        content: encodeURIComponent(formData.contentSample),
        name: encodeURIComponent(formData.name),
      });
      
      router.push(`/audit/results?${params.toString()}`);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Step 1: Basic Info
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
        <p className="text-gray-600 mt-1">So we can personalize your audit</p>
      </div>
      
      <div>
        <label className="block font-medium mb-2 text-gray-900">Your Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] focus:outline-none transition-colors"
          placeholder="Jane Smith"
        />
      </div>

      <div>
        <label className="block font-medium mb-2 text-gray-900">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] focus:outline-none transition-colors"
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label className="block font-medium mb-2 text-gray-900">Business Name</label>
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) => updateField("businessName", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] focus:outline-none transition-colors"
          placeholder="Smith Coaching"
        />
      </div>

      <div>
        <label className="block font-medium mb-2 text-gray-900">Website</label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => updateField("website", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] focus:outline-none transition-colors"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block font-medium mb-2 text-gray-900">Annual Revenue *</label>
        <select
          value={formData.revenue}
          onChange={(e) => updateField("revenue", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] focus:outline-none bg-white transition-colors"
        >
          <option value="">Select range...</option>
          {REVENUE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!formData.name || !formData.email || !formData.revenue}
        className="w-full bg-[#1E3A8A] text-white py-4 font-semibold hover:bg-[#1e3a8a]/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Continue →
      </button>
    </div>
  );

  // Step 2: Content Info
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your content situation</h2>
        <p className="text-gray-600 mt-1">Help us understand what you have to work with</p>
      </div>
      
      <div>
        <label className="block font-medium mb-3 text-gray-900">What content do you already have? *</label>
        <p className="text-sm text-gray-500 mb-3">Select all that apply — we work with text-based content</p>
        <div className="grid grid-cols-2 gap-2">
          {CONTENT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggleArrayField("contentTypes", opt)}
              className={`px-4 py-3 border text-left text-sm transition-colors ${
                formData.contentTypes.includes(opt)
                  ? "border-[#1E3A8A] bg-[#1E3A8A] text-white"
                  : "border-gray-300 hover:border-[#1E3A8A]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#0D9488]/10 border border-[#0D9488]/20 p-4">
        <p className="text-sm text-[#0D9488] font-medium">
          🎯 We&apos;ll turn your content into 30 LinkedIn posts optimized for engagement
        </p>
      </div>

      <div>
        <label className="block font-medium mb-2 text-gray-900">
          What&apos;s your biggest content challenge right now?
        </label>
        <textarea
          value={formData.biggestChallenge}
          onChange={(e) => updateField("biggestChallenge", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] focus:outline-none h-24 resize-none transition-colors"
          placeholder="e.g., I have tons of podcast content but never repurpose it..."
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 border border-gray-300 py-4 font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={formData.contentTypes.length === 0}
          className="flex-1 bg-[#1E3A8A] text-white py-4 font-semibold hover:bg-[#1e3a8a]/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );

  // Step 3: Content Sample
  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Share a content sample</h2>
        <p className="text-gray-600 mt-1">
          Paste your text content below. The more you share, the better we can show you what&apos;s possible.
        </p>
      </div>
      
      <div>
        <label className="block font-medium mb-2 text-gray-900">Your Content Sample *</label>
        <textarea
          value={formData.contentSample}
          onChange={(e) => updateField("contentSample", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] focus:outline-none h-64 resize-none font-mono text-sm transition-colors"
          placeholder="Paste your podcast transcript, blog post, or notes here..."
        />
        <div className="flex justify-between mt-2">
          <p className="text-sm text-gray-500">
            Paste a transcript, blog post, notes, etc.
          </p>
          <p className={`text-sm ${formData.contentSample.length >= 500 ? "text-[#0D9488]" : "text-gray-500"}`}>
            {formData.contentSample.length} characters
            {formData.contentSample.length >= 500 && " ✓"}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 border border-gray-300 py-4 font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={formData.contentSample.length < 200 || isSubmitting}
          className="flex-1 bg-[#0D9488] text-white py-4 font-semibold hover:bg-[#0D9488]/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Get My Free Audit →"}
        </button>
      </div>
      
      {formData.contentSample.length < 200 && formData.contentSample.length > 0 && (
        <p className="text-sm text-amber-600">
          Please provide at least 200 characters for a meaningful audit.
        </p>
      )}
    </div>
  );

  // Progress indicator
  const renderProgress = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              s < step
                ? "bg-[#0D9488] text-white"
                : s === step
                ? "bg-[#1E3A8A] text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {s < step ? "✓" : s}
          </div>
          {s < 3 && (
            <div className={`w-12 h-0.5 ${s < step ? "bg-[#0D9488]" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/audit" className="text-gray-500 hover:text-[#1E3A8A] text-sm flex items-center gap-1">
            ← Back to overview
          </Link>
        </div>

        <div className="bg-white border border-gray-200 p-8 md:p-12 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Free Content Audit</h1>
            <p className="text-gray-600 mt-2">
              See exactly what Agent→Agent can create from your content
            </p>
          </div>

          {renderProgress()}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Trust indicators */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 Your content is secure and confidential</p>
        </div>
      </div>
    </div>
  );
}
