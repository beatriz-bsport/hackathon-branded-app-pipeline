import { useState } from "react";

import { Body, Table, TextField } from "@bsport/kaizen-primitive-core";
import type { MetaActivity } from "@bsport/store-booking-group-activity";
import { useDebounce } from "@bsport/use-debounce";

import { useFetchGroupActivities } from "#src/hooks/useFetchGroupActivities";
import { useRefinedGroupActivities } from "#src/hooks/useRefinedGroupActivities";
import { useSessionActivityColumns } from "#src/hooks/useSessionActivityColumns";
import { useTranslation } from "#src/utils/i18n";

export const ChooseActivityStep = () => {
  const { t } = useTranslation("sessionCreation");

  const [searchQuery, setSearchQuery] = useState("");

  const columns = useSessionActivityColumns();

  const renderedGroupActivities = useRefinedGroupActivities({
    searchQuery,
  });

  const { isLoading, paginationProps } = useFetchGroupActivities({
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
        rows={renderedGroupActivities}
      />
    </div>
  );
};
