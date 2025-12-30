import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-bold mb-6">Agent-Agent</h1>
        <p className="text-2xl mb-4">Writers Edition</p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Turn your catalog into clear organization, placement decisions, and
          product compilation. Get an executive queue that tells you exactly
          what to do next.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="border border-black p-8">
          <h2 className="text-2xl font-bold mb-4">What It Does</h2>
          <ul className="space-y-2">
            <li>→ Organizes your catalog</li>
            <li>→ Decides where each piece goes</li>
            <li>→ Builds sellable collections</li>
            <li>→ Generates repurposing outputs</li>
            <li>→ Creates your weekly queue</li>
          </ul>
        </div>

        <div className="border border-black p-8">
          <h2 className="text-2xl font-bold mb-4">What It Does Not Do</h2>
          <ul className="space-y-2">
            <li>→ No pep talk</li>
            <li>→ No endless suggestions</li>
            <li>→ No hype or flattery</li>
            <li>→ No motivation theater</li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/upload"
          className="inline-block border-2 border-black px-8 py-4 text-lg font-semibold hover:bg-black hover:text-white transition-colors"
        >
          Start Upload
        </Link>
      </div>

      <div className="mt-24 space-y-16">
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">The Agents</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-black pl-6">
              <h3 className="text-xl font-bold mb-2">1. The Archivist</h3>
              <p className="text-gray-700">
                Answers &ldquo;What do I actually have?&rdquo; Tags themes, voice, status,
                and quality band for each piece.
              </p>
            </div>

            <div className="border-l-4 border-black pl-6">
              <h3 className="text-xl font-bold mb-2">2. The Placement Agent</h3>
              <p className="text-gray-700">
                Decides destination. Exactly one primary lane: SUBMISSION,
                PLATFORM, PRODUCT, or ARCHIVE.
              </p>
            </div>

            <div className="border-l-4 border-black pl-6">
              <h3 className="text-xl font-bold mb-2">3. The Compiler</h3>
              <p className="text-gray-700">
                Builds sellable units. Creates ebook candidates with positioning
                and launch readiness.
              </p>
            </div>

            <div className="border-l-4 border-black pl-6">
              <h3 className="text-xl font-bold mb-2">4. The Repurposer</h3>
              <p className="text-gray-700">
                Converts to platform formats. Generates threads, newsletters,
                scripts in native form.
              </p>
            </div>

            <div className="border-l-4 border-black pl-6">
              <h3 className="text-xl font-bold mb-2">5. The Executive</h3>
              <p className="text-gray-700">
                Creates your weekly queue. Strict limits: 3 submissions, 3
                platform tasks, 1 product task.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
