import React, { useId } from "react";

import { List } from "@bsport/kaizen-primitive-core";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";
import type { Member } from "#src/types/member";

import { useMemberListItems } from "./useMemberListItems";
import { useSearchMembers } from "./useSearchMembers";

type MemberSelectorListProps = {
  searchInput: string;
  onSelect: (member: Member) => void;
  onOpenProfile: (memberId: number) => void;
  selectedMemberId?: number;
};

export const MemberSelectorList: React.FC<MemberSelectorListProps> = ({
  searchInput,
  onSelect,
  onOpenProfile,
  selectedMemberId,
}) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  const { isLoading, hasSearchResultEmpty, hasSearchResult, members } =
    useSearchMembers({
      searchInput,
      searchArchived: false,
    });

  const items = useMemberListItems({
    members,
    onSelect,
    onOpenProfile,
    selectedMemberId,
  });

  const isEmpty = !hasSearchResult && searchInput.trim().length === 0;

  return (
    <div className="h-[400px] overflow-y-auto">
      <List
        id={useId()}
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
