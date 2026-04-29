import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const incidents = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/incidents" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    kb: z.string().optional(),
    severity: z.enum(["annoyance", "broken", "catastrophic"]),
    affected: z.array(z.string()),
    fixed: z.boolean().default(false),
    fixDate: z.coerce.date().optional(),
    sources: z.array(z.url()).optional(),
  }),
});

export const collections = { incidents };
