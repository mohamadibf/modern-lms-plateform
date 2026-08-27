"use client";

import { ChevronDown, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SidebarLesson {
  _id: string;
  title: string | null;
  slug: string | null;
  duration: number | null;
}

interface SidebarModule {
  _key: string;
  title: string | null;
  durationSeconds: number | null;
  lessons: SidebarLesson[];
}

interface LessonSidebarProps {
  courseTitle: string;
  courseSlug: string;
  coverImageUrl: string | null;
  coverAlt: string;
  modules: SidebarModule[];
  currentLessonId: string;
  currentModuleIndex: number;
}

function ModuleList({
  modules,
  currentLessonId,
  currentModuleIndex,
  expandedKey,
  onToggle,
}: {
  modules: SidebarModule[];
  currentLessonId: string;
  currentModuleIndex: number;
  expandedKey: string | null;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="flex flex-col">
      {modules.map((module, index) => {
        const isOpen = expandedKey === module._key;
        const isCurrentModule = index === currentModuleIndex;
        const panelId = `lesson-module-panel-${module._key}`;
        const buttonId = `lesson-module-trigger-${module._key}`;

        return (
          <div key={module._key} className={cn(index > 0 && "border-t border-neutral-100")}>
            <button
              type="button"
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => onToggle(module._key)}
              className="flex w-full items-center gap-3 py-3 text-left"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full border font-sans text-xs font-medium",
                  isCurrentModule
                    ? "border-primary-500 bg-primary-500 text-white"
                    : "border-neutral-200 text-neutral-500",
                )}
              >
                {index + 1}
              </span>
              <span className="flex-1">
                <span className="block font-sans text-sm font-medium text-neutral-900">
                  {module.title}
                </span>
                {module.durationSeconds != null && (
                  <span className="mt-0.5 block font-sans text-[13px] text-neutral-500">
                    {formatDuration(module.durationSeconds)}
                  </span>
                )}
              </span>
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "size-4 shrink-0 text-neutral-500 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="flex flex-col gap-1 pb-3 pl-4"
              >
                {module.lessons.map((lesson) => {
                  const isCurrent = lesson._id === currentLessonId;
                  return (
                    <Link
                      key={lesson._id}
                      href={lesson.slug ? `/lessons/${lesson.slug}` : "#"}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm",
                        isCurrent
                          ? "bg-primary-100 text-primary-500"
                          : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-2 shrink-0 rounded-full",
                          isCurrent ? "bg-primary-500" : "border border-neutral-300",
                        )}
                      />
                      <span className="flex-1">
                        <span className="block">{lesson.title}</span>
                        <span className="block text-xs">
                          {isCurrent
                            ? "Now playing"
                            : lesson.duration != null
                              ? formatDuration(lesson.duration)
                              : null}
                        </span>
                      </span>
                      {isCurrent && (
                        <PlayCircle
                          aria-hidden="true"
                          className="size-5 shrink-0 fill-primary-500 text-white"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function LessonSidebar({
  courseTitle,
  courseSlug,
  coverImageUrl,
  coverAlt,
  modules,
  currentLessonId,
  currentModuleIndex,
}: LessonSidebarProps) {
  const [expandedKey, setExpandedKey] = useState<string | null>(
    modules[currentModuleIndex]?._key ?? null,
  );

  const header = (
    <div className="flex items-center gap-3 pb-5">
      {coverImageUrl && (
        <div className="relative size-12 shrink-0 overflow-hidden rounded-md">
          <Image src={coverImageUrl} alt={coverAlt} fill className="object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-sm font-semibold text-neutral-900">
          {courseTitle}
        </p>
        <p className="mt-0.5 font-sans text-[13px] text-neutral-500">0% complete</p>
        <ProgressBar value={0} className="mt-1.5" />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-[280px] shrink-0 border-r border-neutral-100 pr-6 lg:block">
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-primary-500 hover:text-primary-400"
        >
          ← Back to course
        </Link>
        <div className="mt-6">{header}</div>
        <p className="border-t border-neutral-100 py-3 font-sans text-sm font-medium text-neutral-900">
          Module {currentModuleIndex + 1} of {modules.length}
        </p>
        <ModuleList
          modules={modules}
          currentLessonId={currentLessonId}
          currentModuleIndex={currentModuleIndex}
          expandedKey={expandedKey}
          onToggle={(key) => setExpandedKey((current) => (current === key ? null : key))}
        />
      </aside>

      {/* Mobile disclosure */}
      <details className="mb-6 rounded-xl border border-neutral-100 bg-white p-4 lg:hidden">
        <summary className="cursor-pointer font-sans text-sm font-semibold text-neutral-900">
          Course content
        </summary>
        <div className="mt-4">
          <Link
            href={`/courses/${courseSlug}`}
            className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-primary-500 hover:text-primary-400"
          >
            ← Back to course
          </Link>
          <div className="mt-4">{header}</div>
          <ModuleList
            modules={modules}
            currentLessonId={currentLessonId}
            currentModuleIndex={currentModuleIndex}
            expandedKey={expandedKey}
            onToggle={(key) => setExpandedKey((current) => (current === key ? null : key))}
          />
        </div>
      </details>
    </>
  );
}
