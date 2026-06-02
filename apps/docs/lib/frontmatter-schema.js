import { z } from "zod";

export const FRONTMATTER_STATUSES = /** @type {const} */ ([
  "stable",
  "beta",
  "deprecated",
  "internal",
]);

export const FRONTMATTER_CATEGORIES = /** @type {const} */ ([
  "welcome",
  "foundations",
  "components",
  "patterns",
  "mdx-components",
]);

export const FrontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(FRONTMATTER_STATUSES).optional(),
    category: z.enum(FRONTMATTER_CATEGORIES).optional(),
    tags: z.array(z.string()).optional(),
    since: z.string().optional(),
    related: z.array(z.string()).optional(),
    figma: z.string().url().optional(),
    source: z.string().optional(),
    order: z.number().optional(),
    sections: z.array(z.string()).optional(),
  })
  .strict();
