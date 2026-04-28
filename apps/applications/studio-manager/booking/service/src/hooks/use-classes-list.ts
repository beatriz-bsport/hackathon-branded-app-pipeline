import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type SearchGroupActivitiesParams,
  searchGroupActivitiesAndWorkshopsQueryOptions,
} from "@bsport/api-book";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { useClassesNavPermissions } from "#src/hooks/use-permissions";
import { fetch } from "#src/utils/fetch";

type ConfigurableSearchParams = Pick<
  SearchGroupActivitiesParams,
  "inCategoryIds" | "searchQuery" | "isWorkshop"
>;

export const useClassesList = ({
  customerEnabled,
  searchParams,
}: {
  customerEnabled: boolean;
  searchParams?: ConfigurableSearchParams;
}) => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const { canSeeWorkshops, canSeeActivities } = useClassesNavPermissions();

  const workshopsOnly = canSeeWorkshops && !canSeeActivities;
  const activitiesOnly = canSeeActivities && !canSeeWorkshops;

  // computed from permissions + user filter
  const resolvedIsWorkshop = workshopsOnly
    ? true
    : activitiesOnly
      ? false
      : searchParams?.isWorkshop;

  const searchQueryParams: SearchGroupActivitiesParams = {
    customerEnabled,
    page: currentPage,
    pageSize: currentPageSize,
    ...searchParams,
    isWorkshop: resolvedIsWorkshop,
  };

  const { data: searchData } = useSuspenseQuery(
    searchGroupActivitiesAndWorkshopsQueryOptions(fetch, searchQueryParams),
  );

  const rawClasses = useMemo(() => searchData?.results ?? [], [searchData]);
  const totalItems = useMemo(() => searchData?.count ?? 0, [searchData]);

  const classes = useMemo(
    () =>
      rawClasses.map((item) => ({
        ...item,
      })),
    [rawClasses],
  );

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage: currentPageSize,
      showRowsPerPageSelector: true,
      disabled: false,
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
    [currentPage, currentPageSize, totalItems, setPageSettings],
  );

  return {
    classes,
    paginationProps,
  };
};
