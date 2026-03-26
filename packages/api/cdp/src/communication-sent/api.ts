import { queryOptions } from "@tanstack/react-query";

import { type ApiConfig, type Fetch } from "@bsport/store-base";

import type {
  CampaignSummary,
  FetchCampaignSummaryByAutomatedCampaignIdPayload,
} from "#src/communication-sent/types";

const COMMUNICATION_SENT_API_URL =
  "communicate/v1/communication/communication_sent";

export const communicationSentKeys = {
  all: ["@api-cdp", "communication-sent"] as const,

  campaignSummaryByAutomatedCampaignId: (automatedCampaignId: number) =>
    [
      ...communicationSentKeys.all,
      "campaign-summary",
      automatedCampaignId,
    ] as const,
} as const;

const fetchCampaignSummaryByAutomatedCampaignIdConfig = (
  automatedCampaignId: number,
): ApiConfig => {
  const payload: FetchCampaignSummaryByAutomatedCampaignIdPayload = {
    key: "automated_campaign_id",
    value: automatedCampaignId,
  };

  return [
    `${COMMUNICATION_SENT_API_URL}/campaign_summary/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  ];
};

export const fetchCampaignSummaryByAutomatedCampaignId = async (
  fetch: Fetch<CampaignSummary>,
  automatedCampaignId: number,
): Promise<CampaignSummary> => {
  const [uri, init] =
    fetchCampaignSummaryByAutomatedCampaignIdConfig(automatedCampaignId);

  const { data } = await fetch(uri, init);

  return data;
};

export const campaignSummaryByAutomatedCampaignIdQueryOptions = (
  fetch: Fetch<CampaignSummary>,
  automatedCampaignId: number,
) =>
  queryOptions({
    queryKey:
      communicationSentKeys.campaignSummaryByAutomatedCampaignId(
        automatedCampaignId,
      ),
    queryFn: () =>
      fetchCampaignSummaryByAutomatedCampaignId(fetch, automatedCampaignId),
  });
