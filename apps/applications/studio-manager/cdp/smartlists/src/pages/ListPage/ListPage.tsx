import { useState } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";
import type { Smartlist } from "@bsport/store-cdp-smartlist";

import { useSmartlists } from "#src/api/use-smartlists";
import { CreateSmartlistModal } from "#src/components/CreateSmartlistModal";
import { DeleteSmartlistModal } from "#src/components/DeleteSmartlistModal";
import { DuplicateSmartlistModal } from "#src/components/DuplicateSmartlistModal";
import { EditSmartlistModal } from "#src/components/EditSmartlistModal";
import { SmartlistList } from "#src/components/SmartlistList";
import { useTranslation } from "#src/utils/i18n";

import { useFilters } from "./use-filters";

const ListPage: React.FC = () => {
  const { t } = useTranslation("list");

  const {
    currentPage,
    currentPageSize,
    searchTerm,
    onSearchChange,
    onSearchClear,
    onPageSettingsChange,
  } = useFilters();

  const { smartlists, isLoading, totalItems, refetch } = useSmartlists({
    page: currentPage,
    page_size: currentPageSize,
    search: searchTerm,
  });

  const isEmpty = totalItems === 0 && searchTerm.trim().length === 0;
  const isEmptySearch = searchTerm.trim().length > 0 && smartlists.length === 0;

  const [currentInlineAction, setCurrentInlineAction] = useState<
    "none" | "edit" | "duplicate" | "delete" | "create"
  >("none");
  const [currentSmartlist, setCurrentSmartlist] = useState<Smartlist | null>(
    null,
  );
  const closeModal = () => {
    setCurrentSmartlist(null);
    setCurrentInlineAction("none");
  };

  const handleCreateClick = () => {
    setCurrentInlineAction("create");
  };

  const handleEdit = (smartlist: Smartlist) => {
    setCurrentSmartlist(smartlist);
    setCurrentInlineAction("edit");
  };

  const handleDuplicate = (smartlist: Smartlist) => {
    setCurrentSmartlist(smartlist);
    setCurrentInlineAction("duplicate");
  };

  const handleDelete = (smartlist: Smartlist) => {
    setCurrentSmartlist(smartlist);
    setCurrentInlineAction("delete");
  };

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("title")}
        callToActionButton={
          <ListLayout.Button
            color="main"
            intent="call-to-action"
            label={t("addSmartlist")}
            iconLeft="plus"
            onClick={handleCreateClick}
          />
        }
        searchConfig={{
          id: "smartlists-search",
          inputValue: searchTerm,
          onInputValueChange: onSearchChange,
          onClear: onSearchClear,
          tooltipConfig: {
            label: t("search"),
          },
        }}
      />
      <ListLayout.Content>
        <SmartlistList
          smartlists={smartlists}
          paginationProps={{
            currentPage,
            totalItems,
            rowsPerPage: currentPageSize,
            onPageSettingsChange,
          }}
          loadingProps={{
            isLoading,
          }}
          emptyStateConfig={{
            isEmpty,
            isEmptySearch,
            onSearchClear,
            onCreateClick: handleCreateClick,
          }}
          actions={{
            onEdit: handleEdit,
            onDuplicate: handleDuplicate,
            onDelete: handleDelete,
          }}
        />
        {currentSmartlist !== null && currentInlineAction === "duplicate" ? (
          <DuplicateSmartlistModal
            isOpen
            onClose={closeModal}
            onDuplicate={refetch}
            smartlist={currentSmartlist}
          />
        ) : null}
        {currentSmartlist !== null && currentInlineAction === "edit" ? (
          <EditSmartlistModal
            isOpen
            onClose={closeModal}
            onEdit={refetch}
            onUndo={refetch}
            smartlist={currentSmartlist}
          />
        ) : null}
        {currentInlineAction === "create" ? (
          <CreateSmartlistModal
            isOpen
            onClose={closeModal}
            onCreate={refetch}
          />
        ) : null}
        {currentSmartlist !== null && currentInlineAction === "delete" ? (
          <DeleteSmartlistModal
            isOpen
            onClose={closeModal}
            onDelete={refetch}
            smartlist={currentSmartlist}
          />
        ) : null}
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
