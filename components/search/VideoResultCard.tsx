import { ChevronRight, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { formatTimestamp } from "@/lib/format";
import type { VideoResultSchema } from "@/lib/search/types";
import type { z } from "zod";

type VideoResult = z.infer<typeof VideoResultSchema>;

export function VideoResultCard({ result }: { result: VideoResult }) {
  return (
    <Link
      href={`${result.href}?t=${result.startSeconds}`}
      className="flex flex-col gap-5 rounded-xl border border-neutral-100 bg-white p-5 hover:border-neutral-200 sm:flex-row"
    >
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-neutral-900 sm:h-auto sm:w-55">
        {result.thumbnailUrl && (
          <Image
            src={result.thumbnailUrl}
            alt=""
            fill
            className="object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle className="size-10 fill-white/90 text-neutral-900" />
        </div>
        {result.durationSeconds != null && (
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-sans text-xs text-white">
            {formatTimestamp(result.durationSeconds)}
          </span>
        )}
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
          <Badge variant="video" className="shrink-0">
            Video
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
            {result.label && `Lesson ${result.label}`}
            {result.moduleTitle ? ` · ${result.moduleTitle}` : ""}
          </span>
          <span className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-primary-500">
            Watch from {formatTimestamp(result.startSeconds)}
            <ChevronRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
