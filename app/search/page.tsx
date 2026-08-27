import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { Suspense } from "react";

import { SearchForm } from "@/components/search/SearchForm";
import { SearchResults } from "@/components/search/SearchResults";
import { Navigation } from "@/components/ui/Navigation";

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const params = await searchParams;
  const rawQuery = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = rawQuery?.trim() ?? "";

  return (
    <div className="min-h-full bg-neutral-50">
      <Navigation
        links={[
          { label: "Courses", href: "/", active: true },
          { label: "My Learning", href: "#" },
        ]}
        right={
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="flex size-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
            >
              <Bell className="size-5" />
            </button>
            <Show when="signed-out">
              <div className="flex items-center gap-3">
                <SignInButton>
                  <button
                    type="button"
                    className="font-sans text-sm font-medium text-neutral-500 hover:text-neutral-900"
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button
                    type="button"
                    className="rounded-xs bg-primary-500 px-4 py-2 font-sans text-sm font-semibold text-white hover:bg-primary-400"
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        }
      />

      <div className="mx-auto max-w-[900px] px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-xs border border-primary-200 bg-primary-100 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-wide text-primary-500">
            Search Results
          </span>

          {query ? (
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl">
              Results for <span className="text-primary-500">&ldquo;{query}&rdquo;</span>
            </h1>
          ) : (
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl">
              Search your learning
            </h1>
          )}

          <SearchForm
            defaultValue={query}
            className="mt-10 w-full max-w-2xl"
          />
        </div>

        <div className="mt-10">
          <Suspense fallback={null}>
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
