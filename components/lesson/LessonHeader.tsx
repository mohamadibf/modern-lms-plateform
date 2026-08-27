import { Bookmark, Clock, SignalHigh, Users } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { formatDuration, formatLevel, formatStudentCount } from "@/lib/format";

interface LessonHeaderProps {
  lessonLabel: string;
  title: string;
  subtitle: string | null;
  duration: number | null;
  level: string | null;
  studentCount: number | null;
}

export function LessonHeader({
  lessonLabel,
  title,
  subtitle,
  duration,
  level,
  studentCount,
}: LessonHeaderProps) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <Badge variant="lesson">{lessonLabel}</Badge>
        <button
          type="button"
          aria-label="Bookmark this lesson"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
        >
          <Bookmark className="size-4" />
        </button>
      </div>

      <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-neutral-900 md:text-[44px]">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-3 max-w-2xl font-sans text-[17px] leading-8 text-neutral-500">
          {subtitle}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-2 font-sans text-sm text-neutral-500">
        {duration != null && (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 shrink-0" />
            {formatDuration(duration)}
          </span>
        )}
        {level && (
          <span className="inline-flex items-center gap-1.5">
            <SignalHigh className="size-4 shrink-0" />
            {formatLevel(level)}
          </span>
        )}
        {studentCount != null && (
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 shrink-0" />
            {formatStudentCount(studentCount)} students
          </span>
        )}
      </div>
    </div>
  );
}
