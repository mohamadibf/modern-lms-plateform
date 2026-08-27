import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { ArrowRight, Bell, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CourseCard } from "@/components/ui/CourseCard";
import { Navigation } from "@/components/ui/Navigation";
import { SearchInput } from "@/components/ui/Input";
import { formatDuration, formatLevel } from "@/lib/format";
import { urlFor } from "@/lib/sanity/image";
import { sanityFetch } from "@/lib/sanity/fetch";
import { COURSES_LIST_QUERY } from "@/lib/sanity/queries";

const barHeights = [64, 96, 128, 88, 56, 100, 140, 76, 110, 60];

export default async function Home() {
  const allCourses = await sanityFetch({ query: COURSES_LIST_QUERY });
  const courses = allCourses
    .filter((course) => course.slug)
    .slice(0, 3);

  return (
    <div className="min-h-full bg-neutral-50">
      <Navigation
        links={[
          { label: "Courses", href: "/", active: true },
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

      <section className="border-b border-neutral-100 px-6 pb-16 pt-20">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center text-center">
          <span className="inline-flex items-center rounded-xs border border-primary-200 bg-primary-100 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-primary-500">
            Intelligent Learning
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-tight text-neutral-900 sm:text-6xl">
            Search your learning
            <br />
            in plain English.
          </h1>
          <p className="mt-6 max-w-lg font-sans text-base text-neutral-500">
            Vertex understands what you want to learn and finds the exact
            lessons across all your courses.
          </p>
          <Button variant="primary" className="mt-8" icon={<ArrowRight className="size-4" />}>
            Explore Courses
          </Button>
          <SearchInput
            placeholder="Ask anything about your learning…"
            shortcut="⌘ K"
            className="mt-10 w-full max-w-2xl"
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold text-neutral-900">
            All Courses
          </h2>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-primary-500 hover:text-primary-400"
          >
            View all courses
            <ArrowRight className="size-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link key={course._id} href={`/courses/${course.slug}`}>
              <CourseCard
                icon={
                  course.coverImage ? (
                    <Image
                      src={urlFor(course.coverImage)
                        .width(144)
                        .height(144)
                        .url()}
                      alt={course.coverImage.alt ?? course.title ?? ""}
                      width={72}
                      height={72}
                      className="size-full object-cover"
                    />
                  ) : null
                }
                iconClassName="overflow-hidden rounded-lg"
                title={course.title ?? ""}
                description={course.summary ?? ""}
                level={course.level ? formatLevel(course.level) : ""}
                duration={
                  course.totalDurationSeconds != null
                    ? formatDuration(course.totalDurationSeconds)
                    : ""
                }
                moduleCount={course.moduleCount ?? 0}
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1440px] overflow-hidden">
        <div className="mx-auto flex max-w-md items-center justify-center gap-3 px-6 pb-16">
          <span className="h-px flex-1 bg-neutral-200" />
          <span className="inline-flex items-center gap-2 whitespace-nowrap font-sans text-sm text-neutral-500">
            <Star className="size-4 text-primary-500" />
            New courses and lessons added every week.
          </span>
          <span className="h-px flex-1 bg-neutral-200" />
        </div>
        <div className="flex h-40 items-end justify-center gap-4 px-6">
          {barHeights.map((height, i) => (
            <div
              key={i}
              className="w-12 rounded-t-md bg-gradient-to-t from-primary-300 to-primary-100"
              style={{ height }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
