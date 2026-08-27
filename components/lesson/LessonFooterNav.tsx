import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

interface AdjacentLesson {
  slug: string;
  title: string;
  duration: number | null;
}

interface LessonFooterNavProps {
  previous: AdjacentLesson | null;
  next: AdjacentLesson | null;
}

const nextButtonClasses = cn(
  "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6",
  "font-sans text-sm font-medium text-white transition-colors",
  "bg-primary-500 hover:bg-primary-500/90",
);

export function LessonFooterNav({ previous, next }: LessonFooterNavProps) {
  if (!previous && !next) return null;

  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-neutral-100 pt-6 md:flex-row md:items-center md:justify-between">
      {previous ? (
        <Link
          href={`/lessons/${previous.slug}`}
          className="flex items-center gap-3 rounded-lg border border-neutral-200 px-5 py-3 hover:bg-neutral-50"
        >
          <ArrowLeft className="size-4 shrink-0 text-neutral-500" />
          <span>
            <span className="block font-sans text-xs text-neutral-500">
              Previous Lesson
            </span>
            <span className="block font-sans text-sm text-neutral-900">
              {previous.title}
            </span>
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <div className="flex items-center gap-6 md:ml-auto">
          <span className="text-right">
            <span className="block font-sans text-xs text-neutral-500">
              Next Lesson
            </span>
            <span className="block font-sans text-sm text-neutral-900">
              {next.title}
            </span>
            {next.duration != null && (
              <span className="block font-sans text-xs text-neutral-500">
                {formatDuration(next.duration)}
              </span>
            )}
          </span>
          <Link href={`/lessons/${next.slug}`} className={nextButtonClasses}>
            Next Lesson
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
