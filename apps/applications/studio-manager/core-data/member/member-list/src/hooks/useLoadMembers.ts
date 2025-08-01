import { useEffect } from "react";

import type { PaginationProps } from "@bsport/kaizen-primitive-core";
import {
  selectCount,
  selectMembers,
  selectSearchMembers,
  useMemberStore,
} from "@bsport/store-core-data-member";

import { useFetchMembers } from "./useFetchMembers";
import type { FilterParams } from "./useFilterMembers";
import { useSearchMembers } from "./useSearchMembers";

export const useLoadMembers = ({
  archived,
  searchInput,
  activeFilters,
}: {
  archived: boolean;
  searchInput: string;
  activeFilters?: FilterParams;
}) => {
  const { isSearching, searchMembers, searchPaginationParams } =
    useSearchMembers({
      searchInput,
      archived,
    });

  const { isFetching, fetchMemberPage, fetchPaginationParams } =
    useFetchMembers({
      activeFilters,
      archived,
    });

  // ----- Retrieve data from the store -----

  const searchedMembers = useMemberStore((state) =>
    selectSearchMembers(state, archived),
  );
  const currentPageMembers = useMemberStore(selectMembers);
  const count = useMemberStore(selectCount);

  const paginationParams: PaginationProps = {
    ...(searchInput ? searchPaginationParams : fetchPaginationParams),
    totalItems: searchInput ? searchedMembers.length : count,
  };

  // ----- Load data on change -----

  useEffect(() => {
    fetchMemberPage();
  }, [fetchMemberPage]);

  useEffect(() => {
    searchMembers();
  }, [searchMembers]);

  return {
    isLoading: isSearching || isFetching,
    paginationParams,
    fetchMemberPage,
    memberList: searchInput ? searchedMembers : currentPageMembers,
  };
};
