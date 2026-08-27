import { CheckCircle2, ChevronRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import type { LessonResultSchema } from "@/lib/search/types";
import type { z } from "zod";

type LessonResult = z.infer<typeof LessonResultSchema>;

export function LessonResultCard({ result }: { result: LessonResult }) {
  return (
    <Link
      href={result.href}
      className="flex flex-col gap-5 rounded-xl border border-neutral-100 bg-white p-5 hover:border-neutral-200 sm:flex-row"
    >
      <div className="relative flex h-40 w-full shrink-0 flex-col justify-between rounded-lg bg-primary-100 p-4 sm:h-auto sm:w-55">
        <ul className="flex flex-col gap-1.5">
          {result.keyPoints.slice(0, 3).map((point) => (
            <li
              key={point}
              className="line-clamp-1 font-sans text-xs text-neutral-700"
            >
              • {point}
            </li>
          ))}
        </ul>
        <CheckCircle2
          aria-hidden="true"
          className="absolute bottom-3 right-3 size-5 text-neutral-400"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {result.courseIconUrl && (
              <Image
                src={result.courseIconUrl}
                alt=""
                width={20}
                height={20}
                className="size-5 shrink-0 rounded object-cover"
              />
            )}
            <span className="truncate font-sans text-sm text-neutral-500">
              {result.courseTitle}
            </span>
          </div>
          <Badge variant="lesson" className="shrink-0">
            Lesson
          </Badge>
        </div>

        <h3 className="mt-2 font-sans text-lg font-semibold text-neutral-900">
          {result.lessonTitle}
        </h3>
        <p className="mt-1 line-clamp-2 font-sans text-sm text-neutral-500">
          {result.reason}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="font-sans text-xs text-neutral-500">
            {result.moduleTitle ? `Module ${result.label.split(".")[0]}` : null}
          </span>
          <span className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-primary-500">
            View lesson
            <ExternalLink className="size-3.5" />
            <ChevronRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
