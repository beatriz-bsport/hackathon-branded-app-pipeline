import React, { useId, useState } from "react";

import { List, Tabs } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SearchMemberListItem } from "./SearchMemberListItem";
import type { ListItemProps } from "./constants";
import { useFormatMembers } from "./useFormatMembers";
import { useSearchMembers } from "./useSearchMembers";

type SearchMemberListProps = {
  searchInput: string;
  navigate?: (to: string) => void;
};

export const SearchMemberList: React.FC<SearchMemberListProps> = ({
  searchInput,
  navigate,
}) => {
  const { t } = useTranslation("features");
  const [archivedSegment, setArchivedSegment] = useState(false);

  const {
    emptyStateParams,
    loadingParams,
    paginationParams,
    members,
    isShowingList,
  } = useSearchMembers({ searchInput, searchArchived: archivedSegment });

  const formattedMembers = useFormatMembers(members);

  const toastEmailCopied = t(
    "searchMembers.copyToClipboard.toasts.emailCopied",
  );
  const toastPhoneCopied = t(
    "searchMembers.copyToClipboard.toasts.phoneNumberCopied",
  );
  const tagsTooltip = t("searchMembers.tagsTooltip");

  return (
    <div className="min-h-[400px] flex flex-col justify-center flex-1 mt-md">
      {isShowingList && (
        /**@todo Replace by segmented control when implemented */
        <Tabs
          orientation="horizontal"
          tabs={[
            {
              id: "segment-active",
              label: t("searchMembers.segments.active"),
              isActive: !archivedSegment,
              onClick: () => setArchivedSegment(false),
            },
            {
              id: "segment-archived",
              label: t("searchMembers.segments.archived"),
              isActive: archivedSegment,
              onClick: () => setArchivedSegment(true),
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
          toastEmailCopied,
          toastPhoneCopied,
          tagsTooltip,
        }))}
        emptyStateProps={emptyStateParams}
        loadingProps={loadingParams}
        paginationProps={paginationParams}
      />
    </div>
  );
};
