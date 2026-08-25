import { BarChart2, Clock } from "lucide-react";
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
  iconClassName = "bg-neutral-900 text-white",
  title,
  description,
  level,
  duration,
  moduleCount,
}: CourseCardProps) {
  return (
    <div className="rounded-lg border border-neutral-100 bg-white p-5 shadow-sm">
      <div
        className={`mb-4 flex size-10 items-center justify-center rounded-sm font-sans text-sm font-semibold ${iconClassName}`}
      >
        {icon}
      </div>
      <h3 className="font-sans text-lg font-semibold text-neutral-900">
        {title}
      </h3>
      <p className="mt-1 font-sans text-sm text-neutral-500">{description}</p>
      <div className="mt-4 flex items-center gap-4 font-sans text-xs text-neutral-500">
        <span>{level}</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" />
          {duration}
        </span>
        <span className="inline-flex items-center gap-1">
          <BarChart2 className="size-3.5" />
          {moduleCount} modules
        </span>
      </div>
    </div>
  );
}
