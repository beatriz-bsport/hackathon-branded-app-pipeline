import { type Fetch, buildUrlParams } from "@bsport/store-base";

import {
  BackgroundTaskStatusResponse,
  GenerateReportParams,
  GenerateReportResult,
} from "#src/communicate";

import { SMARTLIST_API_V1 } from "./constants";
import type {
  CreatePaymentPackFilterPayload,
  CreateTagFilterPayload,
  CreateTagRuleParams,
  CreateTotalBookingFilterPayload,
  PaymentPackFilter,
  Smartlist,
  SmartlistGetFiltersResponse,
  TagFilter,
  TagRule,
  TotalBookingFilter,
  UpdatePaymentPackFilterPayload,
  UpdateTagFilterPayload,
  UpdateTagRuleParams,
  UpdateTotalBookingFilterPayload,
} from "./types";

export const smartlistKeys = {
  all: ["@sm-smartlist"] as const,
  details: () => [...smartlistKeys.all, "detail"] as const,
  detail: (id: string) => [...smartlistKeys.details(), id] as const,
  tagRules: (id: string) => [...smartlistKeys.all, "tag-rules", id] as const,
  tagRuleDetail: (id: string) =>
    [...smartlistKeys.all, "tag-rule-detail", id] as const,
  filters: (smartlistId: string) => [
    ...smartlistKeys.all,
    "filters",
    smartlistId,
  ],
} as const;

export const fetchSmartlistDetailAPI = async (
  fetch: Fetch<Smartlist>,
  id: string,
): Promise<Smartlist> => {
  const { data } = await fetch(`${SMARTLIST_API_V1}/group/${id}`);
  return data;
};

export const fetchTagRulesAPI = async (
  fetch: Fetch<TagRule[]>,
  smartlistId: string,
): Promise<TagRule[]> => {
  const urlParams = buildUrlParams({ smartlist_id: smartlistId });
  const { data } = await fetch(`${SMARTLIST_API_V1}/tagrules/${urlParams}`);
  return data;
};

/**
 * Deletes a tag rule
 * @param id - ID of the tag rule to delete
 */
export const deleteTagRuleAPI = async (
  fetch: Fetch<void>,
  id: number,
): Promise<void> => {
  await fetch(`${SMARTLIST_API_V1}/tagrules/${id}/`, {
    method: "DELETE",
  });
};

export async function generateCampaignReportAPI(
  fetch: Fetch<BackgroundTaskStatusResponse>,
  params: GenerateReportParams,
): Promise<GenerateReportResult> {
  const searchParams = new URLSearchParams({
    start_date: params.startDate,
    end_date: params.endDate,
  });

  const { backgroundTaskUuid } = await fetch(
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

export async function getBackgroundTaskStatusAPI(
  fetch: Fetch<BackgroundTaskStatusResponse>,
  taskUuid: string,
): Promise<BackgroundTaskStatusResponse> {
  const { data } = await fetch(`platform/v1/background_task/${taskUuid}`, {
    method: "GET",
  });

  if (!data) {
    throw new Error("Failed to fetch background task status");
  }

  return data;
}

export const createTagRuleAPI = async (
  fetch: Fetch<TagRule>,
  params: CreateTagRuleParams,
): Promise<TagRule> => {
  const { data } = await fetch(`${SMARTLIST_API_V1}/tagrules/`, {
    method: "POST",
    body: JSON.stringify(params),
  });

  return data;
};

export const fetchTagRuleDetailAPI = async (
  fetch: Fetch<TagRule>,
  id: string,
): Promise<TagRule> => {
  const { data } = await fetch(`${SMARTLIST_API_V1}/tagrules/${id}/`);

  return data;
};

export const updateTagRuleAPI = async (
  fetch: Fetch<TagRule>,
  params: UpdateTagRuleParams,
): Promise<TagRule> => {
  const { id, ...body } = params;
  const { data } = await fetch(`${SMARTLIST_API_V1}/tagrules/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  return data;
};

export const fetchSmartlistFiltersAPI = async (
  fetch: Fetch<SmartlistGetFiltersResponse>,
  smartlistId: string,
): Promise<SmartlistGetFiltersResponse> => {
  const { data } = await fetch(
    `${SMARTLIST_API_V1}/group/${smartlistId}/get_filters/`,
  );

  return data;
};

// Payment Pack Filters

const PAYMENT_PACK_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/payment_pack`;

export const createPaymentPackFilter = async (
  fetch: Fetch<PaymentPackFilter>,
  payload: CreatePaymentPackFilterPayload,
): Promise<PaymentPackFilter> => {
  const { data } = await fetch(`${PAYMENT_PACK_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchPaymentPackFilter = async (
  fetch: Fetch<PaymentPackFilter>,
  filterId: number,
  payload: UpdatePaymentPackFilterPayload,
): Promise<PaymentPackFilter> => {
  const { data } = await fetch(`${PAYMENT_PACK_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

export const deletePaymentPackFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${PAYMENT_PACK_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};

// Bookings Filters

const TOTAL_BOOKING_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/bookings`;

export const createTotalBookingFilter = async (
  fetch: Fetch<TotalBookingFilter>,
  payload: CreateTotalBookingFilterPayload,
): Promise<TotalBookingFilter> => {
  const { data } = await fetch(`${TOTAL_BOOKING_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchTotalBookingFilter = async (
  fetch: Fetch<TotalBookingFilter>,
  filterId: number,
  payload: UpdateTotalBookingFilterPayload,
): Promise<TotalBookingFilter> => {
  const { data } = await fetch(
    `${TOTAL_BOOKING_FILTER_ENDPOINT}/${filterId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
};

export const deleteTotalBookingFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${TOTAL_BOOKING_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};

// Tag filters

const TAG_FILTER_ENDPOINT = `${SMARTLIST_API_V1}/tag_filter`;

export const createTagFilter = async (
  fetch: Fetch<TagFilter>,
  payload: CreateTagFilterPayload,
): Promise<TagFilter> => {
  const { data } = await fetch(`${TAG_FILTER_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
};

export const patchTagFilter = async (
  fetch: Fetch<TagFilter>,
  filterId: number,
  payload: UpdateTagFilterPayload,
): Promise<TagFilter> => {
  const { data } = await fetch(`${TAG_FILTER_ENDPOINT}/${filterId}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return data;
};

export const deleteTagFilter = async (
  fetch: Fetch<void>,
  filterId: number,
): Promise<void> => {
  await fetch(`${TAG_FILTER_ENDPOINT}/${filterId}/`, {
    method: "DELETE",
  });
};
