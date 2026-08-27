# Implementation prompt: Lesson page

## Goal

Build `/lessons/[slug]`, reproducing `design/vertex-lesson.png`, wired to seeded Sanity content,
with the lesson's video playing on the page through the provider's own embed (never a redirect to
YouTube/Vimeo/Bunny). Read-only.

## Skills and docs read

- `AGENTS.md` — §3 (reference is source of truth, reuse existing components, responsive to mobile),
  §5 (pages read-only, Sanity reads server-only), §7 (playback via provider embed only, no custom
  player, `?t=` start-seconds param support so search can deep-link later, progress and the Notes tab
  are presentational, free-preview is a label), §8 (lesson has no course reference — derive by
  reverse reference; module/lesson numbers derived from order), §9 (YouTube/Vimeo/Bunny are the only
  supported providers), §12 (token server-only), §13 checks.
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` — `searchParams`
  is a Promise and reading it opts the route into dynamic rendering.

## Code inspected (current tree — an earlier draft of this prompt referenced paths from a different
## iteration of the repo; ignored, this one matches what's actually here)

- `lib/sanity/queries.ts` — `LESSON_BY_SLUG_QUERY` already returns everything the lesson body needs
  (`videoUrl`, `thumbnail`, `duration`, `freePreview`, `studentCount`, `notes`, `keyPoints`, `proTip`,
  `resources[]`). `LESSON_SLUGS_QUERY` covers `generateStaticParams`. `COURSE_FOR_LESSON_QUERY`
  resolves the parent course by `references($lessonId)` but only returns bare `_id`/`slug` per lesson
  and no course `coverImage`/duration — **needs extending**, not replacing.
- `studio/schemaTypes/objects/resource.ts` — `resource.type` is one of `documentation, guide,
  repository, article, download, link` (not the values an earlier draft assumed). Icon per type:
  `DocumentTextIcon, BookIcon, GithubIcon, DocumentIcon, DownloadIcon, LinkIcon` in the Studio —
  mapped to lucide equivalents below.
- `studio/schemaTypes/documents/lesson.ts` — `videoUrl` validated to youtube.com/youtu.be/vimeo.com/
  mediadelivery.net/b-cdn.net only. `thumbnail` and `duration` (seconds) required.
- `studio/schemaTypes/objects/block-content.ts` — `notes` Portable Text supports `normal/h2/h3/
  blockquote` styles, `bullet/number` lists, `strong/em/code` marks, and a `link` annotation
  (`href`, https only). No images used in seeded notes but the schema allows one.
- `studio/seed.ndjson` — confirms real shape: every `videoUrl` is
  `https://www.youtube.com/watch?v=<id>`, `notes` opens with a lead paragraph, then an `h2`, then
  bullet points mirroring `keyPoints`, then a closing paragraph; `resources` has 1 item per lesson,
  `type: "link"`. Lesson has no `summary` field — the design's subtitle line under the title has no
  schema home.
- `app/courses/[slug]/page.tsx`, `components/course/*` — the pattern this route follows: server
  component → `sanityFetch` → `notFound()` → `generateMetadata` → `generateStaticParams`; client
  components (`CourseContent`) get plain serializable props, accordion uses `aria-expanded`/
  `aria-controls` and a `ChevronDown` that rotates.
- `components/ui/{Badge,Breadcrumbs,Button,ProgressBar,ResourceCard}.tsx`, `lib/format.ts`
  (`formatDuration`, `formatLevel`, `formatStudentCount`), `lib/utils.ts` (`cn`) — reused.
  `ResourceCard` (title/description/fileMeta, no icon-by-type) doesn't match the lesson design's
  icon-tile card, so the lesson gets its own small resource card, not a variant of that one.
- `next.config.ts` — `images.remotePatterns` already covers `cdn.sanity.io` (course-page work), which
  is where lesson thumbnails and course cover images live post-import. No change needed.
- `package.json` — no Portable Text renderer installed. `@portabletext/react` is on the approved
  stack (AGENTS.md §6) and needs adding.
- lucide-react (this version, `^1.34.0`) has no `Github` export — confirmed via a quick check;
  `FolderGit2` is used for the `repository` resource type instead.

## Decisions and assumptions

1. **The video embeds directly** (no click-to-play poster gate). You asked for the video "playing on
   the page" — the provider's own iframe already shows its native thumbnail-and-play-button chrome
   before the learner presses play, so a custom poster step would just duplicate that. `?t=<seconds>`
   (integer, clamped to `0…duration`) is read server-side and passed through as the provider's own
   start parameter; when present the embed also autoplays.
