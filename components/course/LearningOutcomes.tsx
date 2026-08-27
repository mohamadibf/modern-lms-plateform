import {
  Cloud,
  Code2,
  Database,
  Gauge,
  Layers,
  Puzzle,
  Rocket,
  Shield,
  Sparkles,
  Terminal,
  Video,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import type { COURSE_BY_SLUG_QUERY_RESULT } from "@/sanity.types";

type LearningOutcome = NonNullable<
  NonNullable<COURSE_BY_SLUG_QUERY_RESULT>["learningOutcomes"]
>[number];

const ICON_MAP: Record<string, LucideIcon> = {
  layers: Layers,
  database: Database,
  gauge: Gauge,
  cloud: Cloud,
  code: Code2,
  shield: Shield,
  sparkles: Sparkles,
  workflow: Workflow,
  puzzle: Puzzle,
  rocket: Rocket,
  terminal: Terminal,
  video: Video,
};

interface LearningOutcomesProps {
  outcomes: LearningOutcome[];
}

export function LearningOutcomes({ outcomes }: LearningOutcomesProps) {
  if (outcomes.length === 0) return null;

  return (
    <section className="rounded-2xl border border-neutral-100 bg-white p-7">
      <h2 className="font-display text-2xl font-bold text-neutral-900">
        What you&apos;ll learn
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {outcomes.map((outcome) => {
          const Icon = ICON_MAP[outcome.icon ?? ""] ?? Sparkles;
          return (
            <div
              key={outcome._key}
              className="rounded-lg border border-neutral-100 p-7"
            >
              <Icon className="size-12 text-primary-500" strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-lg font-bold text-neutral-900">
                {outcome.title}
              </h3>
              <p className="mt-2 font-sans text-[15px] leading-7 text-neutral-500">
                {outcome.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
