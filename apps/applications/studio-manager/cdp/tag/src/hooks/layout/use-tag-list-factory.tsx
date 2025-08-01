import { ListHeaderProps, ListItemProps } from "@bsport/kaizen-primitive-core";
import { Tag, TagGroup, TagUsage } from "@bsport/store-cdp-tag";

import {
  TAG_GROUP_LIST_HEADER_ADD_SUB_TAG_ACTION_BUTTON_ID,
  TAG_GROUP_LIST_HEADER_DELETE_ACTION_BUTTON_ID,
  TAG_GROUP_LIST_HEADER_EDIT_ACTION_BUTTON_ID,
  TAG_GROUP_LIST_HEADER_ID,
  TAG_LIST_ITEM_DELETE_ACTION_BUTTON_ID,
  TAG_LIST_ITEM_ID,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  handleEditTagGroup?: (tagGroup: TagGroup) => void;
  handleDeleteTagGroup?: (tagGroup: TagGroup) => void;
  handleCreateTag?: (associatedGroupId?: number) => void;
  handleDeleteTag?: (tag: Tag) => void;
  handleClickTag?: (tag: Tag) => void;
  currentSelectedTag?: Tag | null;
};

export const useTagListFactory = ({
  handleCreateTag,
  handleDeleteTag,
  handleDeleteTagGroup,
  handleEditTagGroup,
  handleClickTag,
  currentSelectedTag,
}: Props) => {
  const { t } = useTranslation("tags");

  const formatTagGroupInListHeader = ({ group }: { group: TagGroup }) => {
    const listHeader: ListHeaderProps = {
      id: TAG_GROUP_LIST_HEADER_ID(group.id),
      title: group.name,
      dropdownConfig: { visibleActionsDisplayLimit: 0 },
      buttons: [
        {
          id: TAG_GROUP_LIST_HEADER_EDIT_ACTION_BUTTON_ID(group.id),
          label: t("tagGroupList.actions.addSubTag"),
          iconLeft: "plus",
          intent: "flat",
          size: "md",
          color: "default",
          onClick: () => {
            handleCreateTag?.(group.id);
          },
        },
        {
          id: TAG_GROUP_LIST_HEADER_DELETE_ACTION_BUTTON_ID(group.id),
          label: t("tagGroupList.actions.rename"),
          iconLeft: "edit-05",
          intent: "flat",
          size: "md",
          color: "default",
          onClick: () => {
            handleEditTagGroup?.(group);
          },
        },
        {
          id: TAG_GROUP_LIST_HEADER_ADD_SUB_TAG_ACTION_BUTTON_ID(group.id),
          label: t("tagGroupList.actions.delete"),
          iconLeft: "trash-01",
          intent: "flat",
          size: "md",
          color: "default",
          onClick: () => {
            handleDeleteTagGroup?.(group);
          },
        },
      ],
    };
    return listHeader;
  };

  const formatListItemsByMainTag = ({
    tagsMapByGroupId,
    tagUsagesMap,
    groupTags,
  }: {
    tagsMapByGroupId: Record<number, Tag>;
    tagUsagesMap: Record<number, TagUsage>;
    groupTags: number[];
  }) => {
    const tagList = groupTags
      .map((_tagId) => tagsMapByGroupId[_tagId])
      .filter(Boolean);
    const listItems = tagList.map((tag) => {
      const tagUsageData = tagUsagesMap[tag.id];
      const formattedItem: ListItemProps = {
        id: TAG_LIST_ITEM_ID(tag.id),
        title: tag.name,
        color: tag.color,
        isActive: currentSelectedTag?.id === tag.id,
        chips: [
          {
            label: String(tagUsageData?.member_count),
            iconLeft: "user-01",
            type: "weak",
            size: "lg",
            color: "default",
          },
        ],
        buttons: [
          {
            id: TAG_LIST_ITEM_DELETE_ACTION_BUTTON_ID(tag.id),
            iconLeft: "trash-01",
            intent: "flat",
            size: "md",
            color: "default",
            tooltipProps: {
              label: t("tagGroupList.items.tooltip.delete"),
              placement: "bottom",
            },
            onClick: () => {
              handleDeleteTag?.(tag);
            },
          },
        ],
        onItemClick: () => {
          handleClickTag?.(tag);
        },
      };
      return formattedItem;
    });
    return listItems;
  };

  return {
    formatTagGroupInListHeader,
    formatListItemsByMainTag,
  };
};
