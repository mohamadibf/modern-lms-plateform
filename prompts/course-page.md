# Implementation prompt: Course detail page

## Goal

Build the course detail route `/courses/[slug]`, reproducing `design/vertex-course.png`, wired to
real Sanity content through the existing server-only data layer. Read-only: the page renders stored
content and nothing on it writes.

## Prerequisite: the dataset is currently empty of content

Live check against the `production` dataset (via the server-only client with the read token) found
**135 documents, all `sanity.imageAsset`, zero `course`/`lesson`/`instructor`/`category` docs.**
`studio/seed.ndjson` (141 lines: 6 categories + 5 instructors + 10 courses + 120 lessons, matching
`prompts/seed-sample-content.md`) exists on disk but has never been imported. My prior memory note
claiming the dataset was already seeded is stale — corrected.

So "wired with seeded content" requires importing `studio/seed.ndjson` first:

```
cd studio && npx sanity dataset import seed.ndjson production --replace
```

This writes to the shared Sanity dataset (not just local files), so I'm calling it out for your
explicit go-ahead rather than running it silently — confirm in the approval question below.
`--replace` is safe here: every document in the file has a deterministic `_id`, so re-running is
idempotent and only touches these 141 docs, nothing else in the dataset.

## Skills and docs read

- `AGENTS.md` — §3 (reference image is source of truth, reuse existing components, responsive to
  mobile), §5 (pages are read-only, Sanity reads are server-only), §7 (module/lesson numbers derived
  from order not stored, progress is a real Clerk-keyed feature not yet built, content is Portable
  Text not markdown), §8 (course/module/lesson field shapes), §12 (private dataset, token server-only,
  keep `images.remotePatterns` scoped), §13 (checks per workspace).
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md` —
  `params` is a Promise in this Next version, `generateStaticParams`.
- `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` — remote images need
  `images.remotePatterns`.

## Code inspected

- `lib/sanity/queries.ts` — `COURSE_BY_SLUG_QUERY` already projects everything the page needs:
  `learningOutcomes[]`, `instructor->`, `category->`, `totalDurationSeconds`
  (`math::sum(modules[].lessons[]->duration)`), and `modules[]` with `lessonCount`,
  `durationSeconds`, and dereferenced `lessons[]` (`title`, `slug`, `duration`, `freePreview`).
  `COURSE_SLUGS_QUERY` covers `generateStaticParams`. **No query changes needed.**
- `lib/sanity/fetch.ts` (`sanityFetch`), `client.ts`, `token.ts`, `image.ts` (`urlFor`) — all
  server-only (`import "server-only"`), reused as-is.
- `studio/schemaTypes/documents/course.ts`, `objects/module.ts`, `objects/learningOutcome.ts`,
  `documents/lesson.ts` — field shapes and validation. `learningOutcome.icon` is constrained to
  exactly 12 keys: `layers, database, gauge, cloud, code, shield, sparkles, workflow, puzzle,
  rocket, terminal, video` — the design's database/cloud glyphs are both in this list, no schema gap.
- `studio/seed.ndjson` — confirms real shape: courses have `popular`, `studentCount`,
  4 `learningOutcomes`, and (checked `nextjs-app-router-in-depth`) 4 modules of 3 lessons each; cover
  images are `picsum.photos` uploaded as real Sanity assets at import time (`_sanityAsset`), so once
  imported they resolve through `cdn.sanity.io`, not hotlinked.
- `components/ui/{Navigation,Breadcrumbs,Badge,Button,ProgressBar,ResourceCard,LessonCard,
  StatusIndicator,CourseCard,CourseMarks}.tsx`, `lib/utils.ts` (`cn`) — existing primitives to reuse.
  No `Card`, `PageFrame`, `SiteHeader`, or `ChartDecoration` components exist yet (an earlier prompt
  referenced paths from a different iteration of this repo — ignored, this prompt matches the
  current tree).
- `app/globals.css` — Tailwind v4 `@theme` tokens (`primary-*`, `neutral-*`, `success-500`,
  `info-500`, `font-display` = Playfair, `font-sans` = Inter).
- `app/page.tsx` — home page pattern: server-rendered `Navigation` with Clerk `SignInButton`/
  `UserButton`/`Show`, `max-w-[1440px]` container, `px-6` gutters.
- `next.config.ts` — empty, no `images.remotePatterns` yet.
- `sanity.types.ts` — exists but currently only has schema-shape types (`BlockContent`, etc.), no
  `*_QUERYResult` types. `typegen` was never re-run against `lib/sanity/queries.ts` since it was
  added. Re-running it is a required check, not optional.
- No `middleware.ts` exists yet (Clerk route protection is out of scope here — this page is public).

## Decisions and assumptions

1. **Progress is presentational**, per AGENTS.md §7 (progress needs a Clerk-keyed server record that
   doesn't exist yet). The sticky bar renders `0%` / "Not started", both CTAs ("Continue Learning")
   link to the first lesson of the first module. The component takes `percentComplete` and
   `resumeHref` props so the real feature drops in later without touching markup.
2. **Lesson links point to `/lessons/<slug>`.** No lesson detail route exists yet (separate prompt,
   `prompts/lesson-page.md`), so these links will 404 until that's built — expected and out of scope
   here.
3. **Module and lesson numbers are derived from array order**, never stored: module index + 1,
   lesson label `"{moduleNumber}.{lessonNumber}"`.
4. **Icon map covers exactly the schema's 12 `learningOutcome.icon` values**, mapped to lucide-react
   equivalents (`layers→Layers, database→Database, gauge→Gauge, cloud→Cloud, code→Code2,
   shield→Shield, sparkles→Sparkles, workflow→Workflow, puzzle→Puzzle, rocket→Rocket,
   terminal→Terminal, video→Video`), with `Sparkles` as an unreachable fallback for type safety.
5. **"Show all N modules" only renders past 6 modules.** Seeded courses have 4, so it won't appear —
   the reference shows 12 modules, which no seeded course has.
6. **Instructor is not rendered on this page** — the reference has no instructor block here (it likely
   surfaces on the lesson page instead, per the video/notes-plus-instructor pattern implied by
   AGENTS.md §8). Flagged under "Needs your attention" in case that's wrong.
7. **Cover art will be a Picsum photo, not the reference's black "N" tile** — that's seeded content,
   not a layout deviation.
8. **Accordion is a small client component**; the page itself stays a server component and passes
   plain serializable data down.

## Files to touch

- `app/courses/[slug]/page.tsx` — new. Server component: `sanityFetch(COURSE_BY_SLUG_QUERY)`,
  `notFound()` on miss, `generateMetadata`, `generateStaticParams` from `COURSE_SLUGS_QUERY`.
  Composes hero, outcomes panel, course content, sticky progress bar.
- `components/course/CourseHero.tsx` — new. Cover image, popular badge, title, summary, meta row
  (level/duration/modules/students), primary + secondary CTA buttons.
- `components/course/LearningOutcomes.tsx` — new. "What you'll learn" panel, 2-column card grid, the
  12-key icon map.
- `components/course/CourseContent.tsx` — new, `"use client"`. Module list with expand/collapse per
  row, revealing that module's lessons; "Show all N modules" toggle past 6.
- `components/course/CourseProgressBar.tsx` — new. Sticky bottom bar (presentational), reuses
  `ProgressBar`.
- `lib/format.ts` — new. `formatDuration(seconds)` → `"18h 24m"` / `"45m"`,
  `formatStudentCount(n)` → `"2.1k"`, `formatLevel(level)` → `"Intermediate"`.
- `next.config.ts` — add `images.remotePatterns` scoped to `cdn.sanity.io`.
- `sanity.types.ts` — regenerated via typegen; page consumes the generated
  `COURSE_BY_SLUG_QUERYResult` type, no hand-written result types, no `any`.
- No changes to `lib/sanity/queries.ts`, the Studio schema, or `studio/seed.ndjson`.

## Requirements

- Server component page; the Sanity read uses `sanityFetch` with a `revalidate` (no write path
  exists yet to make tag-based invalidation worthwhile).
- `generateStaticParams` from `COURSE_SLUGS_QUERY`; unknown slug → `notFound()`.
- `generateMetadata` returns the course title and summary.
- Cover image via `next/image` + `urlFor(...)` using the stored `alt`, `priority` on the hero image.
- Derived values only: durations from `totalDurationSeconds` / per-module `durationSeconds`, counts
  from `count(modules)` / `lessonCount`, module/lesson numbers from array order. Nothing invented.
- Optional fields degrade gracefully: no `popular` → no badge, no `learningOutcomes` → panel omitted,
  missing `studentCount` → that meta item dropped, a module with no `summary` just omits it.
- Responsive to mobile: hero stacks (cover above text), outcome grid collapses to one column, module
  rows keep number + title with duration wrapping, sticky bar stacks and its track goes full width.
  Desktop matches the reference exactly.
- Accessibility: accordion trigger buttons carry `aria-expanded`/`aria-controls`, chevron is
  `aria-hidden` and rotates on open, interactive elements keep visible focus states, numbered circles
  are decorative (not in the tab order).
- Reuse `Badge`, `Breadcrumbs`, `Button`, `ProgressBar`, `Navigation`, `cn`. No new UI primitives
  beyond the `components/course/*` composition layer, no new dependencies.
- Tailwind tokens over raw hex; `lucide-react` for icons; lookup maps (not switch chains) for variant
  → icon/class mapping, matching the existing `Badge`/`StatusIndicator` pattern.

## Security considerations

- Sanity client and read token stay server-only; new client component (`CourseContent`) receives only
  plain serializable props, never imports `lib/sanity/*` directly.
- No project id, dataset, or token reaches the browser beyond the already-public `NEXT_PUBLIC_*`
  values `urlFor` needs.
- Page is public (browsing is public per AGENTS.md §7); nothing here is gated, nothing writes.
- `images.remotePatterns` is scoped to `https://cdn.sanity.io/**`, not a wildcard host.

## Acceptance criteria

1. `/courses/nextjs-app-router-in-depth` renders: title, summary, level, total duration, module
   count, student count, popular badge, cover image — all from the imported seed.
2. "What you'll learn" shows the course's 4 seeded outcomes with correctly mapped icons.
3. Course Content lists all 4 seeded modules in order, numbered 1–4, each with its summary and
   summed duration; the show-all toggle is absent (only 4 modules).
4. Expanding a module reveals its 3 lessons labelled `1.1`–`1.3`, each with duration and a
   free-preview badge where applicable, linking to `/lessons/<slug>`.
5. The sticky bar renders `0%` / "Not started"; both CTAs link to the first lesson of module 1.
6. An unknown slug (`/courses/does-not-exist`) returns the 404 page.
7. Desktop layout matches `design/vertex-course.png`; usable at 375px with no horizontal scroll.
8. `sanity.types.ts` contains `COURSE_BY_SLUG_QUERYResult` and the page compiles against it with no
   `any` and no hand-written result types.

## Checks to run

From the repo root unless noted:

1. `cd studio && npx sanity dataset import seed.ndjson production --replace` (only after your
   go-ahead — see Prerequisite above).
2. `npm --prefix studio run typegen`
3. `npm run typecheck`
4. `npm run lint`
5. `npm run build` (new route + config change)
6. `npm run dev` and walk through the manual steps below.

## Manual test steps

1. After the import and `npm run dev`, open `http://localhost:3000/courses/nextjs-app-router-in-depth`.
   Confirm hero (cover, POPULAR badge, title, summary, meta row, both buttons).
2. Compare side by side against `design/vertex-course.png` at 1440px wide.
3. Click a module row: it expands to its lessons; click again: collapses. Verify the chevron rotates
   and focus rings are visible tabbing through.
4. Click a lesson link — expect a 404 (no lesson route yet, out of scope).
5. Confirm the sticky bar's "Continue Learning" points at the course's first lesson.
6. Resize to 375px: hero stacks, outcomes go single-column, no horizontal scroll anywhere.
7. Open `/courses/does-not-exist` and confirm the 404 page.
8. Visit `/` and click through an existing `CourseCard` (once wired to real slugs — separate task) or
   navigate directly to confirm routing resolves.
