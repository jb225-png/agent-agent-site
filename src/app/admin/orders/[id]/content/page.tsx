"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface LinkedInPost {
  day: number;
  date: string;
  dayOfWeek: string;
  postTime: string;
  postType: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
}

interface ContentOutput {
  customerName: string;
  customerEmail: string;
  generatedAt: string;
  posts: LinkedInPost[];
  postingSchedule: {
    frequency: string;
    bestDays: string[];
    bestTimes: string[];
  };
  strategyNotes: string;
}

export default function OrderContentPage() {
  const params = useParams();
  const [content, setContent] = useState<ContentOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch(`/api/admin/orders/${params.id}/content`);
        if (!res.ok) throw new Error("Failed to fetch content");
        const data = await res.json();
        setContent(data.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [params.id]);

  const copyPost = (post: LinkedInPost, index: number) => {
    const text = `${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.map(t => `#${t}`).join(" ")}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAllPosts = () => {
    if (!content) return;
    const allText = content.posts.map(post => 
      `=== DAY ${post.day}: ${post.dayOfWeek}, ${post.date} at ${post.postTime} ===\nType: ${post.postType}\n\n${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.map(t => `#${t}`).join(" ")}\n\n`
    ).join("\n");
    navigator.clipboard.writeText(allText);
    alert("All posts copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p>Loading content...</p>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <p className="text-red-600">Error: {error || "Content not found"}</p>
        <Link href="/admin/orders" className="text-blue-600 hover:underline">
          ← Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/admin/orders" className="text-sm text-gray-500 hover:text-black">
          ← Back to orders
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">30-Day LinkedIn Content</h1>
        <p className="text-gray-600">For: {content.customerName} ({content.customerEmail})</p>
        <p className="text-sm text-gray-500">Generated: {new Date(content.generatedAt).toLocaleString()}</p>
      </div>

      {/* Schedule Summary */}
      <div className="bg-blue-50 border border-blue-200 p-6 mb-8 rounded-lg">
        <h2 className="font-semibold text-blue-900 mb-2">Posting Schedule</h2>
        <p><strong>Frequency:</strong> {content.postingSchedule.frequency}</p>
        <p><strong>Best Days:</strong> {content.postingSchedule.bestDays.join(", ")}</p>
        <p><strong>Best Times:</strong> {content.postingSchedule.bestTimes.join(", ")}</p>
        <p className="mt-4 text-sm text-blue-800">{content.strategyNotes}</p>
      </div>

      {/* Copy All Button */}
      <div className="mb-6">
        <button
          onClick={copyAllPosts}
          className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
        >
          Copy All 30 Posts
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {content.posts.map((post, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
              <div>
                <span className="font-semibold">Day {post.day}</span>
                <span className="text-gray-500 ml-2">{post.dayOfWeek}, {post.date} at {post.postTime}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {post.postType}
                </span>
                <button
                  onClick={() => copyPost(post, index)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {copiedIndex === index ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-white border border-gray-100 p-4 rounded font-mono text-sm whitespace-pre-wrap">
                <strong>{post.hook}</strong>
                {"\n\n"}
                {post.body}
                {"\n\n"}
                {post.cta}
                {"\n\n"}
                {post.hashtags.map(t => `#${t}`).join(" ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
