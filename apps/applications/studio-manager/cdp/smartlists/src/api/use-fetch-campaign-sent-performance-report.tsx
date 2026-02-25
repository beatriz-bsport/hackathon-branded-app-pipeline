import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignSentPerformanceReportQueryOptions } from "./api";

export const useFetchCampaignSentPerformanceReport = ({
  campaignUuid,
}: {
  campaignUuid: string;
}) => {
  return useSuspenseQuery(
    campaignSentPerformanceReportQueryOptions({ campaignUuid }),
  );
};
