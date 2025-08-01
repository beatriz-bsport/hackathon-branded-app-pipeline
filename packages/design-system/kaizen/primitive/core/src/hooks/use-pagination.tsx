import { useCallback, useEffect, useState } from "react";

import Pagination, {
  type PaginationProps,
} from "#src/components/private/Pagination";

const DEFAULT_CURRENT_PAGE = 1;
const DEFAULT_ROWS_PER_PAGE = 10;

/**
 * Provides a stateful pagination hook.
 *
 * @param {PaginationProps} paginationProps
 * @returns {[number, (page: number) => void, number, (rowsPerPage: number) => void]}
 */
export const usePagination = (paginationProps?: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(
    paginationProps?.currentPage || DEFAULT_CURRENT_PAGE,
  );
  const [rowsPerPage, setRowsPerPage] = useState(
    paginationProps?.rowsPerPage || DEFAULT_ROWS_PER_PAGE,
  );

  useEffect(() => {
    if (
      paginationProps?.rowsPerPage &&
      paginationProps?.rowsPerPage !== rowsPerPage
    ) {
      setRowsPerPage(paginationProps?.rowsPerPage);
    }
  }, [paginationProps?.rowsPerPage, rowsPerPage]);

  useEffect(() => {
    if (
      paginationProps?.currentPage &&
      paginationProps?.currentPage !== currentPage
    ) {
      setCurrentPage(paginationProps?.currentPage);
    }
  }, [paginationProps?.currentPage, currentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      paginationProps?.onPageChange?.(page);
      paginationProps?.onPageSettingsChange?.(page, rowsPerPage);
    },
    [paginationProps, rowsPerPage],
  );

  const handleRowsPerPageChange = useCallback(
    (rows: number) => {
      setRowsPerPage(rows);
      setCurrentPage(1);
      paginationProps?.onRowsPerPageChange?.(rows);
      paginationProps?.onPageSettingsChange?.(1, rows);
    },
    [paginationProps],
  );

  return paginationProps ? (
    <Pagination
      {...paginationProps}
      currentPage={currentPage}
      rowsPerPage={rowsPerPage}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  ) : null;
};
