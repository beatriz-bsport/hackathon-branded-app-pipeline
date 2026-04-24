import { useSuspenseQuery } from "@tanstack/react-query";

import { fetchVideoQueryOptions } from "@bsport/api-buyables/video";

import { fetch } from "#src/utils/fetch";

export const useVideoQuery = (id: number) =>
  useSuspenseQuery(fetchVideoQueryOptions(fetch, { id }));
