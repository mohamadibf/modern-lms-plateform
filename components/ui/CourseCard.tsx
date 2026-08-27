import { Clock, File, SignalHigh } from "lucide-react";
import type { ReactNode } from "react";

interface CourseCardProps {
  icon: ReactNode;
  iconClassName?: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  moduleCount: number;
}

export function CourseCard({
  icon,
  iconClassName = "rounded-lg bg-neutral-900 text-white",
  title,
  description,
  level,
  duration,
  moduleCount,
}: CourseCardProps) {
  return (
    <div className="flex flex-col rounded-lg border border-neutral-100 bg-white p-6 shadow-sm">
      <div
        className={`mb-5 flex size-[72px] items-center justify-center ${iconClassName}`}
      >
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-neutral-900">
        {title}
      </h3>
      <p className="mt-2 font-sans text-[15px] leading-6 text-neutral-500">
        {description}
      </p>
      <div className="mt-5 border-t border-neutral-100 pt-4">
        <div className="flex items-center gap-3 font-sans text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <SignalHigh className="size-4 shrink-0" />
            {level}
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <Clock className="size-4 shrink-0" />
            {duration}
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap">
            <File className="size-4 shrink-0" />
            {moduleCount} modules
          </span>
        </div>
      </div>
    </div>
  );
}
