import { useCallback } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  fetchMembersAction,
  selectCount,
  selectMembers,
  useMemberStore,
} from "@bsport/store-core-data-member";
import { useAsync } from "@bsport/use-async";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import type { FilterParams } from "#src/hooks/useFilterMembers";
import { fetch } from "#src/utils/fetch";

export const useFetchMembers = ({
  archived,
  activeFilters,
}: {
  archived: boolean;
  activeFilters?: FilterParams;
}) => {
  // Retrieve pagination params from the URL
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  // Retrieve pagination results from the store
  const memberList = useMemberStore(selectMembers);
  const totalItems = useMemberStore(selectCount);

  // Handlers
  const { tags_included, tags_excluded } = activeFilters ?? {};
  const fetchMemberPageGeneric = useCallback(
    async ({ page, pageSize }: { page?: number; pageSize?: number }) => {
      return fetchMembersAction(fetch, {
        page_size: pageSize ?? DEFAULT_PAGE_SIZE,
        page: page ?? DEFAULT_PAGE,
        archived: !!archived,
        ...(tags_excluded ? { tags_excluded } : {}),
        ...(tags_included ? { tags_included } : {}),
      });
    },
    [tags_included, tags_excluded, archived],
  );

  const [{ isLoading }, fetchMemberPage] = useAsync<
    typeof fetchMemberPageGeneric
  >({
    asyncFn: fetchMemberPageGeneric,
    dependencies: [fetchMemberPageGeneric],
    onFailure: console.error,
  });

  const fetchMemberCurrentPage = useCallback(async () => {
    return fetchMemberPage({ page: currentPage, pageSize: currentPageSize });
  }, [currentPage, currentPageSize, fetchMemberPage]);

  const refreshMemberList = useCallback(async () => {
    return fetchMemberPage({});
  }, [fetchMemberPage]);

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
    fetchMemberPage: fetchMemberCurrentPage,
    refreshMemberList,
    isLoading,
  };
};
