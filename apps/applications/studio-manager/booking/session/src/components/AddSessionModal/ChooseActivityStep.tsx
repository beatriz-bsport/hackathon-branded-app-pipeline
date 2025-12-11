import { useState } from "react";

import type { MetaActivity } from "@bsport/api-book";
import { Body, Table, TextField } from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { useRefinedGroupActivities } from "#src/hooks/useRefinedGroupActivities";
import { useSessionActivityColumns } from "#src/hooks/useSessionActivityColumns";
import { useTranslation } from "#src/utils/i18n";

export const ChooseActivityStep = () => {
  const { t } = useTranslation("sessionCreation");

  const [searchQuery, setSearchQuery] = useState("");

  const columns = useSessionActivityColumns();

  const { isLoading, paginationProps, groupedActivities } =
    useRefinedGroupActivities({
      searchQuery,
    });

  const setSearchQueryDebounced = useDebounce(setSearchQuery);

  const clearSearchQuery = () => {
    setSearchQueryDebounced("");
  };

  return (
    <div className="flex flex-col gap-lg w-full">
      <Body>{t("addSessionModal.steps.chooseActivity.description")}</Body>
      <TextField
        id="search-activity-input"
        iconLeft="search-refraction"
        fullWidth
        placeholder={t(
          "addSessionModal.steps.chooseActivity.search.placeholder",
        )}
        type="search"
        onChange={(e) => setSearchQueryDebounced(e.target.value)}
        onClear={clearSearchQuery}
      />
      <Table<MetaActivity>
        id="group-activities-table"
        rowHeight="lg"
        loadingProps={{
          isLoading,
          message: t("addSessionModal.steps.chooseActivity.loadingActivities"),
        }}
        columns={columns}
        emptyStateProps={{
          isEmpty: !paginationProps.totalItems,
          emptyConfig: {
            title: t(
              "addSessionModal.steps.chooseActivity.table.emptyState.title",
            ),
          },
        }}
        paginationProps={paginationProps}
        rows={groupedActivities}
      />
    </div>
  );
};
