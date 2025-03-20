import React, { useMemo } from "react";
import classNames from "classnames";
import {
  Body,
  Loader,
  Table,
  type PaginationProps,
} from "@bsport/kaizen-primitive-core";
import type { Member } from "#src/store-api-pkg";
import { useTranslation } from "#src/utils/i18n";
import {
  getTableColumns,
  type GetTableColumnsParams,
  type TableRowData,
} from "./columns";

type MemberTableProps = {
  hasActiveFilters?: boolean;
  isLoading?: boolean;
  memberList: Array<Member>;
  onAddMemberClick?: () => void;
  onClearFilterClick?: () => void;
  paginationProps: PaginationProps;
} & Omit<GetTableColumnsParams, "t">;

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
}) => {
  const { t } = useTranslation("common");

  // ----- TABLE DATA -----
  const tableColumns = useMemo(
    () =>
      getTableColumns({
        handleArchive,
        handleRestore,
        mode,
        t,
      }),
    [mode, handleArchive, handleRestore, t],
  );

  const tableRows: TableRowData[] = memberList.map((member) => ({
    id: member.id,
    balance:
      member.credit_account_balance - parseFloat(member.total_unpaid_amount),
    email: member.email,
    initials:
      `${member.first_name?.[0] ?? ""}${member.last_name?.[0] ?? ""}`.toUpperCase(),
    // TODO : format date join
    joinDate: member.date_joined,
    name: member.name,
    photo: member.photo,
  }));

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
          ctaButtonConfig: {
            label: t("actions.addMember"),
            iconLeft: "plus" as const,
            onClick: onAddMemberClick,
          },
        };

  // Filters are active only in the "active" mode
  const emptySearchConfig = {
    subtitle: t("memberTable.emptySearch.subtitle"),
    secondaryButtonConfig: {
      onClick: onClearFilterClick,
    },
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-md">
        <Loader size="xl" />
        <Body htmlVariant="p">{t("memberTable.loading")}</Body>
      </div>
    );
  }

  const isEmpty = !paginationProps?.totalItems;
  const isEmptySearch = isEmpty && hasActiveFilters;

  return (
    <div
      className={classNames("flex flex-col w-full", {
        "h-full justify-center": isEmpty,
      })}
    >
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
      />
    </div>
  );
};
