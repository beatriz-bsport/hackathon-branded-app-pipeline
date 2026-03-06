import { queryOptions } from "@tanstack/react-query";

import {
  type PaginatedResponse,
  buildUrlParams,
  createErrorWithContext,
} from "@bsport/store-base";

import { fetch } from "#src/utils/fetch";

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE_RECIPIENTS } from "./constants";
import type {
  AutomatedCampaign,
  BackgroundTaskStatusResponse,
  CampaignRecipient,
  CampaignScheduled,
  CampaignSent,
  CampaignSentPerformanceReport,
  CommunicationPreviewRecipientsRequest,
  CommunicationRecipientCount,
  CommunicationRecipientMinimal,
  EmailTemplateDetail,
  FetchAutomatedCampaignsParams,
  FetchCampaignRecipientParams,
  FetchCampaignScheduledParams,
  FetchCampaignSentParams,
  FetchCommunicationRecipientsPreviewParams,
  GenerateReportParams,
  GenerateReportResult,
  Popup,
  Smartlist,
  Tag,
  TagGroup,
  TagRule,
} from "./types";

const SMARTLIST_API_V1 = "customer-data-platform/v1/smartlist";
const COMMUNICATION_API_V1 = "communicate/v1";
const CDP_API_V0 = "customer-data-platform/v0";
const POPUPS_API_URL =
  "member-experience/v1/mobile_app/manager/custom_popup_links";
const EMAIL_TEMPLATE_API_V1 = "customer-data-platform/v1/email_design";
const PLATFORM_BILLING_API_V1 = "financial-services/v1/platform_billing";

/**
 * Query Key Factory
 *
 * Key taxonomy:
 * ['@sm-smartlist', 'detail', id]                        - smartlist detail
 * ['@sm-smartlist', 'detail', id, 'automated-campaigns'] - automated campaigns for a smartlist
 * ['@sm-smartlist', 'detail', id, 'campaign-sent']       - campaign sent data (with analytics)
 */
export const smartlistKeys = {
  all: ["@sm-smartlist"] as const,

  details: () => [...smartlistKeys.all, "detail"] as const,
  detail: (id: string) => [...smartlistKeys.details(), id] as const,

  automatedCampaigns: (id: string) =>
    [...smartlistKeys.detail(id), "automated-campaigns"] as const,

  automatedCampaignDetail: (messageId: string) =>
    [...smartlistKeys.all, "automated-campaign", messageId] as const,

  campaignSentList: (
    id: string,
    page: number,
    page_size: number,
    filters?: {
      only_automated_campaign?: boolean;
      no_automated_campaign?: boolean;
      without_member_info?: boolean;
    },
  ) =>
    [
      ...smartlistKeys.detail(id),
      "campaign-sent",
      page,
      page_size,
      filters?.only_automated_campaign ?? null,
      filters?.no_automated_campaign ?? null,
      filters?.without_member_info ?? null,
    ] as const,

  campaignSentDetail: (campaignUuid: string) =>
    [...smartlistKeys.all, "campaign-sent", "detail", campaignUuid] as const,

  campaignSentPerformanceReport: (campaignUuid: string) =>
    [
      ...smartlistKeys.all,
      "campaign-sent",
      "performance-report",
      campaignUuid,
    ] as const,

  campaignSentRecipients: (campaign: string, page: number, page_size: number) =>
    [
      ...smartlistKeys.all,
      "campaign-sent",
      "recipients",
      campaign,
      page,
      page_size,
    ] as const,

  tagRules: (id: string) => [...smartlistKeys.all, "tag-rules", id] as const,

  tags: () => [...smartlistKeys.all, "tags"] as const,

  tagGroups: () => [...smartlistKeys.all, "tagGroups"] as const,

  campaignScheduledList: (id: string) =>
    [...smartlistKeys.detail(id), "scheduled-campaigns"] as const,

  campaignScheduledDetail: (campaignScheduledId: string) =>
    [
      ...smartlistKeys.all,
      "campaign-scheduled",
      "detail",
      campaignScheduledId,
    ] as const,

  popupDetail: (popupId: number) =>
    [...smartlistKeys.all, "popup", popupId] as const,

  popupImages: (popupId: number, imageUrl: string) =>
    [...smartlistKeys.all, "popup-image", popupId, imageUrl] as const,

  emailTemplateDetail: (emailTemplateId: number) =>
    [...smartlistKeys.all, "email-template", emailTemplateId] as const,

  /**
   * Key for communication preview count (recipients estimate).
   * Uses a stable serialization so e.g. member_ids [1,2,3] and [3,2,1] share the same cache.
   */
  communicationRecipientsCountPreview: (
    request: CommunicationPreviewRecipientsRequest,
  ) =>
    [
      ...smartlistKeys.all,
      "communication-recipients-count-preview",
      ...getCommunicationPreviewKeyPayload(request),
    ] as const,
  /**
   * Key for communication preview count (recipients estimate).
   * Uses a stable serialization so e.g. member_ids [1,2,3] and [3,2,1] share the same cache.
   */
  communicationRecipientsPreview: (
    request: FetchCommunicationRecipientsPreviewParams,
  ) =>
    [
      ...smartlistKeys.all,
      "communication-recipients-preview",
      ...getCommunicationPreviewKeyPayload(request),
      request.page ?? DEFAULT_PAGE,
      request.page_size ?? DEFAULT_PAGE_SIZE_RECIPIENTS,
    ] as const,
} as const;

