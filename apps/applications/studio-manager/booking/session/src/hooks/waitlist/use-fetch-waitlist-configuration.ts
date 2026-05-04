import { useSuspenseQuery } from "@tanstack/react-query";

import { fetchWaitingListConfigurationQueryOption } from "@bsport/api-book";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch.js";

const STALE_TIME = 10 * 60 * 1000; // 10 minutes - very unlikely that the waiting list configuration will change often

export const useFetchWaitingListConfiguration = () => {
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  if (!companyId) {
    throw new Error(
      "Company ID is required to fetch waiting list configuration",
    );
  }

  return useSuspenseQuery({
    ...fetchWaitingListConfigurationQueryOption(fetch, companyId!),
    staleTime: STALE_TIME,
  });
};
