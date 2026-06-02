import {
  Avatar,
  Body,
  Button,
  Chip,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { MembershipPlanRowData } from "./types";

type TableColumn = GenericTableColumn<MembershipPlanRowData>;

export const useMembershipPlanColumns = (): TableColumn[] => {
  const { t } = useTranslation("contract-details");

  const columnStartDate: TableColumn = {
    id: "membership-plan-column-start-date",
    type: "date",
    align: "start",
    header: t("overview.membershipPlanList.headers.startDate"),
    keyPath: "startDate",
  };

  const columnMember: TableColumn = {
    id: "membership-plan-column-member",
    type: "custom",
    align: "start",
    colClassName: "w-full",
    header: t("overview.membershipPlanList.headers.member"),
    render: (row) => (
      <div className="flex flex-row items-center gap-sm">
        <Avatar
          shape="round"
          size="md"
          initials={row.memberInitials}
          alt={row.memberName}
        />
        <Body htmlVariant="p" size="md">
          {row.memberName}
        </Body>
      </div>
    ),
  };

  const columnStatus: TableColumn = {
    id: "membership-plan-column-status",
    type: "custom",
    align: "center",
    colClassName: "px-md",
    header: t("overview.membershipPlanList.headers.status"),
    render: (row) => {
      const { tooltipProps, ...chipProps } = row.statusChip;

      if (!tooltipProps?.label) {
        return <Chip {...chipProps} />;
      }

      return (
        <Tooltip label={tooltipProps.label} placement="bottom-right">
          <Chip {...chipProps} />
        </Tooltip>
      );
    },
  };

  const columnActions: TableColumn = {
    id: "membership-plan-column-actions",
    type: "custom",
    align: "end",
    colClassName: "px-md",
    header: (
      <span
        className="sr-only"
        aria-label={t("overview.membershipPlanList.headers.actions")}
      >
        {t("overview.membershipPlanList.headers.actions")}
      </span>
    ),
    render: (row) => (
      <Button
        kind="default"
        intent="default"
        color="main"
        size="md"
        iconRight="link-external-02"
        label={t("overview.membershipPlanList.actions.viewBillingPlan")}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          row.onViewBillingPlan();
        }}
      />
    ),
  };

  return [columnStartDate, columnMember, columnStatus, columnActions];
};