/**
 * Stable key payload for EstimateRequest so React Query cache keys are deterministic.
 * Sorts member_ids for "members" target so order doesn't create duplicate cache entries.
 */
function getCommunicationPreviewKeyPayload(
  request: CommunicationPreviewRecipientsRequest,
): readonly (string | number | boolean | number[])[] {
  const base: (string | number | boolean)[] = [
    request.channel,
    request.is_marketing,
    request.target.type,
  ];
  switch (request.target.type) {
    case "smartlist":
      return [...base, request.target.smartlist_id];
    case "offer":
      return [...base, request.target.offer_id, request.target.booking_status];
    case "members":
      return [...base, [...request.target.member_ids].sort((a, b) => a - b)];
    case "communication_scheduled":
      return [...base, request.target.communication_scheduled_id];
  }
}

/**
 * Fetch functions
 */
const fetchSmartlistDetail = async (id: string): Promise<Smartlist> => {
  const { data } = await fetch<Smartlist>(`${SMARTLIST_API_V1}/group/${id}`);

  return data;
};

const fetchAutomatedCampaigns = async (
  params: FetchAutomatedCampaignsParams,
): Promise<AutomatedCampaign[]> => {
  const urlParams = buildUrlParams({
    smartlist_id: params.smartlist_id,
    exclude_disabled: params.exclude_disabled ?? true,
  });
  const { data } = await fetch<PaginatedResponse<AutomatedCampaign>>(
    `${SMARTLIST_API_V1}/automated_campaign/${urlParams}`,
  );

  return data.results;
};

const fetchCampaignSentList = async (
  params: FetchCampaignSentParams,
): Promise<PaginatedResponse<CampaignSent>> => {
  const urlParams = buildUrlParams({
    smartlist: params.smartlist,
    page_size: params.page_size ?? 100,
    page: params.page ?? 1,
    ...(typeof params.only_automated_campaign === "boolean"
      ? { only_automated_campaign: params.only_automated_campaign }
      : {}),
    ...(typeof params.without_member_info === "boolean"
      ? { without_member_info: params.without_member_info }
      : {}),
    ...(typeof params.no_automated_campaign === "boolean"
      ? { no_automated_campaign: params.no_automated_campaign }
      : {}),
  });
  const { data } = await fetch<PaginatedResponse<CampaignSent>>(
    `${COMMUNICATION_API_V1}/communication/communication_sent/${urlParams}`,
  );

  return data;
};

const fetchCampaignSent = async (
  campaignUuid: string,
): Promise<CampaignSent> => {
  const { data } = await fetch<CampaignSent>(
    `${COMMUNICATION_API_V1}/communication/communication_sent/${campaignUuid}/`,
  );

  return data;
};

const fetchCampaignSentPerformanceReport = async (
  campaignUuid: string,
): Promise<CampaignSentPerformanceReport> => {
  const { data } = await fetch<CampaignSentPerformanceReport>(
    `${COMMUNICATION_API_V1}/communication/communication_sent/${campaignUuid}/report/`,
  );

  return data;
};

