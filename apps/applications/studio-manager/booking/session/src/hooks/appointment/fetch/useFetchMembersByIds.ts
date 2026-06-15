import { useQuery } from "@tanstack/react-query";
import keyBy from "lodash/keyBy";

import {
  MEMBER_STALE_TIME,
  type Member,
  memberListQueryOptions,
} from "@bsport/api-cdp/member";

import { fetch } from "#src/utils/fetch";

export const useFetchMembersByIds = <T = Record<string, Member>>(
  memberIds: number[] = [],
  enabled = true,
  select?: (members: Member[]) => T,
) => {
  const memberIdsSorted = [...memberIds].sort();
  return useQuery({
    ...memberListQueryOptions(fetch, {
      id__in: memberIdsSorted,
      page_size: memberIdsSorted.length,
    }),
    enabled: enabled && memberIdsSorted.length > 0,
    staleTime: MEMBER_STALE_TIME,
    select: (response) => {
      const members = response.results;
      return select ? select(members) : (keyBy(members, "id") as T);
    },
  });
};
