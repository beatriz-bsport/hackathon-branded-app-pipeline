import { useMemo } from "react";

import { List, type PaginationProps } from "@bsport/kaizen-primitive-core";
import type { Tag } from "@bsport/store-cdp-tag";
import type { Member } from "@bsport/store-core-data-member";

import { useMemberListFactory } from "#src/hooks/layout/use-member-list-factory";
import { useTranslation } from "#src/utils/i18n";

type TagMemberListProps = {
  isLoading: boolean;
  memberList: Member[];
  paginationParams: PaginationProps;
  selectedOption: string;
  tag: Tag;
};

export const TagMemberList: React.FC<TagMemberListProps> = ({
  isLoading,
  memberList,
  paginationParams,
  selectedOption,
  tag,
}: TagMemberListProps) => {
  const { t } = useTranslation("tags");

  const { formatMemberList } = useMemberListFactory({
    handleTagMember: ({ memberId, tagId }) => {
      // Logic to tag a member
      console.log(`Tagging member ${memberId} with tag ${tagId}`);
    },
    handleUntagMember: ({ memberId, tagId }) => {
      // Logic to untag a member
      console.log(`Untagging member ${memberId} from tag ${tagId}`);
    },
  });

  const memberListItems = useMemo(
    () =>
      formatMemberList({
        memberList,
        tagId: tag.id,
        isTagged: selectedOption === "tagged",
      }),
    [memberList, tag.id, selectedOption, formatMemberList],
  );

  return (
    <div>
      <List
        isCompact
        id="tag-members-list"
        paginationProps={paginationParams}
        loadingProps={{
          isLoading,
          message:
            selectedOption === "tagged"
              ? t("tagsDetails.memberList.loadingState.tagged")
              : t("tagsDetails.memberList.loadingState.untagged"),
        }}
        emptyStateProps={{
          isEmpty: memberListItems.length === 0,
          emptyConfig: {
            title:
              selectedOption === "tagged"
                ? t("tagsDetails.memberList.emptyState.title.tagged")
                : t("tagsDetails.memberList.emptyState.title.untagged"),
            subtitle:
              selectedOption === "tagged"
                ? t("tagsDetails.memberList.emptyState.description.tagged")
                : t("tagsDetails.memberList.emptyState.description.untagged"),
          },
        }}
        items={memberListItems}
      />
    </div>
  );
};
