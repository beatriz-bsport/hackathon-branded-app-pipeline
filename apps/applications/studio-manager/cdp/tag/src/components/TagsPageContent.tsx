import { DetailDrawer, List } from "@bsport/kaizen-primitive-core";
import type { Tag, TagGroup, TagUsage } from "@bsport/store-cdp-tag";

import { TagDetails } from "#src/components/Tag/TagDetails";
import { useTagContext } from "#src/context/useTagContext";
import { useNavigateTagDetails } from "#src/hooks/actions/use-navigate-tag-details";
import { useDrawerQueryParam } from "#src/hooks/actions/use-query-param-management";
import { usePageLayout } from "#src/hooks/layout/use-page-layout";
import { useTagListFactory } from "#src/hooks/layout/use-tag-list-factory";
import { useTranslation } from "#src/utils/i18n";

type TagsPageContentProps = {
  tagsMappedByTagId: Record<number, Tag>;
  tagUsagesMap: Record<number, TagUsage>;
  tagGroups: TagGroup[];
};

export const TagsPageContent = ({
  tagsMappedByTagId,
  tagUsagesMap,
  tagGroups,
}: TagsPageContentProps) => {
  const {
    handleCreateTag,
    handleDeleteTag,
    handleDeleteTagGroup,
    handleEditTagGroup,
    handleCreateTagGroup,
  } = useTagContext();
  const { t } = useTranslation("tags");
  const { openId, openDrawer, closeDrawer } = useDrawerQueryParam();
  const {
    currentInspectedTag,
    setCurrentInspectedTag,
    navigateToNextTag,
    navigateToPreviousTag,
  } = useNavigateTagDetails({
    tagGroups,
    tagsMappedByTagId,
    baseTagId: openId ? parseInt(openId, 10) : undefined,
  });
  const { emptyPageState, getEmptyListState } = usePageLayout({
    handleCreateTagGroup,
    handleCreateTag,
  });
  const { formatListItemsByMainTag, formatTagGroupInListHeader } =
    useTagListFactory({
      handleCreateTag,
      handleDeleteTag,
      handleDeleteTagGroup,
      handleEditTagGroup,
      handleClickTag: (tag) => {
        setCurrentInspectedTag(tag);
        openDrawer(tag.id);
      },
      currentSelectedTag: currentInspectedTag,
    });

  return (
    <div>
      <div className="h-full">
        {tagGroups?.length > 0 ? (
          tagGroups.filter(Boolean).map((group) => {
            const listHeader = formatTagGroupInListHeader({
              group,
            });
            const listItems = formatListItemsByMainTag({
              tagsMapByGroupId: tagsMappedByTagId,
              tagUsagesMap,
              groupTags: group.tags,
            });
            const emptyListState = getEmptyListState(group.id);
            return (
              <List
                key={group.id}
                id={listHeader.id}
                header={listHeader}
                collapsibleProps={{
                  initiallyOpen: true,
                }}
                items={listItems}
                emptyStateProps={{
                  emptyConfig: emptyListState,
                  isEmpty: listItems.length === 0,
                }}
              />
            );
          })
        ) : (
          <List
            className="h-full"
            id="main-tag-list-empty"
            items={[]}
            loadingProps={{
              isLoading: !tagGroups && !tagsMappedByTagId && !tagUsagesMap,
              message: t("page.loadingState.message"),
            }}
            emptyStateProps={{
              emptyConfig: emptyPageState,
              isEmpty: tagGroups?.length === 0,
            }}
          />
        )}
      </div>
      <DetailDrawer
        id="tag-details-drawer"
        isOpen={!!currentInspectedTag}
        onClose={() => {
          setCurrentInspectedTag(null);
          closeDrawer();
        }}
        actionsConfig={[
          {
            id: "next-tag-details",
            iconLeft: "chevron-down",
            intent: "default",
            size: "md",
            color: "main",
            onClick: navigateToNextTag,
            tooltipProps: {
              label: t("tagsDetails.tooltip.nextSubTag"),
              placement: "bottom-right",
            },
          },
          {
            id: "previous-tag-details",
            iconLeft: "chevron-up",
            intent: "default",
            size: "md",
            color: "main",
            onClick: navigateToPreviousTag,
            tooltipProps: {
              label: t("tagsDetails.tooltip.previousSubTag"),
              placement: "bottom-right",
            },
          },
        ]}
      >
        <TagDetails tag={currentInspectedTag} />
      </DetailDrawer>
    </div>
  );
};
