import type { FC } from "react";
import { useNavigate } from "react-router";

import { Button, ListLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { StaffTable } from "#src/components/staff-table/staff-table";
import { StaffCreateModal } from "#src/features/staff-create-modal/staff-create-modal";
import {
  type StaffActiveFilters,
  useStaffListQuery,
} from "#src/hooks/api/use-staff-list-query";
import { useDisclosure } from "#src/hooks/use-disclosure";
import { useStaffFilters } from "#src/hooks/use-staff-filters";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type StaffListPageContentProps = {
  activeFilters: StaffActiveFilters;
  isFiltered: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
};

const StaffListPageContent: FC<StaffListPageContentProps> = ({
  activeFilters,
  isFiltered,
  onClearFilters,
  onCreate,
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
      onCreate={onCreate}
    />
  );
};

const StaffListPage: FC = () => {
  const { t } = useTranslation("staff-list");
  const { activeFilters, filterConfig, filterRef, resetFilters } =
    useStaffFilters();
  const isFiltered = Object.keys(activeFilters).length > 0;
  const {
    isOpen: isCreateModalOpen,
    onClose: closeCreateModal,
    onOpen: openCreateModal,
  } = useDisclosure();
  const navigate = useNavigate();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("name")}
        filterConfig={filterConfig}
        filterRef={filterRef}
        callToActionButton={
          <ListLayout.Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            label={t("header.addStaff")}
            onClick={openCreateModal}
          />
        }
        endGroupActions={[
          <Button
            key="to-roles"
            intent="default"
            color="main"
            kind="default"
            size="md"
            label={t("header.toRoles")}
            onClick={() => navigate(URLS.ROLE)}
          />,
        ]}
      />
      <ListLayout.Content>
        <QueryBoundary>
          <StaffListPageContent
            activeFilters={activeFilters}
            isFiltered={isFiltered}
            onClearFilters={resetFilters}
            onCreate={openCreateModal}
          />
        </QueryBoundary>
      </ListLayout.Content>

      <StaffCreateModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
    </ListLayout>
  );
};

export default StaffListPage;
