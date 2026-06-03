import { queryOptions } from "@tanstack/react-query";

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  type Fetch,
  type PaginatedResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import {
  communicateKeys,
  fetchCampaignRecipientsWithMemberDataAPI,
  fetchCampaignScheduledAPI,
  fetchCampaignScheduledListAPI,
  fetchCampaignSentAPI,
  fetchCampaignSentListAPI,
  fetchCampaignSentPerformanceReportAPI,
  fetchCampaignSummaryByAutomatedCampaignIdAPI,
} from "./api";
import {
  DEFAULT_PAGE_SIZE_CAMPAIGN_SCHEDULED_LIST,
  DEFAULT_PAGE_SIZE_RECIPIENTS,
} from "./constants";
import type {
  CampaignRecipientWithMemberData,
  CampaignScheduled,
  CampaignSent,
  CampaignSentPerformanceReport,
  CampaignSummary,
  FetchCampaignRecipientParams,
  FetchCampaignSentParams,
} from "./types";
import { getCampaignSentListTargetParams } from "./utils";

export const campaignSentListQueryOptions = (
  fetch: Fetch<PaginatedResponse<CampaignSent>>,
  params: FetchCampaignSentParams,
) => {
  const {
    page,
    page_size,
    automated_campaign_id,
    only_automated_campaign,
    no_automated_campaign,
    without_member_info,
  } = params;
  const currentPage = page ?? DEFAULT_PAGE;
  const currentPageSize = page_size ?? DEFAULT_PAGE_SIZE;

  const targetParams = getCampaignSentListTargetParams(params);
  const targetContextParams =
    "smartlist" in targetParams
      ? { smartlist: targetParams.smartlist }
      : {
          segment_identifier: targetParams.segment_identifier,
        };

  const listParams = {
    page: currentPage,
    page_size: currentPageSize,
    automated_campaign_id,
    only_automated_campaign,
    no_automated_campaign,
    without_member_info,
    ...targetContextParams,
  };

  return queryOptions({
    queryKey: communicateKeys.campaignSentList({
      ...params,
      page: currentPage,
      page_size: currentPageSize,
    }),
    queryFn: () => fetchCampaignSentListAPI(fetch, listParams),
  });
};

export const campaignSummaryByAutomatedCampaignIdQueryOptions = (
  fetch: Fetch<CampaignSummary>,
  automatedCampaignId: number,
) =>
  queryOptions({
    queryKey:
      communicateKeys.campaignSummaryByAutomatedCampaignId(automatedCampaignId),
    queryFn: () =>
      fetchCampaignSummaryByAutomatedCampaignIdAPI(fetch, automatedCampaignId),
  });

export const campaignSentDetailQueryOptions = (
  fetch: Fetch<CampaignSent>,
  {
    campaignUuid,
    onSuccess,
  }: {
    campaignUuid: string;
    onSuccess?: (data: CampaignSent) => void;
  },
) => {
  return queryOptions({
    queryKey: communicateKeys.campaignSentDetail(campaignUuid),
    queryFn: async () => {
      try {
        const result = await fetchCampaignSentAPI(fetch, campaignUuid);
        onSuccess?.(result);
        return result;
      } catch (error) {
        throw createErrorWithContext(error, {
          message: "Failed to fetch campaign sent detail",
          params: { campaignUuid },
        });
      }
    },
  });
};

export const campaignSentPerformanceReportQueryOptions = (
  fetch: Fetch<CampaignSentPerformanceReport>,
  {
    campaignUuid,
  }: {
    campaignUuid: string;
  },
) => {
  return queryOptions({
    queryKey: communicateKeys.campaignSentPerformanceReport(campaignUuid),
    queryFn: async () => {
      try {
        const result = await fetchCampaignSentPerformanceReportAPI(
          fetch,
          campaignUuid,
        );
        return result;
      } catch (error) {
        throw createErrorWithContext(error, {
          message: "Failed to fetch campaign sent performance report",
          params: { campaignUuid },
        });
      }
    },
  });
};

/**
 * Query Options for fetching campaign scheduled list
 * @param smartlistId - ID of the smartlist
 * @returns Query Options for fetching campaign scheduled list
 * @productDecision we deliberately don't use the page_size and page parameters even if the API supports them.
 * Its because we don't want to paginate the campaign scheduled list. We want to display the full list of campaign scheduled.
 * And our investigations showed that most of the studios do not have near 10 camapign scheduled per smartlists so with 50 we are safe.
 * This can be easily updated tho if needed.
 */
export const campaignScheduledListQueryOptions = (
  fetch: Fetch<PaginatedResponse<CampaignScheduled>>,
  params: {
    pageSize?: number;
    page?: number;
    smartlistId: string;
  },
) =>
  queryOptions({
    queryKey: communicateKeys.campaignScheduledList({
      smartlist_id__in: [Number(params.smartlistId)],
      page_size: params.pageSize ?? DEFAULT_PAGE_SIZE_CAMPAIGN_SCHEDULED_LIST,
      page: params.page ?? DEFAULT_PAGE,
    }),
    queryFn: () =>
      fetchCampaignScheduledListAPI(fetch, {
        smartlist_id__in: [Number(params.smartlistId)],
        page_size: params.pageSize ?? DEFAULT_PAGE_SIZE_CAMPAIGN_SCHEDULED_LIST,
        page: params.page ?? DEFAULT_PAGE,
      }),
  });

export const campaignScheduledDetailQueryOptions = (
  fetch: Fetch<CampaignScheduled>,
  campaignScheduledId: string,
) => {
  return queryOptions({
    queryKey: communicateKeys.campaignScheduledDetail(campaignScheduledId),
    queryFn: () => fetchCampaignScheduledAPI(fetch, campaignScheduledId),
  });
};

export const campaignSentRecipientsWithMemberDataQueryOptions = (
  fetch: Fetch<PaginatedResponse<CampaignRecipientWithMemberData>>,
  params: FetchCampaignRecipientParams,
) => {
  return queryOptions({
    queryKey: communicateKeys.campaignSentRecipients({
      ...params,
      page: params.page ?? DEFAULT_PAGE,
      page_size: params.page_size ?? DEFAULT_PAGE_SIZE_RECIPIENTS,
    }),
    queryFn: () => fetchCampaignRecipientsWithMemberDataAPI(fetch, params),
  });
};
