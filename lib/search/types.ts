import { z } from "zod";

export const SORTS = ["relevance", "newest", "duration"] as const;
export type Sort = (typeof SORTS)[number];

export const SearchRequestSchema = z.object({
  query: z.string().trim().min(1).max(200),
  sort: z.enum(SORTS).default("relevance"),
});
export type SearchRequest = z.infer<typeof SearchRequestSchema>;

/**
 * Model-facing schema. OpenAI structured outputs require every property in
 * `required` and reject min/max/length constraints, so this carries no range
 * checks — those live in SearchRequestSchema and the grounding pass instead.
 */
export const ModelHitSchema = z.object({
  lessonId: z.string(),
  reason: z.string(),
  rank: z.number(),
});

export const ModelOutputSchema = z.object({
  reply: z.string(),
  hits: z.array(ModelHitSchema),
});
export type ModelOutput = z.infer<typeof ModelOutputSchema>;

const SearchResultBaseSchema = z.object({
  lessonId: z.string(),
  lessonTitle: z.string(),
  lessonSlug: z.string(),
  label: z.string(),
  moduleTitle: z.string().nullable(),
  courseTitle: z.string(),
  courseSlug: z.string(),
  courseIconUrl: z.string().nullable(),
  durationSeconds: z.number().nullable(),
  keyPoints: z.array(z.string()),
  freePreview: z.boolean(),
  reason: z.string(),
  rank: z.number(),
  href: z.string(),
});

export const LessonResultSchema = SearchResultBaseSchema.extend({
  kind: z.literal("lesson"),
});

export const VideoResultSchema = SearchResultBaseSchema.extend({
  kind: z.literal("video"),
  startSeconds: z.number(),
  momentLabel: z.string(),
  thumbnailUrl: z.string().nullable(),
});

export const SearchResultSchema = z.discriminatedUnion("kind", [
  LessonResultSchema,
  VideoResultSchema,
]);
export type SearchResult = z.infer<typeof SearchResultSchema>;

export const SearchResponseSchema = z.object({
  query: z.string(),
  sort: z.enum(SORTS),
  count: z.number(),
  courseCount: z.number(),
  reply: z.string(),
  results: z.array(SearchResultSchema),
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
