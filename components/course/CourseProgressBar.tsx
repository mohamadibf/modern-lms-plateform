import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";

interface CourseProgressBarProps {
  percentComplete?: number;
  resumeHref: string | null;
}

const ctaLinkClasses = cn(
  "inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-6",
  "font-sans text-sm font-medium text-white transition-colors",
  "bg-primary-500 hover:bg-primary-500/90",
);

export function CourseProgressBar({
  percentComplete = 0,
  resumeHref,
}: CourseProgressBarProps) {
  const label = percentComplete > 0 ? "In progress" : "Not started";

  return (
    <div className="sticky bottom-6 mt-10 flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:gap-8">
      <div className="shrink-0">
        <p className="font-sans text-[13px] text-neutral-500">
          Your Progress
        </p>
        <p className="mt-0.5 font-sans text-[15px] text-neutral-900">
          <span className="font-semibold">{percentComplete}%</span> {label}
        </p>
      </div>
      <ProgressBar value={percentComplete} className="flex-1 md:max-w-xs" />
      {resumeHref && (
        <Link href={resumeHref} className={cn(ctaLinkClasses, "md:ml-auto")}>
          Continue Learning
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
