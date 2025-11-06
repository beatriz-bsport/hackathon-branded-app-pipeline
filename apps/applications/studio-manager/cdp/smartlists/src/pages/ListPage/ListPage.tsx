import { useState } from "react";

import { List, ListLayout } from "@bsport/kaizen-primitive-core";
import type { ListItemProps } from "@bsport/kaizen-primitive-core";
import type { Smartlist } from "@bsport/store-cdp-smartlist";

import { useSmartlists } from "#src/api/use-smartlists";
import { CreateSmartlistModal } from "#src/components/CreateSmartlistModal";
import { DeleteSmartlistModal } from "#src/components/DeleteSmartlistModal";
import { DuplicateSmartlistModal } from "#src/components/DuplicateSmartlistModal";
import { EditSmartlistModal } from "#src/components/EditSmartlistModal";
import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { VISIBLE_ACTIONS_DISPLAY_LIMIT } from "./constants";
import { useFilters } from "./use-filters";

const ListPage: React.FC = () => {
  const { t } = useTranslation("list");

  const {
    currentPage,
    currentPageSize,
    searchTerm,
    onSearchChange,
    onSearchClear,
    onPageChange,
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

  const listItems: ListItemProps[] = smartlists.map((smartlist: Smartlist) => ({
    id: smartlist.id.toString(),
    title: smartlist.name,
    description: smartlist.description,
    dropdownConfig: {
      visibleActionsDisplayLimit: VISIBLE_ACTIONS_DISPLAY_LIMIT,
    },
    onClick: () => {
      window.location.assign(LEGACY_URLS.SMARTLIST_MEMBER(smartlist.id));
    },
    buttons: [
      {
        id: `smartlist-edit-action-${smartlist.id}`,
        kind: "icon-button",
        icon: "edit-02",
        label: t("inlineActions.edit"),
        size: "md",
        intent: "flat",
        color: "default",
        tooltipProps: {
          label: t("inlineActions.edit"),
          placement: "bottom",
        },
        onClick: () => handleEdit(smartlist),
      },
      {
        id: `smartlist-copy-action-${smartlist.id}`,
        kind: "icon-button",
        icon: "copy-03",
        label: t("inlineActions.duplicate"),
        size: "md",
        intent: "flat",
        color: "default",
        tooltipProps: {
          label: t("inlineActions.duplicate"),
          placement: "bottom",
        },
        onClick: () => handleDuplicate(smartlist),
      },
      {
        id: `smartlist-trash-action-${smartlist.id}`,
        kind: "icon-button",
        icon: "trash-01",
        label: t("inlineActions.delete"),
        size: "md",
        intent: "flat",
        color: "default",
        tooltipProps: {
          label: t("inlineActions.delete"),
          placement: "bottom-right",
        },
        onClick: () => handleDelete(smartlist),
      },
    ],
  }));

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
        }}
      />
      <ListLayout.Content>
        <div className="w-full h-full">
          <List
            id="smartlists-list"
            loadingProps={{
              isLoading,
              message: t("loading"),
            }}
            items={listItems}
            paginationProps={{
              currentPage,
              totalItems,
              onPageChange,
              onPageSettingsChange,
              rowsPerPage: currentPageSize,
              showRowsPerPageSelector: true,
            }}
            emptyStateProps={{
              emptyConfig: {
                ctaButtonConfig: {
                  iconLeft: "plus",
                  label: t("addSmartlist"),
                  color: "main",
                  size: "md",
                  intent: "call-to-action",
                  onClick: handleCreateClick,
                },
                subtitle: t("emptyState.subtitle"),
                title: t("emptyState.title"),
              },
              emptySearchConfig: {
                secondaryButtonConfig: {
                  iconLeft: "x",
                  label: t("emptySearch.clearFilters"),
                  color: "default",
                  size: "md",
                  intent: "flat",
                  onClick: onSearchClear,
                },
                subtitle: t("emptySearch.subtitle"),
                title: t("emptySearch.title"),
              },
              isEmpty,
              isEmptySearch,
            }}
          />
        </div>
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
