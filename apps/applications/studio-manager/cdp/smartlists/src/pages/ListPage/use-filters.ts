import { useState } from "react";

import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

/**
 * Custom hook for managing list search and pagination state.
 *
 * This hook handles search term state and pagination settings, providing
 * functions to update these values and reset pagination when search changes.
 * It uses the usePaginationQueryParams hook to sync pagination state with URL query parameters.
 *
 * @returns {Object} An object containing:
 *   - currentPage: Current page number
 *   - currentPageSize: Number of items per page
 *   - searchTerm: Current search term
 *   - setSearchTerm: Function to set search term directly
 *   - onSearchChange: Function to update search term and reset to first page
 *   - onSearchClear: Function to clear search term
 *   - onPageChange: Function to change current page
 *   - onPageSettingsChange: Function to update both page and page size
 */
export const useFilters = () => {
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  const [searchTerm, setSearchTerm] = useState("");

  const onSearchChange = (value: string) => {
    setSearchTerm(value);
    setPageSettings(DEFAULT_PAGE, currentPageSize);
  };

  const onSearchClear = () => {
    onSearchChange("");
  };

  const onPageChange = (page: number) => {
    setPageSettings(page, currentPageSize);
  };

  return {
    currentPage,
    currentPageSize,
    searchTerm,
    setSearchTerm,
    onSearchChange,
    onSearchClear,
    onPageChange,
    onPageSettingsChange: setPageSettings,
  } as const;
};
