/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

// LANDING PAGE - Sales page for Free Content Audit
// Copy placeholders marked with [COPY: ...] for Claude Cowork to fill in

export default function AuditLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          {/* [COPY: HEADLINE] */}
          Fire Your $6k/Month Marketing Manager
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {/* [COPY: SUBHEADLINE] */}
          Get a month of platform-ready content from a single podcast episode. 
          No more staring at blank screens. No more 'what should I post today?'
        </p>
        <Link
          href="/audit/apply"
          className="inline-block bg-black text-white px-10 py-5 text-xl font-semibold hover:bg-gray-800 transition-colors"
        >
          {/* [COPY: CTA_BUTTON] */}
          Get Your Free Content Audit →
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          {/* [COPY: CTA_SUBTEXT] */}
          Takes 5 minutes. See exactly what we would create from your content.
        </p>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {/* [COPY: PROBLEM_HEADLINE] */}
            You are Sitting on a Gold Mine of Content
          </h2>
          <div className="space-y-4 text-lg text-gray-700">
            {/* [COPY: PROBLEM_BULLETS] */}
            <p>→ You've done 50+ podcast episodes, but they are just sitting there</p>
            <p>→ You spend 10+ hours/week on content and still feel behind</p>
            <p>→ Your marketing manager costs $6k/month and you are not sure what they do</p>
            <p>→ You know content = clients, but the grind is killing you</p>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {/* [COPY: COMPARISON_HEADLINE] */}
            The Old Way vs. The Agent-Agent Way
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Old Way */}
            <div className="border border-gray-300 p-8 bg-gray-50">
              <h3 className="text-xl font-bold mb-6 text-gray-500">❌ The Old Way</h3>
              <ul className="space-y-3 text-gray-600">
                {/* [COPY: OLD_WAY_BULLETS] */}
                <li>• Hire a $6k/month marketing manager</li>
                <li>• Spend 10-15 hours/week on content</li>
                <li>• Stare at blank screens wondering what to post</li>
                <li>• Content sits in folders, never repurposed</li>
                <li>• Inconsistent posting = inconsistent leads</li>
              </ul>
            </div>
            {/* New Way */}
            <div className="border-2 border-black p-8">
              <h3 className="text-xl font-bold mb-6">✓ The Agent-Agent Way</h3>
              <ul className="space-y-3">
                {/* [COPY: NEW_WAY_BULLETS] */}
                <li>• Upload one piece of content</li>
                <li>• Get 20-30 platform-ready pieces back</li>
                <li>• 30-day calendar with exact posting schedule</li>
                <li>• LinkedIn, Twitter, Email, Instagram — all done</li>
                <li>• Fraction of the cost, 10x the output</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {/* [COPY: HOW_IT_WORKS_HEADLINE] */}
            How It Works
          </h2>
          <div className="space-y-8">
            {/* [COPY: HOW_IT_WORKS_STEPS] */}
            <div className="flex gap-6">
              <div className="text-4xl font-bold text-gray-300">1</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Send Us Your Content</h3>
                <p className="text-gray-600">Podcast transcript, video, blog post, voice memo — whatever you've got.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-4xl font-bold text-gray-300">2</div>
              <div>
                <h3 className="text-xl font-bold mb-2">Our Agents Go to Work</h3>
                <p className="text-gray-600">4 specialized AI agents analyze, organize, repurpose, and schedule your content.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-4xl font-bold text-gray-300">3</div>
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
          <h2 className="text-3xl font-bold mb-12 text-center">
            {/* [COPY: WHAT_YOU_GET_HEADLINE] */}
            What You Get Every Month
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* [COPY: DELIVERABLES] */}
            <div className="border border-black p-6">
              <h3 className="font-bold mb-2">5-7 LinkedIn Posts</h3>
              <p className="text-gray-600 text-sm">Story posts, insight posts, listicles — formatted for the algorithm</p>
            </div>
            <div className="border border-black p-6">
              <h3 className="font-bold mb-2">3-5 Twitter Threads</h3>
              <p className="text-gray-600 text-sm">Hook + value + CTA structure that drives engagement</p>
            </div>
            <div className="border border-black p-6">
              <h3 className="font-bold mb-2">5-7 Instagram Captions</h3>
              <p className="text-gray-600 text-sm">With hashtag strategies and carousel suggestions</p>
            </div>
            <div className="border border-black p-6">
              <h3 className="font-bold mb-2">1-2 Email Drafts</h3>
              <p className="text-gray-600 text-sm">Newsletter-ready with subject lines that get opens</p>
            </div>
            <div className="border border-black p-6">
              <h3 className="font-bold mb-2">1 Blog Outline</h3>
              <p className="text-gray-600 text-sm">SEO-structured with headers, key points, and CTAs</p>
            </div>
            <div className="border border-black p-6">
              <h3 className="font-bold mb-2">30-Day Calendar</h3>
              <p className="text-gray-600 text-sm">Exact dates, times, and platform rotation — just follow the plan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {/* [COPY: PRICING_HEADLINE] */}
            Simple Pricing, Massive Value
          </h2>
          <p className="text-gray-600 mb-12">
            {/* [COPY: PRICING_SUBHEAD] */}
            Choose the level of done-for-you that fits your business
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* [COPY: TIER_1] */}
            <div className="border border-black p-8 text-left">
              <h3 className="text-2xl font-bold mb-2">Strategy</h3>
              <p className="text-4xl font-bold mb-4">$2,500<span className="text-lg font-normal text-gray-500">/mo</span></p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li>✓ 20-30 pieces of content</li>
                <li>✓ 30-day publishing calendar</li>
                <li>✓ Platform recommendations</li>
                <li>✓ Monthly strategy call</li>
              </ul>
            </div>
            {/* [COPY: TIER_2] */}
            <div className="border-2 border-black p-8 text-left bg-black text-white">
              <h3 className="text-2xl font-bold mb-2">White-Glove</h3>
              <p className="text-4xl font-bold mb-4">$4,500<span className="text-lg font-normal text-gray-400">/mo</span></p>
              <ul className="space-y-2 text-gray-300 mb-6">
                <li>✓ Everything in Strategy</li>
                <li>✓ We post everything for you</li>
                <li>✓ Comment monitoring</li>
                <li>✓ Weekly performance reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">
            {/* [COPY: FAQ_HEADLINE] */}
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {/* [COPY: FAQ_ITEMS] */}
            <div>
              <h3 className="font-bold mb-2">What kind of content do I need to provide?</h3>
              <p className="text-gray-600">Anything with your voice and ideas — podcast transcripts, video transcripts, blog posts, voice memos, even rough notes. The more raw material, the more we can create.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">How is this different from ChatGPT?</h3>
              <p className="text-gray-600">ChatGPT gives you one piece at a time. We give you an entire content operation — organized library, repurposed content for every platform, and a complete posting schedule. It's the difference between a tool and a system.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">What is included in the free audit?</h3>
              <p className="text-gray-600">Send us 2-3 pieces of your existing content. We'll run it through our system and show you exactly what we would create — sample posts, calendar preview, and gap analysis. No obligation.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Who is this for?</h3>
              <p className="text-gray-600">Executive coaches, business coaches, and consultants doing $500k-5M/year who know content drives clients but hate the content grind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-black text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {/* [COPY: FINAL_CTA_HEADLINE] */}
            Ready to See What We Can Create?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {/* [COPY: FINAL_CTA_SUBHEAD] */}
            Get your free content audit. No commitment. Just results.
          </p>
          <Link
            href="/audit/apply"
            className="inline-block bg-white text-black px-10 py-5 text-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Get Your Free Content Audit →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>© 2026 Agent-Agent. All rights reserved.</p>
      </footer>
    </div>
  );
}
