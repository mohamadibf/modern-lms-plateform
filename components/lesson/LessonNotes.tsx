import { PortableText, type PortableTextComponents } from "@portabletext/react";

import type { BlockContent } from "@/sanity.types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-sans text-[15px] leading-7 text-neutral-700">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h3 className="font-display text-xl font-bold text-neutral-900">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="font-display text-lg font-bold text-neutral-900">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-primary-300 pl-4 font-sans text-[15px] italic leading-7 text-neutral-500">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-1 pl-5 font-sans text-[15px] leading-7 text-neutral-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-1 pl-5 font-sans text-[15px] leading-7 text-neutral-700">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-neutral-900">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[13px] text-neutral-900">
        {children}
      </code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-500 underline hover:text-primary-400"
      >
        {children}
      </a>
    ),
  },
};

interface LessonNotesProps {
  value: BlockContent;
}

export function LessonNotes({ value }: LessonNotesProps) {
  if (value.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <PortableText value={value} components={components} />
    </div>
  );
}
