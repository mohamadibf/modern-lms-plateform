"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Select } from "@/components/ui/Select";
import { LessonResultCard } from "@/components/search/LessonResultCard";
import { VideoResultCard } from "@/components/search/VideoResultCard";
import { SearchEmptyState } from "@/components/search/SearchEmptyState";
import { SORTS, type SearchResponse, type Sort } from "@/lib/search/types";

const SORT_LABELS: Record<Sort, string> = {
  relevance: "Most Relevant",
  newest: "Newest",
  duration: "Shortest first",
};

function ResultSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-5 rounded-xl border border-neutral-100 bg-white p-5 sm:flex-row">
      <div className="h-40 w-full shrink-0 rounded-lg bg-neutral-100 sm:h-auto sm:w-55" />
      <div className="flex-1 space-y-3">
        <div className="h-4 w-1/3 rounded bg-neutral-100" />
        <div className="h-5 w-2/3 rounded bg-neutral-100" />
        <div className="h-4 w-full rounded bg-neutral-100" />
      </div>
    </div>
  );
}

export function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const sort = (searchParams.get("sort") as Sort) || "relevance";

  const [result, setResult] = useState<{
    query: string;
    sort: Sort;
    data: SearchResponse;
  } | null>(null);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const requestKey = `${query}:${sort}`;
  const isLoading =
    Boolean(query) &&
    errorKey !== requestKey &&
    (!result || result.query !== query || result.sort !== sort);
  const hasError = errorKey === requestKey;

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();

    fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, sort }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Search failed");
        const json: SearchResponse = await response.json();
        setResult({ query, sort, data: json });
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setErrorKey(`${query}:${sort}`);
      });

    return () => controller.abort();
  }, [query, sort]);

  function handleSortChange(nextSort: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", nextSort);
    router.replace(`/search?${params.toString()}`);
  }

  if (!query) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <ResultSkeleton />
        <ResultSkeleton />
        <ResultSkeleton />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-neutral-100 bg-white p-10 text-center">
        <p className="font-sans text-sm text-neutral-500">
          Something went wrong while searching. Please try again.
        </p>
        <button
          type="button"
          onClick={() => router.replace(`/search?${searchParams.toString()}`)}
          className="rounded-lg border border-neutral-200 px-4 py-2 font-sans text-sm font-medium text-neutral-900 hover:bg-neutral-50"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!result) return null;
  const { data } = result;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-sans text-sm text-neutral-500">
          {data.count} {data.count === 1 ? "result" : "results"}
        </p>
        <Select
          value={sort}
          onChange={(event) => handleSortChange(event.target.value)}
          className="w-44"
          aria-label="Sort results"
        >
          {SORTS.map((value) => (
            <option key={value} value={value}>
              {SORT_LABELS[value]}
            </option>
          ))}
        </Select>
      </div>

      {data.results.length === 0 ? (
        <SearchEmptyState />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {data.results.map((result) =>
              result.kind === "video" ? (
                <VideoResultCard key={result.lessonId} result={result} />
              ) : (
                <LessonResultCard key={result.lessonId} result={result} />
              ),
            )}
          </div>
          <SearchEmptyState />
        </>
      )}
    </div>
  );
}
