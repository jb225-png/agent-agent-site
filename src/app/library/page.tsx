import Link from "next/link";
import { format } from "date-fns";
import LibraryFilters from "./LibraryFilters";

async function getPrisma() {
  const { prisma } = await import("@/lib/db");
  return prisma;
}

export const dynamic = "force-dynamic";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: { platform?: string; status?: string; quality?: string };
}) {
  const prisma = await getPrisma();
  const { platform, status, quality } = searchParams;

  const pieces = await prisma.piece.findMany({
    include: {
      archivistTags: true,
      placement: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const filtered = pieces.filter((piece) => {
    if (platform && piece.placement?.primaryPlatform !== platform) return false;
    if (status && piece.archivistTags?.status !== status) return false;
    if (quality && piece.archivistTags?.qualityBand !== quality) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Content Library</h1>
          <p className="text-gray-600">
            {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/upload"
          className="border-2 border-black px-6 py-2 font-semibold hover:bg-black hover:text-white transition-colors"
        >
          Upload New
        </Link>
      </div>

      {/* Filters */}
      <LibraryFilters />

      {/* Pieces Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-black">
          <p className="text-gray-600 mb-4">No pieces found.</p>
          <Link href="/upload" className="underline">
            Upload your first piece
          </Link>
        </div>
      ) : (
        <div className="border border-black">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left p-4 font-bold">Title</th>
                <th className="text-left p-4 font-bold">Words</th>
                <th className="text-left p-4 font-bold">Quality</th>
                <th className="text-left p-4 font-bold">Status</th>
                <th className="text-left p-4 font-bold">Platform</th>
                <th className="text-left p-4 font-bold">Potential</th>
                <th className="text-left p-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((piece) => (
                <tr key={piece.id} className="border-b border-gray-300 hover:bg-gray-100">
                  <td className="p-4">
                    <Link
                      href={`/library/${piece.id}`}
                      className="font-semibold hover:underline"
                    >
                      {piece.title}
                    </Link>
                  </td>
                  <td className="p-4">{piece.wordCount.toLocaleString()}</td>
                  <td className="p-4">
                    {piece.archivistTags?.qualityBand || "—"}
                  </td>
                  <td className="p-4 text-sm">
                    {piece.archivistTags?.status || "—"}
                  </td>
                  <td className="p-4 text-sm">
                    {piece.placement?.primaryPlatform || "—"}
                  </td>
                  <td className="p-4 text-sm">
                    {piece.placement?.contentPotential || "—"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {format(new Date(piece.createdAt), "MMM d")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
