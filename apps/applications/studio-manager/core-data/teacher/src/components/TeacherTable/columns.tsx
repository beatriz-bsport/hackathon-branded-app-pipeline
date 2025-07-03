import {
  Avatar,
  Body,
  Button,
  type GenericTableColumn,
  type IconProps,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { CopyToClipboardButton } from "./CopyToClipboardButton";
import type { TableColumnsParams, TableRowData, TeacherHandler } from "./types";

type TableColumn = GenericTableColumn<TableRowData>;

export const useTeacherTableColumns = ({
  handleArchive,
  handleRestore,
  mode,
  permissions,
}: TableColumnsParams) => {
  const { t } = useTranslation("common");

  const columnName: TableColumn = {
    header: t("table.headers.name"),
    id: "column-name",
    type: "custom",
    align: "start",
    render: (row) => {
      return (
        <div className="flex flex-row gap-sm items-center">
          <Avatar
            src={row.iconSrc}
            initials={row.initials}
            shape="round"
            alt={row.name}
            size="md"
          />
          <Body htmlVariant="p" size="lg">
            {row.name}
          </Body>
        </div>
      );
    },
  };

  const columnEmail: TableColumn = {
    header: t("table.headers.email"),
    id: "column-email",
    type: "custom",
    align: "center",
    render: (row) => {
      return (
        <CopyToClipboardButton
          data={row.email}
          toastMessage={t("table.actions.copyEmail")}
        />
      );
    },
  };

  const columnPhone: TableColumn = {
    header: t("table.headers.phone"),
    id: "column-phone",
    type: "custom",
    align: "center",
    render: (row) => {
      return (
        <CopyToClipboardButton
          data={row.phone}
          toastMessage={t("table.actions.copyPhone")}
        />
      );
    },
  };

  const columnActions: TableColumn = {
    header: "",
    id: "column-actions",
    type: "custom",
    align: "center",
    render: (row) => {
      let tooltip: string = "";
      let handler: TeacherHandler | undefined;
      let icon: IconProps["icon"] | undefined;

      if (mode === "archived") {
        tooltip = t("table.tooltips.restore");
        handler = handleRestore;
        icon = "unarchive";
      }
      if (mode === "active") {
        tooltip = t("table.tooltips.archive");
        handler = handleArchive;
        icon = "archive";
      }

      if (!handler || !tooltip || !icon) return null;

      return (
        <Tooltip label={tooltip} placement="bottom-right">
          <Button
            color="default"
            intent="flat"
            size="md"
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              handler?.({
                teacherId: row.id,
                teacherName: row.name,
              });
            }}
            iconLeft={icon}
          />
        </Tooltip>
      );
    },
  };

  const columns = [columnName, columnEmail, columnPhone];

  // Add restricted actions
  const canDelete = mode === "active" && permissions.delete;
  const canRestore = mode === "archived" && permissions.edit;
  if (canDelete || canRestore) {
    columns.push(columnActions);
  }

  return columns;
};
