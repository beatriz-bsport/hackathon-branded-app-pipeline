import { useSuspenseQuery } from "@tanstack/react-query";

import { retrieveReplacementRequestConfigurationQueryOptions } from "@bsport/api-core";

import { fetch } from "#src/utils/fetch";

export const useReplacementRequestConfiguration = () =>
  useSuspenseQuery(retrieveReplacementRequestConfigurationQueryOptions(fetch));
