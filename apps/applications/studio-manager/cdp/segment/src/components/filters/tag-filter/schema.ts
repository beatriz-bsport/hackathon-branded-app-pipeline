import { z } from "zod";

const tagFilterFormBaseSchema = z.object({
  id: z.number().int().positive().optional(),
  smartlist: z.number().int().positive(),
  includeSectionEnabled: z.boolean(),
  excludeSectionEnabled: z.boolean(),
  tagsIncluded: z.array(z.number().int().positive()),
  tagsExcluded: z.array(z.number().int().positive()),
});

const hasAtLeastOneEffectiveTag = (
  data: z.infer<typeof tagFilterFormBaseSchema>,
) => {
  const effectiveIncluded = data.includeSectionEnabled ? data.tagsIncluded : [];
  const effectiveExcluded = data.excludeSectionEnabled ? data.tagsExcluded : [];
  return effectiveIncluded.length > 0 || effectiveExcluded.length > 0;
};

/**
 * Validates tag filter form values before create / update.
 */
export const tagFilterFormSchema = tagFilterFormBaseSchema.refine(
  hasAtLeastOneEffectiveTag,
  {
    message: "atLeastOneTagRequired",
    path: ["tagsIncluded"],
  },
);
