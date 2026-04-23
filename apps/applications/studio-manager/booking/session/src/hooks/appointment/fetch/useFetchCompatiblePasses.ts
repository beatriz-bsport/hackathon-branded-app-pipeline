import { useQuery } from "@tanstack/react-query";

import {
  PRIVATE_CONSUMER_PASS_STALE_TIME,
  type PrivateConsumerPass,
  fetchCompatiblePassesAPI,
  privateConsumerPassKeys,
} from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

const fetchCompatiblePasses = fetchCompatiblePassesAPI.bind(null, fetch);

export const useFetchCompatiblePasses = (
  privateSlotId: number,
  memberId: number,
  enabled = true,
) => {
  return useQuery<PrivateConsumerPass[]>({
    queryKey: privateConsumerPassKeys.compatible(privateSlotId, memberId),
    queryFn: () => fetchCompatiblePasses(privateSlotId, memberId),
    enabled,
    staleTime: PRIVATE_CONSUMER_PASS_STALE_TIME,
  });
};
