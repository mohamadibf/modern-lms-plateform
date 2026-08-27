import "server-only";

import { urlFor } from "@/lib/sanity/image";
import { sanityFetch } from "@/lib/sanity/fetch";
import { SEARCH_LESSONS_BY_IDS_QUERY } from "@/lib/sanity/queries";
import type { ModelHitSchema } from "./types";
import type { Sort, SearchResult } from "./types";
import { z } from "zod";

const MAX_IDS = 100;

type ModelHit = z.infer<typeof ModelHitSchema>;

export async function groundHits(
  hits: ModelHit[],
  sort: Sort,
): Promise<SearchResult[]> {
  const ids = [...new Set(hits.map((hit) => hit.lessonId))].slice(0, MAX_IDS);
  if (ids.length === 0) return [];

  const lessons = await sanityFetch({
    query: SEARCH_LESSONS_BY_IDS_QUERY,
    params: { ids },
  });

  const lessonById = new Map(lessons.map((lesson) => [lesson._id, lesson]));

  const results: SearchResult[] = [];

  for (const hit of hits) {
    const lesson = lessonById.get(hit.lessonId);
    if (!lesson || !lesson.slug || !lesson.course?.slug) {
      console.warn(`[search] dropping unresolved lessonId: ${hit.lessonId}`);
      continue;
    }

    const modules = lesson.course.modules ?? [];
    let moduleIndex = -1;
    let lessonIndex = -1;
    let moduleTitle: string | null = null;

    for (let m = 0; m < modules.length; m++) {
      const idx = (modules[m].lessons ?? []).findIndex(
        (item) => item._id === lesson._id,
      );
      if (idx !== -1) {
        moduleIndex = m;
        lessonIndex = idx;
        moduleTitle = modules[m].title;
        break;
      }
    }

    const label =
      moduleIndex >= 0 && lessonIndex >= 0
        ? `${moduleIndex + 1}.${lessonIndex + 1}`
        : "";

    results.push({
      kind: "lesson",
      lessonId: lesson._id,
      lessonTitle: lesson.title ?? "",
      lessonSlug: lesson.slug,
      label,
      moduleTitle,
      courseTitle: lesson.course.title ?? "",
      courseSlug: lesson.course.slug,
      courseIconUrl: lesson.course.coverImage
        ? urlFor(lesson.course.coverImage).width(64).height(64).url()
        : null,
      durationSeconds: lesson.duration,
      keyPoints: lesson.keyPoints ?? [],
      freePreview: lesson.freePreview ?? false,
      reason: hit.reason,
      rank: hit.rank,
      href: `/lessons/${lesson.slug}`,
    });
  }

  return sortResults(results, sort, lessonById);
}

function sortResults(
  results: SearchResult[],
  sort: Sort,
  lessonById: Map<
    string,
    { _createdAt: string; duration: number | null }
  >,
): SearchResult[] {
  const sorted = [...results];

  if (sort === "newest") {
    sorted.sort((a, b) => {
      const aCreated = lessonById.get(a.lessonId)?._createdAt ?? "";
      const bCreated = lessonById.get(b.lessonId)?._createdAt ?? "";
      return bCreated.localeCompare(aCreated);
    });
    return sorted;
  }

  if (sort === "duration") {
    sorted.sort(
      (a, b) => (a.durationSeconds ?? Infinity) - (b.durationSeconds ?? Infinity),
    );
    return sorted;
  }

  sorted.sort((a, b) => a.rank - b.rank);
  return sorted;
}
