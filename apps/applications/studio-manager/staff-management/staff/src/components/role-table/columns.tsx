import {
  Badge,
  Body,
  Chip,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { RoleRowActions } from "./role-row-actions";
import type { RoleRowData } from "./types";

type TableColumn = GenericTableColumn<RoleRowData>;

const MAX_VISIBLE_PERMISSIONS = 4;

const renderTextCell = (
  content: string,
  className = "block min-w-0 truncate",
) => (
  <Body htmlVariant="span" size="md" color="default" className={className}>
    {content}
  </Body>
);

const renderNameCell = (row: RoleRowData, tooltip: string) => (
  <Tooltip label={tooltip} placement="top">
    <Chip
      label={row.name}
      type="weak"
      color="default"
      size="lg"
      iconLeft={row.isDefault ? "lock-01" : undefined}
      title={tooltip}
    />
  </Tooltip>
);

const renderStaffAssignedCell = (row: RoleRowData, tooltip: string) => (
  <Tooltip label={tooltip} placement="top">
    <Chip
      label={String(row.staffAssignedCount)}
      type="weak"
      color="default"
      size="lg"
      iconLeft="users-01"
      title={tooltip}
    />
  </Tooltip>
);

export const useRoleTableColumns = (onDelete: (role: RoleRowData) => void) => {
  const { t } = useTranslation("role-list");

  const columnName: TableColumn = {
    id: "role-column-name",
    type: "custom",
    align: "start",
    header: t("table.headers.name"),
    render: (row) =>
      renderNameCell(
        row,
        row.isDefault
          ? t("table.tooltips.defaultRole")
          : t("table.tooltips.customRole"),
      ),
  };

  const columnPermissions: TableColumn = {
    id: "role-column-permissions",
    type: "custom",
    align: "start",
    header: t("table.headers.permissions"),
    render: (row) => {
      const visiblePermissions = row.permissions.slice(
        0,
        MAX_VISIBLE_PERMISSIONS,
      );
      const remainingPermissions =
        row.permissions.length - visiblePermissions.length;

      if (visiblePermissions.length === 0) {
        return renderTextCell(t("table.permissions.empty"));
      }

      return (
        <div className="flex flex-wrap items-start gap-2xs">
          {renderTextCell(
            visiblePermissions
              .map((permission) =>
                t("table.permissions.groupItem", {
                  label: t(`table.permissionGroups.${permission.key}`),
                  count: permission.count,
                }),
              )
              .join(", "),
            "min-w-0 flex-1 whitespace-normal line-clamp-2",
          )}
          {remainingPermissions > 0 && (
            <Badge
              text={`${remainingPermissions}+`}
              size="lg"
              color="default"
            />
          )}
        </div>
      );
    },
  };

  const columnStaffAssigned: TableColumn = {
    id: "role-column-staff-assigned",
    type: "custom",
    align: "start",
    header: t("table.headers.staffAssigned"),
    render: (row) =>
      renderStaffAssignedCell(
        row,
        t("table.tooltips.staffAssigned", {
          count: row.staffAssignedCount,
        }),
      ),
  };

  const columnActions: TableColumn = {
    id: "role-column-actions",
    type: "custom",
    align: "center",
    header: t("table.headers.actions"),
    render: (row) => <RoleRowActions row={row} onDelete={onDelete} />,
  };

  return [columnName, columnPermissions, columnStaffAssigned, columnActions];
};
