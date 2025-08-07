import { useMemo } from "react";

import {
  List,
  type PaginationProps,
  toast,
} from "@bsport/kaizen-primitive-core";
import type { Tag } from "@bsport/store-cdp-tag";
import type { Member } from "@bsport/store-core-data-member";

import { useFetchTag } from "#src/hooks/api/use-fetch-tags";
import { useUpdateMemberTag } from "#src/hooks/api/use-update-member-tag";
import { useMemberListFactory } from "#src/hooks/layout/use-member-list-factory";
import { useTranslation } from "#src/utils/i18n";

type TagMemberListProps = {
  isLoading: boolean;
  memberList: Member[];
  paginationParams: PaginationProps;
  selectedOption: string;
  tag: Tag;
  refreshMemberPage?: ({
    tagId,
    tagged,
  }: {
    tagId: number;
    tagged: boolean;
  }) => void;
};

export const TagMemberList: React.FC<TagMemberListProps> = ({
  isLoading,
  memberList,
  paginationParams,
  selectedOption,
  tag,
  refreshMemberPage,
}: TagMemberListProps) => {
  const { fetchTagUsages } = useFetchTag();

  const { t } = useTranslation("tags");
  const { untagMember, tagMember } = useUpdateMemberTag({
    onTagSuccess: () => {
      toast({
        title: t("tagsDetails.memberList.actions.tag.success.title"),
        status: "default",
        icon: "plus",
        buttonIcon: "x-close",
      });
      fetchTagUsages();
      refreshMemberPage?.({
        tagId: tag.id,
        tagged: false,
      });
    },
    onUntagSuccess: () => {
      toast({
        title: t("tagsDetails.memberList.actions.untag.success.title"),
        status: "default",
        icon: "x-close",
        buttonIcon: "x-close",
      });
      fetchTagUsages();
      refreshMemberPage?.({
        tagId: tag.id,
        tagged: true,
      });
    },
    onTagFailure: () => {
      toast({
        title: t("tagsDetails.memberList.actions.tag.failure.title"),
        status: "critical",
        icon: "alert-circle",
        buttonIcon: "x-close",
      });
    },
    onUntagFailure: () => {
      toast({
        title: t("tagsDetails.memberList.actions.untag.failure.title"),
        status: "critical",
        icon: "alert-circle",
        buttonIcon: "x-close",
      });
    },
  });

  const { formatMemberList } = useMemberListFactory({
    handleTagMember: ({ memberId, tagId }) => {
      tagMember({ memberId, tagId });
    },
    handleUntagMember: ({ memberId, tagId }) => {
      untagMember({ memberId, tagId });
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
          },
        }}
        items={memberListItems}
      />
    </div>
  );
};
