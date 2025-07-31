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
  const count = members.length;

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

  const isEmptySearch = count === 0;

  return {
    isEmptySearch,
    isLoading,
    members: members,
    isShowingList: !isLoading && !isEmptySearch,
  };
};
