import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { searchMembersQueryOptions } from "@bsport/api-cdp";

import { fetch } from "#src/utils/fetch";

const MEMBERS_DEFAULT_COUNT = 20;

export const useSearchMembersForFilter = (searchValue: string) => {
  return useQuery({
    ...searchMembersQueryOptions(fetch, {
      text: searchValue,
      count: MEMBERS_DEFAULT_COUNT,
    }),
    placeholderData: keepPreviousData,
    select: (members) =>
      members?.map((member) => ({
        id: `${member.id}`,
        label: member.name,
      })) || [],
  });
};
