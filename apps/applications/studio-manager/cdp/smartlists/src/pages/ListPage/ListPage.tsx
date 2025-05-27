import { useState } from "react";

import { Button, List, ListLayout } from "@bsport/kaizen-primitive-core";
import type {
  CreateSmartlistParams,
  EditSmartlistParams,
  Smartlist,
} from "@bsport/store-cdp-smartlist";

import { useSmartlists } from "#src/api/use-smartlists";
import { CreateSmartlistModal } from "#src/components/CreateSmartlistModal";
import { DuplicateModal } from "#src/components/DuplicateModal";
import { EditSmartlistModal } from "#src/components/EditSmartlistModal";
import { Loading } from "#src/components/Loading";
import { useTranslation } from "#src/utils/i18n";

import { VISIBLE_ACTIONS_DISPLAY_LIMIT } from "./constants";
import { useCreate } from "./use-create";
import { useDuplicate } from "./use-duplicate";
import { useEdit } from "./use-edit";
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

  const hasNoSmartlists = smartlists.length === 0;
  const isEmpty = hasNoSmartlists && searchTerm.trim().length === 0;
  const isEmptySearch = searchTerm.trim().length > 0 && hasNoSmartlists;

  const [currentInlineAction, setCurrentInlineAction] = useState<
    "none" | "edit" | "duplicate" | "delete" | "create"
  >("none");
  const [currentSmartlist, setCurrentSmartlist] = useState<Smartlist | null>(
    null,
  );
  const resetCurrentSmartlist = () => {
    setCurrentSmartlist(null);
    setCurrentInlineAction("none");
  };

  const { duplicateSmartlist } = useDuplicate({
    onSuccess: () => {
      resetCurrentSmartlist();
      refetch();
    },
    onFailure: () => {
      resetCurrentSmartlist();
    },
  });

  const { createSmartlist, isCreating } = useCreate({
    onSuccess: () => {
      resetCurrentSmartlist();
      refetch();
    },
    onFailure: () => {
      resetCurrentSmartlist();
    },
  });

  const { editSmartlist, isEditing } = useEdit({
    onSuccess: () => {
      resetCurrentSmartlist();
      refetch();
    },
    onFailure: () => {
      resetCurrentSmartlist();
    },
    onUndo: () => {
      resetCurrentSmartlist();
      refetch();
    },
  });

  const onDuplicateSmartlist = () => {
    if (!currentSmartlist) {
      throw new Error("No smartlist selected this should never happen");
    }

    duplicateSmartlist({ id: currentSmartlist.id });
  };

  const onEditSmartlist = (data: EditSmartlistParams) => {
    if (!currentSmartlist) {
      throw new Error("No smartlist selected this should never happen");
    }

    editSmartlist(data, currentSmartlist);
  };

  const onCreateSmartlist = (data: {
    name: string;
    description: string;
    company?: number;
  }) => {
    if (!data.company) {
      throw new Error("No company selected this should never happen");
    }

    const params: CreateSmartlistParams = {
      name: data.name,
      description: data.description,
      company: data.company,
    };
    createSmartlist(params);
  };

  const handleCreateClick = () => {
    setCurrentInlineAction("create");
  };

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("title")}
        callToActionButton={
          <Button
            color="main"
            size="md"
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
      <ListLayout.Content showScrollbar={true}>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="w-full">
            <List
              id="smartlists-list"
              items={smartlists.map((smartlist: Smartlist) => {
                const handleEdit = () => {
                  setCurrentSmartlist(smartlist);
                  setCurrentInlineAction("edit");
                };

                const handleDuplicate = () => {
                  setCurrentSmartlist(smartlist);
                  setCurrentInlineAction("duplicate");
                };

                return {
                  id: smartlist.id.toString(),
                  title: smartlist.name,
                  description: smartlist.description,
                  dropdownConfig: {
                    visibleActionsDisplayLimit: VISIBLE_ACTIONS_DISPLAY_LIMIT,
                  },
                  buttons: [
                    {
                      id: `smartlist-edit-action-${smartlist.id}`,
                      color: "default",
                      size: "md",
                      intent: "flat",
                      iconLeft: "edit-02",
                      "aria-label": t("inlineActions.edit"),
                      tooltipProps: {
                        label: t("inlineActions.edit"),
                        placement: "bottom",
                      },
                      onClick: handleEdit,
                    },
                    {
                      id: `smartlist-copy-action-${smartlist.id}`,
                      color: "default",
                      size: "md",
                      intent: "flat",
                      iconLeft: "copy-03",
                      "aria-label": t("inlineActions.duplicate"),
                      onClick: handleDuplicate,
                      tooltipProps: {
                        label: t("inlineActions.duplicate"),
                        placement: "bottom",
                      },
                    },
                    {
                      id: `smartlist-trash-action-${smartlist.id}`,
                      color: "default",
                      size: "md",
                      intent: "flat",
                      iconLeft: "trash-01",
                      "aria-label": t("inlineActions.delete"),
                      tooltipProps: {
                        label: t("inlineActions.delete"),
                        placement: "bottom-right",
                      },
                    },
                  ],
                };
              })}
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
        )}
        {currentSmartlist !== null && currentInlineAction === "duplicate" ? (
          <DuplicateModal
            isOpen
            onClose={resetCurrentSmartlist}
            onDuplicate={onDuplicateSmartlist}
            smartlist={currentSmartlist}
          />
        ) : null}
        {currentSmartlist !== null && currentInlineAction === "edit" ? (
          <EditSmartlistModal
            isOpen
            onClose={resetCurrentSmartlist}
            onEdit={onEditSmartlist}
            smartlist={currentSmartlist}
            isEditing={isEditing}
          />
        ) : null}
        {currentInlineAction === "create" ? (
          <CreateSmartlistModal
            isOpen
            onClose={resetCurrentSmartlist}
            onCreate={onCreateSmartlist}
            isCreating={isCreating}
          />
        ) : null}
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
