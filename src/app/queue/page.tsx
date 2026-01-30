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
  
  // Parse the calendar data - handle both old and new formats
  let calendarData: any = null;
  let isNewFormat = false;
  
  if (calendar) {
    try {
      const parsed = JSON.parse(calendar.calendarJson);
      // Check if it's the new format (has weekly_calendar) or old format (array)
      if (parsed.weekly_calendar) {
        calendarData = parsed;
        isNewFormat = true;
      } else if (parsed.calendar_summary) {
        // Also new format but stored differently
        calendarData = parsed;
        isNewFormat = true;
      } else if (Array.isArray(parsed)) {
        calendarData = { calendar: parsed };
        isNewFormat = false;
      } else {
        // Try to use whatever we have
        calendarData = parsed;
        isNewFormat = !!parsed.weekly_calendar || !!parsed.calendar_summary;
      }
    } catch {
      calendarData = null;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-black">
            ← Back
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-2">30-Day Content Calendar</h1>
        <p className="text-gray-600 mb-8">Your posting schedule with specific dates, times, and content</p>

        {!calendar ? (
          <div className="text-center py-16 border border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">No calendar generated yet.</p>
            <p className="text-sm text-gray-400">
              Upload content and run the pipeline to generate a 30-day calendar.
            </p>
          </div>
        ) : isNewFormat && calendarData ? (
          <>
            {/* Summary Card */}
            <div className="mb-8 p-6 bg-gray-50 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">📊 Calendar Summary</h2>
              <div className="grid grid-cols-6 gap-4 text-center mb-6">
                <div>
                  <div className="text-3xl font-bold">{calendarData.calendar_summary?.total_posts || 0}</div>
                  <div className="text-sm text-gray-500">Total Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{calendarData.calendar_summary?.linkedin_posts || 0}</div>
                  <div className="text-sm text-gray-500">LinkedIn</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sky-500">{calendarData.calendar_summary?.twitter_posts || 0}</div>
                  <div className="text-sm text-gray-500">Twitter</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-500">{calendarData.calendar_summary?.instagram_posts || 0}</div>
                  <div className="text-sm text-gray-500">Instagram</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{calendarData.calendar_summary?.emails || 0}</div>
                  <div className="text-sm text-gray-500">Emails</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">{calendarData.calendar_summary?.blog_posts || 0}</div>
                  <div className="text-sm text-gray-500">Blog</div>
                </div>
              </div>
            </div>

            {/* Posting Schedule */}
            <div className="mb-8 p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">🕐 Posting Schedule</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-800">LinkedIn</div>
                  <div className="text-sm text-blue-600">{calendarData.posting_schedule?.linkedin}</div>
                </div>
                <div className="p-4 bg-sky-50 rounded">
                  <div className="font-semibold text-sky-800">Twitter/X</div>
                  <div className="text-sm text-sky-600">{calendarData.posting_schedule?.twitter}</div>
                </div>
                <div className="p-4 bg-pink-50 rounded">
                  <div className="font-semibold text-pink-800">Instagram</div>
                  <div className="text-sm text-pink-600">{calendarData.posting_schedule?.instagram}</div>
                </div>
                <div className="p-4 bg-green-50 rounded">
                  <div className="font-semibold text-green-800">Email</div>
                  <div className="text-sm text-green-600">{calendarData.posting_schedule?.email}</div>
                </div>
              </div>
            </div>

            {/* Strategy Notes */}
            {calendarData.strategy_notes && (
              <div className="mb-8 p-6 border border-gray-200">
                <h2 className="text-lg font-semibold mb-2">📝 Strategy Notes</h2>
                <p className="text-gray-600">{calendarData.strategy_notes}</p>
              </div>
            )}

            {/* Weekly Calendar */}
            <div className="space-y-8">
              {calendarData.weekly_calendar?.map((week: any) => (
                <div key={week.week_number} className="border border-gray-200">
                  <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">Week {week.week_number}: {week.date_range}</h3>
                      <p className="text-sm text-gray-600">Focus: {week.week_focus}</p>
                    </div>
                    <span className="text-sm text-gray-500">{week.posts?.length || 0} posts</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {week.posts?.map((post: any, i: number) => (
                      <div key={i} className="p-4 flex items-start gap-4">
                        <div className="w-24 shrink-0">
                          <div className="font-medium">{post.day}</div>
                          <div className="text-sm text-gray-500">{post.time}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-1 rounded font-medium ${
                              post.platform === "LinkedIn" ? "bg-blue-100 text-blue-800" :
                              post.platform === "Twitter/X" ? "bg-sky-100 text-sky-800" :
                              post.platform === "Instagram" ? "bg-pink-100 text-pink-800" :
                              post.platform === "Email" ? "bg-green-100 text-green-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {post.platform}
                            </span>
                            <span className="text-sm font-medium">{post.content_type}</span>
                          </div>
                          <p className="text-sm text-gray-600">{post.content_description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Content Gaps */}
            {calendarData.content_gaps && calendarData.content_gaps.length > 0 && (
              <div className="mt-8 p-6 border border-yellow-200 bg-yellow-50">
                <h2 className="text-lg font-semibold mb-2 text-yellow-800">⚠️ Content Gaps</h2>
                <ul className="list-disc list-inside text-sm text-yellow-700">
                  {calendarData.content_gaps.map((gap: string, i: number) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          // Old format fallback
          <div className="border border-gray-200">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold">Calendar ({calendarData?.calendar?.length || 0} posts)</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {calendarData?.calendar?.slice(0, 30).map((entry: any, i: number) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{entry.date} at {entry.time}</div>
                    <div className="text-sm text-gray-500">{entry.content_type}</div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100">{entry.platform}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
