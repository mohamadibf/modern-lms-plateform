import { VideoOff } from "lucide-react";

import { parseVideoUrl } from "@/lib/video";

interface LessonVideoProps {
  videoUrl: string;
  title: string;
  startSeconds?: number;
}

export function LessonVideo({ videoUrl, title, startSeconds = 0 }: LessonVideoProps) {
  const video = parseVideoUrl(videoUrl);

  if (!video) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-neutral-900 text-neutral-400">
        <div className="flex flex-col items-center gap-2">
          <VideoOff className="size-8" />
          <span className="font-sans text-sm">Video unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-neutral-900">
      <iframe
        src={video.embedUrl(startSeconds, startSeconds > 0)}
        title={title}
        className="size-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
