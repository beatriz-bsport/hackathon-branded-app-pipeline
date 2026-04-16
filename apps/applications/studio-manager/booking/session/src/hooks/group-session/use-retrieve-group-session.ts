import { useQuery } from "@tanstack/react-query";

import { retrieveGroupSessionQueryOption } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useRetrieveGroupSession = (groupSessionId: number | null) => {
  return useQuery({
    ...retrieveGroupSessionQueryOption(fetch, groupSessionId!),
    enabled: groupSessionId !== null,
  });
};
