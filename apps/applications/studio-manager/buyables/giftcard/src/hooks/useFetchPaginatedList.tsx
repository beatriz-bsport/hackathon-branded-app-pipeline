import { useCallback } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  fetchGiftcardsAction,
  selectGiftcards,
  selectGiftcardsCount,
  useGiftcardStore,
} from "@bsport/store-buyables-giftcard";
import { useAsync } from "@bsport/use-async";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

export const useFetchPaginatedList = ({ archived }: { archived: boolean }) => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const giftcardList = useGiftcardStore(selectGiftcards);
  const totalItems = useGiftcardStore(selectGiftcardsCount);

  const _fetchGiftcardsPage = useCallback(async () => {
    return fetchGiftcardsAction(fetch, {
      page: currentPage,
      page_size: currentPageSize,
      disabled: archived,
    });
  }, [currentPage, currentPageSize, archived]);

  const [{ isLoading }, fetchGiftcardsPage] = useAsync<
    typeof _fetchGiftcardsPage
  >({
    asyncFn: _fetchGiftcardsPage,
    dependencies: [_fetchGiftcardsPage],
  });

  const paginationParams: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems,
    onPageSettingsChange: setPageSettings,
    showRowsPerPageSelector: true,
  };

  return {
    isLoading,
    paginationParams,
    giftcardList,
    fetchGiftcardsPage,
    totalItems,
  };
};
