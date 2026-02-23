import React, { useId } from "react";

import type { Member } from "@bsport/api-cdp";
import { List } from "@bsport/kaizen-primitive-core";
import type { Fetch } from "@bsport/store-base";

import { useSearchMembers } from "#src/components/cdp/member/hooks/use-search-members";
import { i18nInstance, useTranslation } from "#src/i18n";

import { getMemberListItems } from "./member-list-items";

type MemberSelectorListProps = {
  fetch: Fetch<Member[]>;
  searchInput: string;
  onSelect: (member: Member) => void;
  onOpenProfile: (memberId: number) => void;
  selectedMemberId?: number;
};

export const MemberSelectorList: React.FC<MemberSelectorListProps> = ({
  fetch,
  searchInput,
  onSelect,
  onOpenProfile,
  selectedMemberId,
}) => {
  const { t } = useTranslation("cdp", { i18n: i18nInstance });

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
            subtitle: t("memberSelectorModal.emptyState"),
          },
          isEmptySearch: hasSearchResultEmpty,
          emptySearchConfig: {
            title: "",
            subtitle: t("memberSelectorModal.emptySearch"),
          },
        }}
        loadingProps={{
          isLoading: isLoading,
          message: t("memberSelectorModal.loading"),
        }}
        className="h-full"
      />
    </div>
  );
};
