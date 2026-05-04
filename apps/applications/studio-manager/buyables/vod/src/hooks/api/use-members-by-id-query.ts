import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { type Member, memberListQueryOptions } from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

export const useMembersByIdQuery = (memberIds: number[]) => {
  const sortedIds = useMemo(
    () => [...new Set(memberIds)].sort((a, b) => a - b),
    [memberIds],
  );

  return useQuery({
    ...memberListQueryOptions(fetch, {
      id__in: sortedIds,
      page_size: sortedIds.length,
    }),
    enabled: sortedIds.length > 0,
    select: (response) => {
      return new Map(
        response.results.map((member: Member) => [member.id, member] as const),
      );
    },
  });
};
