/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";

// SUCCESS PAGE - After Stripe payment completes
// Brand: Deep Blue (#1E3A8A), Teal (#0D9488), Amber (#F59E0B)

export default function BuySuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-6 py-12 text-center">
        <div className="bg-white border border-gray-200 p-12 shadow-sm">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-[#0D9488] text-white flex items-center justify-center text-4xl mx-auto mb-6 rounded-full">
            ✓
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Agent→Agent!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your subscription is active. Let's generate your first 30-day calendar.
          </p>

          <div className="bg-[#1E3A8A]/5 border border-[#1E3A8A]/20 p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-3">Your dashboard includes:</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488]">✓</span>
                <span>30 LinkedIn posts generated from your content</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488]">✓</span>
                <span>30-day calendar with optimal posting times</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488]">✓</span>
                <span>One-click copy for each post</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9488]">✓</span>
                <span>Generate new calendars anytime</span>
              </li>
            </ul>
          </div>

          <Link
            href="/dashboard"
            className="inline-block bg-[#1E3A8A] text-white px-8 py-4 font-semibold text-lg hover:bg-[#1E3A8A]/90 transition-colors"
          >
            Go to My Dashboard →
          </Link>

          <p className="text-gray-500 text-sm mt-6">
            Questions? Email us at{" "}
            <a href="mailto:rbb.outreach@gmail.com" className="text-[#1E3A8A] underline">
              rbb.outreach@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
