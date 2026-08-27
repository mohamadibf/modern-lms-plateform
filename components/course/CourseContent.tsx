"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";
import type { COURSE_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

type Course = NonNullable<COURSE_BY_SLUG_QUERY_RESULT>;
type ModuleItem = NonNullable<Course["modules"]>[number];

const VISIBLE_MODULE_LIMIT = 6;

interface CourseContentProps {
  modules: ModuleItem[];
  totalDurationSeconds: number | null;
}

export function CourseContent({
  modules,
  totalDurationSeconds,
}: CourseContentProps) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const visibleModules =
    showAll || modules.length <= VISIBLE_MODULE_LIMIT
      ? modules
      : modules.slice(0, VISIBLE_MODULE_LIMIT);

  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="font-display text-2xl font-bold text-neutral-900">
          Course Content
        </h2>
        <span className="font-sans text-[13px] text-neutral-500">
          {modules.length} modules
          {totalDurationSeconds != null &&
            ` • ${formatDuration(totalDurationSeconds)}`}
        </span>
      </div>

      <div className="rounded-2xl border border-neutral-100 bg-white">
        {visibleModules.map((module, index) => {
          const isOpen = expandedKey === module._key;
          const panelId = `module-panel-${module._key}`;
          const buttonId = `module-trigger-${module._key}`;

          return (
            <div
              key={module._key}
              className={cn(
                index > 0 && "border-t border-neutral-100",
              )}
            >
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() =>
                  setExpandedKey(isOpen ? null : module._key)
                }
                className="flex w-full items-center gap-4 px-8 py-4 text-left"
              >
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 font-sans text-xs font-medium text-neutral-500"
                >
                  {index + 1}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-[15px] font-bold text-neutral-900">
                    {module.title}
                  </span>
                  {module.summary && (
                    <span className="mt-0.5 block font-sans text-[13px] text-neutral-500">
                      {module.summary}
                    </span>
                  )}
                </span>
                {module.durationSeconds != null && (
                  <span className="shrink-0 font-sans text-sm text-neutral-500">
                    {formatDuration(module.durationSeconds)}
                  </span>
                )}
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "size-4 shrink-0 text-neutral-500 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              {isOpen && module.lessons && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="flex flex-col gap-1 px-8 pb-4 pl-[4.25rem]"
                >
                  {module.lessons.map((lesson, lessonIndex) => (
                    <Link
                      key={lesson._id}
                      href={lesson.slug ? `/lessons/${lesson.slug}` : "#"}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                    >
                      <span className="shrink-0 text-xs text-neutral-500">
                        {index + 1}.{lessonIndex + 1}
                      </span>
                      <span className="flex-1">{lesson.title}</span>
                      {lesson.freePreview && (
                        <Badge variant="neutral">Free</Badge>
                      )}
                      {lesson.duration != null && (
                        <span className="shrink-0 text-xs">
                          {formatDuration(lesson.duration)}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modules.length > VISIBLE_MODULE_LIMIT && (
        <div className="-mt-[22px] flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="rounded-full border border-neutral-200 bg-white px-6 py-2.5 font-sans text-sm font-medium text-neutral-900 hover:bg-neutral-50"
          >
            {showAll
              ? "Show fewer modules"
              : `Show all ${modules.length} modules`}
          </button>
        </div>
      )}
    </section>
  );
}
