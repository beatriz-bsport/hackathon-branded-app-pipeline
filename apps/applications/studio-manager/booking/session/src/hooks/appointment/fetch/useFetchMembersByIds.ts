import { useQuery } from "@tanstack/react-query";
import keyBy from "lodash/keyBy";

import { type Member, memberListQueryOptions } from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

export const useFetchMembersByIds = (
  memberIds: number[] = [],
  enabled = true,
) => {
  const memberIdsSorted = [...memberIds].sort();
  return useQuery({
    ...memberListQueryOptions(fetch, {
      id__in: memberIdsSorted,
      page_size: memberIdsSorted.length,
    }),
    enabled: enabled && memberIdsSorted.length > 0,
    select: (response) =>
      keyBy(response.results, "id") as Record<number, Member>,
  });
};
