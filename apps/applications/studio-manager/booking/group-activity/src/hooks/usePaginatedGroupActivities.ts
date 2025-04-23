import { useCallback, useMemo, useState } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  type MetaActivity,
  fetchGroupActivitiesAction,
} from "@bsport/store-booking-group-activity";

import fetch from "#src/utils/fetch";

const usePaginatedGroupActivities = (customerEnabled: boolean) => {
  const [groupActivities, setGroupActivities] = useState<MetaActivity[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [totalItems, setTotalItems] = useState(1);

  const fetchData = useCallback(
    (page: number, rows: number) => {
      setCurrentPage(page);
      setIsLoading(true);
      fetchGroupActivitiesAction(fetch, {
        customerEnabled,
        page: page,
        pageSize: rows,
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
    },
    [currentPage, rowsPerPage],
  );

  const changeRowsPerPage = useCallback((rows: number) => {
    setRowsPerPage(rows);
  }, []);

  const paginationProps: PaginationProps = useMemo(
    () => ({
      currentPage,
      rowsPerPage,
      showRowsPerPageSelector: true,
      disabled: isLoading,
      totalItems,
      onRowsPerPageChange: changeRowsPerPage,
      onPageSettingsChange: fetchData,
      className: "p-md",
    }),
    [
      currentPage,
      rowsPerPage,
      isLoading,
      totalItems,
      changeRowsPerPage,
      fetchData,
    ],
  );

  return {
    groupActivities,
    fetchData,
    currentPage,
    rowsPerPage,
    paginationProps,
    isLoading,
  };
};

export default usePaginatedGroupActivities;
