import { Result } from "typescript-result";

import type { Action } from "@bsport/store-base";
import { createErrorWithContext } from "@bsport/store-base";

import { fetchSubstitutionRequestsAPI } from "#src/api";
import type { SubstitutionRequest } from "#src/types";

import { setSubstitutionRequests } from "./store";

export const fetchSubstitutionRequestsAction: Action<
  void,
  SubstitutionRequest[]
> = async (fetch) => {
  const [uri, init] = fetchSubstitutionRequestsAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setSubstitutionRequests({
        items: data,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch substitution requests",
      }),
  );
};
