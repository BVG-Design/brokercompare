import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "Missing Sanity configuration: NEXT_PUBLIC_SANITY_PROJECT_ID is not set."
  );
}

const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion: "2023-10-01",
  useCdn: true,
});
