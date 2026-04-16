import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { useMemo } from "react";

import {
  type SearchGroupActivitiesParams,
  searchGroupActivitiesAPI,
} from "@bsport/api-book";
import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

type ConfigurableSearchParams = Pick<
  SearchGroupActivitiesParams,
  "inCategoryIds" | "notInCategoryIds" | "searchQuery"
>;

const CLASSES_STALE_TIME = 2 * 60 * 1000; // 2 minutes

const searchClassesQueryOptions = (params: SearchGroupActivitiesParams) =>
  queryOptions({
    queryKey: ["searchGroupActivities", params],
    queryFn: async () => {
      const data = await searchGroupActivitiesAPI(fetch, params);
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: CLASSES_STALE_TIME,
  });

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

  const {
    data: searchData,
    isLoading,
    refetch,
  } = useQuery(searchClassesQueryOptions(searchQueryParams));

  const rawClasses = useMemo(() => searchData?.results ?? [], [searchData]);
  const totalItems = useMemo(() => searchData?.count ?? 0, [searchData]);

  // later on we will have class details
  // const getClassDetailLink = (classId: string) =>
  //   `/activity/${classId}/general`;

  const classes = useMemo(
    () =>
      rawClasses.map((item) => ({
        ...item,
        // link: getClassDetailLink(item.id.toString()),
      })),
    [rawClasses],
  );

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage: currentPageSize,
      showRowsPerPageSelector: true,
      disabled: isLoading,
      totalItems,
      onPageSettingsChange: setPageSettings,
      className: "p-md",
    }),
    [currentPage, currentPageSize, isLoading, totalItems, setPageSettings],
  );

  return {
    classes,
    paginationProps,
    isLoading,
    refetch,
  };
};
