import { TagRuleKind } from "#src/api/constants";

export type AutomationTagRuleFormData = {
  kind: TagRuleKind;
  tagIds: number[];
};
