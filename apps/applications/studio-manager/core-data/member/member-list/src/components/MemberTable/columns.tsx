import {
  Avatar,
  Body,
  Button,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import type { TFunction } from "#src/utils/i18n";

import type { TableColumnsParams, TableRowData } from "./types";

type TableColumn = GenericTableColumn<TableRowData>;

/**
 * Return the colums configs for the Member table
 */
export const getTableColumns = ({
  handleArchive,
  handleRestore,
  mode = "active",
  t,
  permissions,
}: TableColumnsParams & { t: TFunction }): Array<TableColumn> => {
  const columnName: TableColumn = {
    header: t("memberTable.headers.name"),
    id: "column-name",
    keyPath: "",
    type: "custom",
    align: "start",
    render: (row) => (
      <div className="flex flex-row gap-sm items-center">
        <Avatar
          shape="round"
          src={
            row.photo?.includes("default_profile_picture") && row.initials
              ? undefined // Disabled src in case of default profile picture, to fallback to initials if they exist
              : row.photo
          }
          alt={row.name}
          initials={row.initials}
          size="md"
        />
        <Body htmlVariant="p" size="md">
          {row.name}
        </Body>
      </div>
    ),
  };

  const columnEmail: TableColumn = {
    header: t("memberTable.headers.email"),
    id: "column-email",
    type: "copy",
    keyPath: "email",
    align: "start",
  };

  const columnBalance: TableColumn = {
    header: t("memberTable.headers.balance"),
    id: "column-balance",
    keyPath: "balance",
    type: "price",
    align: "end",
    priceColoring: {
      positive: "positive",
      negative: "critical",
    },
  };

  const columnJoinDate: TableColumn = {
    header: t("memberTable.headers.joinDate"),
    id: "column-join-date",
    keyPath: "joinDate",
    type: "date",
    align: "center",
  };

  const renderRestoreAction =
    mode === "archived" && handleRestore && permissions.restore;
  const renderArchiveAction =
    mode === "active" && handleArchive && permissions.archive;
  const columnActions: TableColumn = {
    header: "",
    id: "column-actions",
    keyPath: "",
    type: "custom",
    align: "center",
    render: (row) => {
      if (renderRestoreAction) {
        return (
          <Tooltip
            label={t("memberTable.tooltips.restore")}
            placement="bottom-right"
          >
            <Button
              kind="icon-button"
              icon="unarchive"
              intent="flat"
              color="default"
              size="md"
              label={t("memberTable.tooltips.restore")}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleRestore({
                  memberId: row.id,
                  memberName: row.name,
                });
              }}
            />
          </Tooltip>
        );
      }

      if (renderArchiveAction) {
        return (
          <Tooltip
            label={t("memberTable.tooltips.archive")}
            placement="bottom-right"
          >
            <Button
              kind="icon-button"
              icon="archive"
              intent="flat"
              color="default"
              size="md"
              label={t("memberTable.tooltips.archive")}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleArchive({
                  memberId: row.id,
                  memberName: row.name,
                });
              }}
            />
          </Tooltip>
        );
      }

      return null;
    },
  };

  return [
    columnName,
    permissions.seePersonalData && columnEmail,
    permissions.seeBalance && columnBalance,
    columnJoinDate,
    (renderArchiveAction || renderRestoreAction) && columnActions,
  ].filter((item) => !!item);
};
