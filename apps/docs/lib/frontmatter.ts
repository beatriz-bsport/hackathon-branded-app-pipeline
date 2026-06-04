import type { z } from "zod";

import type { FrontmatterSchema } from "#src/lib/frontmatter-schema";

export type Frontmatter = z.infer<typeof FrontmatterSchema>;
