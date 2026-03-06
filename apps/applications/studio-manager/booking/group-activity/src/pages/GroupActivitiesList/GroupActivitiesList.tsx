import { type FC, useState } from "react";
import { useNavigate } from "react-router";

import type { MetaActivity } from "@bsport/api-book";
import {
  Button,
  type ButtonProps,
  ListLayout,
  Table,
} from "@bsport/kaizen-primitive-core";
import { DEFAULT_DEBOUNCE_DELAY } from "@bsport/use-debounce";

import { useCategoryFilter } from "#src/hooks/useCategoryFilter";
import { useFetchGroupActivities } from "#src/hooks/useFetchGroupActivities";
import { useGroupActivityModals } from "#src/hooks/useGroupActivityModals";
import { usePaginatedGroupActivities } from "#src/hooks/usePaginatedGroupActivities";
import { useRefinedGroupActivities } from "#src/hooks/useRefinedGroupActivities";
import useTableColumns from "#src/hooks/useTableColumns";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type Row = MetaActivity & {
  link: string;
  color: string;
};

export const GroupActivitiesList: FC = () => {
  const { t } = useTranslation("groupActivity");
  const [searchQuery, setSearchQuery] = useState("");
  const columns = useTableColumns<Row>();
  const { fetchGroupActivities, paginationProps, isLoading } =
    usePaginatedGroupActivities({ customerEnabled: true });
  const {
    resetFilters,
    categoryFiltersConfig,
    categoryFiltersRef,
    activeCategoryFilters,
  } = useCategoryFilter();

  const clearSearchQuery = () => {
    setSearchQuery("");
  };

  const renderedGroupActivities = useRefinedGroupActivities({
    searchQuery,
    activeCategoryFilters,
  });

  const { archiveModal, duplicateModal, onClickArchive, onClickDuplicate } =
    useGroupActivityModals({
      fetchGroupActivitiesPage: fetchGroupActivities,
    });

  useFetchGroupActivities({ searchQuery, activeCategoryFilters });

  const { endGroupActions } = ListLayout.useAdaptiveActions({
    endGroupActions: [
      <GoToArchivedLink
        key="link-to-archive"
        kind="icon-button"
        label={t("list.header.archivedActivities")}
        icon="archive"
        intent="default"
        color="main"
        size="md"
      />,
    ],
  });

  return (
    <ListLayout>
      <ListLayout.Header
        endGroupActions={endGroupActions}
        callToActionButton={
          <ListLayout.Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
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
                      kind="icon-button"
                      icon="copy-03"
                      intent="default"
                      color="main"
                      label={t("list.actions.duplicate")}
                      size="md"
                      onClick={(e) => {
                        e.preventDefault();
                        onClickDuplicate(item.id, item.name);
                      }}
                    />
                    <Button
                      kind="icon-button"
                      icon="archive"
                      intent="default"
                      color="main"
                      label={t("list.actions.archive")}
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

function GoToArchivedLink(props: ButtonProps) {
  const navigate = useNavigate();

  return <Button {...props} onClick={() => navigate(ROUTES.ARCHIVED)} />;
}
