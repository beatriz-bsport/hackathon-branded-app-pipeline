import { useState } from "react";

import { Button, List, ListLayout } from "@bsport/kaizen-primitive-core";
import { type Smartlist } from "@bsport/store-cdp-smartlist";

import { useSmartlists } from "#src/api/use-smartlists";
import { DuplicateModal } from "#src/components/DuplicateModal";
import { Loading } from "#src/components/Loading";
import { useTranslation } from "#src/utils/i18n";

import { VISIBLE_ACTIONS_DISPLAY_LIMIT } from "./constants";
import { useDuplicate } from "./use-duplicate";
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

  const [currentSmartlist, setCurrentSmartlist] = useState<Smartlist | null>(
    null,
  );
  const resetCurrentSmartlist = () => setCurrentSmartlist(null);

  const { duplicateSmartlist } = useDuplicate({
    onSuccess: () => {
      resetCurrentSmartlist();
      refetch();
    },
    onFailure: () => {
      resetCurrentSmartlist();
    },
  });

  const onDuplicateSmartlist = () => {
    if (!currentSmartlist) {
      throw new Error("No smartlist selected this should never happen");
    }

    duplicateSmartlist({ id: currentSmartlist.id });
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
        {isLoading ? (
          <Loading />
        ) : (
          <div className="w-full overflow-x-hidden">
            <List
              id="smartlists-list"
              items={smartlists.map((smartlist: Smartlist) => ({
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
                  },
                  {
                    id: `smartlist-copy-action-${smartlist.id}`,
                    color: "default",
                    size: "md",
                    intent: "flat",
                    iconLeft: "copy-03",
                    "aria-label": t("inlineActions.duplicate"),
                    onClick: () => {
                      setCurrentSmartlist(smartlist);
                    },
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
              }))}
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
        {currentSmartlist !== null ? (
          <DuplicateModal
            isOpen
            onClose={resetCurrentSmartlist}
            onDuplicate={onDuplicateSmartlist}
            smartlist={currentSmartlist}
          />
        ) : null}
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
