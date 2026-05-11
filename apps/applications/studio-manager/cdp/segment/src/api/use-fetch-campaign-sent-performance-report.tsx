import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignSentPerformanceReportQueryOptions } from "@bsport/api-cdp/communicate";

import { fetch } from "#src/utils/fetch";

export const useFetchCampaignSentPerformanceReport = ({
  campaignUuid,
}: {
  campaignUuid: string;
}) => {
  return useSuspenseQuery(
    campaignSentPerformanceReportQueryOptions(fetch, { campaignUuid }),
  );
};
