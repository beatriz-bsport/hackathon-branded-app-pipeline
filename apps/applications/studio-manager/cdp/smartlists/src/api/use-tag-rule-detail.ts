import { useSuspenseQuery } from "@tanstack/react-query";

import { tagRuleDetailQueryOptions } from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

export const useTagRuleDetailSuspenseQuery = (tagRuleId: string) => {
  return useSuspenseQuery(tagRuleDetailQueryOptions(fetch, tagRuleId));
};
