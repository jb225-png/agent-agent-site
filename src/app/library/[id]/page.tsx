import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

async function getPrisma() {
  const { prisma } = await import("@/lib/db");
  return prisma;
}

export const dynamic = "force-dynamic";

export default async function PieceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const prisma = await getPrisma();
  const piece = await prisma.piece.findUnique({
    where: { id: params.id },
    include: {
      archivistTags: true,
      placement: true,
      repurposeOutputs: true,
    },
  });

  if (!piece) {
    notFound();
  }

  const themes = piece.archivistTags
    ? JSON.parse(piece.archivistTags.themesJson)
    : [];
  const voiceTags = piece.archivistTags
    ? JSON.parse(piece.archivistTags.voiceTagsJson)
    : [];
  const outlets = piece.placement
    ? JSON.parse(piece.placement.outletsJson)
    : [];
  const secondaryUses = piece.placement
    ? JSON.parse(piece.placement.secondaryJson)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/library" className="text-sm hover:underline mb-4 block">
          ← Back to Library
        </Link>
        <h1 className="text-4xl font-bold mb-2">{piece.title}</h1>
        <div className="flex gap-6 text-sm text-gray-600">
          <span>{piece.wordCount.toLocaleString()} words</span>
          <span>Added {format(new Date(piece.createdAt), "MMM d, yyyy")}</span>
          <span>Source: {piece.source}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Archivist Tags */}
        {piece.archivistTags && (
          <div className="border border-black p-6">
            <h2 className="text-xl font-bold mb-4">The Archivist</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Status</h3>
                <p>{piece.archivistTags.status}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Quality Band</h3>
                <p className="text-2xl font-bold">
                  {piece.archivistTags.qualityBand}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {themes.map((theme: string) => (
                    <span
                      key={theme}
                      className="border border-black px-2 py-1 text-sm"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Voice Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {voiceTags.map((tag: string) => (
                    <span
                      key={tag}
                      className="border border-black px-2 py-1 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Notes</h3>
                <p className="text-sm">{piece.archivistTags.notes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Placement */}
        {piece.placement && (
          <div className="border border-black p-6">
            <h2 className="text-xl font-bold mb-4">The Placement Agent</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Primary Lane</h3>
                <p className="text-xl font-bold">{piece.placement.primaryLane}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Recommended Action</h3>
                <p>{piece.placement.recommendedNextAction}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Exclusivity</h3>
                <p className="text-sm">{piece.placement.exclusivity}</p>
              </div>
              {outlets.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-1">Target Outlets</h3>
                  <ul className="list-disc list-inside text-sm">
                    {outlets.map((outlet: string) => (
                      <li key={outlet}>{outlet}</li>
                    ))}
                  </ul>
                </div>
              )}
              {secondaryUses.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-1">Secondary Uses</h3>
                  <ul className="list-disc list-inside text-sm">
                    {secondaryUses.map((use: string) => (
                      <li key={use}>{use}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Repurpose Outputs */}
      {piece.repurposeOutputs.length > 0 && (
        <div className="mb-8 border border-black p-6">
          <h2 className="text-xl font-bold mb-4">The Repurposer</h2>
          <div className="space-y-6">
            {piece.repurposeOutputs.map((output) => (
              <div key={output.id}>
                <h3 className="font-semibold mb-2">{output.format}</h3>
                <pre className="bg-gray-100 p-4 text-sm whitespace-pre-wrap border border-gray-300">
                  {output.content}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Original Content */}
      <div className="border border-black p-6">
        <h2 className="text-xl font-bold mb-4">Original Content</h2>
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">
            {piece.body}
          </pre>
        </div>
      </div>
    </div>
  );
}
