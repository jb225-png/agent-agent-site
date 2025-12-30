"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RunAgentsButton({ pieceId }: { pieceId: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRunAgents = async () => {
    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pieceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to run agents");
      }

      // Refresh the page to show new data
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleRunAgents}
        disabled={isRunning}
        className="border-2 border-black px-6 py-2 font-semibold hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRunning ? "Running Agents..." : "Run Agent Analysis"}
      </button>
      {error && (
        <p className="text-red-600 mt-2 text-sm">Error: {error}</p>
      )}
    </div>
  );
}
