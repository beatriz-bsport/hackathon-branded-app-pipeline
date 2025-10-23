import { Result } from "typescript-result";

import {
  type Action,
  DEFAULT_PAGE,
  type PaginatedResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import { fetchCommunicationRecipientsAPI } from "#src/api/communication-recipient";
import type {
  CommunicationRecipient,
  FetchCommunicationRecipientParams,
} from "#src/types";

import { setRecipientsList } from "./store";

/**
 * Fetches a paginated list of communication recipients based on provided filters.
 * @param fetch - The fetch function to perform the API call.
 * @param params - Filters for fetching communication recipients.
 * @returns A Result containing a paginated response of CommunicationRecipient objects.
 */
export const fetchCommunicationRecipientsAction: Action<
  FetchCommunicationRecipientParams,
  PaginatedResponse<CommunicationRecipient>
> = async (fetch, params) => {
  const [uri, init] = fetchCommunicationRecipientsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setRecipientsList({
        recipients: data.results,
        page: params.page ?? DEFAULT_PAGE,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch communication recipients",
        params,
      }),
  );
};
