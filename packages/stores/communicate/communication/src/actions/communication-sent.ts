import { Result } from "typescript-result";

import {
  type Action,
  type PaginatedResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import {
  fetchCommunicationSentAPI,
  fetchCommunicationSentCampaignSummaryAPI,
} from "#src/api/communication-sent";
import { COMMUNICATION_MAPPING_CONTEXT_IDENTIFIER_TO_OBJECT_KEY } from "#src/constants";
import type {
  CampaignSummary,
  CommunicationSent,
  FetchCommunicationSentCampaignSummaryPayload,
  FetchCommunicationSentParams,
} from "#src/types";

import { setCampaignSummary, setCommunicationSentList } from "./store";

/**
 * Fetches a specific communication sent campaign summary. This will return the
 * summary of statistics such as total_click, total_read and total_recipients.
 * @param params.key The key for the communication which is the type of campaign
 * where the communication were emitted, for example 'marketing_notificaiton_id'.
 * @param params.value The id of the communication campaign.
 */
export const fetchCommunicationSentCampaignSummaryAction: Action<
  FetchCommunicationSentCampaignSummaryPayload,
  CampaignSummary
> = async (fetch, params) => {
  const [uri, init] = fetchCommunicationSentCampaignSummaryAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCampaignSummary({
        campaignSummary: data,
        objectId: params.value,
        objectType: params.key,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch communications sent campaign summary",
        params,
      }),
  );
};

/**
 * Fetches a paginated list of sent communications based on the provided parameters.
 *
 * This action retrieves communication data from the API, maps the context identifier
 * to the appropriate object key, updates the communication sent list in the store,
 * and returns the paginated response. If the context identifier is unknown, an error is thrown.
 * Any errors during the fetch or processing are wrapped with additional context.
 *
 * @param fetch - The fetch function used to make the API request.
 * @param params - The parameters used to filter and paginate the communications sent list.
 * @returns A Result containing the paginated response of sent communications or an error with context.
 */
export const fetchCommunicationSentPaginatedListAction: Action<
  FetchCommunicationSentParams,
  PaginatedResponse<CommunicationSent>
> = async (fetch, params) => {
  const [uri, init] = fetchCommunicationSentAPI(params);

  const communicationObjectType =
    COMMUNICATION_MAPPING_CONTEXT_IDENTIFIER_TO_OBJECT_KEY[
      params.context_identifier
    ];

  if (!communicationObjectType) {
    throw new Error(
      `Unknown communication context_identifier: ${params.context_identifier}`,
    );
  }

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCommunicationSentList({
        communications: data.results,
        page: data.page,
        count: data.count,
        objectType: communicationObjectType,
        objectId: params.context_object_id,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch communications sent list",
        params,
      }),
  );
};
