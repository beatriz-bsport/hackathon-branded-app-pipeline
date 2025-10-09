import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type {
  FetchCommunicationSentCampaignSummaryPayload,
  FetchCommunicationSentParams,
} from "#src/types";

import { BASE_API_URL } from "./constants";

const COMMUNICATION_SENT_API_URL = `${BASE_API_URL}/communication/communication_sent`;

export const fetchCommunicationSentAPI = (
  params: FetchCommunicationSentParams,
): ApiConfig => {
  return [
    `${COMMUNICATION_SENT_API_URL}/${buildUrlParams(params)}`,
    { method: "GET" },
  ];
};

export const fetchCommunicationSentCampaignSummaryAPI = (
  payload: FetchCommunicationSentCampaignSummaryPayload,
): ApiConfig => {
  return [
    `${COMMUNICATION_SENT_API_URL}/campaign_summary/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  ];
};
