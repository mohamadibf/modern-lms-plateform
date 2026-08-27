import Link from "next/link";
import type { ReactNode } from "react";

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface NavigationProps {
  links: NavLink[];
  right?: ReactNode;
}

export function Navigation({ links, right }: NavigationProps) {
  return (
    <nav className="border-b border-neutral-100 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-xs bg-primary-500 font-display text-sm font-bold text-white">
              V
            </span>
            <span className="font-display text-lg font-bold text-neutral-900">
              Vertex
            </span>
          </Link>
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={
                  link.active
                    ? "font-sans text-sm font-medium text-neutral-900"
                    : "font-sans text-sm font-medium text-neutral-500 hover:text-neutral-900"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        {right}
      </div>
    </nav>
  );
}
