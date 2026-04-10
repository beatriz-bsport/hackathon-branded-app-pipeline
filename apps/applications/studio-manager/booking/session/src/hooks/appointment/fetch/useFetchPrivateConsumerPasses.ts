import { useQuery } from "@tanstack/react-query";
import keyBy from "lodash/keyBy";

import {
  type PrivateConsumerPass,
  privateConsumerPassesQueryOptions,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useFetchPrivateConsumerPasses = (
  passIds: number[] = [],
  enabled = true,
) => {
  const passIdsSorted = [...passIds].sort();
  return useQuery({
    ...privateConsumerPassesQueryOptions(fetch, {
      id__in: passIdsSorted,
      page_size: passIdsSorted.length,
    }),
    enabled: enabled && passIdsSorted.length > 0,
    select: (response) =>
      keyBy(response.results, "id") as Record<number, PrivateConsumerPass>,
  });
};
