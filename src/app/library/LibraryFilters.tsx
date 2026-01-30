"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function LibraryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const platform = searchParams.get("platform") || "";
  const status = searchParams.get("status") || "";
  const quality = searchParams.get("quality") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/library?${params.toString()}`);
  };

  return (
    <div className="mb-8 p-6 border border-black">
      <h3 className="font-bold mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Platform</label>
          <select
            className="w-full border border-black px-3 py-2"
            value={platform}
            onChange={(e) => updateFilter("platform", e.target.value)}
          >
            <option value="">All</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="TWITTER">Twitter</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="EMAIL">Email</option>
            <option value="BLOG">Blog</option>
            <option value="YOUTUBE">YouTube</option>
            <option value="ARCHIVE">Archive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Status</label>
          <select
            className="w-full border border-black px-3 py-2"
            value={status}
            onChange={(e) => updateFilter("status", e.target.value)}
          >
            <option value="">All</option>
            <option value="READY">Ready</option>
            <option value="NEEDS_CLEANUP">Needs Cleanup</option>
            <option value="RAW">Raw</option>
            <option value="ARCHIVE">Archive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Quality</label>
          <select
            className="w-full border border-black px-3 py-2"
            value={quality}
            onChange={(e) => updateFilter("quality", e.target.value)}
          >
            <option value="">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
      </div>
    </div>
  );
}
