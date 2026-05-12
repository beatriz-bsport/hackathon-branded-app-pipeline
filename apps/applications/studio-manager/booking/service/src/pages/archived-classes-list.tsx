import { type FC, useMemo } from "react";
import { Link, useNavigate } from "react-router";

import { type MetaActivity } from "@bsport/api-book";
import {
  Breadcrumbs,
  Button,
  ListLayout,
  Loader,
  Table,
} from "@bsport/kaizen-primitive-core";
import { DEFAULT_DEBOUNCE_DELAY } from "@bsport/use-debounce";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useClassesFilters } from "#src/hooks/use-classes-filters";
import { useClassesList } from "#src/hooks/use-classes-list";
import { useObjectLevelPermission } from "#src/hooks/use-permissions";
import useTableColumns from "#src/hooks/use-table-columns";
import { useUnarchiveClass } from "#src/hooks/use-unarchive-class";
import { ABSOLUTE_ROUTES } from "#src/urls";
import { ClassFlags, useClassFlag } from "#src/utils/featureFlags";
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
  const columns = useTableColumns<MetaActivity>({ includeNextClass: false });
  const { mutate: unarchiveClass } = useUnarchiveClass();
  const navigate = useNavigate();
  const detailEnabled = useClassFlag(ClassFlags.CLASSES_DETAIL_PAGE);

  const canDeleteWorkshop = useObjectLevelPermission(
    "management.workshop.allowed_actions.delete",
  );
  const canDeleteActivity = useObjectLevelPermission(
    "management.activity.allowed_actions.delete",
  );

  const { classes: groupActivities, paginationProps } = useClassesList({
    customerEnabled: false,
    searchParams: { searchQuery, isWorkshop, inCategoryIds },
  });

  const rows = useMemo(
    () =>
      groupActivities.map((item) => ({
        ...item,
        ...(detailEnabled && {
          onRowClick: () => navigate(ABSOLUTE_ROUTES.ARCHIVED_DETAIL(item.id)),
        }),
      })),
    [groupActivities, detailEnabled, navigate],
  );

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
            const canDelete = item.is_workshop
              ? canDeleteWorkshop
              : canDeleteActivity;
            if (!canDelete) return null;
            return (
              <div className="flex flex-row gap-sm">
                <Button
                  kind="icon-button"
                  color="default"
                  icon="unarchive"
                  size="md"
                  intent="flat"
                  label={t("list.actions.unarchive")}
                  onClick={() => unarchiveClass(item.id)}
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
      rows={rows}
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
          <Link
            key="to-active-classes"
            to={{ pathname: ABSOLUTE_ROUTES.ACTIVE }}
          >
            <Breadcrumbs.Item
              text={t("list.header.classes")}
              id="breadcrumb-item-classes"
            />
          </Link>,
          <Breadcrumbs.Item
            isActive
            key="breadcrumb-item-archived-classes"
            text={t("list.header.archivedClasses")}
            id="breadcrumb-item-archived-classes"
          />,
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
