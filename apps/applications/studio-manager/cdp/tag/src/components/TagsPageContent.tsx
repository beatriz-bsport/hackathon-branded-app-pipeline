import { List } from "@bsport/kaizen-primitive-core";
import type { Tag, TagGroup, TagUsage } from "@bsport/store-cdp-tag";

import { useTagContext } from "#src/context/useTagContext";
import { usePageLayout } from "#src/hooks/layout/use-page-layout";
import { useTagListFactory } from "#src/hooks/layout/use-tag-list-factory";

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
    handleCreateTagGroup,
    handleEditTagGroup,
    handleCreateTag,
    handleEditTag,
    handleDeleteTagGroup,
    handleDeleteTag,
  } = useTagContext();
  const { emptyPageState, getEmptyListState } = usePageLayout({
    handleCreateTagGroup,
    handleCreateTag,
  });
  const { formatListItemsByMainTag, formatTagGroupInListHeader } =
    useTagListFactory({
      handleEditTagGroup,
      handleCreateTag,
      handleEditTag,
      handleDeleteTag,
      handleDeleteTagGroup,
    });

  return (
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
            message: "Loading tags...",
          }}
          emptyStateProps={{
            emptyConfig: emptyPageState,
            isEmpty: tagGroups?.length === 0,
          }}
        />
      )}
    </div>
  );
};
