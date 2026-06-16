import {
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";

import {
  COMMUNICATION_API_V1,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE_CAMPAIGN_SCHEDULED_LIST,
  DEFAULT_PAGE_SIZE_CAMPAIGN_SENT_LIST,
  DEFAULT_PAGE_SIZE_RECIPIENTS,
} from "./constants";
import type {
  BackgroundTaskStatusResponse,
  CampaignRecipientWithMemberData,
  CampaignScheduled,
  CampaignSent,
  CampaignSentPerformanceReport,
  CampaignSummary,
  CommunicationPreviewRecipientsRequest,
  CommunicationRecipientCount,
  CommunicationRecipientMinimal,
  FetchCampaignRecipientParams,
  FetchCampaignScheduledParams,
  FetchCampaignSentParams,
  FetchCampaignSummaryByAutomatedCampaignIdPayload,
  FetchCommunicationRecipientsPreviewParams,
  ScheduleCampaignPayload,
  SendCampaignPayload,
  UpdateScheduledEmailCampaignPayload,
} from "./types";
import { getCampaignSentListTargetParams } from "./utils";

export const communicateKeys = {
  all: [QUERY_KEY_MAIN, "communicate"] as const,
  campaignSentList: ({
    smartlist,
    segment_identifier,
    page,
    page_size,
    automated_campaign_id,
    only_automated_campaign,
    no_automated_campaign,
    without_member_info,
  }: FetchCampaignSentParams) =>
    [
      ...communicateKeys.all,
      "campaign-sent",
      "list",
      smartlist ?? null,
      segment_identifier ?? null,
      page ?? DEFAULT_PAGE,
      page_size ?? DEFAULT_PAGE_SIZE_RECIPIENTS,
      automated_campaign_id ?? null,
      only_automated_campaign ?? null,
      no_automated_campaign ?? null,
      without_member_info ?? null,
    ] as const,
  campaignSentDetails: () =>
    [...communicateKeys.all, "campaign-sent", "detail"] as const,
  campaignSentDetail: (campaignUuid: string) =>
    [...communicateKeys.campaignSentDetails(), campaignUuid] as const,
  campaignSentPerformanceReports: () =>
    [...communicateKeys.all, "campaign-sent", "performance-report"] as const,
  campaignSentPerformanceReport: (campaignUuid: string) =>
    [
      ...communicateKeys.campaignSentPerformanceReports(),
      campaignUuid,
    ] as const,
  campaignSentRecipients: ({
    campaign,
    page,
    page_size,
  }: FetchCampaignRecipientParams) =>
    [
      ...communicateKeys.all,
      "campaign-sent",
      "recipients",
      campaign,
      page ?? DEFAULT_PAGE,
      page_size ?? DEFAULT_PAGE_SIZE_RECIPIENTS,
    ] as const,
  campaignScheduledList: (params: FetchCampaignScheduledParams) =>
    [
      ...communicateKeys.all,
      "campaign-scheduled",
      "list",
      [...(params.smartlist_id__in ?? [])],
      [...(params.id__in ?? [])],
      params.page ?? DEFAULT_PAGE,
      params.page_size ?? DEFAULT_PAGE_SIZE_CAMPAIGN_SCHEDULED_LIST,
    ] as const,
  campaignScheduledDetails: () =>
    [...communicateKeys.all, "campaign-scheduled", "detail"] as const,
  campaignScheduledDetail: (campaignScheduledId: string) =>
    [
      ...communicateKeys.campaignScheduledDetails(),
      campaignScheduledId,
    ] as const,
  communicationRecipientsCountPreview: (
    request: CommunicationPreviewRecipientsRequest,
  ) =>
    [
      ...communicateKeys.all,
      "communication-recipients-count-preview",
      ...getCommunicationPreviewKeyPayload(request),
    ] as const,
  communicationRecipientsPreview: (
    request: FetchCommunicationRecipientsPreviewParams,
  ) =>
    [
      ...communicateKeys.all,
      "communication-recipients-preview",
      ...getCommunicationPreviewKeyPayload(request),
      request.page ?? DEFAULT_PAGE,
      request.page_size ?? DEFAULT_PAGE_SIZE_RECIPIENTS,
    ] as const,

  campaignSummariesByAutomatedCampaignId: () =>
    [
      ...communicateKeys.all,
      "campaign-summary-by-automated-campaign-id",
    ] as const,
  campaignSummaryByAutomatedCampaignId: (automatedCampaignId: number) =>
    [
      ...communicateKeys.campaignSummariesByAutomatedCampaignId(),
      automatedCampaignId,
    ] as const,
} as const;

export function getCommunicationPreviewKeyPayload(
  request: CommunicationPreviewRecipientsRequest,
): readonly (string | number | boolean | number[])[] {
  const base: (string | number | boolean)[] = [
    request.channel,
    request.is_marketing,
    request.target.type,
  ];
  if (request.target.type === "smartlist")
    return [...base, request.target.smartlist_id];
  if (request.target.type === "offer") {
    return [...base, request.target.offer_id, request.target.booking_status];
  }
  if (request.target.type === "members") {
    return [...base, [...request.target.member_ids]];
  }
  if (request.target.type === "segment") {
    return [...base, request.target.segment_identifier];
  }
  return [...base, request.target.communication_scheduled_id];
}

export const sendEmailCampaignAPI = async (
  fetch: Fetch<CampaignSent>,
  payload: SendCampaignPayload,
): Promise<CampaignSent> => {
  const { data } = await fetch(
    `${COMMUNICATION_API_V1}/communication/communication_sent/send_communication/`,
    { method: "POST", body: JSON.stringify(payload) },
  );
  return data;
};

export const fetchCampaignSentListAPI = async (
  fetch: Fetch<PaginatedResponse<CampaignSent>>,
  params: FetchCampaignSentParams,
): Promise<PaginatedResponse<CampaignSent>> => {
  const targetParams = getCampaignSentListTargetParams(params);
  const listParams = {
    page_size: params.page_size ?? DEFAULT_PAGE_SIZE_CAMPAIGN_SENT_LIST,
    page: params.page ?? DEFAULT_PAGE,
    ...(typeof params.automated_campaign_id === "number"
      ? { automated_campaign_id: params.automated_campaign_id }
      : {}),
    ...(typeof params.only_automated_campaign === "boolean"
      ? { only_automated_campaign: params.only_automated_campaign }
      : {}),
    ...(typeof params.without_member_info === "boolean"
      ? { without_member_info: params.without_member_info }
      : {}),
    ...(typeof params.no_automated_campaign === "boolean"
      ? { no_automated_campaign: params.no_automated_campaign }
      : {}),
  };
  const urlParams = buildUrlParams(
    "smartlist" in targetParams
      ? { ...listParams, smartlist: targetParams.smartlist }
      : { ...listParams, segment_identifier: targetParams.segment_identifier },
  );
  const { data } = await fetch(
    `${COMMUNICATION_API_V1}/communication/communication_sent/${urlParams}`,
  );
  return data;
};

export const fetchCampaignSentAPI = async (
  fetch: Fetch<CampaignSent>,
  campaignUuid: string,
): Promise<CampaignSent> => {
  const { data } = await fetch(
    `${COMMUNICATION_API_V1}/communication/communication_sent/${campaignUuid}/`,
  );
  return data;
};

export const fetchCampaignSentPerformanceReportAPI = async (
  fetch: Fetch<CampaignSentPerformanceReport>,
  campaignUuid: string,
): Promise<CampaignSentPerformanceReport> => {
  const { data } = await fetch(
    `${COMMUNICATION_API_V1}/communication/communication_sent/${campaignUuid}/report/`,
  );
  return data;
};

export const fetchCampaignScheduledListAPI = async (
  fetch: Fetch<PaginatedResponse<CampaignScheduled>>,
  params: FetchCampaignScheduledParams,
): Promise<PaginatedResponse<CampaignScheduled>> => {
  const urlParams = buildUrlParams({
    page_size: params.page_size ?? DEFAULT_PAGE_SIZE_CAMPAIGN_SCHEDULED_LIST,
    page: params.page ?? DEFAULT_PAGE,
    smartlist_id__in: params.smartlist_id__in ?? [],
    id__in: params.id__in ?? [],
  });
  const { data } = await fetch(
    `${COMMUNICATION_API_V1}/communication/communication_scheduled/${urlParams}`,
  );
  return data;
};

export const scheduleEmailCampaignAPI = async (
  fetch: Fetch<CampaignScheduled>,
  payload: ScheduleCampaignPayload,
): Promise<CampaignScheduled> => {
  const { data } = await fetch(
    `${COMMUNICATION_API_V1}/communication/communication_scheduled/`,
    { method: "POST", body: JSON.stringify(payload) },
  );
  return data;
};

export const updateScheduledEmailCampaignAPI = async (
  fetch: Fetch<CampaignScheduled>,
  campaignScheduledId: string,
  payload: UpdateScheduledEmailCampaignPayload,
): Promise<CampaignScheduled> => {
  const { data } = await fetch(
    `${COMMUNICATION_API_V1}/communication/communication_scheduled/${campaignScheduledId}/`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return data;
};

export const fetchCampaignScheduledAPI = async (
  fetch: Fetch<CampaignScheduled>,
  campaignScheduledId: string,
): Promise<CampaignScheduled> => {
  const { data } = await fetch(
    `${COMMUNICATION_API_V1}/communication/communication_scheduled/${campaignScheduledId}/`,
  );
  return data;
};

export const deleteScheduledCommunicationAPI = async (
  fetch: Fetch<void>,
  scheduledCampaignId: string,
): Promise<void> => {
  await fetch(
    `${COMMUNICATION_API_V1}/communication/communication_scheduled/${scheduledCampaignId}/`,
    { method: "DELETE" },
  );
};

export const fetchCampaignRecipientsWithMemberDataAPI = async (
  fetch: Fetch<PaginatedResponse<CampaignRecipientWithMemberData>>,
  params: FetchCampaignRecipientParams,
): Promise<PaginatedResponse<CampaignRecipientWithMemberData>> => {
  const { data } = await fetch(
    `${COMMUNICATION_API_V1}/communication/communication_recipient_with_member_data/${buildUrlParams(
      {
        campaign: params.campaign,
        page: params.page ?? DEFAULT_PAGE,
        page_size: params.page_size ?? DEFAULT_PAGE_SIZE_RECIPIENTS,
      },
    )}`,
  );
  return data;
};

export const fetchCommunicationRecipientsCountPreviewAPI = async (
  fetch: Fetch<CommunicationRecipientCount>,
  request: CommunicationPreviewRecipientsRequest,
): Promise<CommunicationRecipientCount> => {
  const { data } = await fetch(
    `${COMMUNICATION_API_V1}/communication/preview/count/`,
    {
      method: "POST",
      body: JSON.stringify(request),
    },
  );
  return data;
};

export const fetchCommunicationRecipientsPreviewAPI = async (
  fetch: Fetch<PaginatedResponse<CommunicationRecipientMinimal>>,
  request: FetchCommunicationRecipientsPreviewParams,
): Promise<PaginatedResponse<CommunicationRecipientMinimal>> => {
  const urlParams = buildUrlParams({
    page: request.page ?? DEFAULT_PAGE,
    page_size: request.page_size ?? DEFAULT_PAGE_SIZE_RECIPIENTS,
  });
  const { data } = await fetch(
    `${COMMUNICATION_API_V1}/communication/preview/recipients/${urlParams}`,
    { method: "POST", body: JSON.stringify(request) },
  );
  return data;
};

export const fetchCampaignSummaryByAutomatedCampaignIdAPI = async (
  fetch: Fetch<CampaignSummary>,
  automatedCampaignId: number,
): Promise<CampaignSummary> => {
  const payload: FetchCampaignSummaryByAutomatedCampaignIdPayload = {
    key: "automated_campaign_id",
    value: automatedCampaignId,
  };

  const { data } = await fetch(`${COMMUNICATION_API_V1}/campaign_summary/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export async function exportCampaignAsyncAPI(
  fetch: Fetch<BackgroundTaskStatusResponse>,
  campaignUuid: string,
): Promise<{ backgroundTaskUuid: string }> {
  const { backgroundTaskUuid } = await fetch(
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

export const sendNowScheduledCampaignAPI = async (
  fetch: Fetch<void>,
  campaignScheduledId: string,
): Promise<void> => {
  await fetch(
    `${COMMUNICATION_API_V1}/communication/communication_scheduled/${campaignScheduledId}/send_now/`,
    {
      method: "POST",
    },
  );
};
