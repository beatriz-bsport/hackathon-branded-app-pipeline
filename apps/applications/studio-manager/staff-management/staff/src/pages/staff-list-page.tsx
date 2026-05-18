import { type FC, useState } from "react";
import { useNavigate } from "react-router";

import { Button, ListLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { StaffTable } from "#src/components/staff-table/staff-table";
import type { StaffRowData } from "#src/components/staff-table/types";
import { StaffCreateModal } from "#src/features/staff-create-modal/staff-create-modal";
import { StaffDeleteModal } from "#src/features/staff-delete-modal/staff-delete-modal";
import {
  type StaffActiveFilters,
  useStaffListQuery,
} from "#src/hooks/api/use-staff-list-query";
import { useDisclosure } from "#src/hooks/use-disclosure";
import { useStaffFilters } from "#src/hooks/use-staff-filters";
import { LEGACY_URLS, URLS } from "#src/urls";
import { StaffFlags, useStaffFlag } from "#src/utils/featureFlags";
import { useTranslation } from "#src/utils/i18n";

type StaffListPageContentProps = {
  activeFilters: StaffActiveFilters;
  isFiltered: boolean;
  onClearFilters: () => void;
  onCreate: () => void;
  onDeleteRow: (row: StaffRowData, queryKey: readonly unknown[]) => void;
};

const StaffListPageContent: FC<StaffListPageContentProps> = ({
  activeFilters,
  isFiltered,
  onClearFilters,
  onCreate,
  onDeleteRow,
}) => {
  const navigate = useNavigate();
  const { staffRows, isEmpty, isFetching, paginationProps, staffQueryKey } =
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
      onRowClick={(id) => navigate(URLS.DETAILS(id))}
      onDeleteRow={(row) => onDeleteRow(row, staffQueryKey)}
    />
  );
};

const StaffListPage: FC = () => {
  const { t } = useTranslation("staff-list");
  const isRolePageRevampEnabled = useStaffFlag(StaffFlags.ROLE_PAGE);
  const { activeFilters, filterConfig, filterRef, resetFilters } =
    useStaffFilters();
  const isFiltered = Object.keys(activeFilters).length > 0;
  const {
    isOpen: isCreateModalOpen,
    onClose: closeCreateModal,
    onOpen: openCreateModal,
  } = useDisclosure();
  const navigate = useNavigate();
  const [staffToDelete, setStaffToDelete] = useState<StaffRowData | null>(null);
  const [deleteSourceQueryKey, setDeleteSourceQueryKey] = useState<
    readonly unknown[] | null
  >(null);

  const handleCloseDeleteModal = () => {
    setStaffToDelete(null);
    setDeleteSourceQueryKey(null);
  };

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
            onClick={() => {
              if (isRolePageRevampEnabled) {
                navigate(URLS.ROLE);
              } else {
                window.location.assign(LEGACY_URLS.ROLE);
              }
            }}
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
            onDeleteRow={(row, queryKey) => {
              setStaffToDelete(row);
              setDeleteSourceQueryKey(queryKey);
            }}
          />
        </QueryBoundary>
      </ListLayout.Content>

      <StaffCreateModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
      <StaffDeleteModal
        staff={staffToDelete}
        queryKey={deleteSourceQueryKey ?? undefined}
        onClose={handleCloseDeleteModal}
      />
    </ListLayout>
  );
};

export default StaffListPage;
