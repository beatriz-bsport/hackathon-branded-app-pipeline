import {
  Button,
  Chip,
  DropdownMenu,
  type DropdownMenuItems,
  type GenericTableColumn,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { MembershipPlanInvoiceRowData } from "./types";

type TableColumn = GenericTableColumn<MembershipPlanInvoiceRowData>;

const EDIT_BILLING_DATE_ACTION_ID = "edit-billing-date";
const EDIT_PRICE_ACTION_ID = "edit-price";

export const useMembershipPlanInvoiceColumns = (
  onEditBillingDate: (row: MembershipPlanInvoiceRowData) => void,
  onEditPrice: (row: MembershipPlanInvoiceRowData) => void,
): TableColumn[] => {
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
    render: (row) => {
      // Legacy parity (apps/applications/saas-legacy .../PlannedInvoiceListDetail
      // → PlannedInvoiceEditMenu) still has two rules we can't mirror yet:
      // 1. `disableActions`: every invoice after the one flagged as last before a
      //    scheduled stop is fully disabled. Needs `is_last_invoice_before_scheduled_stop`,
      //    absent from the current mock PlannedInvoice.
      // 2. A third "Stop after invoice" action (disabled when >31 days old), gated
      //    by the end-after-invoice permission — no scheduled-stop concept here yet.
      // Revisit both when the real /subscription/planned-invoice/ endpoint lands.
      const items: DropdownMenuItems = [
        {
          id: EDIT_BILLING_DATE_ACTION_ID,
          label: t("invoiceList.actions.editBillingDate"),
          iconLeft: "calendar",
          disabled: row.isDateEditDisabled,
        },
        {
          id: EDIT_PRICE_ACTION_ID,
          label: t("invoiceList.actions.editPrice"),
          iconLeft: "coins-stacked-01",
          disabled: row.isPast,
        },
      ];

      return (
        <DropdownMenu
          items={items}
          onSelectOption={({ id, setIsPopoverOpened }) => {
            if (id === EDIT_BILLING_DATE_ACTION_ID) {
              onEditBillingDate(row);
            }
            if (id === EDIT_PRICE_ACTION_ID) {
              onEditPrice(row);
            }

            setIsPopoverOpened(false);
          }}
          placement="bottom-right"
          target={({ setIsPopoverOpened }) => (
            <Button
              kind="icon-button"
              intent="flat"
              icon="pencil-02"
              onClick={() => setIsPopoverOpened(true)}
              color="default"
              label={t("invoiceList.actions.openActions")}
              size="md"
            />
          )}
        />
      );
    },
  };

  return [columnBillingDate, columnStatus, columnAmount, columnActions];
};
