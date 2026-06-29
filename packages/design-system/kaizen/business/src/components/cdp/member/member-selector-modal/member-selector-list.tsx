import React, { useId } from "react";

import type { Member } from "@bsport/api-cdp/member";
import { List } from "@bsport/kaizen-primitive-core";
import type { Fetch } from "@bsport/store-base";

import { useSearchMembers } from "#src/components/cdp/member/hooks/use-search-members";

import { getMemberListItems } from "./member-list-items";

type MemberSelectorListTexts = {
  emptyState: string;
  emptySearch: string;
  loading: string;
};

type MemberSelectorListProps = {
  fetch: Fetch<Member[]>;
  searchInput: string;
  onSelect: (member: Member) => void;
  onOpenProfile: (memberId: number) => void;
  texts: MemberSelectorListTexts;
  selectedMemberId?: number;
};

export const MemberSelectorList: React.FC<MemberSelectorListProps> = ({
  fetch,
  searchInput,
  onSelect,
  onOpenProfile,
  texts,
  selectedMemberId,
}) => {
  const listId = useId();

  const { isLoading, hasSearchResultEmpty, hasSearchResult, members } =
    useSearchMembers({
      fetch,
      searchInput,
      searchArchived: false,
    });

  const items = getMemberListItems({
    members,
    onSelect,
    onOpenProfile,
    selectedMemberId,
  });

  const isEmpty = !hasSearchResult && searchInput.trim().length === 0;

  return (
    <div className="h-[400px] overflow-y-auto">
      <List
        id={`member-selector-list-${listId}`}
        items={items}
        emptyStateProps={{
          isEmpty: isEmpty,
          emptyConfig: {
            title: "",
            subtitle: texts.emptyState,
          },
          isEmptySearch: hasSearchResultEmpty,
          emptySearchConfig: {
            title: "",
            subtitle: texts.emptySearch,
          },
        }}
        loadingProps={{
          isLoading: isLoading,
          message: texts.loading,
        }}
        className="h-full"
      />
    </div>
  );
};
