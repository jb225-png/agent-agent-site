/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";

// POST PERFORMANCE PREDICTOR - Lead gen tool
// Brand: Deep Blue (#1E3A8A), Teal (#0D9488), Amber (#F59E0B)

interface Scores {
  hook: number;
  format: number;
  engage: number;
  relate: number;
  length: number;
}

interface Tip {
  icon: string;
  text: string;
}

export default function PostPredictorPage() {
  const [postText, setPostText] = useState("");
  const [scores, setScores] = useState<Scores | null>(null);
  const [tips, setTips] = useState<Tip[]>([]);
  const [overall, setOverall] = useState(0);

  function analyzePost() {
    if (!postText.trim()) return;

    const newScores: Scores = {
      hook: scoreHook(postText),
      format: scoreFormat(postText),
      engage: scoreEngagement(postText),
      relate: scoreRelatability(postText),
      length: scoreLength(postText),
    };

    // Weighted average (hook matters most)
    const weights = { hook: 0.3, format: 0.15, engage: 0.25, relate: 0.2, length: 0.1 };
    const overallScore = Math.round(
      newScores.hook * weights.hook +
      newScores.format * weights.format +
      newScores.engage * weights.engage +
      newScores.relate * weights.relate +
      newScores.length * weights.length
    );

    setScores(newScores);
    setOverall(overallScore);
    setTips(generateTips(postText, newScores));
  }

  function scoreHook(text: string): number {
    const firstLine = text.split("\n")[0].trim();
    let score = 5;

    if (firstLine.length < 50) score += 1;
    if (firstLine.length < 30) score += 1;
    if (/^(I |Most |Here's |The |Stop |Never |Why |What |How |This )/i.test(firstLine)) score += 1;
    if (/[?!]/.test(firstLine)) score += 1;
    if (/^[\d%$]/.test(firstLine)) score += 1;
    if (/\.{3}|—$|:$/.test(firstLine)) score += 1;
    if (firstLine.length > 100) score -= 2;

    return Math.max(1, Math.min(10, score));
  }

  function scoreFormat(text: string): number {
    let score = 5;
    const lines = text.split("\n").filter((l) => l.trim());

    if (lines.length > 3) score += 1;
    if (lines.length > 5) score += 1;
    if (/^[-•→✓✗\d.]\s/m.test(text)) score += 2;

    const emojiCount = (text.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
    if (emojiCount > 0 && emojiCount <= 5) score += 1;
    if (emojiCount > 8) score -= 1;
    if (text.includes("\n\n")) score += 1;
    if (text.length > 500 && lines.length < 5) score -= 2;

    return Math.max(1, Math.min(10, score));
  }

  function scoreEngagement(text: string): number {
    let score = 4;
    const lower = text.toLowerCase();

    if (text.includes("?")) score += 2;
    if (/comment|share|thoughts|agree|disagree|what do you|let me know/i.test(lower)) score += 2;
    if (/unpopular|controversial|hot take|truth is|nobody|everyone thinks|wrong about/i.test(lower)) score += 1;
    if (/tip|lesson|mistake|learned|secret|framework|strategy|playbook/i.test(lower)) score += 1;

    const lastLine = text.trim().split("\n").pop() || "";
    if (/[?]/.test(lastLine)) score += 1;

    return Math.max(1, Math.min(10, score));
  }

  function scoreRelatability(text: string): number {
    let score = 5;
    const lower = text.toLowerCase();

    if (/\b(i|my|me|we|our)\b/i.test(text)) score += 1;
    if ((text.match(/\bI\b/g) || []).length >= 2) score += 1;
    if (/years ago|last week|yesterday|recently|when i|one day/i.test(lower)) score += 1;
    if (/struggle|fail|success|fear|excited|proud|frustrated|grateful|honest/i.test(lower)) score += 1;
    if (/\byou\b|\byour\b/i.test(text)) score += 1;
    if (/\d{2,}|%|\$/g.test(text)) score += 1;

    return Math.max(1, Math.min(10, score));
  }

  function scoreLength(text: string): number {
    const words = text.split(/\s+/).filter((w) => w).length;

    if (words >= 100 && words <= 200) return 10;
    if (words >= 80 && words <= 250) return 8;
    if (words >= 50 && words <= 300) return 6;
    if (words < 30) return 3;
    if (words > 400) return 4;
    return 5;
  }

  function generateTips(text: string, s: Scores): Tip[] {
    const tipList: Tip[] = [];
    const firstLine = text.split("\n")[0].trim();
    const words = text.split(/\s+/).filter((w) => w).length;

    if (s.hook < 6) {
      if (firstLine.length > 50) {
        tipList.push({ icon: "🎣", text: "Shorten your hook. First line should be < 50 chars to stop the scroll." });
      } else {
        tipList.push({ icon: "🎣", text: "Try starting with a question, number, or bold statement." });
      }
    }

    if (s.format < 6) {
      if (!text.includes("\n\n")) {
        tipList.push({ icon: "📐", text: "Add white space between sections. Walls of text get skipped." });
      }
      if (!/^[-•→✓\d.]\s/m.test(text)) {
        tipList.push({ icon: "📐", text: "Try bullet points or a numbered list for key points." });
      }
    }

    if (s.engage < 6) {
      if (!text.includes("?")) {
        tipList.push({ icon: "💬", text: "End with a question to drive comments." });
      } else {
        tipList.push({ icon: "💬", text: 'Add a clear call-to-action (e.g., "What would you add?")' });
      }
    }

    if (s.relate < 6) {
      tipList.push({ icon: "🤝", text: "Add a personal story or specific example. People connect with stories." });
    }

    if (s.length < 6) {
      if (words < 80) {
        tipList.push({ icon: "📏", text: "Post is short. Aim for 100-200 words for optimal engagement." });
      } else if (words > 300) {
        tipList.push({ icon: "📏", text: "Post is long. Consider trimming to ~200 words." });
      }
    }

    if (tipList.length === 0) {
      tipList.push({ icon: "✅", text: "Looking good! Post when your audience is most active (Tue-Thu, 8-10am)." });
    }

    return tipList.slice(0, 4);
  }

  function getVerdict(score: number): string {
    if (score >= 9) return "🔥 Viral potential";
    if (score >= 7) return "✨ Strong performer";
    if (score >= 5) return "👍 Decent engagement";
    if (score >= 3) return "😐 Below average";
    return "⚠️ Needs work";
  }

  function getBarColor(score: number): string {
    if (score >= 7) return "bg-[#0D9488]";
    if (score >= 4) return "bg-[#F59E0B]";
    return "bg-red-500";
  }

  function clearAll() {
    setPostText("");
    setScores(null);
    setTips([]);
    setOverall(0);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/audit" className="text-[#1E3A8A] font-bold text-xl">
            Agent→Agent
          </Link>
          <Link
            href="/audit/apply"
            className="text-sm text-[#0D9488] hover:underline"
          >
            Get Your Free Audit →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="inline-block bg-[#0D9488]/10 text-[#0D9488] px-4 py-1.5 text-sm font-medium rounded-full mb-4">
          Free Tool
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
          LinkedIn Post <span className="text-[#1E3A8A]">Predictor</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Paste your post below. Get an engagement score + tips to improve before you hit publish.
        </p>
      </section>

      {/* Main Tool */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Side */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your LinkedIn Post
            </label>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Paste your LinkedIn post here..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={analyzePost}
                disabled={!postText.trim()}
                className="flex-1 bg-[#1E3A8A] text-white py-3 px-6 font-semibold hover:bg-[#1E3A8A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔮 Predict Engagement
              </button>
              <button
                onClick={clearAll}
                className="py-3 px-6 border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {postText.split(/\s+/).filter((w) => w).length} words
            </p>
          </div>

          {/* Results Side */}
          <div>
            {scores ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-gradient-to-br from-[#1E3A8A]/10 to-[#0D9488]/10 border border-[#1E3A8A]/20 p-6 text-center">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Predicted Engagement
                  </p>
                  <p className="text-6xl font-extrabold text-gray-900">{overall}</p>
                  <p className="text-lg font-semibold text-[#1E3A8A] mt-1">
                    {getVerdict(overall)}
                  </p>
                </div>

                {/* Breakdown */}
                <div className="bg-gray-50 p-6 space-y-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    Score Breakdown
                  </p>
                  {[
                    { label: "🎣 Hook", key: "hook" as const },
                    { label: "📐 Format", key: "format" as const },
                    { label: "💬 Engagement", key: "engage" as const },
                    { label: "🤝 Relatability", key: "relate" as const },
                    { label: "📏 Length", key: "length" as const },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm w-28 flex-shrink-0">{label}</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getBarColor(scores[key])} transition-all duration-500`}
                          style={{ width: `${scores[key] * 10}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-6 text-right">
                        {scores[key]}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tips */}
                <div className="bg-gray-50 p-6">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
                    💡 Tips to Improve
                  </p>
                  <div className="space-y-3">
                    {tips.map((tip, i) => (
                      <div
                        key={i}
                        className="flex gap-3 bg-white p-3 border border-gray-200 text-sm"
                      >
                        <span>{tip.icon}</span>
                        <span className="text-gray-700">{tip.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                {overall < 7 && (
                  <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 p-6 text-center">
                    <p className="text-gray-900 font-semibold mb-2">
                      Want posts that score 8+ every time?
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Our AI agents create 30 optimized posts from your content.
                    </p>
                    <Link
                      href="/audit/apply"
                      className="inline-block bg-[#1E3A8A] text-white px-6 py-3 font-semibold hover:bg-[#1E3A8A]/90 transition-colors"
                    >
                      Get Your Free Audit →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg p-12">
                <div className="text-center">
                  <p className="text-4xl mb-3">🔮</p>
                  <p>Paste a post and click "Predict Engagement"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* What We Check */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            What We Analyze
          </h2>
          <div className="grid md:grid-cols-5 gap-6 text-center">
            {[
              { icon: "🎣", title: "Hook", desc: "Does your first line stop the scroll?", weight: "30%" },
              { icon: "💬", title: "Engagement", desc: "Questions, CTAs, and conversation starters", weight: "25%" },
              { icon: "🤝", title: "Relatability", desc: "Personal stories and emotional connection", weight: "20%" },
              { icon: "📐", title: "Format", desc: "Line breaks, bullets, and visual flow", weight: "15%" },
              { icon: "📏", title: "Length", desc: "Sweet spot: 100-200 words", weight: "10%" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 border border-gray-200">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{item.desc}</p>
                <p className="text-xs font-semibold text-[#1E3A8A]">{item.weight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#1E3A8A] text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-4">
            Stop Guessing. Start Growing.
          </h2>
          <p className="text-blue-200 mb-6">
            Get 30 optimized LinkedIn posts every month. Zero blank screens.
          </p>
          <Link
            href="/audit/apply"
            className="inline-block bg-[#F59E0B] text-gray-900 px-8 py-4 text-lg font-semibold hover:bg-[#fbbf24] transition-colors"
          >
            Get Your Free Content Audit →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-200">
        <p>© 2026 Agent→Agent. All rights reserved.</p>
      </footer>
    </div>
  );
}