const fetchAutomatedCampaignDetail = async (
  messageId: string,
): Promise<AutomatedCampaign> => {
  const { data } = await fetch<AutomatedCampaign>(
    `${SMARTLIST_API_V1}/automated_campaign/${messageId}/`,
  );

  return data;
};

const fetchTagRules = async (smartlistId: string): Promise<TagRule[]> => {
  const urlParams = buildUrlParams({ smartlist_id: smartlistId });
  const { data } = await fetch<TagRule[]>(
    `${SMARTLIST_API_V1}/tagrules/${urlParams}`,
  );

  return data;
};

const fetchTags = async (): Promise<Tag[]> => {
  const { data } = await fetch<Tag[]>(`${CDP_API_V0}/tagging/tag/`);

  return data;
};

const fetchTagGroups = async (): Promise<TagGroup[]> => {
  const { data } = await fetch<TagGroup[]>(`${CDP_API_V0}/tagging/tag-group/`);

  return data;
};

const fetchCampaignScheduledList = async (
  params: FetchCampaignScheduledParams,
): Promise<CampaignScheduled[]> => {
  const urlParams = buildUrlParams({
    page_size: params.page_size ?? 50,
    page: params.page ?? 1,
    smartlist_id__in: params.smartlist_id__in ?? [],
    id__in: params.id__in ?? [],
  });
  const { data } = await fetch<PaginatedResponse<CampaignScheduled>>(
    `${COMMUNICATION_API_V1}/communication/communication_scheduled/${urlParams}`,
  );

  return data.results;
};

const fetchCampaignScheduled = async (
  campaignScheduledId: string,
): Promise<CampaignScheduled> => {
  const { data } = await fetch<CampaignScheduled>(
    `${COMMUNICATION_API_V1}/communication/communication_scheduled/${campaignScheduledId}/`,
  );

  return data;
};

const fetchCampaignRecipients = async ({
  campaign,
  page,
  page_size,
}: FetchCampaignRecipientParams): Promise<
  PaginatedResponse<CampaignRecipient>
> => {
  const { data } = await fetch<PaginatedResponse<CampaignRecipient>>(
    `${COMMUNICATION_API_V1}/communication/communication_recipient/${buildUrlParams(
      {
        campaign,
        page: page ?? DEFAULT_PAGE,
        page_size: page_size ?? DEFAULT_PAGE_SIZE_RECIPIENTS,
      },
    )}`,
  );

  return data;
};

/**
 * Deletes an automated campaign
 * @param id - ID of the automated campaign to delete
 */
export const deleteAutomatedCampaign = async (id: number): Promise<void> => {
  await fetch(`${SMARTLIST_API_V1}/automated_campaign/${id}/`, {
    method: "DELETE",
  });
};

const fetchPopupDetail = async (popupId: number): Promise<Popup> => {
  const { data } = await fetch<Popup>(`${POPUPS_API_URL}/${popupId}/`);
  return data;
};

const fetchPopupImage = async (imageUrl: string): Promise<File> => {
  const url = new URL(imageUrl);
  const filename = url.pathname.split("/").pop() || "popup-image.jpg";
  const { data } = await fetch<Blob>(imageUrl, {
    responseType: "blob",
  });
  return new File([data], filename, { type: data.type });
};

export async function generateCampaignReport(
  params: GenerateReportParams,
): Promise<GenerateReportResult> {
  const searchParams = new URLSearchParams({
    start_date: params.startDate,
    end_date: params.endDate,
  });

  const { backgroundTaskUuid } = await fetch<BackgroundTaskStatusResponse>(
    `${SMARTLIST_API_V1}/group/${params.smartlistId}/export-campaigns-background/?${searchParams.toString()}`,
    {
      method: "POST",
    },
  );

  if (!backgroundTaskUuid) {
    throw new Error("Missing background task id in response header");
  }

  return { backgroundTaskUuid };
}