2. **Only YouTube has seed coverage.** `lib/video.ts` parses YouTube, Vimeo, and Bunny per the
   schema's allowed hosts (so nothing breaks if a future lesson uses one), but Vimeo/Bunny paths are
   unverified against real content — flagged. An unparseable `videoUrl` renders a plain "Video
   unavailable" panel instead of a broken iframe.
3. **The lesson's subtitle line is its notes' first paragraph**, since the schema has no summary
   field (adding one is a schema change, out of scope). That block is then omitted from the rendered
   Overview so it isn't shown twice. Flagged — a real `summary` field would be cleaner long-term.
4. **`COURSE_FOR_LESSON_QUERY` is extended**, not replaced: adds `_id`, `coverImage` on the course,
   and turns each `modules[].lessons[]` reference into a full projection (`title`, `slug`, `duration`,
   `freePreview`) plus a summed `durationSeconds` per module — everything the sidebar needs that the
   bare `_id`/`slug` version didn't carry.
5. **Progress is presentational**, consistent with the course page: the sidebar's course row shows
   0% / "Not started" via the existing `ProgressBar`, and no module or lesson renders a "completed"
   checkmark (the reference shows checks on modules before the current one, implying finished
   lessons — there's no real progress data to justify that, so this page won't fake it). The current
   module still starts expanded and its current lesson still gets the "Now playing" treatment,
   because both are derived from the URL, not from progress. Flagged as a visual deviation from the
   mock's checkmarks.
