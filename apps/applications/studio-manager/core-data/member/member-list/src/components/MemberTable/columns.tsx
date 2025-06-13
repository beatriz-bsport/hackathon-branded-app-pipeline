import {
  Avatar,
  Body,
  Button,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import type { TFunction } from "#src/utils/i18n";

export type TableRowData = {
  balance: number;
  email: string;
  id: number;
  initials: string;
  joinDate: string;
  name: string;
  photo?: string;
};

type TableColumn = GenericTableColumn<TableRowData>;

type MemberHandler = ({
  memberId,
  memberName,
}: {
  memberId: number;
  memberName: string;
}) => void;

export type GetTableColumnsParams = {
  handleArchive?: MemberHandler;
  handleRestore?: MemberHandler;
  mode?: "archived" | "active";
  t: TFunction;
};

/**
 * Return the colums configs for the Member table
 */
export const getTableColumns = ({
  handleArchive,
  handleRestore,
  mode = "active",
  t,
}: GetTableColumnsParams) => {
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
    keyPath: "email",
    type: "string",
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
    type: "string",
    align: "center",
  };

  const columnActions: TableColumn = {
    header: "",
    id: "column-actions",
    keyPath: "",
    type: "custom",
    align: "center",
    render: (row) => {
      if (mode === "archived" && handleRestore) {
        return (
          <Tooltip
            label={t("memberTable.tooltips.restore")}
            placement="bottom-right"
          >
            <Button
              color="default"
              intent="flat"
              size="md"
              onClick={() =>
                handleRestore({
                  memberId: row.id,
                  memberName: row.name,
                })
              }
              iconLeft="unarchive"
            />
          </Tooltip>
        );
      }

      if (mode === "active" && handleArchive) {
        return (
          <Tooltip
            label={t("memberTable.tooltips.archive")}
            placement="bottom-right"
          >
            <Button
              color="default"
              intent="flat"
              size="md"
              onClick={() =>
                handleArchive({
                  memberId: row.id,
                  memberName: row.name,
                })
              }
              iconLeft="archive"
            />
          </Tooltip>
        );
      }

      return null;
    },
  };

  return [
    columnName,
    columnEmail,
    columnBalance,
    columnJoinDate,
    columnActions,
  ];
};
