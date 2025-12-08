import { useEffect } from "react";

import {
  searchMembersAction,
  selectSearchMembers,
  useMemberStore,
} from "@bsport/store-core-data-member";
import { useAsync } from "@bsport/use-async";

import { fetch } from "#src/utils/fetch";

export const useSearchMembers = ({
  searchInput,
  searchArchived,
}: {
  searchInput: string;
  searchArchived: boolean;
}) => {
  // ----- State from Zustand -----

  const members = useMemberStore((state) =>
    selectSearchMembers(state, searchArchived),
  );

  // ----- Fetcher -----
  const handleSearchMembers = async ({
    searchInput,
    searchArchived,
  }: {
    searchInput: string;
    searchArchived: boolean;
  }) => {
    return searchMembersAction(fetch, {
      text: searchInput,
      params: searchArchived
        ? { only_archived: true }
        : { hide_archived: true },
    });
  };

  const [{ isLoading }, searchMembers] = useAsync<typeof handleSearchMembers>({
    asyncFn: handleSearchMembers,
  });

  // ----- Auto data fetching -----

  useEffect(() => {
    if (searchInput.trim()) {
      searchMembers({ searchArchived, searchInput });
    }
  }, [searchInput, searchArchived, searchMembers]);

  return {
    isLoading,
    hasSearchResultEmpty:
      !isLoading && searchInput.trim().length > 0 && members.length === 0,
    hasSearchResult:
      !isLoading && searchInput.trim().length > 0 && members.length > 0,
    members: members,
  };
};
