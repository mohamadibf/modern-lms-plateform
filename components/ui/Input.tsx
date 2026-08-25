import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldClasses =
  "h-11 w-full rounded-md border border-neutral-200 bg-white px-4 font-sans text-sm text-neutral-900 placeholder:text-neutral-500 outline-none transition-colors focus:border-primary-400";

export function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClasses, className)} {...props} />;
}

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  shortcut?: string;
}

export function SearchInput({
  className,
  shortcut,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
      <input
        type="search"
        className={cn(fieldClasses, "pl-11", shortcut && "pr-14")}
        {...props}
      />
      {shortcut && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-xs border border-neutral-200 px-1.5 py-0.5 font-sans text-xs text-neutral-500">
          {shortcut}
        </span>
      )}
    </div>
  );
}
