import { useCallback } from "react";

import { searchMembersAction } from "@bsport/store-core-data-member";
import { useAsync } from "@bsport/use-async";
import { DEFAULT_PAGE } from "@bsport/use-pagination-query-params";

import { fetch } from "#src/utils/fetch";

const DEFAULT_MEMBER_SEARCH_SIZE = 20; // Enforced backend side

export const useSearchMembers = ({
  searchInput,
  archived,
}: {
  searchInput: string;
  archived: boolean;
}) => {
  const handleSearchMembers = useCallback(async () => {
    return searchMembersAction(fetch, {
      text: searchInput,
      params: archived ? { only_archived: true } : { hide_archived: true },
    });
  }, [searchInput, archived]);

  const [{ isLoading }, searchMembers] = useAsync<typeof handleSearchMembers>({
    asyncFn: handleSearchMembers,
    dependencies: [handleSearchMembers],
  });

  const searchPaginationParams = {
    currentPage: DEFAULT_PAGE,
    rowsPerPage: DEFAULT_MEMBER_SEARCH_SIZE,
    showRowsPerPageSelector: false,
  };

  return {
    searchMembers,
    isSearching: isLoading,
    searchPaginationParams,
  };
};
