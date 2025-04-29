import { useCallback, useMemo, useState } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  type MetaActivity,
  fetchGroupActivitiesAction,
} from "@bsport/store-booking-group-activity";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import fetch from "#src/utils/fetch";

const usePaginatedGroupActivities = (customerEnabled: boolean) => {
  const [groupActivities, setGroupActivities] = useState<MetaActivity[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({
      shouldReplace: false,
      defaultValues: { page_size: 10, page: 1 },
    });

  const [totalItems, setTotalItems] = useState(1);

  const fetchGroupActivitiesPage = useCallback(() => {
    setIsLoading(true);
    fetchGroupActivitiesAction(fetch, {
      customerEnabled,
      page: currentPage,
      pageSize: currentPageSize,
    }).then((response) => {
      response.fold(
        ({ results, count }) => {
          setGroupActivities(results);
          setTotalItems(count);
        },
        (error) => console.error(error),
      );
      setIsLoading(false);
    });
  }, [currentPage, currentPageSize]);

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
    groupActivities,
    fetchGroupActivitiesPage,
    paginationProps,
    isLoading,
  };
};

export default usePaginatedGroupActivities;
