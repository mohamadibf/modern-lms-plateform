import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schema } from "./schemaTypes";
import { structure } from "./structure";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }
  return v;
}

const projectId = assertValue(
  process.env.SANITY_STUDIO_PROJECT_ID,
  "Missing environment variable: SANITY_STUDIO_PROJECT_ID (add it to studio/.env)"
);

const dataset = assertValue(
  process.env.SANITY_STUDIO_DATASET,
  "Missing environment variable: SANITY_STUDIO_DATASET (add it to studio/.env)"
);

export default defineConfig({
  name: "vertex",
  title: "Vertex",
  projectId,
  dataset,
  schema,
  plugins: [structureTool({ structure }), visionTool()],
});
