import { queryOptions } from "@tanstack/react-query";

import { Fetch } from "@bsport/store-base";

import { fetchCommunicationVariablesAPI, notificationRuleKeys } from "./api";
import { CommunicationVariable } from "./types";

export const communicationVariablesQueryOptions = (
  fetch: Fetch<CommunicationVariable>,
) =>
  queryOptions({
    queryKey: notificationRuleKeys.communicationVariables(),
    queryFn: () => fetchCommunicationVariablesAPI(fetch),
  });
