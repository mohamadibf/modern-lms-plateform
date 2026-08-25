import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  showLabel,
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-1.5 flex-1 rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-primary-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="whitespace-nowrap font-sans text-xs text-neutral-500">
          {percent}% complete
        </span>
      )}
    </div>
  );
}
