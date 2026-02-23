import { useMemo, useState } from "react";

import type { MetaActivity } from "@bsport/api-book";
import {
  Body,
  List,
  ListProps,
  Table,
  TextField,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { useDebounce } from "@bsport/use-debounce";

import { useRefinedGroupActivities } from "#src/hooks/useRefinedGroupActivities";
import { useSessionActivityColumns } from "#src/hooks/useSessionActivityColumns";
import { useTranslation } from "#src/utils/i18n";

export const ChooseActivityStep = () => {
  const { t } = useTranslation("sessionCreation");
  const isMobile = !useMatchMedia("lg");

  const [searchQuery, setSearchQuery] = useState("");

  const columns = useSessionActivityColumns();

  const { isLoading, paginationProps, groupedActivities } =
    useRefinedGroupActivities({
      searchQuery,
    });

  const listItems: ListProps["items"] = useMemo(
    () =>
      isMobile
        ? groupedActivities.map((activity) => {
            return {
              id: activity.id.toString(),
              title: activity.name,
              avatar: {
                alt: activity.alt_cover_main,
                src: activity.cover_main,
                shape: "squared",
                size: "lg",
              },
              color: activity.color,
              onClick: activity.onRowClick,
              isActive: activity.isActive,
            };
          })
        : [],
    [groupedActivities, isMobile],
  );

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
      {isMobile ? (
        <List
          id="group-activities-list"
          items={listItems}
          loadingProps={{
            isLoading,
            message: t(
              "addSessionModal.steps.chooseActivity.loadingActivities",
            ),
          }}
          emptyStateProps={{
            isEmpty: !paginationProps.totalItems,
            emptyConfig: {
              title: t(
                "addSessionModal.steps.chooseActivity.table.emptyState.title",
              ),
            },
          }}
          paginationProps={paginationProps}
        />
      ) : (
        <Table<MetaActivity>
          id="group-activities-table"
          rowHeight="lg"
          loadingProps={{
            isLoading,
            message: t(
              "addSessionModal.steps.chooseActivity.loadingActivities",
            ),
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
      )}
    </div>
  );
};
