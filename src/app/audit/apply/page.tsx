"use client";

import { useState } from "react";
import Link from "next/link";

// FREE AUDIT APPLICATION FORM
// Collects intake info + embeds Calendly for booking

interface FormData {
  name: string;
  email: string;
  businessName: string;
  website: string;
  revenue: string;
  contentTypes: string[];
  platforms: string[];
  biggestChallenge: string;
  contentSample: string;
}

const REVENUE_OPTIONS = [
  "Under $100k",
  "$100k - $250k",
  "$250k - $500k",
  "$500k - $1M",
  "$1M - $5M",
  "$5M+",
];

const CONTENT_TYPE_OPTIONS = [
  "Podcast episodes",
  "Video content",
  "Blog posts",
  "Voice memos/notes",
  "Webinar recordings",
  "Course content",
  "Other",
];

const PLATFORM_OPTIONS = [
  "LinkedIn",
  "Twitter/X",
  "Instagram",
  "Email newsletter",
  "Blog/Website",
  "YouTube",
  "TikTok",
];

// [CONFIG: CALENDLY_URL] - Replace with actual Calendly link
const CALENDLY_URL = "https://calendly.com/your-link-here";

export default function AuditApplyPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    businessName: "",
    website: "",
    revenue: "",
    contentTypes: [],
    platforms: [],
    biggestChallenge: "",
    contentSample: "",
  });

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: "contentTypes" | "platforms", value: string) => {
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
      // Submit to API endpoint
      const response = await fetch("/api/audit/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1: Basic Info
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tell us about yourself</h2>
      
      <div>
        <label className="block font-medium mb-2">Your Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
          placeholder="Jane Smith"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Business Name</label>
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) => updateField("businessName", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
          placeholder="Smith Coaching"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Website</label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => updateField("website", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block font-medium mb-2">Annual Revenue *</label>
        <select
          value={formData.revenue}
          onChange={(e) => updateField("revenue", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none bg-white"
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
        className="w-full bg-black text-white py-4 font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Continue →
      </button>
    </div>
  );

  // Step 2: Content & Platforms
  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your content situation</h2>
      
      <div>
        <label className="block font-medium mb-3">What content do you already have? *</label>
        <div className="grid grid-cols-2 gap-2">
          {CONTENT_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggleArrayField("contentTypes", opt)}
              className={`px-4 py-2 border text-left text-sm transition-colors ${
                formData.contentTypes.includes(opt)
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-3">Which platforms do you want to post on? *</label>
        <div className="grid grid-cols-2 gap-2">
          {PLATFORM_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggleArrayField("platforms", opt)}
              className={`px-4 py-2 border text-left text-sm transition-colors ${
                formData.platforms.includes(opt)
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:border-black"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">
          What&apos;s your biggest content challenge right now?
        </label>
        <textarea
          value={formData.biggestChallenge}
          onChange={(e) => updateField("biggestChallenge", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none h-24 resize-none"
          placeholder="e.g., I have tons of podcast content but never repurpose it..."
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 border border-black py-4 font-semibold hover:bg-gray-100 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={formData.contentTypes.length === 0 || formData.platforms.length === 0}
          className="flex-1 bg-black text-white py-4 font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );

  // Step 3: Content Sample
  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Share a content sample</h2>
      <p className="text-gray-600">
        Paste a transcript, blog post, or notes below. This is what we&apos;ll use for your free audit.
        The more you share, the better we can show you what&apos;s possible.
      </p>
      
      <div>
        <label className="block font-medium mb-2">Your Content Sample *</label>
        <textarea
          value={formData.contentSample}
          onChange={(e) => updateField("contentSample", e.target.value)}
          className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none h-64 resize-none font-mono text-sm"
          placeholder="Paste your podcast transcript, blog post, or notes here..."
        />
        <p className="text-sm text-gray-500 mt-2">
          {formData.contentSample.length} characters
          {formData.contentSample.length > 500 && " ✓"}
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 border border-black py-4 font-semibold hover:bg-gray-100 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={formData.contentSample.length < 200 || isSubmitting}
          className="flex-1 bg-black text-white py-4 font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit & Book Call →"}
        </button>
      </div>
      
      {formData.contentSample.length < 200 && formData.contentSample.length > 0 && (
        <p className="text-sm text-red-600">
          Please provide at least 200 characters for a meaningful audit.
        </p>
      )}
    </div>
  );

  // Success state with Calendly
  const renderSuccess = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-2">Application Received!</h2>
        <p className="text-gray-600">
          We&apos;re running your content through Agent-Agent now. 
          Book a time below to review your audit results.
        </p>
      </div>
      
      {/* Calendly Embed */}
      <div className="border border-gray-200">
        <iframe
          src={CALENDLY_URL}
          width="100%"
          height="700"
          frameBorder="0"
          title="Schedule a call"
        />
      </div>
      
      <p className="text-center text-gray-500 text-sm">
        Can&apos;t find a time that works?{" "}
        <a href="mailto:hello@agent-agent.com" className="underline">
          Email us
        </a>
      </p>
    </div>
  );

  // Progress indicator
  const renderProgress = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`w-3 h-3 rounded-full transition-colors ${
            s <= step ? "bg-black" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/audit" className="text-gray-500 hover:text-black text-sm">
            ← Back to overview
          </Link>
        </div>

        <div className="border border-black p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2 text-center">Free Content Audit</h1>
          <p className="text-gray-600 text-center mb-8">
            See exactly what Agent-Agent can create from your content
          </p>

          {!submitted && renderProgress()}

          {submitted ? (
            renderSuccess()
          ) : (
            <>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
