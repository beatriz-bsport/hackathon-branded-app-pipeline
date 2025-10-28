import { Result } from "typescript-result";

import type { Action, PaginatedResponse } from "@bsport/store-base";
import { createErrorWithContext } from "@bsport/store-base";

import { fetchSubstitutionRequestsAPI } from "#src/api";
import type {
  FetchSubstitutionRequestsParams,
  SubstitutionRequest,
} from "#src/types";

import { setSubstitutionRequests } from "./store";

export const fetchSubstitutionRequestsAction: Action<
  FetchSubstitutionRequestsParams,
  PaginatedResponse<SubstitutionRequest>
> = async (fetch, params) => {
  const [uri, init] = fetchSubstitutionRequestsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSubstitutionRequests({
        items: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch substitution requests",
        params,
      }),
  );
};
