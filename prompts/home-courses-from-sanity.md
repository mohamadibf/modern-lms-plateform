# Implementation prompt: Home page courses from Sanity

## Goal

Replace the hardcoded `courses` placeholder array in `app/page.tsx` with real seeded content read
through the existing server-only data layer, without changing the home page's design.

## Skills and docs read

- `AGENTS.md` — §3 (reference image is the source of truth), §5 (pages are read-only, Sanity reads
  are server-only), §7 (nothing invented, derived values not stored), §12 (private dataset, token
  server-only), §13 checks.
- Carried over from `prompts/course-page.md` (already implemented): the query layer, TypeGen types,
  `next/image` + `urlFor` + `cdn.sanity.io` remote pattern all already exist and work end to end
  against the live seeded dataset.

## Code inspected

- `app/page.tsx` — a `courses: {icon, iconClassName, title, description, level, duration,
  moduleCount}[]` placeholder with the `NextMark`/`DockerMark`/`TypeScriptMark` brand SVGs
  (`components/ui/CourseMarks.tsx`), rendered as three `CourseCard` items in a
  `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` grid — no links, just static cards.
- `lib/sanity/queries.ts` — `COURSES_LIST_QUERY` already projects everything the card needs:
  `title`, `slug`, `summary`, `coverImage`, `level`, `popular`, `moduleCount`,
  `totalDurationSeconds`. Ordered `_createdAt desc` only — **no popular-first ordering yet**.
- `components/ui/CourseCard.tsx` — `icon` is a plain `ReactNode` (so a `next/image` cover works as
  a drop-in replacement for the brand-mark SVGs), `iconClassName` controls the 72px tile's frame
  (brand marks use `bg-neutral-900`/similar; a real photo needs the tile styled as
  `overflow-hidden rounded-lg` with no background color, matching the TypeScript mark's pattern).
  Card itself has no built-in link — the caller wraps it.
- `lib/format.ts` (already added in the course-page work) — `formatDuration`, `formatLevel`; no
  `pluralize` helper exists or is needed (`CourseCard` hardcodes the `modules` suffix already).
- `sanity.types.ts` — `COURSES_LIST_QUERY_RESULT` is generated and current.
- `lib/sanity/fetch.ts` — `sanityFetch({query, params, tags, revalidate})`, no `CACHE_TAGS` export
  exists in this codebase (an earlier prompt assumed one from a different iteration — ignored).

## Decisions and assumptions

1. **The section keeps showing exactly three cards** (matches `design/vertex-home.png`: one row of
   three beside "View all courses"). Take the first three results.
2. **Query gets a small, additive change**: order becomes `order(popular desc, _createdAt desc)` so
   the homepage preview surfaces popular courses first instead of whatever was created last. This
   only affects ordering, no field changes, and `courses-catalog.md`'s catalog page (separate, not
   yet built) would want the same order for consistency.
3. **The cover image replaces the brand-mark icon**, rendered via `next/image` + `urlFor(...)` sized
   for the 72px tile at 2x, with `iconClassName="overflow-hidden rounded-lg"` (no background color —
   a photo fills the tile). `CourseMarks.tsx` is left untouched since `app/design-system/page.tsx`
   still references it.
4. **Each card links to `/courses/<slug>`** (the route built in the previous task), wrapping
   `CourseCard` in a `Link` — matching how the design implies these are clickable entry points.
5. **Meta comes straight from the data**: `formatLevel(level)`, `formatDuration(totalDurationSeconds)`,
   `moduleCount`. A course missing a `slug` is skipped (can't route to it); other optional fields
   (`summary`, `coverImage`) degrade to an empty string / no image rather than a guess.
6. Layout, spacing, typography, and the "View all courses" link are untouched.

## Files to touch

- `app/page.tsx` — fetch `COURSES_LIST_QUERY` via `sanityFetch`, drop the placeholder array and the
  `NextMark`/`DockerMark`/`TypeScriptMark` imports, map the first three results into `CourseCard`s
  wrapped in `Link`s.
- `lib/sanity/queries.ts` — change `COURSES_LIST_QUERY`'s `order(...)` clause only.
- No changes to `components/ui/CourseCard.tsx`, the schema, or the seed.

## Requirements

- Read via `sanityFetch({ query: COURSES_LIST_QUERY })` in the server component (`app/page.tsx`
  stays a server component); no client-side fetching, no token in the browser.
- Skip courses without a `slug`; if the fetch returns fewer than three (or zero) usable courses, the
  grid just renders what's available — no placeholder filler.
- Cover images use the stored `alt`, sized for the 72px tile at 2x (`width(144).height(144)`).
- Home page metadata/hero/CTA/decoration sections are untouched.

## Security considerations

- Same as the course page: the Sanity client and token stay server-only; `app/page.tsx` imports only
  `sanityFetch`/`urlFor`, never the client or token modules directly.
- No project id, dataset, or token reaches the browser beyond the already-public `NEXT_PUBLIC_*`
  values `urlFor` needs.

## Acceptance criteria

1. The home page's three cards show real seeded courses with their cover art, level, duration, and
   module count — no hardcoded copy or brand-mark SVGs left in `app/page.tsx` for this section.
2. Popular courses (seed has several with `popular: true`) appear before non-popular ones.
3. Each card links to a working `/courses/<slug>` page.
4. The section's layout matches `design/vertex-home.png` apart from the content itself (real photos
   instead of brand-mark tiles).
5. `sanity.types.ts`'s `COURSES_LIST_QUERY_RESULT` still matches after the query's order clause
   changes (typegen re-run, no field shape change expected).

## Checks to run

1. `npm --prefix studio run typegen` (query text changed)
2. `npm run typecheck`
3. `npm run lint`
4. `npm run build`
5. `npm run dev` and load `/`

## Manual test steps

1. Open `http://localhost:3000/` and confirm the three cards show real seeded courses (titles,
   cover photos, level, duration, module count).
2. Confirm popular-flagged courses show up first.
3. Click each card and confirm it navigates to the matching `/courses/<slug>` page.
4. Compare the section against `design/vertex-home.png` (layout/spacing unchanged, content is now
   real).
