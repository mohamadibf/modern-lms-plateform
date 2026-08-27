# Implementation prompt: Sanity content model, standalone Studio, and web data layer

## Goal

Stand up the content foundation for Vertex in two parts:

1. **A standalone Sanity Studio** at `studio/`, with schema for `course`, `module` (embedded
   object), `lesson`, `instructor`, `category`, and their supporting object types. The embedded
   Studio currently mounted inside the Next.js app is removed.
2. **A server-only read layer** in the web app (repo root, per the confirmed decision to keep
   Next.js at root rather than move it into `web/`): a Sanity client holding the read token, a
   typed fetch helper with cache tags, and the GROQ queries the catalog / course / lesson /
   instructor pages will consume later.

No pages, no UI, no ingestion, no search in this task — nothing renders yet. Also out of scope
(later tasks per AGENTS.md §8): the `video` document and its ingestion pipeline, the agent Context
document, and the `progress` document with its write route.

## Skills and docs read

- `AGENTS.md` — §2 loop, §5 structure (standalone Studio; server-only data access; browser holds
  no token), §6 stack, §7 fixed decisions (Portable Text not markdown; modules embedded; derived
  numbering; provider embeds), §8 the data model, §12 traps (private dataset, token on server), §13
  checks.
- `sanity-best-practices` → `references/schema.md` — `defineType`/`defineField`/`defineArrayMember`,
  icons imported from per-icon subpaths, references vs nested objects, generated `_id`s, safe
  update / deprecation pattern, validation patterns.
- `sanity-best-practices` → `references/project-structure.md` — monorepo layout, kebab-case schema
  files, `documents/` / `objects/` split.
- `sanity-best-practices` → `references/nextjs.md` — §1 standalone Studio rationale, §3 caching
  table (tag vs time revalidation), §7 error handling. `defineLive`/Visual Editing/draft mode are
  **not** used — AGENTS.md §5 asks for "a server only Sanity client and fetch helper", and none of
  Visual Editing, Presentation, or live preview is in scope yet.

## Code inspected (current repo state)

- `sanity.config.ts` (root, `'use client'`), `sanity.cli.ts` (root), `app/studio/[[...tool]]/page.tsx`
  — the embedded Studio from an earlier `sanity init` run inside the Next app. Confirmed with you
  this gets replaced by a standalone `studio/`, with Next.js staying at the repo root (not moved to
  `web/`).
- `sanity/schemaTypes/index.ts` — `schema.types` is an empty array; nothing to preserve.
- `sanity/env.ts` — `apiVersion` (env `NEXT_PUBLIC_SANITY_API_VERSION`, default `2026-08-25`),
  `dataset` / `projectId` from `NEXT_PUBLIC_SANITY_DATASET` / `NEXT_PUBLIC_SANITY_PROJECT_ID`, both
  asserted non-empty.
- `sanity/lib/client.ts` — `createClient({ projectId, dataset, apiVersion, useCdn: true })`, no
  token. `sanity/lib/image.ts` — `urlFor` via `@sanity/image-url`. `sanity/lib/live.ts` —
  scaffolded `defineLive`, unused, being deleted (not adopting Live Content API here).
- `sanity/structure.ts` — default `S.documentTypeListItems()`.
- `components/ui/CourseCard.tsx` — current props are display-only placeholders (`title`,
  `description`, `level`, `duration` string, `moduleCount`); no schema-typed data flows in yet.
- `app/page.tsx` — local placeholder `courses` array; nothing fetched from Sanity yet.
- `app/layout.tsx` — `ClerkProvider` wraps children; no Sanity provider needed (no Visual Editing).
- `package.json` — `next 16.3.2`, `next-sanity 13.3.3`, `sanity ^5.31.2`, `@sanity/vision ^5.31.2`,
  `@sanity/image-url`, `styled-components` (unused by any web component — grepped, zero hits
  outside the Sanity toolchain), `clsx`, `lucide-react`, `tailwind-merge`. Scripts: `dev`, `build`,
  `start`, `lint`. No `typecheck` script yet.
- `tsconfig.json` — `include: ["next-env.d.ts","**/*.ts","**/*.tsx",...]`, `exclude: ["node_modules"]`
  only — this is why a prior `tsc --noEmit` picked up unrelated files under `agent/skills/**`
  (pre-existing, out of scope here; not touching it beyond adding `studio` to `exclude`).
