import type { PaginatedResponse } from "@bsport/store-base";

import { TagRuleKind } from "./constants";

export type Smartlist = {
  id: number;
  name: string;
  company: number;
  description: string;
  member_base: number;
  has_active_communication_group_configs: boolean;
};
export type PaginatedTagRules = PaginatedResponse<TagRule>;

/**
 * Query params for fetching tag rules
 */
export type FetchTagRulesParams = { smartlist_id: string };

export type TagRule = {
  id: number;
  company_id: number;
  smartlist: number;
  tag: number;
  kind: TagRuleKind;
  date_created: string;
};

export type CreateTagRuleParams = {
  smartlist: number;
  tag: number;
  kind: TagRuleKind;
};

export type UpdateTagRuleParams = CreateTagRuleParams & {
  id: number;
};
