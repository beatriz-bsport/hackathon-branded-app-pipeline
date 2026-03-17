import { queryOptions } from "@tanstack/react-query";

import { type ApiConfig, type Fetch } from "@bsport/store-base";

import type { CommunicationVariable } from "#src/notification-rule/types";

const API_URL = "customer-data-platform/v1/notification";
const RULE_API_URL = API_URL + "/rule";

export const notificationRuleKeys = {
  all: ["@api-cdp", "notification-rule"] as const,

  communicationVariables: () =>
    [...notificationRuleKeys.all, "communication-variables"] as const,
} as const;

const fetchCommunicationVariablesAPIConfig = (): ApiConfig => {
  return [`${RULE_API_URL}/tags/`];
};

export const fetchCommunicationVariables = async (
  fetch: Fetch<CommunicationVariable>,
): Promise<CommunicationVariable> => {
  const [uri, init] = fetchCommunicationVariablesAPIConfig();

  const { data } = await fetch(uri, init);

  return data;
};

export const communicationVariablesQueryOptions = (
  fetch: Fetch<CommunicationVariable>,
) =>
  queryOptions({
    queryKey: notificationRuleKeys.communicationVariables(),
    queryFn: () => fetchCommunicationVariables(fetch),
    staleTime: 2 * 60 * 1000,
  });