- `eslint.config.mjs` — flat config, `globalIgnores([".next/**","out/**","build/**","next-env.d.ts"])`.
- `.gitignore` — `.env*` with no exception, so a new `.env.example` would be ignored unless negated.
- `.env.local` exists (Clerk keys plus `NEXT_PUBLIC_SANITY_DATASET` /
  `NEXT_PUBLIC_SANITY_PROJECT_ID`, confirmed by import, not read — its directory is permission-
  blocked for me). No Sanity token in it yet.
- `lib/utils.ts` — the only file in `lib/`, home of `cn()`. New data-layer modules live in
  `lib/sanity/` to match this existing convention, not a resurrected `sanity/lib/`.
- Design references (`design/vertex-course.png`, `design/vertex-lesson.png`) — course page shows
  learning outcomes as icon + title + description tiles; course-level and per-module durations are
  displayed but never separately authored (they read as sums of lesson durations); the lesson page
  splits **"Lesson Content"** (overview text, "in this lesson you will" checklist, an optional pro
  tip callout, resource cards with a type icon) from a separate **"Notes"** tab. Per AGENTS.md §7
  the Notes tab itself is presentational with no backend, so it is *not* the schema's `notes` field
  — `lesson.notes` (Portable Text) is the Overview copy shown under "Lesson Content".

## Decisions and assumptions

Confirmed with you already: standalone `studio/`, Next.js stays at the repo root (no `web/` move).

Further decisions, flagged here rather than buried in code:

- **Durations are stored as seconds** (`number`), not display strings, on `lesson` only. A course's
  total duration and each module's duration are summed from lesson durations in the GROQ query, not
  stored — matching "numbers derived from order" already required for `Module 5` / `Lesson 5.1`
  (AGENTS.md §8) extended to durations, and the "data over presentation" test in `schema.md` §1.
- **Numbering is never stored.** No `order`/`number` fields; position comes from array order.
- **`level` is `course`-only**, a `string` with `options.list` (beginner/intermediate/advanced,
  radio layout) — `schema.md` §4C. The lesson page's level badge (design ref) is the parent
  course's level via the reverse-reference query, not a duplicated lesson field.
- **`popular` and `freePreview` stay booleans** — genuinely binary, and free preview is a label per
  AGENTS.md §7, not access control.
- **`keyPoints` is an array of plain strings.** The "in this lesson you will" list has no per-item
  metadata beyond text.
- **`learningOutcomes` is an array of `learningOutcome` objects** (`icon`, `title`, `description`),
  since AGENTS.md §8 names all three explicitly. `icon` is a `string` constrained to a curated
  `options.list` of lucide icon names (`Layers`, `Database`, `Gauge`, `Cloud`, `Code2`,
  `ShieldCheck`, `Zap`, `BookOpen`, `Rocket`, `Terminal`, `Video`, `Settings2`) so an author can
  never pick a name the frontend has no icon for. This list is generic across course topics, not
  Next.js-specific, since courses cover Docker/TypeScript/etc. too.
- **Shared `blockContent` object** for `lesson.notes` and `instructor.bio` — one array-of-blocks
  type (H2/H3, normal, blockquote, bullet/number lists, strong/em/code marks, an https-only `link`
  annotation, inline `image` with required `alt`), reused per `schema.md` §3.
- **`resource.type`** uses an `options.list` matching what the lesson design actually shows
  (`documentation`, `guide`, `repository`, `article`, `download`, `link`) rather than a
  file-format-flavored list — resources here are external references, not stored files.
- **A lesson does not store its parent course** (AGENTS.md §8, explicit). The lesson data layer
  derives it with `*[_type == "course" && references($lessonId)][0]`.
- **`videoUrl` is validated to YouTube / Vimeo / Bunny hosts only** — the only providers AGENTS.md
  §9 lists as supported, so a lesson can't be authored with a video the site can't embed yet.
- **Generated document `_id`s throughout** (`schema.md` §6) — no slug-derived or deterministic ids.
- **`useCdn: false`** on the server client. The dataset is private and every read is already token-
  authenticated, so CDN latency savings don't apply the way they do for a public/anonymous read;
  Next's own fetch cache (tags) sits in front regardless.
- **`server-only` is added as a new dependency** (tiny, zero-runtime-cost guard package). Both
  `lib/sanity/client.ts` and a new `lib/sanity/token.ts` start with `import "server-only"`, so an
  accidental import from a client component is a build error, not a runtime leak. Flagging this
  since it's one dependency beyond what AGENTS.md's tech stack list names, but it directly enforces
  a rule that list already requires ("the browser holds no token").
