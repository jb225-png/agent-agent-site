import Link from "next/link";

// Separate layout for audit/marketing pages (no app navigation)
export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header with logo only */}
      <header className="border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/audit" className="text-xl font-bold text-[#1E3A8A]">
            Agent→Agent
          </Link>
          <Link 
            href="/audit/apply" 
            className="bg-[#1E3A8A] text-white px-5 py-2 font-medium hover:bg-[#1e3a8a]/90 transition-colors"
          >
            Get Free Audit
          </Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
