import {
  Badge,
  Body,
  Button,
  Chip,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { StaffRowData } from "./types";

type TableColumn = GenericTableColumn<StaffRowData>;

export const useStaffTableColumns = () => {
  const { t } = useTranslation("staff-list");

  const columnName: TableColumn = {
    id: "staff-column-name",
    type: "custom",
    align: "start",
    colClassName: "px-md",
    header: t("table.headers.name"),
    render: (row) => (
      <Body
        htmlVariant="span"
        size="md"
        color="default"
        weight="strong"
        className="block min-w-0 truncate"
      >
        {row.name}
      </Body>
    ),
  };

  const columnEmail: TableColumn = {
    id: "staff-column-email",
    type: "custom",
    align: "start",
    colClassName: "px-md",
    header: t("table.headers.email"),
    render: (row) => (
      <Body
        htmlVariant="span"
        size="md"
        color="default"
        className="block min-w-0 truncate"
      >
        {row.email}
      </Body>
    ),
  };

  const columnRole: TableColumn = {
    id: "staff-column-role",
    type: "custom",
    align: "start",
    colClassName: "px-md",
    header: t("table.headers.role"),
    render: (row) => {
      if (!row.roleName) return null;
      const tooltip = row.roleIsDefault
        ? t("table.tooltips.defaultRole")
        : t("table.tooltips.customRole");
      return (
        <Tooltip label={tooltip} placement="bottom-right">
          <Chip
            label={row.roleName}
            type="weak"
            color="default"
            size="lg"
            iconLeft={row.roleIsDefault ? "lock-01" : undefined}
            title={tooltip}
          />
        </Tooltip>
      );
    },
  };

  const columnBillingGroup: TableColumn = {
    id: "staff-column-billing-group",
    type: "custom",
    align: "start",
    colClassName: "px-md",
    header: t("table.headers.billingGroup"),
    render: (row) => (
      <Body
        htmlVariant="span"
        size="md"
        color="default"
        className="block min-w-0 max-w-[320px] truncate"
      >
        {row.billingGroupName ?? ""}
      </Body>
    ),
  };

  const columnAssignedTeachers: TableColumn = {
    id: "staff-column-assigned-teachers",
    type: "custom",
    align: "start",
    colClassName: "w-full px-md",
    header: t("table.headers.assignedTeachers"),
    render: (row) => {
      const MAX_TEACHERS = 2;
      const displayed = row.assignedTeachers.slice(0, MAX_TEACHERS);
      const remaining = row.assignedTeachers.length - displayed.length;
      return (
        <div className="flex flex-wrap gap-2xs">
          {displayed.map((teacher) => (
            <Chip
              key={teacher}
              label={teacher}
              type="weak"
              color="default"
              size="lg"
            />
          ))}
          {remaining > 0 && (
            <Badge text={`${remaining}+`} size="lg" color="default" />
          )}
        </div>
      );
    },
  };

  const columnCommission: TableColumn = {
    id: "staff-column-commission",
    type: "custom",
    align: "start",
    colClassName: "px-md",
    header: t("table.headers.commission"),
    render: (row) => (
      <Body
        htmlVariant="span"
        size="md"
        color="default"
        className="block min-w-0 truncate"
      >
        {row.commission}
      </Body>
    ),
  };

  const columnActions: TableColumn = {
    id: "staff-column-actions",
    type: "custom",
    align: "center",
    colClassName: "px-md",
    header: (
      <span className="sr-only" aria-label={t("table.headers.actions")}>
        {t("table.headers.actions")}
      </span>
    ),
    render: (row) => (
      <div className="flex min-w-[44px] items-center justify-end">
        {row.onDelete ? (
          <Button
            color="default"
            intent="flat"
            size="md"
            kind="icon-button"
            icon="trash-01"
            label={t("table.actions.delete")}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              row.onDelete?.();
            }}
          />
        ) : null}
      </div>
    ),
  };

  return [
    columnName,
    columnEmail,
    columnRole,
    columnBillingGroup,
    columnAssignedTeachers,
    columnCommission,
    columnActions,
  ];
};
