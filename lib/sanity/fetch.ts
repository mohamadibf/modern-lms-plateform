import "server-only";
import type { QueryParams } from "next-sanity";

import { client } from "./client";

const ONE_HOUR = 60 * 60;

export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  tags,
  revalidate,
}: {
  query: QueryString;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
}) {
  return client.fetch(query, params, {
    next: {
      tags,
      revalidate: tags?.length ? false : (revalidate ?? ONE_HOUR),
    },
  });
}
