import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Agent-Agent | Writers Edition",
  description: "Cognitive agent system for writers. Clear organization, placement decisions, and execution queue.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-black">
            <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                Agent-Agent
              </Link>
              <div className="flex gap-8">
                <Link href="/upload" className="hover:underline">
                  Upload
                </Link>
                <Link href="/library" className="hover:underline">
                  Library
                </Link>
                <Link href="/collections" className="hover:underline">
                  Collections
                </Link>
                <Link href="/queue" className="hover:underline">
                  Queue
                </Link>
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-black mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-600">
              Agent-Agent Writers Edition. No hype. Just decisions.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
