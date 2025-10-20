import { useEffect } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  COMMUNICATION_CONTEXT_IDENTIFIER_MARKETING_NOTIFICATION,
  fetchCommunicationRecipientsAction,
  fetchCommunicationSentPaginatedListAction,
  selectCommunicationSentList,
  selectCommunicationSentListCount,
  useCommunicationStore,
} from "@bsport/store-communicate-communication";
import { useAsync } from "@bsport/use-async";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { useFormatCommunicationRecipients } from "#src/hooks/layout/use-format-communication-recipients";
import { fetch } from "#src/utils/fetch";

const FETCH_ONLY_ORIGINAL_RECIPIENTS = 1;

const FALLBACK_UNASSIGNED_ID = 0;

const fetchCommunicationSentPaginatedBound =
  fetchCommunicationSentPaginatedListAction.bind(null, fetch);

const fetchCommunicationRecipientsBound =
  fetchCommunicationRecipientsAction.bind(null, fetch);

/**
 * Hook for fetching and formatting communication recipients data.
 *
 * This hook provides functionality to fetch communication sent data and their recipients,
 * then formats the data for display in the marketing notification recipients table.
 * It handles API calls, manages loading states, and provides pagination support.
 * The hook accepts a communication object ID to retrieve communications for that context.
 *
 * @param communicationObjectId - The ID of the marketing notification to fetch communications for
 * @returns Object containing formatted communication recipients and pagination parameters
 */
export function useFetchCommunicationRecipients({
  communicationObjectId,
}: {
  communicationObjectId?: number;
}) {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const [, fetchCommunicationRecipients] = useAsync<
    typeof fetchCommunicationRecipientsBound
  >({
    asyncFn: fetchCommunicationRecipientsBound,
  });

  const [, fetchCommunicationSentPaginated] = useAsync<
    typeof fetchCommunicationSentPaginatedBound
  >({
    asyncFn: fetchCommunicationSentPaginatedBound,
    onSuccess: ({ value }) => {
      value.results.forEach((communication) => {
        fetchCommunicationRecipients({
          communication_sent: communication.id,
          page: DEFAULT_PAGE,
          page_size: FETCH_ONLY_ORIGINAL_RECIPIENTS,
        });
      });
    },
  });

  const communicationSentList = useCommunicationStore((state) =>
    selectCommunicationSentList({
      state,
      objectType: "marketing_notification_id",
      objectId: communicationObjectId ?? FALLBACK_UNASSIGNED_ID,
    }),
  );

  const communicationSentCount = useCommunicationStore((state) =>
    selectCommunicationSentListCount({
      state,
      objectType: "marketing_notification_id",
      objectId: communicationObjectId ?? FALLBACK_UNASSIGNED_ID,
    }),
  );

  const communicationRecipients = useFormatCommunicationRecipients(
    communicationSentList,
  );

  useEffect(() => {
    if (communicationObjectId) {
      fetchCommunicationSentPaginated({
        page: currentPage ?? DEFAULT_PAGE,
        page_size: currentPageSize ?? DEFAULT_PAGE_SIZE,
        context_identifier:
          COMMUNICATION_CONTEXT_IDENTIFIER_MARKETING_NOTIFICATION,
        context_object_id: String(communicationObjectId),
      });
    }
  }, [
    communicationObjectId,
    currentPage,
    currentPageSize,
    fetchCommunicationSentPaginated,
  ]);

  const paginationParams: PaginationProps | undefined =
    communicationSentCount > currentPageSize
      ? {
          currentPage,
          rowsPerPage: currentPageSize,
          totalItems: communicationSentCount,
          onPageSettingsChange: setPageSettings,
          showRowsPerPageSelector: false,
        }
      : undefined;

  return { communicationRecipients, paginationParams };
}
