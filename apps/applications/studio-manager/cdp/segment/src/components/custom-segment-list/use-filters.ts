import { useState } from "react";

import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

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

  const onPageSettingsChange = (page: number, pageSize: number) => {
    if (pageSize !== currentPageSize) {
      setPageSettings(DEFAULT_PAGE, pageSize);
    } else {
      setPageSettings(page, pageSize);
    }
  };

  return {
    currentPage,
    currentPageSize,
    searchTerm,
    setSearchTerm,
    onSearchChange,
    onSearchClear,
    onPageSettingsChange,
  } as const;
};
