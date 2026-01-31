/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

// LANDING PAGE - Sales page for Free Content Audit
// Brand: Deep Blue (#1E3A8A), Teal (#0D9488), Amber (#F59E0B)
// Font: Inter

export default function AuditLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-[#0D9488]/10 text-[#0D9488] px-4 py-1.5 text-sm font-medium rounded-full mb-6">
          For Executive Coaches Making $500K-5M/Year
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
          Fire Your $6K/Month<br />
          <span className="text-[#1E3A8A]">Marketing Manager</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Turn one podcast episode into 30 days of content. 
          No more blank screens. No more "what should I post?"
        </p>
        <Link
          href="/audit/apply"
          className="inline-block bg-[#1E3A8A] text-white px-10 py-5 text-xl font-semibold hover:bg-[#1e3a8a]/90 transition-colors"
        >
          Get Your Free Content Audit →
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          Takes 5 minutes • See exactly what we'd create from your content
        </p>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
            You're Sitting on a <span className="text-[#0D9488]">Gold Mine</span> of Content
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-lg">
            <div className="bg-white p-6 border border-gray-200">
              <span className="text-[#F59E0B] font-bold">→</span> You've done 50+ podcast episodes, but they're just sitting there
            </div>
            <div className="bg-white p-6 border border-gray-200">
              <span className="text-[#F59E0B] font-bold">→</span> You spend 10+ hours/week on content and still feel behind
            </div>
            <div className="bg-white p-6 border border-gray-200">
              <span className="text-[#F59E0B] font-bold">→</span> Your marketing manager costs $6k/month and you're not sure what they do
            </div>
            <div className="bg-white p-6 border border-gray-200">
              <span className="text-[#F59E0B] font-bold">→</span> You know content = clients, but the grind is killing you
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
            The Old Way vs. <span className="text-[#1E3A8A]">Agent→Agent</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="border border-gray-200 p-8 bg-gray-50">
              <h3 className="text-xl font-bold mb-6 text-gray-400">❌ The Old Way</h3>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-gray-400">•</span>
                  <span>Hire a $6k/month marketing manager</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400">•</span>
                  <span>Spend 10-15 hours/week on content</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400">•</span>
                  <span>Stare at blank screens wondering what to post</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400">•</span>
                  <span>Content sits in folders, never repurposed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400">•</span>
                  <span>Inconsistent posting = inconsistent leads</span>
                </li>
              </ul>
            </div>
            {/* New Way */}
            <div className="border-2 border-[#1E3A8A] p-8">
              <h3 className="text-xl font-bold mb-6 text-[#1E3A8A]">✓ The Agent→Agent Way</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-[#0D9488] font-bold">✓</span>
                  <span>Upload one piece of content</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0D9488] font-bold">✓</span>
                  <span>Get 20-30 platform-ready pieces back</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0D9488] font-bold">✓</span>
                  <span>30-day calendar with exact posting schedule</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0D9488] font-bold">✓</span>
                  <span>LinkedIn, Twitter, Email, Instagram — all done</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0D9488] font-bold">✓</span>
                  <span>Fraction of the cost, 10x the output</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
            How It Works
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-[#1E3A8A] text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Send Us Your Content</h3>
                <p className="text-gray-600">Podcast transcript, video, blog post, voice memo — whatever you've got.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-[#0D9488] text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Our AI Agents Go to Work</h3>
                <p className="text-gray-600">4 specialized agents analyze, organize, repurpose, and schedule your content.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-[#F59E0B] text-gray-900 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Get Your Content Machine</h3>
                <p className="text-gray-600">20-30 ready-to-post pieces + a 30-day calendar. Just copy, paste, post.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900">
            What You Get Every Month
          </h2>
          <p className="text-center text-gray-600 mb-12">From a single content upload</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 p-6 hover:border-[#1E3A8A] transition-colors">
              <div className="text-3xl font-bold text-[#1E3A8A] mb-2">5-7</div>
              <h3 className="font-bold mb-2">LinkedIn Posts</h3>
              <p className="text-gray-600 text-sm">Story posts, insight posts, listicles — formatted for the algorithm</p>
            </div>
            <div className="border border-gray-200 p-6 hover:border-[#1E3A8A] transition-colors">
              <div className="text-3xl font-bold text-[#1E3A8A] mb-2">3-5</div>
              <h3 className="font-bold mb-2">Twitter Threads</h3>
              <p className="text-gray-600 text-sm">Hook + value + CTA structure that drives engagement</p>
            </div>
            <div className="border border-gray-200 p-6 hover:border-[#1E3A8A] transition-colors">
              <div className="text-3xl font-bold text-[#1E3A8A] mb-2">5-7</div>
              <h3 className="font-bold mb-2">Instagram Captions</h3>
              <p className="text-gray-600 text-sm">With hashtag strategies and carousel suggestions</p>
            </div>
            <div className="border border-gray-200 p-6 hover:border-[#1E3A8A] transition-colors">
              <div className="text-3xl font-bold text-[#0D9488] mb-2">1-2</div>
              <h3 className="font-bold mb-2">Email Drafts</h3>
              <p className="text-gray-600 text-sm">Newsletter-ready with subject lines that get opens</p>
            </div>
            <div className="border border-gray-200 p-6 hover:border-[#1E3A8A] transition-colors">
              <div className="text-3xl font-bold text-[#0D9488] mb-2">1</div>
              <h3 className="font-bold mb-2">Blog Outline</h3>
              <p className="text-gray-600 text-sm">SEO-structured with headers, key points, and CTAs</p>
            </div>
            <div className="border border-gray-200 p-6 hover:border-[#1E3A8A] transition-colors">
              <div className="text-3xl font-bold text-[#F59E0B] mb-2">30</div>
              <h3 className="font-bold mb-2">Day Calendar</h3>
              <p className="text-gray-600 text-sm">Exact dates, times, and platform rotation — just follow the plan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Simple Pricing, <span className="text-[#0D9488]">Massive Value</span>
          </h2>
          <p className="text-gray-600 mb-12">
            Choose the level of done-for-you that fits your business
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Tier 1 */}
            <div className="border border-gray-200 p-8 text-left bg-white">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Strategy</h3>
              <p className="text-5xl font-extrabold text-[#1E3A8A] mb-1">$2,500</p>
              <p className="text-gray-500 mb-6">/month</p>
              <ul className="space-y-3 text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-[#0D9488]">✓</span> 20-30 pieces of content
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0D9488]">✓</span> 30-day publishing calendar
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0D9488]">✓</span> Platform recommendations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0D9488]">✓</span> Monthly strategy call
                </li>
              </ul>
              <Link
                href="/audit/apply"
                className="block w-full border-2 border-[#1E3A8A] text-[#1E3A8A] py-3 text-center font-semibold hover:bg-[#1E3A8A] hover:text-white transition-colors"
              >
                Start Free Audit
              </Link>
            </div>
            {/* Tier 2 */}
            <div className="border-2 border-[#1E3A8A] p-8 text-left bg-[#1E3A8A] text-white relative">
              <div className="absolute -top-3 right-4 bg-[#F59E0B] text-gray-900 px-3 py-1 text-xs font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">White-Glove</h3>
              <p className="text-5xl font-extrabold mb-1">$4,500</p>
              <p className="text-blue-200 mb-6">/month</p>
              <ul className="space-y-3 text-blue-100 mb-8">
                <li className="flex items-center gap-2">
                  <span className="text-[#0D9488]">✓</span> Everything in Strategy
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0D9488]">✓</span> We post everything for you
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0D9488]">✓</span> Comment monitoring
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#0D9488]">✓</span> Weekly performance reports
                </li>
              </ul>
              <Link
                href="/audit/apply"
                className="block w-full bg-white text-[#1E3A8A] py-3 text-center font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Free Audit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">What kind of content do I need to provide?</h3>
              <p className="text-gray-600">Anything with your voice and ideas — podcast transcripts, video transcripts, blog posts, voice memos, even rough notes. The more raw material, the more we can create.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">How is this different from ChatGPT?</h3>
              <p className="text-gray-600">ChatGPT gives you one piece at a time. We give you an entire content operation — organized library, repurposed content for every platform, and a complete posting schedule. It's the difference between a tool and a system.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">What's included in the free audit?</h3>
              <p className="text-gray-600">Send us 2-3 pieces of your existing content. We'll run it through our system and show you exactly what we'd create — sample posts, calendar preview, and gap analysis. No obligation.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">Who is this for?</h3>
              <p className="text-gray-600">Executive coaches, business coaches, and consultants doing $500k-5M/year who know content drives clients but hate the content grind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1E3A8A] text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Ready to See What We Can Create?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Get your free content audit. No commitment. Just results.
          </p>
          <Link
            href="/audit/apply"
            className="inline-block bg-[#F59E0B] text-gray-900 px-10 py-5 text-xl font-semibold hover:bg-[#fbbf24] transition-colors"
          >
            Get Your Free Content Audit →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200">
        <p>© 2026 Agent→Agent. All rights reserved.</p>
      </footer>
    </div>
  );
}
