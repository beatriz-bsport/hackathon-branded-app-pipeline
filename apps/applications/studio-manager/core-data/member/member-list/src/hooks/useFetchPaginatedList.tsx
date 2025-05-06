import { useCallback } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  fetchMembersAction,
  selectCount,
  selectMembers,
  useMemberStore,
} from "@bsport/store-core-data-member";
import { useAsync } from "@bsport/use-async";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import type { FilterParams } from "#src/hooks/useMemberFilters";
import { fetch } from "#src/utils/fetch";

export const useFetchPaginatedList = ({
  archived,
  activeFilters,
}: {
  archived: boolean;
  activeFilters?: FilterParams;
}) => {
  // Retrieve pagination params from the URL
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({
      shouldReplace: false,
      defaultValues: { page: 1, page_size: 10 },
    });

  // Retrieve pagination results from the store
  const memberList = useMemberStore(selectMembers);
  const totalItems = useMemberStore(selectCount);

  const _fetchMemberPage = useCallback(async () => {
    const filters = activeFilters ?? {};
    return fetchMembersAction(fetch, {
      page_size: currentPageSize,
      page: currentPage,
      /** @todo Update this field when true filtering exist */
      exclude_archived: !archived,
      ...filters,
    });
  }, [currentPage, currentPageSize, activeFilters, archived]);

  const [{ isLoading }, fetchMemberPage] = useAsync<typeof _fetchMemberPage>({
    asyncFn: _fetchMemberPage,
    dependencies: [_fetchMemberPage],
    onFailure: console.error,
  });

  const paginationParams: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems,
    onPageSettingsChange: setPageSettings,
    showRowsPerPageSelector: true,
  };

  return {
    paginationParams,
    memberList,
    totalItems,
    fetchMemberPage,
    isLoading,
  };
};
