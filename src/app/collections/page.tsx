import Link from "next/link";

async function getPrisma() {
  const { prisma } = await import("@/lib/db");
  return prisma;
}

export default async function CollectionsPage() {
  const prisma = await getPrisma();
  const contentSeries = await prisma.contentSeries.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-black">
            ← Back
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-8">Content Series</h1>

        {contentSeries.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">No content series yet.</p>
            <p className="text-sm text-gray-400">
              Upload content and run the pipeline to generate series.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {contentSeries.map((series) => (
              <div
                key={series.id}
                className="border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{series.title}</h2>
                  <span className="text-xs px-2 py-1 bg-gray-100">
                    {series.seriesType}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{series.description}</p>
                <div className="text-sm text-gray-500">
                  <span>Theme: {series.theme}</span>
                  <span className="mx-2">•</span>
                  <span>{series.estimatedPieces} pieces</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
