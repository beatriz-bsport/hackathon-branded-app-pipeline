import { useQueryClient } from "@tanstack/react-query";
import { type FC } from "react";
import { Link } from "react-router";

import { type MetaActivity, groupActivityKeys } from "@bsport/api-book";
import {
  Breadcrumbs,
  Button,
  ListLayout,
  Loader,
  Table,
  toast,
} from "@bsport/kaizen-primitive-core";
import {
  archiveGroupActivityAction,
  unarchiveGroupActivityAction,
} from "@bsport/store-booking-group-activity";
import { DEFAULT_DEBOUNCE_DELAY } from "@bsport/use-debounce";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useClassesFilters } from "#src/hooks/use-classes-filters";
import { useClassesList } from "#src/hooks/use-classes-list";
import useTableColumns from "#src/hooks/use-table-columns";
import { ROUTES } from "#src/urls";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type ArchivedClassesTableProps = {
  searchQuery: string;
  isWorkshop: boolean | undefined;
  inCategoryIds: string[] | undefined;
  onClearFilters: () => void;
};

// Inner component — renders only when data is ready (useSuspenseQuery guaranteed).
// Also owns the mutation handlers since they depend on the data context.
const ArchivedClassesTable: FC<ArchivedClassesTableProps> = ({
  searchQuery,
  isWorkshop,
  inCategoryIds,
  onClearFilters,
}) => {
  const { t } = useTranslation("list");
  const columns = useTableColumns<MetaActivity>();
  const queryClient = useQueryClient();

  const { classes: groupActivities, paginationProps } = useClassesList({
    customerEnabled: false,
    searchParams: { searchQuery, isWorkshop, inCategoryIds },
  });

  const handleInvalidate = () => {
    queryClient.invalidateQueries({ queryKey: groupActivityKeys.searches() });
  };

  const revertUnarchiveClass = (classId: number) => () => {
    archiveGroupActivityAction(fetch, classId.toString()).then((response) => {
      response.fold(
        () => handleInvalidate(),
        (error) => console.error(error),
      );
    });
  };

  const handleUnarchiveClass = (classId: number) => () => {
    if (!classId) return;
    unarchiveGroupActivityAction(fetch, classId.toString()).then((response) => {
      response.fold(
        ({ name }) => {
          toast({
            status: "default",
            icon: "unarchive",
            description: t("list.toasts.unarchive", {
              className: name,
            }),
            duration: 5000,
            buttonLabel: t("list.toasts.undo"),
            onButtonClick: revertUnarchiveClass(classId),
          });
          handleInvalidate();
        },
        (error) => console.error(error),
      );
    });
  };

  const isEmptySearch =
    !!(searchQuery || isWorkshop !== undefined || inCategoryIds?.length) &&
    paginationProps.totalItems === 0;

  return (
    <Table<MetaActivity>
      id="archived-classes-list"
      columns={[
        ...columns,
        {
          header: "",
          id: "actions",
          keyPath: "actions",
          type: "custom",
          render: (item) => {
            return (
              <div className="flex flex-row gap-sm">
                <Button
                  iconLeft="unarchive"
                  intent="default"
                  color="main"
                  size="md"
                  label={t("list.actions.unarchive")}
                  onClick={handleUnarchiveClass(item.id)}
                />
              </div>
            );
          },
        },
      ]}
      emptyStateProps={{
        isEmpty: !paginationProps.totalItems,
        isEmptySearch,
        emptyConfig: {
          title: t("list.state.empty.title"),
        },
        emptySearchConfig: {
          title: t("list.state.emptySearch.title"),
          subtitle: t("list.state.emptySearch.subtitle"),
          ctaButtonConfig: {
            label: t("list.state.emptySearch.cta"),
            onClick: onClearFilters,
            iconLeft: "x",
          },
        },
      }}
      paginationProps={paginationProps}
      rows={groupActivities}
    />
  );
};

// Outer component — owns the layout, search/filter state, and the QueryBoundary.
// The header/breadcrumbs render immediately; only the table area suspends.
export const ArchivedClassesList: FC = () => {
  const { t } = useTranslation("list");
  const {
    searchQuery,
    onSearchChange,
    onSearchClear,
    filterConfig,
    filterRef,
    activeIsWorkshop,
    activeCategoryIds,
    resetFilters,
  } = useClassesFilters();

  return (
    <ListLayout>
      <ListLayout.Header
        BreadcrumbsItems={[
          <Link key="to-active-classes" to={ROUTES.ACTIVE}>
            <Breadcrumbs.Item
              text={t("list.header.classes")}
              id="breadcrumb-item-classes"
            />
          </Link>,
        ]}
        pageTitle={t("list.header.archivedClasses")}
        searchConfig={{
          id: "archived-classes-search",
          inputValue: searchQuery,
          debounceValue: DEFAULT_DEBOUNCE_DELAY,
          onInputValueChange: onSearchChange,
          onClear: onSearchClear,
        }}
        filterConfig={filterConfig}
        filterRef={filterRef}
      />
      <ListLayout.Content>
        <QueryBoundary
          loadingFallback={<Loader className="w-full h-full" size="xl" />}
        >
          <ArchivedClassesTable
            searchQuery={searchQuery}
            isWorkshop={activeIsWorkshop}
            inCategoryIds={activeCategoryIds}
            onClearFilters={resetFilters}
          />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ArchivedClassesList;
