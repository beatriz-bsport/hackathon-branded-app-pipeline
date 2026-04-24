import { type FC, useState } from "react";
import { useNavigate } from "react-router";

import type { MetaActivity } from "@bsport/api-book";
import {
  Button,
  type ButtonProps,
  ListLayout,
  Loader,
  Table,
} from "@bsport/kaizen-primitive-core";
import { DEFAULT_DEBOUNCE_DELAY } from "@bsport/use-debounce";

import { ArchiveClassModal } from "#src/components/archive-class-modal/archive-class-modal";
import { AddClassModal } from "#src/components/class-form/add-class-modal";
import { DuplicateClassModal } from "#src/components/duplicate-class-modal/duplicate-class-modal";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useClassesFilters } from "#src/hooks/use-classes-filters";
import { useClassesList } from "#src/hooks/use-classes-list";
import useTableColumns from "#src/hooks/use-table-columns";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type Row = MetaActivity & {
  color: string;
};

type ClassesTableProps = {
  searchQuery: string;
  isWorkshop: boolean | undefined;
  inCategoryIds: string[] | undefined;
  onClearFilters: () => void;
  onAddClick: () => void;
  onClickArchive: (row: Row) => void;
  onClickDuplicate: (row: Row) => void;
};

const ClassesTable: FC<ClassesTableProps> = ({
  searchQuery,
  isWorkshop,
  inCategoryIds,
  onClearFilters,
  onAddClick,
  onClickArchive,
  onClickDuplicate,
}) => {
  const { t } = useTranslation("list");
  const columns = useTableColumns<Row>();
  const { classes: renderedClasses, paginationProps } = useClassesList({
    customerEnabled: true,
    searchParams: { searchQuery, isWorkshop, inCategoryIds },
  });

  const isEmptySearch =
    !!(searchQuery || isWorkshop !== undefined || inCategoryIds?.length) &&
    paginationProps.totalItems === 0;

  return (
    <Table<Row>
      id="enabled-classes-list"
      columns={[
        ...columns,
        {
          header: "",
          id: "actions",
          type: "custom",
          render: (row) => {
            return (
              <div className="flex flex-row gap-sm">
                <Button
                  kind="icon-button"
                  icon="copy-03"
                  intent="flat"
                  color="default"
                  label={t("list.actions.duplicate")}
                  size="md"
                  onClick={(e) => {
                    e.preventDefault();
                    onClickDuplicate(row);
                  }}
                />
                <Button
                  kind="icon-button"
                  icon="archive"
                  intent="flat"
                  color="default"
                  label={t("list.actions.archive")}
                  size="md"
                  onClick={(e) => {
                    e.preventDefault();
                    onClickArchive(row);
                  }}
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
          subtitle: t("list.state.empty.subtitle"),
          ctaButtonConfig: {
            label: t("list.state.empty.cta"),
            onClick: onAddClick,
            iconLeft: "plus",
          },
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
      rows={renderedClasses}
    />
  );
};

const ClassesListingPage: FC = () => {
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { endGroupActions } = ListLayout.useAdaptiveActions({
    endGroupActions: [
      <GoToArchivedLink
        key="link-to-archive"
        kind="icon-button"
        label={t("list.header.archivedClasses")}
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
            onClick={() => setIsCreateModalOpen(true)}
          />
        }
        pageTitle={t("list.header.classes")}
        searchConfig={{
          id: "classes-search",
          inputValue: searchQuery,
          debounceValue: DEFAULT_DEBOUNCE_DELAY,
          onInputValueChange: onSearchChange,
          onClear: onSearchClear,
        }}
        filterConfig={filterConfig}
        filterRef={filterRef}
      />
      <ListLayout.Content className="flex flex-col gap-sm">
        <AddClassModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
        <ArchiveClassModal
          open={isArchiveModalOpen}
          onClose={() => setIsArchiveModalOpen(false)}
          classToArchive={selectedClass}
        />
        <DuplicateClassModal
          open={isDuplicateModalOpen}
          onClose={() => setIsDuplicateModalOpen(false)}
          classToDuplicate={selectedClass}
        />
        <QueryBoundary
          loadingFallback={<Loader className="w-full h-full" size="xl" />}
        >
          <ClassesTable
            searchQuery={searchQuery}
            isWorkshop={activeIsWorkshop}
            inCategoryIds={activeCategoryIds}
            onClearFilters={resetFilters}
            onAddClick={() => setIsCreateModalOpen(true)}
            onClickArchive={(row) => {
              setSelectedClass({ id: row.id, name: row.name });
              setIsArchiveModalOpen(true);
            }}
            onClickDuplicate={(row) => {
              setSelectedClass({ id: row.id, name: row.name });
              setIsDuplicateModalOpen(true);
            }}
          />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

function GoToArchivedLink(props: ButtonProps) {
  const navigate = useNavigate();

  return <Button {...props} onClick={() => navigate(ROUTES.ARCHIVED)} />;
}

export default ClassesListingPage;
