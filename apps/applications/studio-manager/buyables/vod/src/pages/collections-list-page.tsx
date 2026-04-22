import { type FC, useState } from "react";
import { useNavigate } from "react-router";

import type { Collection } from "@bsport/api-buyables/collection";
import { ErrorFallback, ListLayout } from "@bsport/kaizen-primitive-core";

import { CollectionTable } from "#src/components/collection-table/collection-table";
import { CollectionCreateModal } from "#src/features/collection-create-modal/collection-create-modal";
import { CollectionDeleteModal } from "#src/features/collection-delete-modal/collection-delete-modal";
import { CollectionEditModal } from "#src/features/collection-edit-modal/collection-edit-modal";
import { useCollectionsQuery } from "#src/hooks/api/use-collections-query";
import { useBuildPageTabs } from "#src/hooks/layout/use-build-page-tabs";
import { useDisclosure } from "#src/hooks/use-disclosure";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const CollectionsListPage: FC = () => {
  const { t } = useTranslation(["collections-list", "shared-list"]);
  const navigate = useNavigate();
  const {
    collections,
    isLoading,
    isError,
    error,
    refetch,
    isEmpty,
    paginationProps,
  } = useCollectionsQuery();

  const pageTabs = useBuildPageTabs();

  const {
    isOpen: isCreateModalOpen,
    onClose: closeCreateModal,
    onOpen: openCreateModal,
  } = useDisclosure();

  const {
    isOpen: isEditModalOpen,
    onClose: closeEditModal,
    onOpen: openEditModal,
  } = useDisclosure();

  const [editedCollection, setEditedCollection] = useState<Collection | null>(
    null,
  );

  const [deletedCollectionId, setDeletedCollectionId] = useState<number | null>(
    null,
  );

  const handleEdit = (collection: Collection) => {
    setEditedCollection(collection);
    openEditModal();
  };

  const handleCloseEditModal = () => {
    closeEditModal();
    setEditedCollection(null);
  };

  const errorMessage =
    error instanceof Error && error.message
      ? error.message
      : t("error.description", {
          ns: "collections-list",
        });

  const handleDelete = (collection: Collection) => {
    setDeletedCollectionId(collection.id);
  };

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pageTitle", { ns: "shared-list" })}
        pageTabs={pageTabs}
        callToActionButton={
          <ListLayout.Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            label={t("table.headers.createCollection", {
              ns: "collections-list",
            })}
            onClick={openCreateModal}
          />
        }
      />
      <ListLayout.Content>
        {isError ? (
          <ErrorFallback
            className="mx-auto"
            title={t("error.title", {
              ns: "collections-list",
            })}
            subtitle=""
            description={errorMessage}
            actionProps={{
              label: t("error.retry", {
                ns: "collections-list",
              }),
              onClick: () => {
                void refetch();
              },
            }}
          />
        ) : (
          <CollectionTable
            collections={collections}
            paginationProps={paginationProps}
            isEmpty={isEmpty}
            isLoading={isLoading}
            onCreate={openCreateModal}
            onRowClick={(id) => {
              navigate(URLS.COLLECTION_DETAILS(id));
            }}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </ListLayout.Content>

      <CollectionCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
      />

      {editedCollection && (
        <CollectionEditModal
          collection={editedCollection}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
        />
      )}

      {deletedCollectionId !== null && (
        <CollectionDeleteModal
          collectionId={deletedCollectionId}
          isOpen={!!deletedCollectionId}
          closeModal={() => {
            setDeletedCollectionId(null);
          }}
        />
      )}
    </ListLayout>
  );
};

export default CollectionsListPage;
