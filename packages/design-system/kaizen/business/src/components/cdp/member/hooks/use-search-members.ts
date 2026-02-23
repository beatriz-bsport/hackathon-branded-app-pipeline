import { queryOptions, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { type Member, searchMembersAPI } from "@bsport/api-cdp";
import type { Fetch } from "@bsport/store-base";
import { useDebounce } from "@bsport/use-debounce";

const MEMBERS_SEARCH_COUNT = 20;
const MEMBERS_SEARCH_STALE_TIME = 30 * 1000; // 30 seconds
const MEMBERS_SEARCH_DEBOUNCE_TIME = 300; // 300ms

const searchMembersQueryOptions = (
  fetch: Fetch<Member[]>,
  text: string,
  searchArchived: boolean,
) => {
  const searchMembers = searchMembersAPI.bind(null, fetch);

  return queryOptions({
    queryKey: ["members", "search", text, searchArchived],
    queryFn: () =>
      searchMembers({
        text,
        count: MEMBERS_SEARCH_COUNT,
        params: searchArchived
          ? { only_archived: true }
          : { hide_archived: true },
      }),
    staleTime: MEMBERS_SEARCH_STALE_TIME,
    enabled: text.trim().length > 0,
  });
};

export const useSearchMembers = ({
  fetch,
  searchInput,
  searchArchived = false,
}: {
  fetch: Fetch<Member[]>;
  searchInput: string;
  searchArchived?: boolean;
}) => {
  const [debouncedSearchInput, setDebouncedSearchInput] = useState("");
  const debouncedSetValue = useDebounce(
    setDebouncedSearchInput,
    MEMBERS_SEARCH_DEBOUNCE_TIME,
  );

  useEffect(() => {
    debouncedSetValue(searchInput.trim());
  }, [searchInput, debouncedSetValue]);

  const query = useQuery({
    ...searchMembersQueryOptions(fetch, debouncedSearchInput, searchArchived),
  });

  const members = query.data ?? [];
  const isLoading = query.isLoading;
  const hasSearchResultEmpty =
    !isLoading && debouncedSearchInput.length > 0 && members.length === 0;
  const hasSearchResult =
    !isLoading && debouncedSearchInput.length > 0 && members.length > 0;

  return {
    isLoading,
    error: query.error,
    hasSearchResultEmpty,
    hasSearchResult,
    members,
  };
};
