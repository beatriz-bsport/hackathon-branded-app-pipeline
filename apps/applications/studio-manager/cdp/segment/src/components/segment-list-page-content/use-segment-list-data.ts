import { useSmartlists } from "#src/api/use-smartlists";

import { useFilters } from "./use-filters";

export const useSegmentListData = () => {
  const filters = useFilters();

  const { currentPage, currentPageSize, searchTerm } = filters;

  const smartlistQuery = useSmartlists({
    page: currentPage,
    page_size: currentPageSize,
    search: searchTerm,
  });

  return {
    filters,
    smartlistQuery,
  };
};
