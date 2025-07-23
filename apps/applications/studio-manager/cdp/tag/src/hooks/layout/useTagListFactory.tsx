import { ListHeaderProps, ListItemProps } from "@bsport/kaizen-primitive-core";
import { Tag, TagGroup, TagUsage } from "@bsport/store-cdp-tag";

import { useTranslation } from "#src/utils/i18n";

export const useTagListFactory = () => {
  const { t } = useTranslation("tags");

  const formatTagGroupInListHeader = ({ group }: { group: TagGroup }) => {
    const listHeader: ListHeaderProps = {
      id: `main-tag-list-${group.id}`,
      title: group.name,
      dropdownConfig: { visibleActionsDisplayLimit: 0 },
      buttons: [
        {
          id: `list-header-tag-group-${group.id}-add-sub-tag-button`,
          label: t("tagGroupList.actions.addSubTag"),
          iconLeft: "plus",
          intent: "flat",
          size: "md",
          color: "default",
        },
        {
          id: `list-header-tag-group-${group.id}-rename-main-tag-button`,
          label: t("tagGroupList.actions.rename"),
          iconLeft: "edit-05",
          intent: "flat",
          size: "md",
          color: "default",
        },
        {
          id: `list-header-tag-group-${group.id}-delete-main-tag-button`,
          label: t("tagGroupList.actions.delete"),
          iconLeft: "trash-01",
          intent: "flat",
          size: "md",
          color: "default",
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
    const tagList = groupTags.map((_tagId) => tagsMapByGroupId[_tagId]);
    const listItems = tagList.map((tag) => {
      const tagUsageData = tagUsagesMap[tag.id];
      const formattedItem: ListItemProps = {
        id: `list-item-tag-${tag.id}`,
        title: tag.name,
        color: tag.color,
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
            id: `list-item-tag-${tag.id}-delete-button`,
            iconLeft: "trash-01",
            intent: "flat",
            size: "md",
            color: "default",
            tooltipProps: {
              label: t("tagGroupList.items.tooltip.delete"),
              placement: "bottom",
            },
          },
        ],
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
