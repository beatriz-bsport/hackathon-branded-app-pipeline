import { z } from "zod";

import { TagRuleKind } from "#src/api/constants";
import { i18nInstance } from "#src/utils/i18n";

import { type AutomationTagRuleFormData } from "./types";

export const automationTagRuleSchema = z.object({
  kind: z.union([
    z.literal(TagRuleKind.TAG_ON_JOIN_AND_UNTAG_ON_LEFT),
    z.literal(TagRuleKind.TAG_ON_JOIN_AND_KEEP_TAG),
    z.literal(TagRuleKind.TAG_ON_LEFT),
  ]),
  tagIds: z.array(z.number()).min(
    1,
    i18nInstance.t("actions.createAutomationModal.tagRuleForm.tag.required", {
      ns: "sm-smartlists_details",
    }),
  ),
}) satisfies z.ZodType<AutomationTagRuleFormData>;
