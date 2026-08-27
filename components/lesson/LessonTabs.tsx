"use client";

import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type TabId = "content" | "notes";

const TABS: { id: TabId; label: string }[] = [
  { id: "content", label: "Lesson Content" },
  { id: "notes", label: "Notes" },
];

interface LessonTabsProps {
  content: ReactNode;
  notes: ReactNode;
}

export function LessonTabs({ content, notes }: LessonTabsProps) {
  const [active, setActive] = useState<TabId>("content");

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const currentIndex = TABS.findIndex((tab) => tab.id === active);
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + delta + TABS.length) % TABS.length;
    setActive(TABS[nextIndex].id);
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Lesson sections"
        onKeyDown={handleKeyDown}
        className="flex items-center gap-8 border-b border-neutral-100"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`lesson-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`lesson-tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={cn(
                "-mb-px border-b-2 pb-3 font-sans text-[15px] font-medium",
                isActive
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-neutral-500 hover:text-neutral-900",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id="lesson-tabpanel-content"
        role="tabpanel"
        aria-labelledby="lesson-tab-content"
        hidden={active !== "content"}
        className="pt-8"
      >
        {content}
      </div>
      <div
        id="lesson-tabpanel-notes"
        role="tabpanel"
        aria-labelledby="lesson-tab-notes"
        hidden={active !== "notes"}
        className="pt-8"
      >
        {notes}
      </div>
    </div>
  );
}
