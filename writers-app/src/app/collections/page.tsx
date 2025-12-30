import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Collections</h1>
      <p className="text-gray-600 mb-12">
        Sellable products compiled by The Compiler.
      </p>

      {collections.length === 0 ? (
        <div className="text-center py-16 border border-black">
          <p className="text-gray-600 mb-4">No collections yet.</p>
          <p className="text-sm text-gray-500">
            Upload more pieces and run the pipeline to generate collections.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {collections.map((collection) => {
            const pieceIds = JSON.parse(collection.includedPieceIdsJson);
            const missing = JSON.parse(collection.missingJson);

            return (
              <div key={collection.id} className="border border-black p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {collection.titleWorking}
                    </h2>
                    <p className="text-gray-700">{collection.positioning}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold mb-1">
                      Price Band
                    </div>
                    <div className="text-lg font-bold">
                      {collection.recommendedPriceBand}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Launch Readiness</h3>
                    <p className="text-sm">{collection.launchReadiness}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Estimated Effort</h3>
                    <p className="text-sm">
                      {collection.estimatedEffortHours} hours
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Included Pieces</h3>
                  <p className="text-sm text-gray-600">
                    {pieceIds.length} piece{pieceIds.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {missing.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">
                      Missing Connective Tissue
                    </h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {missing.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
