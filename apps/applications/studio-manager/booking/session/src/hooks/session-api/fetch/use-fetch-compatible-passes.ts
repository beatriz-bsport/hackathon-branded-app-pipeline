import { useSuspenseQuery } from "@tanstack/react-query";

import { FetchPassesParams, passesQueryOptions } from "@bsport/api-buyables";

import { fetch } from "#src/utils/fetch";

export const useFetchCompatiblePasses = (
  sessionId: number,
  params?: Omit<FetchPassesParams, "offer">,
) =>
  useSuspenseQuery(passesQueryOptions(fetch, { offer: sessionId, ...params }));
