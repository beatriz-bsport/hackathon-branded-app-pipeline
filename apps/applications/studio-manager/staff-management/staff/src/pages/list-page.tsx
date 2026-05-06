import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { StaffTable } from "#src/components/staff-table/staff-table";
import {
  type StaffActiveFilters,
  useStaffListQuery,
} from "#src/hooks/api/use-staff-list-query";
import { useStaffFilters } from "#src/hooks/use-staff-filters";
import { useTranslation } from "#src/utils/i18n";

type StaffListPageContentProps = {
  activeFilters: StaffActiveFilters;
  isFiltered: boolean;
  onClearFilters: () => void;
};

const StaffListPageContent: FC<StaffListPageContentProps> = ({
  activeFilters,
  isFiltered,
  onClearFilters,
}) => {
  const { staffRows, isEmpty, isFetching, paginationProps } =
    useStaffListQuery(activeFilters);

  return (
    <StaffTable
      rows={staffRows}
      paginationProps={paginationProps}
      isEmpty={isEmpty}
      isEmptySearch={isEmpty && isFiltered}
      isLoading={isFetching}
      onClearFilters={onClearFilters}
    />
  );
};

const ListPage: FC = () => {
  const { t } = useTranslation("staff-list");
  const { activeFilters, filterConfig, filterRef, resetFilters } =
    useStaffFilters();
  const isFiltered = Object.keys(activeFilters).length > 0;

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("name")}
        filterConfig={filterConfig}
        filterRef={filterRef}
      />
      <ListLayout.Content>
        <QueryBoundary>
          <StaffListPageContent
            activeFilters={activeFilters}
            isFiltered={isFiltered}
            onClearFilters={resetFilters}
          />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
