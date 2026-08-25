import { ExternalLink, FileText } from "lucide-react";

interface ResourceCardProps {
  title: string;
  description: string;
  fileMeta: string;
}

export function ResourceCard({
  title,
  description,
  fileMeta,
}: ResourceCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-neutral-100 bg-white p-5 shadow-sm">
      <FileText className="mt-0.5 size-5 shrink-0 text-neutral-500" />
      <div className="flex-1">
        <h3 className="font-sans text-sm font-semibold text-neutral-900">
          {title}
        </h3>
        <p className="mt-1 font-sans text-sm text-neutral-500">
          {description}
        </p>
        <span className="mt-2 block font-sans text-xs text-neutral-500">
          {fileMeta}
        </span>
      </div>
      <ExternalLink className="size-4 shrink-0 text-neutral-500" />
    </div>
  );
}
