/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// SUCCESS PAGE - Content drop after payment
// Brand: Deep Blue (#1E3A8A), Teal (#0D9488), Amber (#F59E0B)

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (content.length < 200) {
      setError("Please paste at least 200 characters of content.");
      return;
    }
    
    setError("");
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/dashboard/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content,
          sessionId 
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsComplete(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Generation error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-lg mx-auto px-6 py-12 text-center">
          <div className="bg-white border border-gray-200 p-12 shadow-sm">
            <div className="w-20 h-20 bg-[#0D9488] text-white flex items-center justify-center text-4xl mx-auto mb-6 rounded-full">
              ✓
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Posts Are Ready!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Check your email — we've sent your 30 LinkedIn posts and 30-day calendar.
            </p>

            <div className="bg-[#1E3A8A]/5 border border-[#1E3A8A]/20 p-6 text-left">
              <h2 className="font-semibold text-gray-900 mb-3">What's in your email:</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-[#0D9488]">✓</span>
                  <span>30 LinkedIn posts ready to copy-paste</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0D9488]">✓</span>
                  <span>30-day calendar with optimal posting times</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0D9488]">✓</span>
                  <span>Mix of stories, insights, how-tos, hot takes</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-500 text-sm mt-8">
              Didn't get it? Check spam or email{" "}
              <a href="mailto:rbb.outreach@gmail.com" className="text-[#1E3A8A] underline">
                rbb.outreach@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white border border-gray-200 p-8 shadow-sm">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0D9488] text-white flex items-center justify-center text-3xl mx-auto mb-4 rounded-full">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600">
              Now drop your content and we'll generate your 30 LinkedIn posts.
            </p>
          </div>

          {/* Content Drop */}
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-2 text-gray-900">
                Your Content
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Paste a podcast transcript, blog post, video script, voice memo transcript, or any content with your ideas. The more you give us, the better your posts.
              </p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] focus:outline-none h-64 resize-none font-mono text-sm transition-colors"
                placeholder="Paste your content here..."
              />
              <div className="flex justify-between mt-2">
                <p className="text-sm text-gray-500">
                  Minimum 200 characters
                </p>
                <p className={`text-sm ${content.length >= 200 ? "text-[#0D9488]" : "text-gray-500"}`}>
                  {content.length} characters
                  {content.length >= 200 && " ✓"}
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={content.length < 200 || isGenerating}
              className="w-full bg-[#1E3A8A] text-white py-4 text-lg font-semibold hover:bg-[#1E3A8A]/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Your Posts...
                </span>
              ) : (
                "Generate My 30 Posts →"
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              ⚡ Usually takes 2-3 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  );
}

export default function BuySuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SuccessContent />
    </Suspense>
  );
}
