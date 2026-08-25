import { ExternalLink, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface LessonCardProps {
  variant: "video" | "lesson";
  title: string;
  description: string;
  meta: string;
  actionLabel: string;
}

export function LessonCard({
  variant,
  title,
  description,
  meta,
  actionLabel,
}: LessonCardProps) {
  return (
    <div className="rounded-lg border border-neutral-100 bg-white p-5 shadow-sm">
      <Badge variant={variant}>{variant}</Badge>
      <h3 className="mt-3 font-sans text-lg font-semibold text-neutral-900">
        {title}
      </h3>
      <p className="mt-1 font-sans text-sm text-neutral-500">{description}</p>
      <div className="mt-4 flex items-center justify-between font-sans text-sm">
        <span className="text-neutral-500">{meta}</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-primary-500">
          {actionLabel}
          {variant === "video" ? (
            <PlayCircle className="size-4" />
          ) : (
            <ExternalLink className="size-4" />
          )}
        </span>
      </div>
    </div>
  );
}
