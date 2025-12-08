import React, { useId, useState } from "react";

import { List, SegmentedControl } from "@bsport/kaizen-primitive-core";
import {
  selectSearchedMembers,
  useMemberStore,
} from "@bsport/store-core-data-member";

import { useTranslation } from "#src/utils/i18n";

import type { TagsMap } from "./constants";
import { useSearchMemberListItems } from "./useSearchMemberListItems";
import { useSearchMembers } from "./useSearchMembers";

type SearchMemberListProps = {
  searchInput: string;
  navigate: (to: string) => void;
  tagsMap: TagsMap;
  isMobile?: boolean;
};

export const SearchMemberList: React.FC<SearchMemberListProps> = ({
  searchInput,
  navigate,
  tagsMap,
  isMobile = false,
}) => {
  const { t } = useTranslation("features");
  const [activeSegment, setActiveSegment] = useState<string>("segment-active");

  const searchedMembers = useMemberStore(selectSearchedMembers);
  const hasSearchHistoryEmpty =
    searchedMembers.length === 0 && searchInput.trim().length === 0;

  const { isLoading, members, hasSearchResult, hasSearchResultEmpty } =
    useSearchMembers({
      searchInput,
      searchArchived: activeSegment === "segment-archived",
    });

  const displayedMembers = hasSearchResult
    ? members
    : [...searchedMembers].reverse();

  const items = useSearchMemberListItems({
    members: displayedMembers,
    isMobile,
    tagsMap,
    navigate,
  });

  return (
    <div className="mt-sm">
      <SegmentedControl
        id="member-search-archive-active-control"
        options={[
          {
            value: "segment-active",
            label: t("searchMembers.segments.active"),
          },
          {
            value: "segment-archived",
            label: t("searchMembers.segments.archived"),
          },
        ]}
        onChangeValue={(value: string) => {
          setActiveSegment(value);
        }}
        value={activeSegment}
      />
      <div className="h-[400px] overflow-y-scroll hide-scrollbar min-h-0">
        <List
          id={useId()}
          items={items}
          emptyStateProps={{
            /**
             * We want to show empty search state only when
             * - there is an active search input but no results have been retrieved
             * - there isn't an active search input and there is no search history
             * still by considering that zustand store is not reset after one search
             */
            isEmptySearch: hasSearchResultEmpty || hasSearchHistoryEmpty,
            emptySearchConfig: {
              title: "", // Avoid default title
              subtitle: t("searchMembers.emptySearch"),
            },
          }}
          loadingProps={{
            isLoading: isLoading,
            message: t("searchMembers.loading"),
          }}
          className="h-full"
        />
      </div>
    </div>
  );
};
