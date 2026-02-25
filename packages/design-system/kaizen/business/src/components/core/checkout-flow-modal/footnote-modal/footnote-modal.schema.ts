import { z } from "zod";

import { FOOTNOTE_MAX_LENGTH } from "#src/components/core/checkout-flow-modal/schema";

export const footnoteModalSchema = z
  .string()
  .min(1, "Footnote is required")
  .max(
    FOOTNOTE_MAX_LENGTH,
    `Footnote must be at most ${FOOTNOTE_MAX_LENGTH} characters`,
  );
