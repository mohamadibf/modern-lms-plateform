import { Check, Circle, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "in-progress" | "completed" | "now-playing" | "locked";

interface StatusIndicatorProps {
  status: Status;
  label?: string;
  className?: string;
}

const statusConfig: Record<
  Status,
  { icon: typeof Circle; label: string; className: string }
> = {
  "in-progress": {
    icon: Circle,
    label: "In Progress",
    className: "text-neutral-500",
  },
  completed: {
    icon: Check,
    label: "Completed",
    className: "text-success-500",
  },
  "now-playing": {
    icon: PlayCircle,
    label: "Now Playing",
    className: "text-primary-500",
  },
  locked: {
    icon: Lock,
    label: "Locked",
    className: "text-neutral-500",
  },
};

export function StatusIndicator({
  status,
  label,
  className,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-sans text-sm",
        config.className,
        className,
      )}
    >
      <Icon className="size-4" />
      {label ?? config.label}
    </span>
  );
}
