import React, { useEffect } from "react";
import { Link } from "react-router";

import { Button, ListLayout, Table } from "@bsport/kaizen-primitive-core";
import type { MetaActivity } from "@bsport/store-booking-group-activity";
import { DEFAULT_DEBOUNCE_DELAY } from "@bsport/use-debounce";

import { useCategoryFilter } from "#src/hooks/useCategoryFilter";
import { useGroupActivityModals } from "#src/hooks/useGroupActivityModals";
import { usePaginatedGroupActivities } from "#src/hooks/usePaginatedGroupActivities";
import useTableColumns from "#src/hooks/useTableColumns";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type Row = MetaActivity & {
  link: string;
  color: string;
};

export const GroupActivitiesList: React.FC = () => {
  const { t } = useTranslation("groupActivity");
  const [searchQuery, setSearchQuery] = React.useState("");
  const columns = useTableColumns<Row>();
  const {
    searchGroupActivitiesPage,
    groupActivities,
    paginationProps,
    isLoading,
  } = usePaginatedGroupActivities(true);
  const {
    activeCategoryFilters,
    resetFilters,
    categoryFiltersConfig,
    categoryFiltersRef,
  } = useCategoryFilter();

  const getGroupActivityDetailLink = (groupActivityId: string) =>
    `/activity/${groupActivityId}/general`;

  const clearSearchQuery = () => {
    setSearchQuery("");
  };

  const renderedGroupActivities = groupActivities.map((item) => ({
    ...item,
    link: getGroupActivityDetailLink(item.id.toString()),
    color: item.color,
  }));

  const { archiveModal, duplicateModal, onClickArchive, onClickDuplicate } =
    useGroupActivityModals({
      fetchGroupActivitiesPage: searchGroupActivitiesPage,
    });

  useEffect(() => {
    searchGroupActivitiesPage({
      inCategoryIds: activeCategoryFilters.is,
      notInCategoryIds: activeCategoryFilters.isNot,
      searchQuery,
    });
  }, [searchGroupActivitiesPage, activeCategoryFilters, searchQuery]);

  return (
    <ListLayout>
      <ListLayout.Header
        endGroupActions={[
          <Link key="link-to-archive" to={ROUTES.ARCHIVED}>
            <Button
              iconLeft="archive"
              intent="default"
              color="main"
              size="md"
            />
          </Link>,
        ]}
        callToActionButton={
          <Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            size="md"
            label={t("list.header.add")}
          />
        }
        pageTitle={t("list.header.groupActivities")}
        filterConfig={categoryFiltersConfig}
        filterRef={categoryFiltersRef}
        searchConfig={{
          id: "group-activity-expandable-search",
          inputValue: searchQuery,
          debounceValue: DEFAULT_DEBOUNCE_DELAY,
          onInputValueChange: setSearchQuery,
          onClear: clearSearchQuery,
        }}
      />
      <ListLayout.Content className="flex flex-col gap-sm">
        <Table<Row>
          id="enabled-group-activities-list"
          loadingProps={{
            isLoading,
          }}
          columns={[
            ...columns,
            {
              header: "",
              id: "actions",
              type: "custom",
              render: (item) => {
                return (
                  <div className="flex flex-row gap-sm">
                    <Button
                      iconLeft="copy-03"
                      intent="default"
                      color="main"
                      aria-label={t("list.actions.duplicate")}
                      size="md"
                      onClick={(e) => {
                        e.preventDefault();
                        onClickDuplicate(item.id, item.name);
                      }}
                    />
                    <Button
                      iconLeft="archive"
                      intent="default"
                      color="main"
                      aria-label={t("list.actions.archive")}
                      size="md"
                      onClick={(e) => {
                        e.preventDefault();
                        onClickArchive(item.id, item.name);
                      }}
                    />
                  </div>
                );
              },
            },
          ]}
          emptyStateProps={{
            isEmpty: !paginationProps.totalItems,
            isEmptySearch: !paginationProps.totalItems,
            emptyConfig: {
              title: t("list.enabled.emptyState.title"),
            },
            emptySearchConfig: {
              title: t("list.enabled.emptySearchState.title"),
              subtitle: t("list.enabled.emptySearchState.subtitle"),
              ctaButtonConfig: {
                label: t("list.enabled.emptySearchState.action"),
                iconLeft: "plus" as const,
                onClick: resetFilters,
              },
            },
          }}
          paginationProps={paginationProps}
          rows={renderedGroupActivities}
        />
        {archiveModal}
        {duplicateModal}
      </ListLayout.Content>
    </ListLayout>
  );
};
