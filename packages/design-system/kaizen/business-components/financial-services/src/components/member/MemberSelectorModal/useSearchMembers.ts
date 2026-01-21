import { useEffect, useState } from "react";

import { useAsync } from "@bsport/use-async";

import { searchMembersAction } from "#src/actions/member";
import type { Member } from "#src/types/member";
import fetch from "#src/utils/fetch";

const MEMBERS_SEARCH_COUNT = 20;

export const useSearchMembers = ({
  searchInput,
  searchArchived = false,
}: {
  searchInput: string;
  searchArchived?: boolean;
}) => {
  const [members, setMembers] = useState<Member[]>([]);

  const handleSearchMembers = async ({
    searchInput: input,
    searchArchived: archived,
  }: {
    searchInput: string;
    searchArchived: boolean;
  }) => {
    return searchMembersAction(fetch, {
      text: input,
      count: MEMBERS_SEARCH_COUNT,
      params: archived ? { only_archived: true } : { hide_archived: true },
    });
  };

  const [{ isLoading, error }, searchMembers] = useAsync<
    typeof handleSearchMembers
  >({
    asyncFn: handleSearchMembers,
    onSuccess: ({ value }) => {
      setMembers(value);
    },
  });

  useEffect(() => {
    if (searchInput.trim()) {
      searchMembers({ searchInput, searchArchived });
    } else {
      setMembers([]);
    }
  }, [searchInput, searchArchived, searchMembers]);

  return {
    isLoading,
    error,
    hasSearchResultEmpty:
      !isLoading && searchInput.trim().length > 0 && members.length === 0,
    hasSearchResult:
      !isLoading && searchInput.trim().length > 0 && members.length > 0,
    members,
  };
};
