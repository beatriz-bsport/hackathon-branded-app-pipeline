import {
  Badge,
  Body,
  Chip,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { StaffRowData } from "./types";

type TableColumn = GenericTableColumn<StaffRowData>;

const renderTextCell = (content: string) => (
  <Body
    htmlVariant="span"
    size="md"
    color="default"
    className="block min-w-0 truncate"
  >
    {content}
  </Body>
);

const renderNameCell = (content: string) => (
  <Body
    htmlVariant="span"
    size="md"
    color="default"
    weight="strong"
    className="block min-w-0 truncate"
  >
    {content}
  </Body>
);

export const useStaffTableColumns = () => {
  const { t } = useTranslation("staff-list");

  const columnName: TableColumn = {
    id: "staff-column-name",
    type: "custom",
    align: "start",
    header: t("table.headers.name"),
    render: (row) => renderNameCell(row.name),
  };

  const columnEmail: TableColumn = {
    id: "staff-column-email",
    type: "custom",
    align: "start",
    header: t("table.headers.email"),
    render: (row) => renderTextCell(row.email),
  };

  const columnRole: TableColumn = {
    id: "staff-column-role",
    type: "custom",
    align: "start",
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
    header: t("table.headers.commission"),
    render: (row) => renderTextCell(row.commission),
  };

  return [
    columnName,
    columnEmail,
    columnRole,
    columnBillingGroup,
    columnAssignedTeachers,
    columnCommission,
  ];
};
