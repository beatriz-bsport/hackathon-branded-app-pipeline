import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type { FetchCommunicationRecipientParams } from "#src/types";

import { BASE_API_URL } from "./constants";

const COMMUNICATION_API_URL = `${BASE_API_URL}/communication`;

export const fetchCommunicationRecipientsAPI = (
  params: FetchCommunicationRecipientParams,
): ApiConfig => {
  return [
    `${COMMUNICATION_API_URL}/communication_recipient/${buildUrlParams(params)}`,
    { method: "GET" },
  ];
};

export const fetchCommunicationRecipientsWithMemberDataAPI = (
  params: FetchCommunicationRecipientParams,
): ApiConfig => {
  return [
    `${COMMUNICATION_API_URL}/communication_recipient_with_member_data/${buildUrlParams(params)}`,
    { method: "GET" },
  ];
};
