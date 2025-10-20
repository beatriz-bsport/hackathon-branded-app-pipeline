import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type { FetchCommunicationRecipientParams } from "#src/types";

import { BASE_API_URL } from "./constants";

const COMMUNICATION_RECIPIENTS_API_URL = `${BASE_API_URL}/communication/communication_recipient`;

export const fetchCommunicationRecipientsAPI = (
  params: FetchCommunicationRecipientParams,
): ApiConfig => {
  return [
    `${COMMUNICATION_RECIPIENTS_API_URL}/${buildUrlParams(params)}`,
    { method: "GET" },
  ];
};
