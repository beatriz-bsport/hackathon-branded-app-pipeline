import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { StaffTable } from "#src/components/staff-table/staff-table";
import { useStaffListQuery } from "#src/hooks/api/use-staff-list-query";
import { useTranslation } from "#src/utils/i18n";

const StaffListPageContent: FC = () => {
  const { staffRows, isEmpty, isFetching, paginationProps } =
    useStaffListQuery();

  return (
    <StaffTable
      rows={staffRows}
      paginationProps={paginationProps}
      isEmpty={isEmpty}
      isLoading={isFetching}
    />
  );
};

const ListPage: FC = () => {
  const { t } = useTranslation("staff-list");

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("name")} />
      <ListLayout.Content>
        <QueryBoundary>
          <StaffListPageContent />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
