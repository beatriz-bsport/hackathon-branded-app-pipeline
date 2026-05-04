import { TagRuleKind } from "@bsport/api-cdp/smartlist";

export type AutomationTagRuleFormData = {
  kind: TagRuleKind;
  tagIds: number[];
};
