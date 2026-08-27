export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatStudentCount(count: number): string {
  if (count < 1000) return `${count}`;
  return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function formatLevel(level: string): string {
  return LEVEL_LABELS[level] ?? level;
}
