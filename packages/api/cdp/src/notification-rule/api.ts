import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";
import type { CommunicationVariable } from "#src/notification-rule/types";

const API_URL = "customer-data-platform/v1/notification";
const RULE_API_URL = API_URL + "/rule";

export const notificationRuleKeys = {
  all: [QUERY_KEY_MAIN, "notification-rule"] as const,

  communicationVariables: () =>
    [...notificationRuleKeys.all, "communication-variables"] as const,
} as const;

const fetchCommunicationVariablesConfig = (): ApiConfig => {
  return [`${RULE_API_URL}/tags/`];
};

export const fetchCommunicationVariablesAPI = async (
  fetch: Fetch<CommunicationVariable>,
): Promise<CommunicationVariable> => {
  const [uri, init] = fetchCommunicationVariablesConfig();

  const { data } = await fetch(uri, init);

  return data;
};
