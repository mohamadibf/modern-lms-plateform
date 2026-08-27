import { Search } from "lucide-react";
import Link from "next/link";

export function SearchEmptyState() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-primary-100 p-6 sm:flex-row">
      <div className="flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-primary-500">
          <Search className="size-5" />
        </span>
        <div>
          <p className="font-sans text-sm font-semibold text-neutral-900">
            Can&apos;t find what you&apos;re looking for?
          </p>
          <p className="mt-0.5 font-sans text-sm text-neutral-500">
            Try different keywords or browse our full course catalog.
          </p>
        </div>
      </div>
      <Link
        href="/"
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-5 font-sans text-sm font-medium text-neutral-900 hover:bg-neutral-50"
      >
        Browse all courses
      </Link>
    </div>
  );
}