6. **The Notes tab is presentational** — an empty state, no storage, no writes, matching AGENTS.md §7.
7. **Bookmark button is presentational**, an accessible no-op like the header's notification bell.
8. **Prev/next lesson nav** walks the flattened curriculum (all modules' lessons in order) and links
   to the adjacent lesson's slug; the first/last lesson of a course omits the respective side.
9. **Breadcrumb**: `All Courses › <course> › <module> › <lesson>` — the module segment is plain text
   (modules have no route of their own).
10. **Numbers are derived from array order**: "Module N of M", "LESSON N.L", never stored.
11. **Mobile**: the sidebar becomes a collapsed `<details>`/disclosure above the content instead of a
    fixed column; the resources grid goes single-column; the footer bar stacks. Desktop matches the
    reference.

## Files to touch

- `lib/sanity/queries.ts` — extend `COURSE_FOR_LESSON_QUERY` per decision 4.
- `sanity.types.ts` — regenerated via typegen after the query change. Not hand-edited.
- `lib/video.ts` — new. `parseVideoUrl(url)` → `{ provider, embedUrl(startSeconds?, autoplay?) }` for
  YouTube (`youtube-nocookie.com/embed/<id>`), Vimeo (`player.vimeo.com/video/<id>`), Bunny
  (`iframe.mediadelivery.net/embed/<library>/<id>`), or `null`.
- `lib/format.ts` — add `formatTimestamp(seconds)` → `"12:45"` / `"1:28:00"` (used only if we surface
  a timestamp label; otherwise skip if unused to avoid dead code — confirm while implementing).
- `app/lessons/[slug]/page.tsx` — new. Fetch lesson + course, `notFound()`, `generateMetadata`,
  `generateStaticParams`, `?t=` parsing/clamping, flattened curriculum, prev/next resolution, layout.
- `components/lesson/LessonSidebar.tsx` — new, `"use client"`. Back-to-course link, course tile +
  presentational progress, module accordion (current module expanded), lesson rows with "Now
  playing" state, mobile disclosure variant.
- `components/lesson/LessonHeader.tsx` — new. `LESSON x.y` badge, title, bookmark button, subtitle,
  meta row (duration/level/students).
- `components/lesson/LessonVideo.tsx` — new. Provider iframe (or the unavailable-state panel).
- `components/lesson/LessonTabs.tsx` — new, `"use client"`. Lesson Content / Notes tabs
  (`role="tablist"`, arrow-key navigation).
- `components/lesson/LessonNotes.tsx` — new. `PortableText` with local components for
  `normal/h2/h3/blockquote`, `bullet/number` lists, `strong/em/code`, `link`.
- `components/lesson/LessonKeyPoints.tsx` — new. "In this lesson you will:" list + Pro Tip panel.
- `components/lesson/LessonResources.tsx` — new. Icon-tile resource cards
  (`documentation→FileText, guide→BookOpen, repository→FolderGit2, article→FileText, download→
  Download, link→Link2`), external link, `rel="noopener noreferrer"`, `target="_blank"`.
- `components/lesson/LessonFooterNav.tsx` — new. Previous/Next lesson bar.
- `package.json` — add `@portabertext/react` — *(typo guard: package name is `@portabletext/react`)*.
- No Studio schema changes, no seed changes.

## Requirements

- Server component page; the only writes are none. `sanityFetch` for both the lesson and the course
  lookup.
- `generateStaticParams` from `LESSON_SLUGS_QUERY`; unknown slug → `notFound()`.
- `generateMetadata` returns the lesson title and a description derived from its notes' lead text.
- Derived values only: module/lesson numbers from order, module duration from the query's
  `math::sum`, durations/counts formatted via existing helpers. Nothing invented.
- Optional fields degrade: no `keyPoints` → list dropped; no `proTip` → panel dropped; no `resources`
  → section dropped; no parent course → sidebar/course-crumb/prev-next omitted rather than faked;
  unparseable `videoUrl` → "Video unavailable" panel.
- The iframe carries `title`, `allow="accelerometer; autoplay; clipboard-write; encrypted-media;
  picture-in-picture"`, `allowFullScreen`, `loading="lazy"`, `referrerPolicy=
  "strict-origin-when-cross-origin"`.
- Accessibility: tabs use `role="tablist"/"tab"/"tabpanel"` with `aria-selected` and arrow-key
  support; accordion uses `aria-expanded`/`aria-controls`; the current lesson row is
  `aria-current="page"`; decorative glyphs are `aria-hidden`; interactive elements keep visible focus
  rings.
- Reuse `Badge`, `Breadcrumbs`, `Button`, `ProgressBar`, `Navigation`, `cn`, `formatDuration`,
  `formatLevel`, `formatStudentCount`. No new UI primitives beyond `components/lesson/*`, no new
  dependency beyond `@portabletext/react`.

## Security considerations

- Sanity client/token stay server-only; client components (`LessonSidebar`, `LessonTabs`) receive
  only plain serializable props.
- Resource/video URLs come from content: only `https:` renders as a link; external links carry
  `rel="noopener noreferrer"` and `target="_blank"`; the iframe `src` is built from a *parsed*
  provider id, never by interpolating the raw stored URL string.
- `?t=` is parsed as an integer, clamped to `[0, duration]`, and only used to build the embed URL —
  never reflected into the DOM unescaped.
- Page is public; nothing writes.

## Acceptance criteria

1. `/lessons/nextjs-app-router-in-depth-file-system-routing` renders: `LESSON 1.1` badge, title,
   subtitle (lead paragraph), duration, level, student count.
2. The YouTube video is embedded and plays on the page — no navigation to youtube.com.
3. `?t=120` starts the embed at 2:00 and autoplays.
4. The sidebar shows every module of the parent course, the current lesson's module expanded with
   its lessons and durations, "Now playing" on the current lesson, and "Back to course" linking to
   `/courses/<course-slug>`.
5. Lesson Content shows Overview (notes minus the lead paragraph), key points, Pro Tip, and the
   resources grid; Notes tab shows its empty state; tabs are keyboard-navigable.
6. Footer bar links to the previous/next lessons in curriculum order with correct titles/durations;
   first/last lesson of a course omits the missing side.
7. Unknown slug → 404.
8. Desktop matches `design/vertex-lesson.png`; usable at 375px with the sidebar collapsed and no
   horizontal scroll.
9. `sanity.types.ts` regenerates with the extended `COURSE_FOR_LESSON_QUERY_RESULT`; page compiles
   with no `any` and no hand-written result types.

## Checks to run

1. `npm install @portabletext/react`
2. `npm --prefix studio run typegen`
3. `npm run typecheck`
4. `npm run lint`
5. `npm run build`
6. `npm run dev` + manual steps below

## Manual test steps

1. From `/courses/nextjs-app-router-in-depth`, click a lesson in the module accordion — lands on the
   lesson page.
2. Compare against `design/vertex-lesson.png` at 1440px.
3. Confirm the YouTube video plays inline.
4. Open the same URL with `?t=120` and confirm playback starts at 2:00.
5. Expand/collapse sidebar modules; confirm the current module starts expanded and its current
   lesson is highlighted; click another lesson and confirm navigation.
6. Switch Lesson Content ↔ Notes with mouse and arrow keys; confirm focus rings.
7. Click a resource card — opens in a new tab.
8. Click Previous/Next Lesson and confirm curriculum order.
9. Resize to 375px: sidebar collapses to a disclosure, resources single-column, footer stacks, no
   horizontal scroll.
10. Open `/lessons/does-not-exist` → 404.
