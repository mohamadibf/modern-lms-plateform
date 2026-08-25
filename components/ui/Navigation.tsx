import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

interface NavigationProps {
  links: NavLink[];
}

export function Navigation({ links }: NavigationProps) {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-100 bg-white px-6 py-4">
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
    </nav>
  );
}
