import "server-only";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";
import { getReadToken } from "./token";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: getReadToken(),
  useCdn: false,
  perspective: "published",
});
