/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

// LINKEDIN LANDING PAGE - $39 Self-Serve Offer
// Optimized for impulse purchase - fast, clear, direct
// Brand: Deep Blue (#1E3A8A), Teal (#0D9488), Amber (#F59E0B)

export default function LinkedInLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clear, Direct, Fast */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
          30 LinkedIn Posts.<br />
          <span className="text-[#0D9488]">Done For You.</span><br />
          <span className="text-[#1E3A8A]">$39.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Stop staring at blank screens. Paste your content, 
          get 30 days of LinkedIn posts delivered in 48 hours.
        </p>
        <Link
          href="/buy"
          className="inline-block bg-[#0D9488] text-white px-10 py-5 text-xl font-semibold hover:bg-[#0D9488]/90 transition-colors shadow-lg"
        >
          Get My 30 Posts — $39
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          ⚡ Delivered in 48 hours • 🔒 7-day money-back guarantee
        </p>
      </section>

      {/* What You Get - Visual & Fast */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">
            What You Get
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-gray-200 flex items-start gap-4">
              <div className="text-3xl">📝</div>
              <div>
                <h3 className="font-bold text-lg mb-1">30 LinkedIn Posts</h3>
                <p className="text-gray-600">Ready to copy-paste. Formatted for the algorithm.</p>
              </div>
            </div>
            <div className="bg-white p-6 border border-gray-200 flex items-start gap-4">
              <div className="text-3xl">📅</div>
              <div>
                <h3 className="font-bold text-lg mb-1">30-Day Calendar</h3>
                <p className="text-gray-600">Exact posting schedule. Just follow the plan.</p>
              </div>
            </div>
            <div className="bg-white p-6 border border-gray-200 flex items-start gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="font-bold text-lg mb-1">Multiple Formats</h3>
                <p className="text-gray-600">Stories, insights, listicles, tips — variety that works.</p>
              </div>
            </div>
            <div className="bg-white p-6 border border-gray-200 flex items-start gap-4">
              <div className="text-3xl">⚡</div>
              <div>
                <h3 className="font-bold text-lg mb-1">48-Hour Delivery</h3>
                <p className="text-gray-600">Pay today, posts in your inbox by day after tomorrow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Anchor */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-[#1E3A8A]/5 border border-[#1E3A8A]/20 p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              The Math Makes Sense
            </h2>
            <div className="space-y-3 text-lg text-gray-600 mb-6">
              <p><span className="line-through text-gray-400">LinkedIn ghostwriter: $2,000-3,000/month</span></p>
              <p><span className="line-through text-gray-400">Content agency: $1,500-5,000/month</span></p>
              <p><span className="line-through text-gray-400">Your time (10 hrs/week × $200/hr): $8,000/month</span></p>
            </div>
            <p className="text-3xl font-extrabold text-[#0D9488]">
              30 posts for $39 = $9.90 per post
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - 3 Steps */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1E3A8A] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg mb-2">Paste Your Content</h3>
              <p className="text-gray-600">Podcast transcript, blog post, video script, notes — whatever you've got.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0D9488] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg mb-2">AI Creates Your Posts</h3>
              <p className="text-gray-600">Our agents analyze your content and generate 30 unique LinkedIn posts.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F59E0B] text-gray-900 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg mb-2">Copy, Paste, Post</h3>
              <p className="text-gray-600">Get your posts + calendar in 48 hours. Just follow the schedule.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
            Perfect For You If...
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-lg">
              <span className="text-[#0D9488] font-bold mt-1">✓</span>
              <span>You know you should post on LinkedIn but never have time</span>
            </div>
            <div className="flex items-start gap-3 text-lg">
              <span className="text-[#0D9488] font-bold mt-1">✓</span>
              <span>You have content (podcasts, blogs, ideas) collecting dust</span>
            </div>
            <div className="flex items-start gap-3 text-lg">
              <span className="text-[#0D9488] font-bold mt-1">✓</span>
              <span>You hate staring at blank screens trying to be "creative"</span>
            </div>
            <div className="flex items-start gap-3 text-lg">
              <span className="text-[#0D9488] font-bold mt-1">✓</span>
              <span>You want consistent posting without the grind</span>
            </div>
            <div className="flex items-start gap-3 text-lg">
              <span className="text-[#0D9488] font-bold mt-1">✓</span>
              <span>You'd rather spend $39 than 10 hours writing posts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-[#0D9488]/10 py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900">
            7-Day Money-Back Guarantee
          </h2>
          <p className="text-gray-600 text-lg">
            Not happy with your posts? Email us within 7 days for a full refund. 
            No questions asked. We take the risk so you don't have to.
          </p>
        </div>
      </section>

      {/* FAQ - Short */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900">
            Quick Questions
          </h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">What content do I need to provide?</h3>
              <p className="text-gray-600">Anything with your ideas — a podcast transcript, blog post, video script, or even rough notes. Minimum 500 words.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">How long until I get my posts?</h3>
              <p className="text-gray-600">48 hours or less. Most orders deliver within 24 hours.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">Can I request revisions?</h3>
              <p className="text-gray-600">Yes — one round of revisions included. Or just grab your refund if you're not happy.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">Is this just ChatGPT?</h3>
              <p className="text-gray-600">No. This is a multi-agent system that analyzes your content, extracts themes, and creates platform-optimized posts with a strategic calendar. ChatGPT gives you one generic post at a time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1E3A8A] text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            30 Days of LinkedIn Content.<br />
            Done in 48 Hours.
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Stop overthinking. Start posting.
          </p>
          <Link
            href="/buy"
            className="inline-block bg-[#F59E0B] text-gray-900 px-10 py-5 text-xl font-semibold hover:bg-[#fbbf24] transition-colors shadow-lg"
          >
            Get My 30 Posts — $39
          </Link>
          <p className="text-sm text-blue-200 mt-4">
            🔒 Secure checkout • ⚡ 48-hour delivery • 💯 7-day guarantee
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200">
        <p>© 2026 Agent→Agent. All rights reserved.</p>
      </footer>
    </div>
  );
}
