import { useSuspenseQuery } from "@tanstack/react-query";

import { wellhubAccountsQueryOptions } from "@bsport/api-book";

import { fetch } from "#src/utils/fetch";

export const useWellhubAccounts = (partnershipId: number) =>
  useSuspenseQuery(wellhubAccountsQueryOptions(fetch, partnershipId));
