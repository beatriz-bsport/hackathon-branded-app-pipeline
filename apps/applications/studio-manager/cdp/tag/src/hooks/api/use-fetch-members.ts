import { useCallback, useEffect, useRef } from "react";

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

import { fetch } from "#src/utils/fetch";

const _fetchMembers = fetchMembersAction.bind(null, fetch);

export const useFetchMembers = ({
  relatedTagId,
  isTagged = true,
}: {
  relatedTagId: number;
  isTagged: boolean;
}) => {
  const tagStatus = isTagged === true ? "tagged" : "untagged";
  // We keep the last state of the tag to be able to know when we should reset the member list
  const lastTagStatus = useRef(tagStatus);
  // Retrieve pagination params from the URL
  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams();

  // Retrieve pagination results from the store
  const memberList = useMemberStore(selectMembers);
  const totalItems = useMemberStore(selectCount);

  // Handlers
  const fetchMemberPageGeneric = useCallback(
    async ({
      page,
      pageSize,
      excludedTag,
      includedTag,
    }: {
      page?: number;
      pageSize?: number;
      excludedTag?: string;
      includedTag?: string;
    }) => {
      return _fetchMembers({
        page_size: pageSize ?? DEFAULT_PAGE_SIZE,
        page: page ?? DEFAULT_PAGE,
        exclude_archived: true,
        email_confirmed: true,
        ...(excludedTag ? { tags_excluded: excludedTag } : {}),
        ...(includedTag ? { tags_included: includedTag } : {}),
      });
    },
    [],
  );

  const [{ isLoading }, fetchMemberPage] = useAsync<
    typeof fetchMemberPageGeneric
  >({
    asyncFn: fetchMemberPageGeneric,
    dependencies: [fetchMemberPageGeneric],
    onFailure: console.error,
  });

  const fetchMemberCurrentPage = useCallback(
    async ({ tagId, tagged }: { tagId: number; tagged: boolean }) => {
      const stringifiedTagId = tagId.toString();
      const params = {
        page: currentPage,
        pageSize: currentPageSize,
        includedTag: tagged ? stringifiedTagId : undefined,
        excludedTag: !tagged ? stringifiedTagId : undefined,
      };
      return fetchMemberPage(params);
    },
    [currentPage, currentPageSize, fetchMemberPage],
  );

  const resetMemberList = useCallback(
    async ({ tagId, tagged }: { tagId: number; tagged: boolean }) => {
      const stringifiedTagId = tagId.toString();
      const params = {
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        includedTag: tagged ? stringifiedTagId : undefined,
        excludedTag: !tagged ? stringifiedTagId : undefined,
      };
      return fetchMemberPage(params);
    },
    [fetchMemberPage],
  );

  useEffect(() => {
    if (lastTagStatus.current !== tagStatus) {
      lastTagStatus.current = tagStatus;
      resetMemberList({ tagId: relatedTagId, tagged: isTagged });
    } else {
      fetchMemberCurrentPage({ tagId: relatedTagId, tagged: isTagged });
    }
  }, [
    resetMemberList,
    fetchMemberCurrentPage,
    relatedTagId,
    isTagged,
    tagStatus,
  ]);

  const paginationParams: PaginationProps = {
    currentPage,
    rowsPerPage: currentPageSize,
    totalItems,
    onPageSettingsChange: setPageSettings,
    showRowsPerPageSelector: false,
  };

  return {
    paginationParams,
    memberList,
    totalItems,
    fetchMemberPage: fetchMemberCurrentPage,
    resetMemberList,
    isLoading,
  };
};
