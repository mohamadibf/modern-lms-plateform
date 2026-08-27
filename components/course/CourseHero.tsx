import { Bookmark, Clock, FileText, SignalHigh, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { urlFor } from "@/lib/sanity/image";
import { formatDuration, formatLevel, formatStudentCount } from "@/lib/format";
import type { COURSE_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

const primaryLinkClasses = cn(
  "inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6",
  "font-sans text-sm font-medium text-white transition-colors",
  "bg-primary-500 hover:bg-primary-500/90",
);

type Course = NonNullable<COURSE_BY_SLUG_QUERY_RESULT>;

interface CourseHeroProps {
  course: Course;
  firstLessonHref: string | null;
}

export function CourseHero({ course, firstLessonHref }: CourseHeroProps) {
  const moduleCount = course.modules?.length ?? 0;

  return (
    <section className="flex flex-col gap-10 md:flex-row">
      {course.coverImage && (
        <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-2xl md:h-82 md:w-70">
          <Image
            src={urlFor(course.coverImage).width(560).height(656).url()}
            alt={course.coverImage.alt ?? course.title ?? "Course cover"}
            fill
            priority
            sizes="(min-width: 768px) 280px, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col">
        {course.popular && (
          <Badge variant="popular" className="w-fit">
            Popular
          </Badge>
        )}
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-neutral-900 md:text-5xl">
          {course.title}
        </h1>
        {course.summary && (
          <p className="mt-4 max-w-md font-sans text-[17px] leading-8 text-neutral-500">
            {course.summary}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-x-9 gap-y-2 font-sans text-sm text-neutral-500">
          {course.level && (
            <span className="inline-flex items-center gap-1.5">
              <SignalHigh className="size-4 shrink-0" />
              {formatLevel(course.level)}
            </span>
          )}
          {course.totalDurationSeconds != null && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 shrink-0" />
              {formatDuration(course.totalDurationSeconds)}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-4 shrink-0" />
            {moduleCount} modules
          </span>
          {course.studentCount != null && (
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4 shrink-0" />
              {formatStudentCount(course.studentCount)} students
            </span>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {firstLessonHref ? (
            <Link href={firstLessonHref} className={primaryLinkClasses}>
              Continue Learning
            </Link>
          ) : (
            <Button variant="primary" className="h-14 px-6" disabled>
              Continue Learning
            </Button>
          )}
          <Button
            variant="tertiary"
            className="h-14 px-6"
            icon={<Bookmark className="size-4" />}
          >
            Bookmark
          </Button>
        </div>
      </div>
    </section>
  );
}
