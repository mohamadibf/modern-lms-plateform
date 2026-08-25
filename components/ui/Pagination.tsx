"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

function getPageItems(page: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items = new Set([1, 2, totalPages - 1, totalPages, page]);
  const sorted = [...items].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);

  const result: (number | "...")[] = [];
  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1] > 1) result.push("...");
    result.push(n);
  });
  return result;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const items = getPageItems(page, totalPages);

  return (
    <nav className="flex items-center gap-1 font-sans text-sm">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
        className="flex size-9 items-center justify-center rounded-sm text-neutral-500 hover:bg-neutral-100 disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>
      {items.map((item, index) => (
        <Fragment key={`${item}-${index}`}>
          {item === "..." ? (
            <span className="flex size-9 items-center justify-center text-neutral-500">
              …
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onPageChange?.(item)}
              className={cn(
                "flex size-9 items-center justify-center rounded-sm",
                item === page
                  ? "border border-primary-500 font-medium text-primary-500"
                  : "text-neutral-500 hover:bg-neutral-100",
              )}
            >
              {item}
            </button>
          )}
        </Fragment>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange?.(page + 1)}
        className="flex size-9 items-center justify-center rounded-sm text-neutral-500 hover:bg-neutral-100 disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
