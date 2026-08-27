import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseContent } from "@/components/course/CourseContent";
import { CourseHero } from "@/components/course/CourseHero";
import { CourseProgressBar } from "@/components/course/CourseProgressBar";
import { LearningOutcomes } from "@/components/course/LearningOutcomes";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Navigation } from "@/components/ui/Navigation";
import { sanityFetch } from "@/lib/sanity/fetch";
import { COURSE_BY_SLUG_QUERY, COURSE_SLUGS_QUERY } from "@/lib/sanity/queries";

export async function generateStaticParams() {
  const slugs = await sanityFetch({ query: COURSE_SLUGS_QUERY });
  return slugs
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await sanityFetch({
    query: COURSE_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!course) return {};

  return {
    title: `${course.title} · Vertex`,
    description: course.summary ?? undefined,
  };
}

export default async function CoursePage({
  params,
}: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = await sanityFetch({
    query: COURSE_BY_SLUG_QUERY,
    params: { slug },
  });

  if (!course) notFound();

  const modules = course.modules ?? [];
  const firstLessonSlug = modules[0]?.lessons?.[0]?.slug ?? null;
  const firstLessonHref = firstLessonSlug ? `/lessons/${firstLessonSlug}` : null;

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
            { label: course.title ?? "Course" },
          ]}
        />

        <div className="mt-8">
          <CourseHero course={course} firstLessonHref={firstLessonHref} />
        </div>

        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
          <div className="mt-12">
            <LearningOutcomes outcomes={course.learningOutcomes} />
          </div>
        )}

        {modules.length > 0 && (
          <div className="mt-12">
            <CourseContent
              modules={modules}
              totalDurationSeconds={course.totalDurationSeconds}
            />
          </div>
        )}

        <CourseProgressBar percentComplete={0} resumeHref={firstLessonHref} />
      </div>
    </div>
  );
}
