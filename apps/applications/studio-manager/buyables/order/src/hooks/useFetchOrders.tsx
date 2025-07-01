import { useCallback } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  fetchOrdersAction,
  selectCount,
  selectOrders,
  useOrderStore,
} from "@bsport/store-buyables-order";
import { useAsync } from "@bsport/use-async";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { OrderStatus } from "#src/utils/constants";
import { fetch } from "#src/utils/fetch";

export const useFetchOrders = ({ status }: { status?: OrderStatus }) => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const orders = useOrderStore(selectOrders);
  const totalItems = useOrderStore(selectCount);

  const _fetchOrdersPage = useCallback(async () => {
    const params = status ? { state: status } : {};
    return fetchOrdersAction(fetch, {
      page: currentPage,
      page_size: currentPageSize,
      ...params,
    });
  }, [currentPage, currentPageSize, status]);

  const [{ isLoading }, fetchOrdersPage] = useAsync<typeof _fetchOrdersPage>({
    asyncFn: _fetchOrdersPage,
    dependencies: [_fetchOrdersPage],
  });

  const paginationParams: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems,
    onPageSettingsChange: setPageSettings,
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
  };
};