- **TypeGen is wired and its output committed** (`sanity.types.ts` at the repo root) — you asked for
  "the data layer", and a data layer without generated types would leave every fetch helper
  hand-typed or `any`. Glob is scoped to `../{app,lib}/**/*.{ts,tsx}` from `studio/`, not the whole
  repo, to skip `node_modules`, `.next`, and the unrelated `agent/skills/**` reference tree.
- **No Visual Editing / Presentation / draft mode / `defineLive`.** Not requested, not needed until
  an authoring preview task exists; keeps this task from overbuilding.
- **A read token is required and I cannot supply it myself** — `.env.local` is outside my read/write
  permissions in this environment, and even if it weren't, the token itself must come from Sanity
  Manage. This blocks live verification (see "Needs your attention").

## Files expected to change

**New — Studio workspace (`studio/`)**

| File | Purpose |
|---|---|
| `studio/package.json` | own deps: `sanity`, `@sanity/vision`, `@sanity/icons`, `styled-components`, `react`, `react-dom`; scripts `dev`, `build`, `deploy`, `typegen` |
| `studio/sanity.config.ts` | `defineConfig`, `projectId`/`dataset` from `SANITY_STUDIO_PROJECT_ID`/`SANITY_STUDIO_DATASET`, `structureTool`, `visionTool` |
| `studio/sanity.cli.ts` | `defineCliConfig` + `typegen` block (`path: '../{app,lib}/**/*.{ts,tsx}'`, `generates: '../sanity.types.ts'`, `overloadClientMethods: true`) |
| `studio/structure.ts` | grouped desk: Courses, Lessons, Instructors, Categories |
| `studio/tsconfig.json` | standard Studio TS config |
| `studio/.gitignore` | `node_modules`, `dist`, `.sanity`, `schema.json` |
| `studio/schemaTypes/index.ts` | exports the `schema.types` array |
| `studio/schemaTypes/documents/course.ts` | `course` |
| `studio/schemaTypes/documents/lesson.ts` | `lesson` |
| `studio/schemaTypes/documents/instructor.ts` | `instructor` |
| `studio/schemaTypes/documents/category.ts` | `category` |
| `studio/schemaTypes/objects/module.ts` | `moduleType` (schema name `module`) |
| `studio/schemaTypes/objects/learning-outcome.ts` | `learningOutcome` |
| `studio/schemaTypes/objects/resource.ts` | `resource` |
| `studio/schemaTypes/objects/block-content.ts` | shared `blockContent` |

**New — web data layer**

| File | Purpose |
|---|---|
| `lib/sanity/env.ts` | re-export of the existing `NEXT_PUBLIC_SANITY_PROJECT_ID`/`DATASET`/`API_VERSION` (unchanged values, new home) |
| `lib/sanity/token.ts` | `import "server-only"`; asserts `SANITY_API_READ_TOKEN` |
| `lib/sanity/client.ts` | `import "server-only"`; server read client, `useCdn: false`, token-authenticated |
| `lib/sanity/image.ts` | `urlFor` builder (no `server-only` — safe for any component) |
| `lib/sanity/queries.ts` | all `defineQuery` definitions |
| `lib/sanity/fetch.ts` | typed `sanityFetch` helper (tags/revalidate) built on the client |
| `sanity.types.ts` (repo root) | TypeGen output, committed |
| `.env.example` | canonical env list (names only, no values) |

**Modified**

| File | Change |
|---|---|
| `package.json` | remove `sanity`, `@sanity/vision`; add `server-only`; add `"typecheck": "tsc --noEmit"` |
| `tsconfig.json` | add `"studio"` to `exclude` |
| `eslint.config.mjs` | add `"studio/**"` and `"sanity.types.ts"` to `globalIgnores` |
| `.gitignore` | add `!.env.example` so the canonical list can be committed |

**Deleted**

`sanity.config.ts`, `sanity.cli.ts` (root), `app/studio/` (whole route), `sanity/` (whole folder —
`schemaTypes/`, `structure.ts`, `env.ts`, `lib/client.ts`, `lib/image.ts`, `lib/live.ts`).

**Not touched:** `.env.local` (permission-blocked; you add the token yourself — see below).

## Requirements

### Schema

Every type uses `defineType`/`defineField`/`defineArrayMember`, an icon imported from its own
`@sanity/icons/<Name>` subpath, and a `preview` useful in Studio lists.

**`course`** (document)

