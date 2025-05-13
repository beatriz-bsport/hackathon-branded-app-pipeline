import { useState } from "react";

import { Button, List, ListLayout } from "@bsport/kaizen-primitive-core";
import { type Smartlist } from "@bsport/store-cdp-smartlist";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { Loading } from "#src/components/Loading";
import { useTranslation } from "#src/utils/i18n";

import { DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE } from "./constants";
import { useSmartlists } from "./use-smartlists";

const ListPage: React.FC = () => {
  const { t } = useTranslation("list");

  const { currentPage, currentPageSize, setPageSettings } =
    usePaginationQueryParams({
      defaultValues: { page: DEFAULT_PAGE, page_size: DEFAULT_ROWS_PER_PAGE },
      shouldReplace: false,
    });

  const [searchTerm, setSearchTerm] = useState("");

  const { smartlists, isLoading, totalItems } = useSmartlists({
    page: currentPage,
    page_size: currentPageSize,
    search: searchTerm,
  });

  const hasNoSmartlists = smartlists.length === 0;
  const isEmpty = hasNoSmartlists && searchTerm.trim().length === 0;
  const isEmptySearch = searchTerm.trim().length > 0 && hasNoSmartlists;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPageSettings(DEFAULT_PAGE, currentPageSize);
  };

  const handleSearchClear = () => {
    handleSearchChange("");
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
          />
        }
        searchConfig={{
          id: "smartlists-search",
          inputValue: searchTerm,
          onInputValueChange: handleSearchChange,
          onClear: handleSearchClear,
        }}
      />
      <ListLayout.Content>
        {isLoading ? (
          <Loading />
        ) : (
          <List
            id="smartlists-list"
            className="w-full"
            items={smartlists.map((smartlist: Smartlist) => ({
              id: smartlist.id.toString(),
              title: smartlist.name,
              buttons: [
                {
                  id: `smartlist-edit-action-${smartlist.id}`,
                  color: "default",
                  size: "md",
                  intent: "flat",
                  iconLeft: "edit-02",
                },
                {
                  id: `smartlist-copy-action-${smartlist.id}`,
                  color: "default",
                  size: "md",
                  intent: "flat",
                  iconLeft: "copy-03",
                },
                {
                  id: `smartlist-trash-action-${smartlist.id}`,
                  color: "default",
                  size: "md",
                  intent: "flat",
                  iconLeft: "trash-01",
                },
              ],
            }))}
            paginationProps={{
              currentPage,
              totalItems,
              rowsPerPage: currentPageSize,
              onPageChange: (page: number) =>
                setPageSettings(page, currentPageSize),
              onPageSettingsChange: setPageSettings,
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
                  onClick: handleSearchClear,
                },
                subtitle: t("emptySearch.subtitle"),
                title: t("emptySearch.title"),
              },
              isEmpty,
              isEmptySearch,
            }}
          />
        )}
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
