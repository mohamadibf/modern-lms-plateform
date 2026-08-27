import {
  Download,
  ExternalLink,
  FileText,
  FolderGit2,
  BookOpen,
  Link2,
  type LucideIcon,
} from "lucide-react";

import type { LESSON_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

type Resource = NonNullable<
  NonNullable<LESSON_BY_SLUG_QUERY_RESULT>["resources"]
>[number];

const ICON_MAP: Record<string, LucideIcon> = {
  documentation: FileText,
  guide: BookOpen,
  repository: FolderGit2,
  article: FileText,
  download: Download,
  link: Link2,
};

interface LessonResourcesProps {
  resources: Resource[];
}

export function LessonResources({ resources }: LessonResourcesProps) {
  if (resources.length === 0) return null;

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-neutral-900">
        Resources
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {resources.map((resource) => {
          const Icon = ICON_MAP[resource.type ?? ""] ?? Link2;
          return (
            <a
              key={resource._key}
              href={resource.url ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex flex-col gap-3 rounded-xl border border-neutral-100 bg-white p-5 hover:bg-neutral-50"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary-100 text-primary-500">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="font-sans text-sm font-semibold text-neutral-900">
                  {resource.title}
                </p>
                {resource.description && (
                  <p className="mt-1 font-sans text-[13px] leading-5 text-neutral-500">
                    {resource.description}
                  </p>
                )}
              </div>
              <ExternalLink
                aria-hidden="true"
                className="absolute bottom-5 right-5 size-4 text-neutral-400"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