| field | type | notes |
|---|---|---|
| `title` | string | required |
| `slug` | slug | required, source `title`, `maxLength: 96` |
| `summary` | text | required, max 200 chars |
| `coverImage` | image | `hotspot: true`; nested required `alt` string |
| `level` | string | `options.list` beginner/intermediate/advanced, radio, required |
| `price` | number | required, `min(0)`; `0` = free |
| `popular` | boolean | `initialValue: false` |
| `studentCount` | number | `min(0)`, `initialValue: 0` |
| `learningOutcomes` | array of `learningOutcome` | `max(6)` |
| `instructor` | reference → `instructor` | required |
| `category` | reference → `category` | required |
| `modules` | array of `module` | required, `min(1)` |

**`module`** (object, embedded in `course.modules` only): `title` (string, required), `summary`
(text), `lessons` (array of `reference → lesson`, required, `min(1)`, `unique()`). Preview shows
title + lesson count.

**`lesson`** (document): `title` (string, required), `slug` (slug, required), `videoUrl` (url,
required, `https` only, custom rule restricting the hostname to YouTube/Vimeo/Bunny), `thumbnail`
(image + hotspot + required `alt`), `duration` (number, seconds, required, positive integer),
`freePreview` (boolean, `initialValue: false`), `studentCount` (number, `min(0)`), `notes`
(`blockContent`), `keyPoints` (array of string, `max(6)`), `proTip` (text, optional), `resources`
(array of `resource`).

**`instructor`** (document): `name` (string, required), `slug` (required), `photo` (image + hotspot
+ required `alt`), `expertise` (array of string, `unique()`), `bio` (`blockContent`).

**`category`** (document): `title` (string, required), `slug` (required), `description` (text).

**`learningOutcome`** (object): `icon` (string, `options.list` of the curated lucide names above,
required), `title` (string, required), `description` (text, required).

**`resource`** (object): `type` (string, `options.list`: documentation/guide/repository/
article/download/link, required), `title` (string, required), `description` (text), `url` (url,
required, `https`).

**`blockContent`** (array-of-blocks object type): H2/H3, normal, blockquote styles; bullet/number
lists; strong/em/code marks; `link` annotation (url, `https` only); inline `image` member with
required `alt`.

