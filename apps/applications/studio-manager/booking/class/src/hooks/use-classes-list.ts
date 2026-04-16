import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type SearchGroupActivitiesParams,
  searchGroupActivitiesQueryOptions,
} from "@bsport/api-book";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

type ConfigurableSearchParams = Pick<
  SearchGroupActivitiesParams,
  "inCategoryIds" | "notInCategoryIds" | "searchQuery"
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

  const searchQueryParams: SearchGroupActivitiesParams = {
    customerEnabled,
    page: currentPage,
    pageSize: currentPageSize,
    ...searchParams,
  };

  const { data: searchData } = useSuspenseQuery(
    searchGroupActivitiesQueryOptions(fetch, searchQueryParams),
  );

  const rawClasses = useMemo(() => searchData?.results ?? [], [searchData]);
  const totalItems = useMemo(() => searchData?.count ?? 0, [searchData]);

  //TODO: upcoming: later on we will have class details
  // const getClassDetailLink = (classId: string) =>
  //   `/CLASSES_URL/${classId}`;

  const classes = useMemo(
    () =>
      rawClasses.map((item) => ({
        ...item,
        // TODO: when we will have the actual click on row opening details
        // link: getClassDetailLink(item.id.toString()),
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
      onPageSettingsChange: setPageSettings,
      className: "p-md",
    }),
    [currentPage, currentPageSize, totalItems, setPageSettings],
  );

  return {
    classes,
    paginationProps,
  };
};
