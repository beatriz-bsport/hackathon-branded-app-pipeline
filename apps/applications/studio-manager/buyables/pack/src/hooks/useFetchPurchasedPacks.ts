import { useEffect } from "react";

import {
  fetchPurchasedPacksAction,
  selectPurchasedPacks,
  selectPurchasedPacksCount,
  usePackStore,
} from "@bsport/store-buyables-pack";
import { useAsync } from "@bsport/use-async";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

const fetchPurchasedPacksBound = fetchPurchasedPacksAction.bind(null, fetch);

export const useFetchPurchasedPacks = (packId: number) => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const [{ isLoading }, fetchPurchasedPacks] = useAsync<
    typeof fetchPurchasedPacksBound
  >({
    asyncFn: fetchPurchasedPacksBound,
    onFailure: console.error,
  });

  const onPageSettingsChange = (page: number, pageSize: number) => {
    if (pageSize !== currentPageSize) {
      setPageSettings(DEFAULT_PAGE, pageSize);
    } else {
      setPageSettings(page, pageSize);
    }
  };

  useEffect(() => {
    fetchPurchasedPacks({
      page: currentPage,
      page_size: currentPageSize,
      packId: packId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, currentPageSize, packId]);

  const purchasedPacks = usePackStore(selectPurchasedPacks);
  const totalItems = usePackStore(selectPurchasedPacksCount);

  return {
    paginationParams: {
      onPageSettingsChange,
      currentPage,
      rowsPerPage: currentPageSize,
      totalItems,
      showRowsPerPageSelector: true,
    },
    isLoading: isLoading && !totalItems,
    isEmpty: totalItems === 0,
    purchasedPacks,
  };
};
