import { ListLayout } from "@bsport/kaizen-primitive-core";

import { CreateEditTagGroupModal } from "#src/components/Modal/CreateEditTagGroupModal";
import { CreateEditTagModal } from "#src/components/Modal/CreateEditTagModal";
import { DeleteTagGroupModal } from "#src/components/Modal/DeleteTagGroupModal";
import { DeleteTagModal } from "#src/components/Modal/DeleteTagModal";
import { TagsPageContent } from "#src/components/TagsPageContent";
import { TagsPageProvider, useTagContext } from "#src/context/useTagContext";
import { useFetchTag } from "#src/hooks/api/use-fetch-tags";
import { usePageLayout } from "#src/hooks/layout/use-page-layout";
import { useTranslation } from "#src/utils/i18n";

const TagsComponent: React.FC = () => {
  const {
    pageCurrentAction,
    selectedTagGroup,
    selectedTag,
    preselectedTagGroupId,
    handleCreateTagGroup,
    handleCreateTag,
    handleUnselectAction: handleCloseModal,
  } = useTagContext();
  const { t } = useTranslation("tags");
  const {
    tagGroups,
    tagsMappedByTagId,
    tagUsagesMap,
    fetchAllTagsInformation,
    fetchTagGroups,
  } = useFetchTag();

  const { pageActions } = usePageLayout({
    handleCreateTagGroup: handleCreateTagGroup,
    handleCreateTag: handleCreateTag,
  });

  return (
    <>
      <ListLayout>
        <ListLayout.Header
          pageTitle={t("page.title")}
          endGroupActions={pageActions}
        />
        <ListLayout.Content>
          <TagsPageContent
            tagsMappedByTagId={tagsMappedByTagId}
            tagUsagesMap={tagUsagesMap}
            tagGroups={tagGroups}
          />
        </ListLayout.Content>
      </ListLayout>
      {pageCurrentAction === "create-tag-group" ||
      pageCurrentAction === "edit-tag-group" ? (
        <CreateEditTagGroupModal
          isOpen={true}
          onClose={handleCloseModal}
          tagGroupDraft={selectedTagGroup}
          onSuccess={() => {
            fetchTagGroups();
          }}
        />
      ) : null}
      {pageCurrentAction === "create-tag" ||
      pageCurrentAction === "edit-tag" ? (
        <CreateEditTagModal
          isOpen={true}
          onClose={handleCloseModal}
          tagDraft={selectedTag}
          tagGroupList={tagGroups}
          preselectedTagGroupId={preselectedTagGroupId}
          onSuccess={() => {
            fetchAllTagsInformation();
          }}
        />
      ) : null}
      {pageCurrentAction === "delete-tag-group" && selectedTagGroup ? (
        <DeleteTagGroupModal
          isOpen={true}
          onClose={handleCloseModal}
          tagGroupToDelete={selectedTagGroup}
          tagsMap={tagsMappedByTagId}
          tagUsagesMap={tagUsagesMap}
          onSuccess={() => {
            fetchAllTagsInformation();
          }}
        />
      ) : null}
      {pageCurrentAction === "delete-tag" && selectedTag ? (
        <DeleteTagModal
          isOpen={true}
          onClose={handleCloseModal}
          tagToDelete={selectedTag}
          tagUsage={tagUsagesMap[selectedTag.id]}
          onSuccess={() => {
            fetchAllTagsInformation();
          }}
        />
      ) : null}
    </>
  );
};

const TagsPage: React.FC = () => {
  return (
    <TagsPageProvider>
      <TagsComponent />
    </TagsPageProvider>
  );
};

export default TagsPage;
