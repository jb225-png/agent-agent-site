"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [pasteText, setPasteText] = useState("");
  const [pasteTitle, setPasteTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleFileUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess(
        `Successfully uploaded ${data.results.length} piece(s). Running pipeline...`
      );

      // Run pipeline on uploaded pieces
      await fetch("/api/pipeline/run-all", { method: "POST" });

      // Redirect to library after a short delay
      setTimeout(() => {
        router.push("/library");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePasteUpload = async () => {
    if (!pasteText.trim()) {
      setError("Please enter some text");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/upload/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: pasteText,
          title: pasteTitle || "Untitled",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setSuccess("Successfully created piece. Running pipeline...");

      // Run pipeline on the piece
      await fetch(`/api/pipeline/run/${data.pieceId}`, { method: "POST" });

      // Redirect to piece detail
      setTimeout(() => {
        router.push(`/library/${data.pieceId}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">Upload</h1>
      <p className="text-gray-600 mb-12">
        Upload files or paste text. Supported formats: TXT, MD, DOCX, PDF, ZIP.
      </p>

      {error && (
        <div className="mb-6 p-4 border-2 border-black bg-gray-100">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 border-2 border-black bg-white">
          <p>{success}</p>
        </div>
      )}

      <div className="space-y-12">
        {/* File Upload */}
        <div className="border border-black p-8">
          <h2 className="text-2xl font-bold mb-6">Upload Files</h2>
          <div className="space-y-4">
            <input
              type="file"
              multiple
              accept=".txt,.md,.docx,.pdf,.zip"
              onChange={handleFileChange}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:border file:border-black file:bg-white hover:file:bg-black hover:file:text-white"
              disabled={uploading}
            />
            {files.length > 0 && (
              <div className="text-sm">
                <p className="font-semibold mb-2">Selected files:</p>
                <ul className="list-disc list-inside">
                  {files.map((file, i) => (
                    <li key={i}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={handleFileUpload}
              disabled={uploading || files.length === 0}
              className="border-2 border-black px-6 py-2 font-semibold hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? "Uploading..." : "Upload & Process"}
            </button>
          </div>
        </div>

        {/* Paste Text */}
        <div className="border border-black p-8">
          <h2 className="text-2xl font-bold mb-6">Paste Text</h2>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">Title (optional)</label>
              <input
                type="text"
                value={pasteTitle}
                onChange={(e) => setPasteTitle(e.target.value)}
                placeholder="Untitled"
                className="w-full border border-black px-4 py-2"
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Content</label>
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder="Paste your writing here..."
                rows={12}
                className="w-full border border-black px-4 py-2 font-mono text-sm"
                disabled={uploading}
              />
            </div>
            <button
              onClick={handlePasteUpload}
              disabled={uploading || !pasteText.trim()}
              className="border-2 border-black px-6 py-2 font-semibold hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? "Processing..." : "Create & Process"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
