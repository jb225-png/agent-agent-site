"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function LibraryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lane = searchParams.get("lane") || "";
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
          <label className="block text-sm font-semibold mb-2">Lane</label>
          <select
            className="w-full border border-black px-3 py-2"
            value={lane}
            onChange={(e) => updateFilter("lane", e.target.value)}
          >
            <option value="">All</option>
            <option value="SUBMISSION">Submission</option>
            <option value="PLATFORM">Platform</option>
            <option value="PRODUCT">Product</option>
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
            <option value="FINISHED">Finished</option>
            <option value="NEEDS_POLISH">Needs Polish</option>
            <option value="FRAGMENT">Fragment</option>
            <option value="SEED">Seed</option>
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
