import { queryOptions } from "@tanstack/react-query";

import type { Fetch } from "@bsport/store-base";

import { customFormKeys, fetchCustomFormsAPI } from "./api";
import type { FetchCustomFormsParams, PaginatedCustomForms } from "./types";

export const customFormsQueryOptions = (
  fetch: Fetch<PaginatedCustomForms>,
  params: FetchCustomFormsParams,
) =>
  queryOptions({
    queryKey: customFormKeys.list(params),
    queryFn: () => fetchCustomFormsAPI(fetch, params),
  });
