/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Post {
  format: string;
  hook: string;
  body: string;
  hashtags: string[];
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const contentSample = searchParams.get("content");
    const name = searchParams.get("name");

    if (!contentSample) {
      setError("No content provided");
      setLoading(false);
      return;
    }

    // Generate posts
    fetch("/api/audit/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contentSample: decodeURIComponent(contentSample),
        name: name ? decodeURIComponent(name) : undefined
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setPosts(data.posts || []);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to generate posts");
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatLabel = (format: string) => {
    const labels: Record<string, string> = {
      story: "Story Post",
      listicle: "Listicle",
      insight: "Insight",
      hot_take: "Hot Take",
      how_to: "How-To",
      question: "Engagement",
    };
    return labels[format] || format;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Generating Your Posts...</h2>
          <p className="text-gray-600">Our AI is creating 10 LinkedIn posts from your content</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto mb-4 rounded-full">
            !
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/audit/apply"
            className="inline-block bg-[#1E3A8A] text-white px-6 py-3 font-semibold hover:bg-[#1E3A8A]/90"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <div className="inline-block bg-[#0D9488]/10 text-[#0D9488] px-4 py-1.5 text-sm font-medium rounded-full mb-4">
            ✓ Your Free Audit Is Ready
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            10 LinkedIn Posts. Just For You.
          </h1>
          <p className="text-gray-600 text-lg">
            Copy any of these and post them today. They're yours.
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div key={index} className="bg-white border border-gray-200 shadow-sm">
              {/* Post Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-[#1E3A8A] text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {formatLabel(post.format)}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(post.body + "\n\n" + post.hashtags.map(h => `#${h}`).join(" "), index)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    copiedIndex === index
                      ? "bg-[#0D9488] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
              </div>
              
              {/* Post Content */}
              <div className="px-6 py-5">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-[15px]">
                  {post.body}
                </div>
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.hashtags.map((tag, i) => (
                      <span key={i} className="text-[#1E3A8A] text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#1E3A8A] text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Like What You See?
          </h2>
          <p className="text-xl text-blue-200 mb-2">
            Get 30 posts like these. Every month. Automatically.
          </p>
          <p className="text-blue-300 mb-8">
            Just upload your content and let Agent→Agent do the rest.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 max-w-md mx-auto mb-8">
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-5xl font-extrabold">$39</span>
              <span className="text-blue-200">/month</span>
            </div>
            <ul className="text-left space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488]">✓</span> 30 LinkedIn posts monthly
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488]">✓</span> Multiple formats (story, insight, listicle, how-to)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488]">✓</span> 30-day publishing calendar
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488]">✓</span> Generated in minutes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488]">✓</span> Cancel anytime
              </li>
            </ul>
            <Link
              href="/buy"
              className="block w-full bg-[#F59E0B] text-gray-900 py-4 text-center font-semibold text-lg hover:bg-[#fbbf24] transition-colors"
            >
              Get Started — $39/month →
            </Link>
          </div>
          
          <p className="text-blue-300 text-sm">
            Questions? <a href="mailto:rbb.outreach@gmail.com" className="underline">Email us</a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200 bg-white">
        <p>© 2026 Agent→Agent. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function AuditResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
