import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 font-sans text-sm text-neutral-500">
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <ChevronRight className="size-3.5" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-neutral-900">
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-900">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
