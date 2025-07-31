import type {
  ActionButton,
  ListItemProps,
} from "@bsport/kaizen-primitive-core";
import type { Member } from "@bsport/store-core-data-member";

import { useTranslation } from "#src/utils/i18n";

type Props = {
  handleTagMember?: ({
    memberId,
    tagId,
  }: {
    memberId: number;
    tagId: number;
  }) => void;
  handleUntagMember?: ({
    memberId,
    tagId,
  }: {
    memberId: number;
    tagId: number;
  }) => void;
};

export const useMemberListFactory = ({
  handleTagMember,
  handleUntagMember,
}: Props) => {
  const { t } = useTranslation("tags");

  const formatMemberList = ({
    memberList,
    tagId,
    isTagged,
  }: {
    memberList: Member[];
    tagId: number;
    isTagged: boolean;
  }): ListItemProps[] => {
    return memberList.map((member) => {
      const buttonConfig: ActionButton = isTagged
        ? {
            id: `tag-${member.id}`,
            size: "sm",
            intent: "flat",
            color: "default",
            iconLeft: "x-close",
            tooltipProps: {
              label: t("tagsDetails.tooltip.untagMember"),
              placement: "bottom-right",
            },
            onClick: () => {
              handleUntagMember?.({ memberId: member.id, tagId: tagId });
            },
          }
        : {
            id: `untag-${member.id}`,
            size: "sm",
            intent: "flat",
            color: "default",
            iconLeft: "plus",
            tooltipProps: {
              label: t("tagsDetails.tooltip.tagMember"),
              placement: "bottom-right",
            },
            onClick: () => {
              handleTagMember?.({ memberId: member.id, tagId: tagId });
            },
          };

      const memberListItem: ListItemProps = {
        id: `tag-member-${member.id}`,
        avatar: {
          src: member?.photo,
          alt: member.name,
          initials:
            `${member.first_name?.[0] || ""}${member.last_name?.[0] || ""}` ||
            "",
          size: "sm",
          shape: "round",
        },
        title: member.name,
        buttons: [buttonConfig],
      };
      return memberListItem;
    });
  };

  return {
    formatMemberList,
  };
};
