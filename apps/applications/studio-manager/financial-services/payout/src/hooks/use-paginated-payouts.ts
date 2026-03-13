import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";

import type {
  GetPayoutListRequest,
  PayoutListItem,
  PayoutListResponse,
} from "@bsport/api-financial-services";
import { getPayoutListAPI } from "@bsport/api-financial-services";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

type PayoutListQueryParams = Pick<GetPayoutListRequest, "page" | "page_size">;

const payoutListQueryOptions = ({ page, page_size }: PayoutListQueryParams) => {
  return queryOptions<PayoutListResponse>({
    queryKey: ["payout-list", { page, page_size }],
    queryFn: () => getPayoutListAPI(fetch, { page, page_size }),
    placeholderData: keepPreviousData,
  });
};

export type UsePaginatedPayoutsResult = {
  payouts: PayoutListItem[];
  paginationProps: PaginationProps;
  isFetching: boolean;
  error: Error | null;
};

export const usePaginatedPayouts = (): UsePaginatedPayoutsResult => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const { data, isFetching, error } = useQuery({
    ...payoutListQueryOptions({
      page: currentPage,
      page_size: currentPageSize,
    }),
  });

  const payouts = data?.results ?? [];
  const totalItems = data?.count ?? 0;

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage: currentPageSize,
      showRowsPerPageSelector: true,
      disabled: isFetching,
      totalItems,
      onPageSettingsChange: setPageSettings,
    }),
    [currentPage, currentPageSize, isFetching, totalItems, setPageSettings],
  );

  return {
    payouts,
    paginationProps,
    isFetching,
    error,
  };
};
