import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
  deployment: {
    appId: "qon4kgoiwqmjivoui6yfitqe",
  },
  typegen: {
    enabled: true,
    path: "../{app,lib}/**/*.{ts,tsx}",
    schema: "schema.json",
    generates: "../sanity.types.ts",
    overloadClientMethods: true,
  },
});
