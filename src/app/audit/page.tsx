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
          For Coaches & Consultants Making $100K+
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
          Stop Creating Content.<br />
          <span className="text-[#1E3A8A]">Start Repurposing It.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          One podcast episode. 30 days of content. 
          <br className="hidden md:block" />
          Zero blank screens. Zero burnout.
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
            You're Sitting on a <span className="text-[#0D9488]">Gold Mine</span>
          </h2>
          <p className="text-center text-gray-600 mb-10 text-lg">
            Your content isn't bad. It's buried.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-lg">
            <div className="bg-white p-6 border border-gray-200">
              <span className="text-[#F59E0B] font-bold">→</span> 50+ podcast episodes collecting dust
            </div>
            <div className="bg-white p-6 border border-gray-200">
              <span className="text-[#F59E0B] font-bold">→</span> 10+ hours/week on content — still feel behind
            </div>
            <div className="bg-white p-6 border border-gray-200">
              <span className="text-[#F59E0B] font-bold">→</span> Great ideas trapped in your head (or one platform)
            </div>
            <div className="bg-white p-6 border border-gray-200">
              <span className="text-[#F59E0B] font-bold">→</span> Inconsistent posting = inconsistent leads
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
                  <span>Stare at blank screens</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400">•</span>
                  <span>10-15 hours/week on content</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400">•</span>
                  <span>Pay a VA to rewrite ChatGPT outputs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400">•</span>
                  <span>Content sits in folders, never used</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400">•</span>
                  <span>Post when you remember (you won't)</span>
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
                  <span>Get 30 platform-ready pieces back</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0D9488] font-bold">✓</span>
                  <span>30-day calendar with exact dates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0D9488] font-bold">✓</span>
                  <span>LinkedIn-optimized for max engagement</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#0D9488] font-bold">✓</span>
                  <span>Copy. Paste. Post. That's it.</span>
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
            Dead Simple
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-[#1E3A8A] text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Drop Your Content</h3>
                <p className="text-gray-600">Podcast transcript. Video. Voice memo. Whatever you've got.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-[#0D9488] text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI Agents Do the Work</h3>
                <p className="text-gray-600">4 specialized agents analyze, repurpose, and schedule everything.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-[#F59E0B] text-gray-900 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Post and Grow</h3>
                <p className="text-gray-600">30 days of content. Ready to go. Just follow the calendar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900">
            30 LinkedIn Posts. Every Month.
          </h2>
          <p className="text-center text-gray-600 mb-12">Variety that keeps your audience hooked</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 p-6 hover:border-[#1E3A8A] transition-colors">
              <div className="text-3xl font-bold text-[#1E3A8A] mb-2">8-10</div>
              <h3 className="font-bold mb-2">Story Posts</h3>
              <p className="text-gray-600 text-sm">Personal narratives that build trust and connection</p>
            </div>
            <div className="border border-gray-200 p-6 hover:border-[#1E3A8A] transition-colors">
              <div className="text-3xl font-bold text-[#1E3A8A] mb-2">6-8</div>
              <h3 className="font-bold mb-2">Insight Posts</h3>
              <p className="text-gray-600 text-sm">Industry takes and contrarian perspectives</p>
            </div>
            <div className="border border-gray-200 p-6 hover:border-[#1E3A8A] transition-colors">
              <div className="text-3xl font-bold text-[#1E3A8A] mb-2">5-7</div>
              <h3 className="font-bold mb-2">Listicles</h3>
              <p className="text-gray-600 text-sm">"5 ways to..." posts that get saved and shared</p>
            </div>
            <div className="border border-gray-200 p-6 hover:border-[#1E3A8A] transition-colors">
              <div className="text-3xl font-bold text-[#0D9488] mb-2">4-5</div>
              <h3 className="font-bold mb-2">How-To Posts</h3>
              <p className="text-gray-600 text-sm">Tactical advice that positions you as the expert</p>
            </div>
            <div className="border border-gray-200 p-6 hover:border-[#1E3A8A] transition-colors">
              <div className="text-3xl font-bold text-[#0D9488] mb-2">3-4</div>
              <h3 className="font-bold mb-2">Hot Takes</h3>
              <p className="text-gray-600 text-sm">Bold opinions that spark conversation</p>
            </div>
            <div className="border border-gray-200 p-6 hover:border-[#1E3A8A] transition-colors">
              <div className="text-3xl font-bold text-[#F59E0B] mb-2">30</div>
              <h3 className="font-bold mb-2">Day Calendar</h3>
              <p className="text-gray-600 text-sm">Exact dates. Exact times. Just follow it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Single Tier */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            One Price. <span className="text-[#0D9488]">Everything Included.</span>
          </h2>
          <p className="text-gray-600 mb-12">
            No tiers. No upsells. Just results.
          </p>
          
          {/* Single Pricing Card */}
          <div className="border-2 border-[#1E3A8A] p-10 bg-white text-left max-w-md mx-auto relative">
            <div className="absolute -top-3 right-4 bg-[#F59E0B] text-gray-900 px-3 py-1 text-xs font-bold">
              FULL ACCESS
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Agent→Agent</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <p className="text-5xl font-extrabold text-[#1E3A8A]">$39</p>
              <p className="text-gray-500">/month</p>
            </div>
            <ul className="space-y-3 text-gray-600 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488] font-bold">✓</span> 30 LinkedIn posts monthly
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488] font-bold">✓</span> 30-day publishing calendar
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488] font-bold">✓</span> Mix of story, insight, listicle, how-to
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488] font-bold">✓</span> Algorithm-optimized formatting
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488] font-bold">✓</span> Generated in minutes
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488] font-bold">✓</span> Cancel anytime
              </li>
            </ul>
            <Link
              href="/audit/apply"
              className="block w-full bg-[#1E3A8A] text-white py-4 text-center font-semibold hover:bg-[#1E3A8A]/90 transition-colors text-lg"
            >
              Start Your Free Audit →
            </Link>
            <p className="text-center text-sm text-gray-500 mt-4">
              See what we'd create before you pay anything
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
            Questions? Answers.
          </h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">What content do I need?</h3>
              <p className="text-gray-600">Anything with your voice — podcast transcripts, videos, blog posts, voice memos, rough notes. The more raw material, the more we create.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">How is this different from ChatGPT?</h3>
              <p className="text-gray-600">ChatGPT gives you one piece at a time. We give you a content operation — library, repurposed content for every platform, and a complete schedule. Tool vs. system.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">What's in the free audit?</h3>
              <p className="text-gray-600">Send us 2-3 pieces of your content. We'll show you exactly what we'd create — sample posts, calendar preview, gap analysis. No obligation.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">Who is this for?</h3>
              <p className="text-gray-600">Coaches, consultants, and creators making $100K+ who know content drives clients — but hate the content grind.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="font-bold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes. No contracts. No commitments. If it's not working, you're out.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#1E3A8A] text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            Your Content Is Already Good.
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Let's make sure people actually see it.
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
