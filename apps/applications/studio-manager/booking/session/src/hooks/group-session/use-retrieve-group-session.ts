import { useQuery } from "@tanstack/react-query";

import { retrieveGroupSessionQueryOption } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const GROUP_SESSION_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const useRetrieveGroupSession = (groupSessionId: number | null) => {
  return useQuery({
    ...retrieveGroupSessionQueryOption(fetch, groupSessionId!),
    enabled: groupSessionId !== null,
    staleTime: GROUP_SESSION_STALE_TIME,
  });
};
