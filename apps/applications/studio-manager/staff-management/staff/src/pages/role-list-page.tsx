import { type FC, useMemo } from "react";
import { useNavigate } from "react-router";

import { Button, ListLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { RoleTable } from "#src/components/role-table/role-table";
import { RoleCreateModal } from "#src/features/role-create-modal/role-create-modal";
import { useRoleListQuery } from "#src/hooks/api/use-role-list-query";
import { useDisclosure } from "#src/hooks/use-disclosure";
import {
  type RoleTypeFilter,
  useRoleFilters,
} from "#src/hooks/use-role-filters";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type RoleListPageContentProps = {
  searchQuery: string;
  typeFilter: RoleTypeFilter;
  isFiltered: boolean;
  onClearFilters: () => void;
  onCreateRole: () => void;
};

const matchesRoleTypeFilter = (
  isDefault: boolean,
  typeFilter: RoleTypeFilter,
): boolean => {
  if (typeFilter === "default") {
    return isDefault;
  }

  if (typeFilter === "custom") {
    return !isDefault;
  }

  return true;
};

const RoleListPageContent: FC<RoleListPageContentProps> = ({
  searchQuery,
  typeFilter,
  isFiltered,
  onClearFilters,
  onCreateRole,
}) => {
  const { roleRows, isEmpty, isFetching } = useRoleListQuery();
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredRoleRows = useMemo(
    () =>
      roleRows.filter(
        (role) =>
          matchesRoleTypeFilter(role.isDefault, typeFilter) &&
          (normalizedSearchQuery === "" ||
            role.name.toLowerCase().includes(normalizedSearchQuery)),
      ),
    [normalizedSearchQuery, roleRows, typeFilter],
  );
  const isEmptySearch = isFiltered && filteredRoleRows.length === 0;

  return (
    <RoleTable
      rows={filteredRoleRows}
      isEmpty={isEmpty}
      isEmptySearch={isEmptySearch}
      onClearFilters={onClearFilters}
      isLoading={isFetching}
      onCreateRole={onCreateRole}
    />
  );
};

const RoleListPage: FC = () => {
  const { t } = useTranslation("role-list");
  const navigate = useNavigate();
  const {
    searchQuery,
    typeFilter,
    filterConfig,
    filterRef,
    onSearchChange,
    onSearchClear,
    isFiltered,
    resetFilters,
  } = useRoleFilters();
  const {
    isOpen: isCreateModalOpen,
    onClose: closeCreateModal,
    onOpen: openCreateModal,
  } = useDisclosure();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("page.title")}
        searchConfig={{
          id: "role-list-search",
          inputValue: searchQuery,
          debounceValue: 10,
          onInputValueChange: onSearchChange,
          onClear: onSearchClear,
          tooltipConfig: {
            label: t("search.tooltip"),
          },
        }}
        filterConfig={filterConfig}
        filterRef={filterRef}
        callToActionButton={
          <ListLayout.Button
            iconLeft="plus"
            intent="call-to-action"
            color="main"
            label={t("page.addRole")}
            onClick={openCreateModal}
          />
        }
        endGroupActions={[
          <Button
            key="to-staff"
            intent="default"
            color="main"
            kind="default"
            size="md"
            label={t("page.toStaff")}
            onClick={() => navigate(URLS.INDEX)}
          />,
        ]}
      />
      <ListLayout.Content>
        <QueryBoundary>
          <RoleListPageContent
            searchQuery={searchQuery}
            typeFilter={typeFilter}
            isFiltered={isFiltered}
            onClearFilters={resetFilters}
            onCreateRole={openCreateModal}
          />
        </QueryBoundary>
      </ListLayout.Content>

      <RoleCreateModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
    </ListLayout>
  );
};

export default RoleListPage;
