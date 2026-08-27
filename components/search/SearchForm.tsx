"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { SearchInput } from "@/components/ui/Input";

interface SearchFormProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export function SearchForm({
  defaultValue = "",
  placeholder = "Ask anything about your learning…",
  className,
}: SearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className={className}>
      <SearchInput
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        shortcut="⌘ K"
        aria-label="Search lessons and courses"
      />
    </form>
  );
}
