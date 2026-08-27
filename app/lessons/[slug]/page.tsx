import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LessonFooterNav } from "@/components/lesson/LessonFooterNav";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { LessonKeyPoints } from "@/components/lesson/LessonKeyPoints";
import { LessonNotes } from "@/components/lesson/LessonNotes";
import { LessonResources } from "@/components/lesson/LessonResources";
import { LessonSidebar } from "@/components/lesson/LessonSidebar";
import { LessonTabs } from "@/components/lesson/LessonTabs";
import { LessonVideo } from "@/components/lesson/LessonVideo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Navigation } from "@/components/ui/Navigation";
import { urlFor } from "@/lib/sanity/image";
import { splitLeadParagraph } from "@/lib/portable-text";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  COURSE_FOR_LESSON_QUERY,
  LESSON_BY_SLUG_QUERY,
  LESSON_SLUGS_QUERY,
} from "@/lib/sanity/queries";

export async function generateStaticParams() {
  const slugs = await sanityFetch({ query: LESSON_SLUGS_QUERY });
  return slugs
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/lessons/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!lesson) return {};

  const { lead } = splitLeadParagraph(lesson.notes);

  return {
    title: `${lesson.title} · Vertex`,
    description: lead ?? undefined,
  };
}

export default async function LessonPage({
  params,
  searchParams,
}: PageProps<"/lessons/[slug]">) {
  const { slug } = await params;
  const search = await searchParams;

  const lesson = await sanityFetch({
    query: LESSON_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!lesson) notFound();

  const course = await sanityFetch({
    query: COURSE_FOR_LESSON_QUERY,
    params: { lessonId: lesson._id },
  });

  const modules = course?.modules ?? [];
  const currentModuleIndex = modules.findIndex((module) =>
    module.lessons?.some((item) => item._id === lesson._id),
  );
  const currentModule = currentModuleIndex >= 0 ? modules[currentModuleIndex] : null;
  const lessonIndexInModule =
    currentModule?.lessons?.findIndex((item) => item._id === lesson._id) ?? -1;

  const lessonLabel =
    currentModuleIndex >= 0 && lessonIndexInModule >= 0
      ? `LESSON ${currentModuleIndex + 1}.${lessonIndexInModule + 1}`
      : "LESSON";

  const flattenedLessons = modules.flatMap((module) => module.lessons ?? []);
  const flatIndex = flattenedLessons.findIndex((item) => item._id === lesson._id);
  const previousLesson =
    flatIndex > 0
      ? flattenedLessons[flatIndex - 1]
      : null;
  const nextLesson =
    flatIndex >= 0 && flatIndex < flattenedLessons.length - 1
      ? flattenedLessons[flatIndex + 1]
      : null;

  const rawStart = Array.isArray(search.t) ? search.t[0] : search.t;
  const parsedStart = rawStart ? Number.parseInt(rawStart, 10) : 0;
  const startSeconds = Number.isFinite(parsedStart)
    ? Math.max(0, Math.min(parsedStart, lesson.duration ?? parsedStart))
    : 0;

  const { lead, body } = splitLeadParagraph(lesson.notes);

  return (
    <div className="min-h-full bg-neutral-50">
      <Navigation
        links={[
          { label: "Courses", href: "/" },
          { label: "My Learning", href: "#" },
        ]}
        right={
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="flex size-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
            >
              <Bell className="size-5" />
            </button>
            <Show when="signed-out">
              <div className="flex items-center gap-3">
                <SignInButton>
                  <button
                    type="button"
                    className="font-sans text-sm font-medium text-neutral-500 hover:text-neutral-900"
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button
                    type="button"
                    className="rounded-xs bg-primary-500 px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-primary-400"
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        }
      />

      <div className="mx-auto max-w-[1440px] px-6 py-8">
        <Breadcrumbs
          items={[
            { label: "All Courses", href: "/" },
            ...(course
              ? [{ label: course.title ?? "Course", href: `/courses/${course.slug}` }]
              : []),
            ...(currentModule?.title ? [{ label: currentModule.title }] : []),
            { label: lesson.title ?? "Lesson" },
          ]}
        />

        <div className="mt-8 flex flex-col gap-10 lg:flex-row">
          {course && (
            <LessonSidebar
              courseTitle={course.title ?? ""}
              courseSlug={course.slug ?? ""}
              coverImageUrl={
                course.coverImage ? urlFor(course.coverImage).width(96).height(96).url() : null
              }
              coverAlt={course.coverImage?.alt ?? course.title ?? ""}
              modules={modules.map((module) => ({
                _key: module._key,
                title: module.title,
                durationSeconds: module.durationSeconds,
                lessons: module.lessons ?? [],
              }))}
              currentLessonId={lesson._id}
              currentModuleIndex={Math.max(currentModuleIndex, 0)}
            />
          )}

          <div className="min-w-0 flex-1">
            <LessonHeader
              lessonLabel={lessonLabel}
              title={lesson.title ?? ""}
              subtitle={lead}
              duration={lesson.duration}
              level={course?.level ?? null}
              studentCount={lesson.studentCount}
            />

            <div className="mt-6">
              {lesson.videoUrl && (
                <LessonVideo
                  videoUrl={lesson.videoUrl}
                  title={lesson.title ?? "Lesson video"}
                  startSeconds={startSeconds}
                />
              )}
            </div>

            <div className="mt-8">
              <LessonTabs
                content={
                  <div className="flex flex-col gap-8">
                    {body.length > 0 && (
                      <div>
                        <h2 className="font-display text-xl font-bold text-neutral-900">
                          Overview
                        </h2>
                        <div className="mt-4">
                          <LessonNotes value={body} />
                        </div>
                      </div>
                    )}

                    <LessonKeyPoints keyPoints={lesson.keyPoints} proTip={lesson.proTip} />

                    {lesson.resources && lesson.resources.length > 0 && (
                      <LessonResources resources={lesson.resources} />
                    )}
                  </div>
                }
                notes={
                  <p className="font-sans text-[15px] text-neutral-500">
                    Your notes live here soon.
                  </p>
                }
              />
            </div>

            <LessonFooterNav
              previous={
                previousLesson?.slug
                  ? {
                      slug: previousLesson.slug,
                      title: previousLesson.title ?? "",
                      duration: previousLesson.duration,
                    }
                  : null
              }
              next={
                nextLesson?.slug
                  ? {
                      slug: nextLesson.slug,
                      title: nextLesson.title ?? "",
                      duration: nextLesson.duration,
                    }
                  : null
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
