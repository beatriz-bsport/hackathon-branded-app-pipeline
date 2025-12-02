import React, { useId, useState } from "react";

import { List, Tabs } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SearchMemberListItem } from "./SearchMemberListItem";
import type { ListItemProps, TagsMap } from "./constants";
import { useFormatMembers } from "./useFormatMembers";
import { useListItemTranslations } from "./useListItemTranslations";
import { useSearchMembers } from "./useSearchMembers";

type SearchMemberListProps = {
  searchInput: string;
  navigate?: (to: string) => void;
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

  const { isEmptySearch, isLoading, members, isShowingList } = useSearchMembers(
    { searchInput, searchArchived: activeSegment === "segment-archived" },
  );

  const formattedMembers = useFormatMembers({ members });

  const translations = useListItemTranslations();

  return (
    <div className="min-h-[400px] flex flex-col justify-center flex-1 mt-md">
      {isShowingList && (
        /**@todo Replace by segmented control when implemented */
        <Tabs
          orientation="horizontal"
          value={activeSegment}
          onValueChange={(value) => setActiveSegment(value)}
          tabs={[
            {
              id: "segment-active",
              label: t("searchMembers.segments.active"),
            },
            {
              id: "segment-archived",
              label: t("searchMembers.segments.archived"),
            },
          ]}
        />
      )}
      <List<ListItemProps>
        id={useId()}
        ListItem={SearchMemberListItem}
        items={formattedMembers.map((member) => ({
          ...member,
          navigate,
          ...translations,
          tagsMap,
          isMobile,
        }))}
        emptyStateProps={{
          // We want to show empty search state only
          isEmptySearch: isEmptySearch,
          emptySearchConfig: {
            title: "", // Avoid default title
            subtitle: t("searchMembers.emptySearch"),
          },
        }}
        loadingProps={{
          isLoading: isLoading,
          message: t("searchMembers.loading"),
          className: "self-center",
        }}
      />
    </div>
  );
};