export async function exportCampaignAsync(
  campaignUuid: string,
): Promise<{ backgroundTaskUuid: string }> {
  const { backgroundTaskUuid } = await fetch<BackgroundTaskStatusResponse>(
    `${COMMUNICATION_API_V1}/communication/communication_sent/${campaignUuid}/export-campaign-async/`,
    {
      method: "POST",
    },
  );

  if (!backgroundTaskUuid) {
    throw new Error("Missing background task id in response");
  }

  return { backgroundTaskUuid };
}

export async function getBackgroundTaskStatus(
  taskUuid: string,
): Promise<BackgroundTaskStatusResponse> {
  const { data } = await fetch<BackgroundTaskStatusResponse>(
    `platform/v1/background_task/${taskUuid}`,
    {
      method: "GET",
    },
  );

  if (!data) {
    throw new Error("Failed to fetch background task status");
  }

  return data;
}

/**
 * Deletes a tag rule
 * @param id - ID of the tag rule to delete
 */
export const deleteTagRule = async (id: number): Promise<void> => {
  await fetch(`${SMARTLIST_API_V1}/tagrules/${id}/`, {
    method: "DELETE",
  });
};

/**
 * Request an upsell package by identifier (creates HubSpot deal).
 * Same endpoint as saas-legacy platform-billing requestUpsellPackage.
 */
export const requestUpsellPackage = async (
  upsellIdentifier: number,
): Promise<void> => {
  await fetch(
    `${PLATFORM_BILLING_API_V1}/upsell_package/request_upsell_by_identifier/`,
    {
      method: "POST",
      body: JSON.stringify({ upsell_identifier: upsellIdentifier }),
    },
  );
};

const fetchEmailTemplateDetail = async (
  emailTemplateId: number,
): Promise<EmailTemplateDetail> => {
  const { data } = await fetch<EmailTemplateDetail>(
    `${EMAIL_TEMPLATE_API_V1}/${emailTemplateId}/`,
  );

  return data;
};

const fetchCommunicationRecipientsCountPreview = async (
  request: CommunicationPreviewRecipientsRequest,
): Promise<CommunicationRecipientCount> => {
  const { data } = await fetch<CommunicationRecipientCount>(
    `${COMMUNICATION_API_V1}/communication/preview/count/`,
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );

  return data;
};

const fetchCommunicationRecipientsPreview = async (
  request: FetchCommunicationRecipientsPreviewParams,
): Promise<PaginatedResponse<CommunicationRecipientMinimal>> => {
  const urlParams = buildUrlParams({
    page: request.page ?? DEFAULT_PAGE,
    page_size: request.page_size ?? DEFAULT_PAGE_SIZE_RECIPIENTS,
  });
  const { data } = await fetch<
    PaginatedResponse<CommunicationRecipientMinimal>
  >(`${COMMUNICATION_API_V1}/communication/preview/recipients/${urlParams}`, {
    method: "POST",
    body: JSON.stringify(request),
  });

  return data;
};

/**
 * Query Options
 */
export const smartlistDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: smartlistKeys.detail(id),
    queryFn: () => fetchSmartlistDetail(id),
  });

export const popupDetailQueryOptions = (popupId: number) =>
  queryOptions({
    queryKey: smartlistKeys.popupDetail(popupId),
    queryFn: () => fetchPopupDetail(popupId),
  });

export const popupImageQueryOptions = (popupId: number, imageUrl: string) =>
  queryOptions({
    queryKey: smartlistKeys.popupImages(popupId, imageUrl),
    queryFn: () => fetchPopupImage(imageUrl),
  });

export const automatedCampaignsQueryOptions = (smartlistId: string) =>
  queryOptions({
    queryKey: smartlistKeys.automatedCampaigns(smartlistId),
    queryFn: () =>
      fetchAutomatedCampaigns({
        smartlist_id: smartlistId,
        exclude_disabled: true,
      }),
  });

export const campaignSentListQueryOptions = ({
  smartlist,
  page,
  page_size,
  only_automated_campaign,
  no_automated_campaign,
  without_member_info,
}: FetchCampaignSentParams) => {
  const currentPage = page ?? 1;
  const currentPageSize = page_size ?? 10;
  return queryOptions({
    queryKey: smartlistKeys.campaignSentList(
      String(smartlist),
      currentPage,
      currentPageSize,
      { only_automated_campaign, no_automated_campaign, without_member_info },
    ),
    queryFn: () =>
      fetchCampaignSentList({
        smartlist,
        page: currentPage,
        page_size: currentPageSize,
        only_automated_campaign,
        no_automated_campaign,
        without_member_info,
      }),
  });
};

