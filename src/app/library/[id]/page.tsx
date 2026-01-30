import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import RunAgentsButton from "./RunAgentsButton";

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
  const keyInsights = piece.archivistTags
    ? JSON.parse(piece.archivistTags.keyInsightsJson || "[]")
    : [];
  const secondaryPlatforms = piece.placement
    ? JSON.parse(piece.placement.secondaryPlatformsJson || "[]")
    : [];
  const recommendedFormats = piece.placement
    ? JSON.parse(piece.placement.recommendedFormatsJson || "[]")
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

      {/* Run Agents Button */}
      {!piece.archivistTags && !piece.placement && (
        <div className="mb-8 p-6 border border-black bg-gray-50">
          <p className="mb-4">This piece hasn&apos;t been analyzed yet. Run the agent pipeline to get:</p>
          <ul className="list-disc list-inside mb-4 text-sm space-y-1">
            <li>Themes, voice tags, key insights (Archivist)</li>
            <li>Platform placement and content potential (Placement Agent)</li>
            <li>LinkedIn posts, Twitter threads, email drafts (Repurposer)</li>
          </ul>
          <RunAgentsButton pieceId={piece.id} />
        </div>
      )}

      {(piece.archivistTags || piece.placement) && (
        <div className="mb-4">
          <RunAgentsButton pieceId={piece.id} />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Archivist Tags */}
        {piece.archivistTags && (
          <div className="border border-black p-6">
            <h2 className="text-xl font-bold mb-4">The Archivist</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold mb-1 text-sm">Status</h3>
                  <p className="text-lg">{piece.archivistTags.status}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-sm">Quality</h3>
                  <p className="text-2xl font-bold">
                    {piece.archivistTags.qualityBand}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-sm">Type</h3>
                  <p className="text-sm">{piece.archivistTags.contentType}</p>
                </div>
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
              {keyInsights.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-1">Key Insights</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {keyInsights.map((insight: string, i: number) => (
                      <li key={i}>{insight}</li>
                    ))}
                  </ul>
                </div>
              )}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1 text-sm">Primary Platform</h3>
                  <p className="text-xl font-bold">{piece.placement.primaryPlatform}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-sm">Content Potential</h3>
                  <p className="text-xl font-bold">{piece.placement.contentPotential}</p>
                </div>
              </div>
              {secondaryPlatforms.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-1">Secondary Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {secondaryPlatforms.map((platform: string) => (
                      <span
                        key={platform}
                        className="border border-gray-400 px-2 py-1 text-sm"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {recommendedFormats.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-1">Recommended Formats</h3>
                  <ul className="list-disc list-inside text-sm">
                    {recommendedFormats.map((format: string) => (
                      <li key={format}>{format}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-1">Reasoning</h3>
                <p className="text-sm">{piece.placement.reasoning}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Repurpose Outputs */}
      {piece.repurposeOutputs.length > 0 && (
        <div className="mb-8 border border-black p-6">
          <h2 className="text-xl font-bold mb-4">The Repurposer</h2>
          <p className="text-sm text-gray-600 mb-4">
            {piece.repurposeOutputs.length} pieces of content generated
          </p>
          <div className="space-y-6">
            {piece.repurposeOutputs.map((output) => {
              const content = JSON.parse(output.contentJson);
              return (
                <div key={output.id} className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">
                      {output.platform} - {output.format}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gray-100">
                      {output.status}
                    </span>
                  </div>
                  {output.platform === "LINKEDIN" && (
                    <div className="bg-gray-50 p-4 text-sm">
                      <p className="font-bold mb-2">{content.hook}</p>
                      <pre className="whitespace-pre-wrap">{content.body}</pre>
                      {content.cta && (
                        <p className="mt-2 text-gray-600">{content.cta}</p>
                      )}
                    </div>
                  )}
                  {output.platform === "TWITTER" && (
                    <div className="bg-gray-50 p-4 text-sm space-y-2">
                      {content.tweets?.map((tweet: any, i: number) => (
                        <div key={i} className="border-l-2 border-blue-400 pl-3">
                          <span className="text-xs text-gray-500">{tweet.position}/</span>
                          <p>{tweet.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {output.platform === "EMAIL" && (
                    <div className="bg-gray-50 p-4 text-sm">
                      <p className="font-bold">Subject: {content.subject_line}</p>
                      <p className="text-gray-500 mb-2">Preview: {content.preview_text}</p>
                      <pre className="whitespace-pre-wrap">{content.body}</pre>
                    </div>
                  )}
                  {output.platform === "INSTAGRAM" && (
                    <div className="bg-gray-50 p-4 text-sm">
                      <pre className="whitespace-pre-wrap">{content.caption}</pre>
                      {content.hashtags && (
                        <p className="text-blue-600 mt-2">
                          {content.hashtags.map((h: string) => `#${h}`).join(" ")}
                        </p>
                      )}
                    </div>
                  )}
                  {output.platform === "BLOG" && (
                    <div className="bg-gray-50 p-4 text-sm">
                      <p className="font-bold text-lg">{content.title}</p>
                      <p className="text-gray-500 mb-2">{content.meta_description}</p>
                      <div className="space-y-2">
                        {content.sections?.map((section: any, i: number) => (
                          <div key={i}>
                            <p className="font-semibold">{section.heading}</p>
                            <ul className="list-disc list-inside text-xs">
                              {section.key_points?.map((point: string, j: number) => (
                                <li key={j}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
