import { List, ListLayout } from "@bsport/kaizen-primitive-core";

import { useFetchTag } from "#src/hooks/api/use-fetch-tags";
import { usePageLayout } from "#src/hooks/layout/usePageLayout";
import { useTagListFactory } from "#src/hooks/layout/useTagListFactory";
import { useTranslation } from "#src/utils/i18n";

const TagsPage: React.FC = () => {
  const { t } = useTranslation("tags");
  const { tagGroups, tagsMappedByTagId, tagUsagesMap } = useFetchTag();
  const { emptyPageState, emptyListState, pageActions } = usePageLayout({
    onCtaButtonClick: () => {
      console.log("CTA button clicked");
    },
    onSecondaryButtonClick: () => {
      console.log("Secondary button clicked");
    },
  });
  const { formatListItemsByMainTag, formatTagGroupInListHeader } =
    useTagListFactory();

  return (
    <>
      <ListLayout>
        <ListLayout.Header
          pageTitle={t("page.title")}
          endGroupActions={pageActions}
        />
        <ListLayout.Content>
          <div className="h-full">
            {tagGroups?.length > 0 ? (
              tagGroups.map((group) => {
                const listHeader = formatTagGroupInListHeader({
                  group,
                });
                const listItems = formatListItemsByMainTag({
                  tagsMapByGroupId: tagsMappedByTagId,
                  tagUsagesMap,
                  groupTags: group.tags,
                });
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
        </ListLayout.Content>
      </ListLayout>
    </>
  );
};

export default TagsPage;
