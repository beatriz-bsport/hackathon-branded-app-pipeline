import { Result } from "typescript-result";

import {
  type Action,
  type PaginatedResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import { fetchSubscriptionListAPI, searchSubscriptionAPI } from "#src/api";
import type { FetchSubscriptionQueryParams, Subscription } from "#src/types";

import { setFuzzySearchedSubscriptions, setSubscriptions } from "./store";

/**
 * Fetches a list of subscriptions from the API, supporting both paginated and non-paginated responses.
 *
 * - If the API returns a simple array of subscriptions, stores them in the main subscriptions list.
 * - If the API returns a paginated response, stores the results in a fuzzy search structure for consistency.
 * - Handles errors by wrapping them with additional context.
 *
 * @param fetch - The fetch function to perform the API request.
 * @param params - Query parameters for fetching subscriptions.
 * @param params.disabled - Filter by disabled status
 * @param params.manager_only - Filter by manager-only subscriptions
 * @param params.is_usable_by_staff - Filter by staff usability
 * @param params.id__in - Filter by specific subscription IDs
 * @param params.page - Page number for pagination (default: 1)
 * @param params.page_size - Number of items per page (default: 20)
 * @returns A Result containing either an array of subscriptions or a paginated response.
 */
export const fetchSubscriptionsAction: Action<
  FetchSubscriptionQueryParams,
  Subscription[] | PaginatedResponse<Subscription>
> = async (fetch, params) => {
  const [uri, init] = fetchSubscriptionListAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      // Check if response is paginated (has page/count properties) or simple array
      if (Array.isArray(data)) {
        // Simple array response - store in main subscriptions list
        setSubscriptions(data);
        return data;
      } else {
        // Paginated response - store in fuzzy search structure for consistency
        const paginatedData = data as PaginatedResponse<Subscription>;
        setFuzzySearchedSubscriptions({
          subscriptions: paginatedData.results,
          count: paginatedData.count,
          page: paginatedData.page || 1,
        });
        return paginatedData;
      }
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch subscriptions",
      }),
  );
};

/**
 * Searches for subscriptions with fuzzy matching and pagination.
 * Always returns paginated results with search metadata.
 *
 * @param fetch - The fetch function for making API calls
 * @param params - Search parameters including query and filters
 * @param params.q - Search query string
 * @param params.disabled - Filter by disabled status
 * @param params.manager_only - Filter by manager-only subscriptions
 * @param params.is_usable_by_staff - Filter by staff usability
 * @param params.id__in - Filter by specific subscription IDs
 * @param params.page - Page number for pagination (default: 1)
 * @param params.page_size - Number of items per page (default: 20)
 * @returns Promise<Result<PaginatedResponse<Subscription>, Error>>
 */
export const searchSubscriptionsAction: Action<
  FetchSubscriptionQueryParams & { q: string },
  PaginatedResponse<Subscription>
> = async (fetch, params) => {
  const [uri, init] = searchSubscriptionAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setFuzzySearchedSubscriptions({
        subscriptions: data.results,
        count: data.count,
        page: data.page || params.page || 1,
      });
      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to search subscriptions",
        context: { searchParams: params },
      }),
  );
};
