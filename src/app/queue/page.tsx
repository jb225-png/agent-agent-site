import Link from "next/link";

async function getPrisma() {
  const { prisma } = await import("@/lib/db");
  return prisma;
}

export default async function QueuePage() {
  const prisma = await getPrisma();
  const calendars = await prisma.contentCalendar.findMany({
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  const calendar = calendars[0];
  const entries = calendar ? JSON.parse(calendar.calendarJson) : [];
  const weeklyBreakdown = calendar ? JSON.parse(calendar.weeklyBreakdownJson) : {};

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-black">
            ← Back
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-8">Content Calendar</h1>

        {!calendar ? (
          <div className="text-center py-16 border border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">No calendar generated yet.</p>
            <p className="text-sm text-gray-400">
              Upload content and run the pipeline to generate a 30-day calendar.
            </p>
          </div>
        ) : (
          <>
            {/* Weekly Breakdown */}
            <div className="mb-8 p-6 bg-gray-50 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Weekly Target</h2>
              <div className="grid grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{weeklyBreakdown.linkedin_posts || 0}</div>
                  <div className="text-sm text-gray-500">LinkedIn</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{weeklyBreakdown.twitter_posts || 0}</div>
                  <div className="text-sm text-gray-500">Twitter</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{weeklyBreakdown.instagram_posts || 0}</div>
                  <div className="text-sm text-gray-500">Instagram</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{weeklyBreakdown.emails || 0}</div>
                  <div className="text-sm text-gray-500">Email</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{weeklyBreakdown.blog_posts || 0}</div>
                  <div className="text-sm text-gray-500">Blog</div>
                </div>
              </div>
            </div>

            {/* Strategy Notes */}
            {calendar.strategyNotes && (
              <div className="mb-8 p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-2">Strategy Notes</h2>
                <p className="text-gray-600">{calendar.strategyNotes}</p>
              </div>
            )}

            {/* Calendar Entries */}
            <div className="border border-gray-200">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold">30-Day Schedule ({entries.length} posts)</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {entries.slice(0, 20).map((entry: any, i: number) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{entry.date} at {entry.time}</div>
                      <div className="text-sm text-gray-500">{entry.content_type}</div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100">
                      {entry.platform}
                    </span>
                  </div>
                ))}
                {entries.length > 20 && (
                  <div className="p-4 text-center text-sm text-gray-500">
                    + {entries.length - 20} more entries
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
