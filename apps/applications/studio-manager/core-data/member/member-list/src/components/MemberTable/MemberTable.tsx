import React, { useMemo } from "react";

import {
  type PaginationProps,
  Table,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import type { Member } from "@bsport/store-core-data-member";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { MemberList } from "./MemberList";
import { getTableColumns } from "./columns";
import type { MemberViewData, TableColumnsParams, TableRowData } from "./types";

type MemberTableProps = {
  hasActiveFilters?: boolean;
  isLoading?: boolean;
  memberList: Array<Member>;
  onAddMemberClick?: () => void;
  onClearFilterClick?: () => void;
  paginationProps: PaginationProps;
} & TableColumnsParams;

export const MemberTable: React.FC<MemberTableProps> = ({
  handleArchive,
  handleRestore,
  hasActiveFilters = false,
  isLoading = false,
  memberList,
  mode,
  onAddMemberClick,
  onClearFilterClick,
  paginationProps,
  permissions,
}) => {
  const { t } = useTranslation("common");

  // ----- TRANSFORM DATA ONCE FOR BOTH TABLE AND LIST -----
  const memberViewData: MemberViewData[] = useMemo(
    () =>
      memberList.map((member) => {
        const balance =
          member.credit_account_balance -
          parseFloat(member.total_unpaid_amount);
        const initials =
          `${member.first_name?.[0] ?? ""}${member.last_name?.[0] ?? ""}`.toUpperCase();

        return {
          id: member.id,
          name: member.name,
          email: member.email,
          photo: member.photo,
          initials,
          balance,
          joinDate: member.date_joined,
          link: permissions.seeProfile
            ? LEGACY_URLS.DETAILS(member.id)
            : undefined,
        };
      }),
    [memberList, permissions.seeProfile],
  );

  // ----- TABLE DATA -----
  const tableColumns = useMemo(
    () =>
      getTableColumns({
        handleArchive,
        handleRestore,
        mode,
        t,
        permissions,
      }),
    [mode, handleArchive, handleRestore, t, permissions],
  );

  const tableRows: TableRowData[] = memberViewData;

  // ----- EMPTY TABLE CONFIGURATIONS -----
  // Configure empty state config based on the mode
  const emptyConfig =
    mode === "archived"
      ? {
          title: t("memberTable.emptyList.archivedMode.title"),
        }
      : {
          title: t("memberTable.emptyList.activeMode.title"),
          subtitle: t("memberTable.emptyList.activeMode.subtitle"),
          ctaButtonConfig: permissions.create
            ? {
                label: t("actions.addMember"),
                iconLeft: "plus" as const,
                onClick: onAddMemberClick,
              }
            : undefined,
        };

  // Filters are active only in the "active" mode
  const emptySearchConfig = {
    subtitle: t("memberTable.emptySearch.subtitle"),
    secondaryButtonConfig: {
      onClick: onClearFilterClick,
    },
  };

  const isEmpty = !paginationProps?.totalItems;
  const isEmptySearch = isEmpty && hasActiveFilters;

  const isMobile = !useMatchMedia("lg");

  if (isMobile) {
    return (
      <MemberList
        mode={mode ?? "active"}
        memberViewData={memberViewData}
        permissions={permissions}
        paginationProps={paginationProps}
        isEmpty={isEmpty}
        isEmptySearch={isEmptySearch}
        isLoading={isLoading}
        handleArchive={handleArchive}
        handleRestore={handleRestore}
        emptyConfig={emptyConfig}
      />
    );
  }

  return (
    <Table
      columns={tableColumns}
      rowHeight="lg"
      rows={tableRows}
      paginationProps={paginationProps}
      emptyStateProps={{
        isEmpty: isEmpty,
        emptyConfig: emptyConfig,
        isEmptySearch: isEmptySearch,
        emptySearchConfig: emptySearchConfig,
      }}
      loadingProps={{
        isLoading,
        message: t("memberTable.loading"),
      }}
    />
  );
};
