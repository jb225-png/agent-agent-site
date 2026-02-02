/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";

interface Post {
  format: string;
  hook: string;
  body: string;
  hashtags: string[];
}

interface CalendarEntry {
  date: string;
  dayName: string;
  time: string;
  postIndex: number;
  post: Post;
  week: number;
}

interface Calendar {
  entries: CalendarEntry[];
  summary: {
    totalPosts: number;
    weeksSpan: number;
    postsPerWeek: number;
  };
  schedule: {
    days: string;
    times: string;
    note: string;
  };
}

export default function DashboardPage() {
  const [contentSample, setContentSample] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [activeTab, setActiveTab] = useState<"calendar" | "posts">("calendar");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (contentSample.length < 200) {
      alert("Please provide at least 200 characters of content.");
      return;
    }

    setIsGenerating(true);
    setPosts([]);
    setCalendar(null);

    try {
      const response = await fetch("/api/dashboard/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentSample }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        setPosts(data.posts || []);
        setCalendar(data.calendar || null);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadPDF = () => {
    if (!posts.length || !calendar) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let yPosition = 20;

    // Title
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Your 30-Day LinkedIn Calendar", margin, yPosition);
    yPosition += 15;

    // Schedule info
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Schedule: ${calendar.schedule.days} at ${calendar.schedule.times}`, margin, yPosition);
    yPosition += 8;
    doc.text(`${calendar.summary.totalPosts} posts over ${calendar.summary.weeksSpan} weeks`, margin, yPosition);
    yPosition += 15;

    // Posts
    calendar.entries.forEach((entry, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      // Date header
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const dateStr = new Date(entry.date).toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric" 
      });
      doc.text(`#${index + 1} — ${dateStr} at ${entry.time}`, margin, yPosition);
      yPosition += 6;

      // Format tag
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.text(`[${formatLabel(entry.post.format)}]`, margin, yPosition);
      yPosition += 6;

      // Post content
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(entry.post.body, maxWidth);
      
      lines.forEach((line: string) => {
        if (yPosition > 275) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, margin, yPosition);
        yPosition += 5;
      });

      // Hashtags
      if (entry.post.hashtags?.length) {
        yPosition += 2;
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(entry.post.hashtags.map(h => `#${h}`).join(" "), margin, yPosition);
        doc.setTextColor(0, 0, 0);
      }

      yPosition += 12;
    });

    // Save
    doc.save("linkedin-30-day-calendar.pdf");
  };

  const formatLabel = (format: string) => {
    const labels: Record<string, string> = {
      story: "Story",
      listicle: "Listicle",
      insight: "Insight",
      hot_take: "Hot Take",
      how_to: "How-To",
      question: "Engagement",
    };
    return labels[format] || format;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Group calendar entries by week
  const getWeeklyCalendar = () => {
    if (!calendar) return [];
    
    const weeks: { [key: number]: CalendarEntry[] } = {};
    calendar.entries.forEach((entry) => {
      if (!weeks[entry.week]) weeks[entry.week] = [];
      weeks[entry.week].push(entry);
    });
    
    return Object.entries(weeks).map(([week, entries]) => ({
      week: parseInt(week),
      entries,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-[#1E3A8A]">
            Agent→Agent
          </Link>
          <div className="text-sm text-gray-600">
            Subscriber Dashboard
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Upload Section */}
        {!calendar && (
          <div className="bg-white border border-gray-200 p-8 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Generate Your 30-Day Content Calendar
            </h1>
            <p className="text-gray-600 mb-6">
              Paste your content below. We'll create 30 LinkedIn posts and schedule them optimally.
            </p>

            <textarea
              value={contentSample}
              onChange={(e) => setContentSample(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 h-64 resize-none font-mono text-sm focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] focus:outline-none"
              placeholder="Paste your podcast transcript, blog post, course content, or notes here..."
            />

            <div className="flex justify-between items-center mt-4">
              <p className={`text-sm ${contentSample.length >= 500 ? "text-[#0D9488]" : "text-gray-500"}`}>
                {contentSample.length} characters
                {contentSample.length >= 500 && " ✓"}
              </p>
              <button
                onClick={handleGenerate}
                disabled={contentSample.length < 200 || isGenerating}
                className="bg-[#1E3A8A] text-white px-8 py-3 font-semibold hover:bg-[#1E3A8A]/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? "Generating 30 Posts..." : "Generate Calendar →"}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Creating Your Content...</h2>
            <p className="text-gray-600">Generating 30 LinkedIn posts and building your calendar</p>
          </div>
        )}

        {/* Results */}
        {calendar && !isGenerating && (
          <>
            {/* Stats Bar */}
            <div className="bg-[#1E3A8A] text-white p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Your 30-Day Calendar is Ready</h2>
                  <p className="text-blue-200">
                    {calendar.summary.totalPosts} posts scheduled over {calendar.summary.weeksSpan} weeks
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={downloadPDF}
                    className="bg-[#F59E0B] text-gray-900 px-4 py-2 text-sm font-semibold hover:bg-[#fbbf24] transition-colors"
                  >
                    📥 Download PDF
                  </button>
                  <button
                    onClick={() => {
                      setCalendar(null);
                      setPosts([]);
                      setContentSample("");
                    }}
                    className="border border-white/30 px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                  >
                    Generate New
                  </button>
                </div>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="bg-[#0D9488]/10 border border-[#0D9488]/20 p-4 mb-6">
              <p className="text-[#0D9488] font-medium">
                📅 Posting Schedule: {calendar.schedule.days} at {calendar.schedule.times}
              </p>
              <p className="text-[#0D9488]/80 text-sm mt-1">
                {calendar.schedule.note}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === "calendar"
                    ? "bg-[#1E3A8A] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                📅 Calendar View
              </button>
              <button
                onClick={() => setActiveTab("posts")}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === "posts"
                    ? "bg-[#1E3A8A] text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                📝 All Posts ({posts.length})
              </button>
            </div>

            {/* Calendar View */}
            {activeTab === "calendar" && (
              <div className="space-y-8">
                {getWeeklyCalendar().map(({ week, entries }) => (
                  <div key={week} className="bg-white border border-gray-200">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900">Week {week}</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {entries.map((entry, idx) => (
                        <div key={idx} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start gap-4">
                            {/* Date/Time */}
                            <div className="w-24 flex-shrink-0 text-center">
                              <div className="text-lg font-bold text-[#1E3A8A]">
                                {formatDate(entry.date)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {entry.dayName}
                              </div>
                              <div className="text-xs text-[#0D9488] font-medium mt-1">
                                {entry.time}
                              </div>
                            </div>

                            {/* Post Preview */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs bg-gray-100 px-2 py-1 text-gray-600">
                                  {formatLabel(entry.post.format)}
                                </span>
                                <span className="text-xs text-gray-400">
                                  Post #{entry.postIndex + 1}
                                </span>
                              </div>
                              <p className="text-gray-900 font-medium text-sm line-clamp-2">
                                {entry.post.hook}
                              </p>
                              
                              {/* Expanded Content */}
                              {expandedPost === entry.postIndex && (
                                <div className="mt-4 p-4 bg-gray-50 border border-gray-200">
                                  <div className="whitespace-pre-wrap text-sm text-gray-800">
                                    {entry.post.body}
                                  </div>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {entry.post.hashtags.map((tag, i) => (
                                      <span key={i} className="text-[#1E3A8A] text-xs">
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => setExpandedPost(
                                  expandedPost === entry.postIndex ? null : entry.postIndex
                                )}
                                className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50"
                              >
                                {expandedPost === entry.postIndex ? "Hide" : "View"}
                              </button>
                              <button
                                onClick={() => copyToClipboard(
                                  entry.post.body + "\n\n" + entry.post.hashtags.map(h => `#${h}`).join(" "),
                                  entry.postIndex
                                )}
                                className={`text-xs px-3 py-1.5 transition-colors ${
                                  copiedIndex === entry.postIndex
                                    ? "bg-[#0D9488] text-white"
                                    : "bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90"
                                }`}
                              >
                                {copiedIndex === entry.postIndex ? "Copied!" : "Copy"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* All Posts View */}
            {activeTab === "posts" && (
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <div key={index} className="bg-white border border-gray-200">
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
                        onClick={() => copyToClipboard(
                          post.body + "\n\n" + post.hashtags.map(h => `#${h}`).join(" "),
                          index
                        )}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          copiedIndex === index
                            ? "bg-[#0D9488] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {copiedIndex === index ? "Copied!" : "Copy"}
                      </button>
                    </div>
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
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200 bg-white mt-12">
        <p>© 2026 Agent→Agent. All rights reserved.</p>
      </footer>
    </div>
  );
}
