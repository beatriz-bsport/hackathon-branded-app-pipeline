import { Chip, type GenericTableColumn } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { MembershipPlanInvoiceRowData } from "./types";

type TableColumn = GenericTableColumn<MembershipPlanInvoiceRowData>;

export const useMembershipPlanInvoiceColumns = (): TableColumn[] => {
  const { t } = useTranslation("membership-plan");

  const columnBillingDate: TableColumn = {
    id: "membership-plan-invoice-column-billing-date",
    type: "string",
    align: "start",
    header: t("invoiceList.headers.billingDate"),
    keyPath: "billingDate",
  };

  const columnStatus: TableColumn = {
    id: "membership-plan-invoice-column-status",
    type: "custom",
    align: "center",
    header: t("invoiceList.headers.status"),
    render: (row) => <Chip {...row.statusChip} />,
  };

  const columnAmount: TableColumn = {
    id: "membership-plan-invoice-column-amount",
    type: "string",
    align: "end",
    header: t("invoiceList.headers.amount"),
    keyPath: "amount",
  };

  const columnActions: TableColumn = {
    id: "membership-plan-invoice-column-actions",
    type: "custom",
    align: "end",
    header: "",
    render: () => <span />,
  };

  return [columnBillingDate, columnStatus, columnAmount, columnActions];
};