Slug uniqueness relies on Sanity's built-in per-type slug behavior in Studio; no custom async
uniqueness validator (keeping schema complexity proportional to what's asked).

### Studio

- `studio/sanity.config.ts` reads `SANITY_STUDIO_PROJECT_ID` / `SANITY_STUDIO_DATASET` from
  `studio/.env` (the Studio's own env convention, gitignored), asserted non-empty with a clear
  error, same pattern as the current `sanity/env.ts` assertion.
- `structure.ts` groups the desk into Courses / Lessons / Instructors / Categories instead of the
  default flat `documentTypeListItems()`.
- `npm run typegen` inside `studio/` runs `sanity schemas extract --force && sanity typegen
  generate`, writing `../sanity.types.ts`.

### Data layer

- `lib/sanity/token.ts` and `lib/sanity/client.ts` both start with `import "server-only"`.
  `lib/sanity/image.ts` does not (safe for any component, only needs public project id/dataset).
- `sanityFetch<T>` signature: `{ query, params?, tags?, revalidate? }` → `client.fetch(query,
  params, { next: { tags, revalidate } })`, defaulting to `revalidate: false` when `tags` are
  supplied and a 1-hour time revalidation otherwise. Return type flows from `defineQuery` via
  TypeGen's `overloadClientMethods`.
- Every query is a uniquely named `defineQuery` in `lib/sanity/queries.ts`, minimum set:
  - `COURSES_LIST_QUERY` — catalog cards: title, `"slug": slug.current`, summary, level, price,
    popular, studentCount, coverImage, instructor→name, category→title, `"moduleCount":
    count(modules)`, `"totalDurationSeconds": math::sum(modules[].lessons[]->duration)`.
  - `COURSE_SLUGS_QUERY` — slugs for static params.
  - `COURSE_BY_SLUG_QUERY` — full detail incl. `learningOutcomes[]`, `modules[]{ _key, title,
    summary, "lessonCount": count(lessons), "durationSeconds": math::sum(lessons[]->duration),
    lessons[]->{ _id, title, "slug": slug.current, duration, freePreview } }`, instructor→,
    category→.
  - `LESSON_SLUGS_QUERY`, `LESSON_BY_SLUG_QUERY` — lesson detail (notes, keyPoints, proTip,
    resources, videoUrl, thumbnail, duration, freePreview, studentCount).
  - `COURSE_FOR_LESSON_QUERY` — `*[_type == "course" && references($lessonId)][0]{ title,
    "slug": slug.current, level, modules[]{ title, lessons[]->{ _id, "slug": slug.current } } }`,
    letting a lesson page compute its breadcrumb, level badge, and `Module X / Lesson X.Y` label.
  - `INSTRUCTORS_LIST_QUERY`, `INSTRUCTOR_BY_SLUG_QUERY`.
  - `CATEGORIES_LIST_QUERY`.
- Every array projection includes `_key` (`schema.md` §4A). List queries never return whole
  Portable Text bodies or the full `resources`/`keyPoints` arrays.
- No React components, no route files, no rendering — this task only produces importable modules.

## Security considerations

- `SANITY_API_READ_TOKEN` is server-only: no `NEXT_PUBLIC_` prefix; `server-only` makes an
  accidental client-component import a build failure, not a silent leak.
- `.env.example` lists key names with empty values only, never real values.
- The Studio's own env vars (`SANITY_STUDIO_*`) are separate from the web app's and carry no token
  (Studio auth is the logged-in Sanity CLI user, not a stored secret).
- The read token needs **Viewer** rights only; no write token is created in this task.
- `next build` must not emit the token into any client chunk — checked by grepping `.next/static`.

## Acceptance criteria

1. `studio/` runs standalone (`npm run dev` → `http://localhost:3333`) and shows Courses, Lessons,
   Instructors, Categories in the desk.
2. A course can be authored end to end in the Studio: instructor → category → two lessons → a
   course with one module referencing both lessons, all required-field validation enforced, and a
   non-YouTube/Vimeo/Bunny `videoUrl` rejected.
3. The embedded Studio is gone: no `app/studio/`, no root `sanity.config.ts` / `sanity.cli.ts`, no
   root `sanity/` folder; `/studio` 404s in the web app.
4. `npm run typegen` in `studio/` writes `sanity.types.ts` at the repo root with `Course`, `Lesson`,
   `Instructor`, `Category`, a module object type, and a `*_QUERY_RESULT` type per query.
5. `npm run typecheck`, `npm run lint`, and `npm run build` pass at the repo root.
6. `grep -r` over `.next/static` finds no occurrence of the token value; a client component that
   imports `lib/sanity/client` fails the build (`server-only` guard).
7. Each query, run against real authored content, returns the shape the future card/page components
   need (verified via Vision, since no page consumes them yet).

## Checks to run

Repo root:

```bash
npm run typecheck
npm run lint
npm run build
```

`studio/`:

```bash
npm install
npm run typegen
npm run build
```

Plus a `.next/static` token grep, and Vision queries against each `defineQuery` with real content.

## Manual test steps

1. Add a Viewer-only token to `.env.local` as `SANITY_API_READ_TOKEN=...` (see "Needs your
   attention"), and create `studio/.env` with `SANITY_STUDIO_PROJECT_ID=` /
   `SANITY_STUDIO_DATASET=` copied from the existing `NEXT_PUBLIC_SANITY_*` values.
2. `cd studio && npm install && npm run dev` — Studio opens at `http://localhost:3333` with the
   four groups in the desk.
3. Create, in order: an instructor, a category, two lessons (real YouTube URLs, durations in
   seconds), then a course with one module referencing both lessons. Confirm required fields block
   publishing when empty, and a non-YouTube/Vimeo/Bunny `videoUrl` is rejected.
4. `npm run typegen` in `studio/` — `sanity.types.ts` appears at the repo root with the document
   types.
5. In Vision (or `npx sanity documents query`), run each `defineQuery` — confirm module/lesson
   arrays include `_key`, and `totalDurationSeconds` / `durationSeconds` are non-zero once lessons
   have durations.
6. From the repo root: `npm run typecheck && npm run lint && npm run build`; visit `/studio` and
   confirm a 404.

## Needs your attention (before I can finish end-to-end)

- **A read token.** Create a Viewer-only token in sanity.io/manage → API → Tokens and add it to
  `.env.local` as `SANITY_API_READ_TOKEN=` yourself — that file's directory is outside my
  read/write permissions in this environment. Steps 4–6 above and acceptance criteria 6–7 are
  blocked without it.
- **`studio/.env` values.** I don't have the actual `projectId`/`dataset` values either (same
  permission boundary). Copy them from your existing `NEXT_PUBLIC_SANITY_PROJECT_ID` /
  `NEXT_PUBLIC_SANITY_DATASET` in `.env.local` into `studio/.env` as `SANITY_STUDIO_PROJECT_ID` /
  `SANITY_STUDIO_DATASET`.
- **Studio deploy.** `npx sanity deploy` needs an interactive login and a hostname choice — not
  required for this task, but the Context MCP won't serve the dataset until it's done (AGENTS.md
  §12), so plan it before the search task.
