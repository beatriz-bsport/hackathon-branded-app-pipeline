import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

export type SmartfillOfferDisplay = {
  id: number;
  activity_name: string;
  teacher_name: string | null;
  date_start: string;
  timezone_name: string;
  duration_minute: number;
};

export type SmartfillTargetedOffer = {
  id: number;
  offer_id: number;
  offer: SmartfillOfferDisplay | null;
  date_created: string;
  notifications_count: number;
  booked_count: number;
  latest_run_date_created: string | null;
};

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  next_page: number | null;
  results: T[];
};

export const SMARTFILL_TARGETED_OFFERS_QUERY_KEY = [
  "@sm-smartfill",
  "targeted-offers",
] as const;

export const useSmartfillTargetedOffers = (enabled: boolean) => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const query = useQuery({
    queryKey: [
      ...SMARTFILL_TARGETED_OFFERS_QUERY_KEY,
      currentPage,
      currentPageSize,
    ],
    queryFn: async () => {
      const search = new URLSearchParams({
        page: String(currentPage),
        page_size: String(currentPageSize),
      });
      const { data } = await fetch<Paginated<SmartfillTargetedOffer>>(
        `book/v1/smartfill/targeted-offers/?${search.toString()}`,
      );
      return data;
    },
    enabled,
    placeholderData: keepPreviousData,
  });

  const totalItems = query.data?.count ?? 0;

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage: currentPageSize,
      showRowsPerPageSelector: true,
      disabled: query.isLoading,
      totalItems,
      onPageSettingsChange: (page, pageSize) => {
        if (pageSize !== currentPageSize) {
          setPageSettings(DEFAULT_PAGE, pageSize);
        } else {
          setPageSettings(page, pageSize);
        }
      },
      className: "p-md",
    }),
    [
      currentPage,
      currentPageSize,
      query.isLoading,
      totalItems,
      setPageSettings,
    ],
  );

  return { ...query, paginationProps };
};
