import { Result } from "typescript-result";

import { type Action, createErrorWithContext } from "@bsport/store-base";

import { fetchCommunicationVariablesAPI } from "#src/api";
import type { CommunicationVariable } from "#src/types";

import { setCommunicationVariables } from "./store";

/**
 * Fetches all the available communicaiton variables usable in communication methods.
 */
export const fetchCommunicationVariablesAction: Action<
  void,
  CommunicationVariable
> = async (fetch) => {
  const [uri, init] = fetchCommunicationVariablesAPI();

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCommunicationVariables(data);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch communication variables",
      }),
  );
};
