import { useCallback } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  fetchOrdersAction,
  selectCount,
  selectOrders,
  useOrderStore,
} from "@bsport/store-buyables-order";
import { useAsync } from "@bsport/use-async";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import type { OrderStatus } from "#src/utils/constants";
import { fetch } from "#src/utils/fetch";

export const useFetchOrders = () => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const orders = useOrderStore(selectOrders);
  const totalItems = useOrderStore(selectCount);

  const _fetchOrdersPage = useCallback(
    async ({ status }: { status?: OrderStatus }) => {
      const params = status ? { state: status } : {};
      return fetchOrdersAction(fetch, {
        page: currentPage,
        page_size: currentPageSize,
        ...params,
      });
    },
    [currentPage, currentPageSize],
  );

  const [{ isLoading }, fetchOrdersPage] = useAsync<typeof _fetchOrdersPage>({
    asyncFn: _fetchOrdersPage,
    dependencies: [_fetchOrdersPage],
  });

  const onFilterChange = () => {
    setPageSettings(DEFAULT_PAGE, currentPageSize);
  };

  const onPageSettingsChange = (page: number, pageSize: number) => {
    if (pageSize !== currentPageSize) {
      setPageSettings(DEFAULT_PAGE, pageSize);
    } else {
      setPageSettings(page, pageSize);
    }
  };

  const paginationParams: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems,
    onPageSettingsChange,
    showRowsPerPageSelector: true,
  };

  const isEmpty = totalItems === 0;
  const isEmptySearch = isEmpty && !!status;

  return {
    fetchOrdersPage,
    isEmpty,
    isEmptySearch,
    isLoading: isLoading && orders.length === 0,
    orders,
    paginationParams,
    totalItems,
    onFilterChange,
  };
};