export const campaignSentDetailQueryOptions = ({
  campaignUuid,
  onSuccess,
}: {
  campaignUuid: string;
  onSuccess?: (data: CampaignSent) => void;
}) => {
  return queryOptions({
    queryKey: smartlistKeys.campaignSentDetail(campaignUuid),
    queryFn: async () => {
      try {
        const result = await fetchCampaignSent(campaignUuid);
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

export const campaignSentPerformanceReportQueryOptions = ({
  campaignUuid,
}: {
  campaignUuid: string;
}) => {
  return queryOptions({
    queryKey: smartlistKeys.campaignSentPerformanceReport(campaignUuid),
    queryFn: async () => {
      try {
        const result = await fetchCampaignSentPerformanceReport(campaignUuid);
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

export const automatedCampaignDetailQueryOptions = (messageId: string) =>
  queryOptions({
    queryKey: smartlistKeys.automatedCampaignDetail(messageId),
    queryFn: () => fetchAutomatedCampaignDetail(messageId),
  });

export const tagRulesQueryOptions = (smartlistId: string) =>
  queryOptions({
    queryKey: smartlistKeys.tagRules(smartlistId),
    queryFn: () => fetchTagRules(smartlistId),
  });

export const tagsQueryOptions = () =>
  queryOptions({
    queryKey: smartlistKeys.tags(),
    queryFn: () => fetchTags(),
  });

export const tagGroupsQueryOptions = () =>
  queryOptions({
    queryKey: smartlistKeys.tagGroups(),
    queryFn: () => fetchTagGroups(),
  });

/**
 * Query Options for fetching campaign scheduled list
 * @param smartlistId - ID of the smartlist
 * @returns Query Options for fetching campaign scheduled list
 * @productDecision we deliberately don't use the page_size and page parameters even if the API supports them.
 * Its because we don't want to paginate the campaign scheduled list. We want to display the full list of campaign scheduled.
 * And our investigations showed that most of the studios do not have near 10 camapign scheduled per smartlists so with 50 we are safe.
 * This can be easily updated tho if needed.
 */
export const campaignScheduledListQueryOptions = (smartlistId: string) =>
  queryOptions({
    queryKey: smartlistKeys.campaignScheduledList(smartlistId),
    queryFn: () =>
      fetchCampaignScheduledList({
        smartlist_id__in: [Number(smartlistId)],
        page_size: 50,
        page: 1,
      }),
  });

export const campaignScheduledDetailQueryOptions = (
  campaignScheduledId: string,
) => {
  return queryOptions({
    queryKey: smartlistKeys.campaignScheduledDetail(campaignScheduledId),
    queryFn: () => fetchCampaignScheduled(campaignScheduledId),
  });
};

export const campaignSentRecipientsQueryOptions = (
  params: FetchCampaignRecipientParams,
) => {
  return queryOptions({
    queryKey: smartlistKeys.campaignSentRecipients(
      params.campaign,
      params.page ?? DEFAULT_PAGE,
      params.page_size ?? DEFAULT_PAGE_SIZE_RECIPIENTS,
    ),
    queryFn: () => fetchCampaignRecipients(params),
  });
};

export const emailTemplateDetailQueryOptions = (emailTemplateId: number) => {
  return queryOptions({
    queryKey: smartlistKeys.emailTemplateDetail(emailTemplateId),
    queryFn: () => fetchEmailTemplateDetail(emailTemplateId),
  });
};

export const communicationRecipientsCountPreviewQueryOptions = (
  request: CommunicationPreviewRecipientsRequest,
) =>
  queryOptions({
    queryKey: smartlistKeys.communicationRecipientsCountPreview(request),
    queryFn: () => fetchCommunicationRecipientsCountPreview(request),
  });

export const communicationRecipientsPreviewQueryOptions = (
  request: FetchCommunicationRecipientsPreviewParams,
) =>
  queryOptions({
    queryKey: smartlistKeys.communicationRecipientsPreview(request),
    queryFn: () => fetchCommunicationRecipientsPreview(request),
  });
