import { useCallback, useMemo, useState } from "react";

import {
  fetchGroupActivities,
  DEFAULT_CURRENT_PAGE,
  DEFAULT_ROWS_PER_PAGE,
  type MetaActivity,
} from "@bsport/store-booking-group-activity";

import fetch from "#src/utils/fetch";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";

const usePaginatedGroupActivities = (customerEnabled: boolean) => {
  const [groupActivities, setGroupActivities] = useState<MetaActivity[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);

  const [totalItems, setTotalItems] = useState(1);

  const fetchData = useCallback(
    (page: number, rows: number) => {
      setCurrentPage(page);
      setIsLoading(true);
      fetchGroupActivities(fetch, {
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
