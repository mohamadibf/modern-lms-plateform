import { CheckCircle2, Lightbulb } from "lucide-react";

interface LessonKeyPointsProps {
  keyPoints: string[] | null;
  proTip: string | null;
}

export function LessonKeyPoints({ keyPoints, proTip }: LessonKeyPointsProps) {
  if ((!keyPoints || keyPoints.length === 0) && !proTip) return null;

  return (
    <div className="flex flex-col gap-6">
      {keyPoints && keyPoints.length > 0 && (
        <div>
          <p className="font-sans text-[15px] font-semibold text-neutral-900">
            In this lesson you will:
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {keyPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2 font-sans text-[15px] leading-8 text-neutral-700"
              >
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-1 size-[18px] shrink-0 text-primary-500"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {proTip && (
        <div className="rounded-xl bg-primary-100 p-6">
          <div className="flex items-center gap-2">
            <Lightbulb aria-hidden="true" className="size-5 text-primary-500" />
            <p className="font-display text-base font-bold text-neutral-900">
              Pro Tip
            </p>
          </div>
          <p className="mt-2 font-sans text-[15px] leading-7 text-neutral-700">
            {proTip}
          </p>
        </div>
      )}
    </div>
  );
}
