import { type FC, useEffect, useMemo, useState } from "react";

import type {
  PayoutBalanceTransaction,
  PayoutListItem,
} from "@bsport/api-financial-services";
import {
  Alert,
  Button,
  Chip,
  type GenericTableColumn,
  type IconName,
  Menu,
  Modal,
  type PaginationProps,
  Popover,
  Table,
} from "@bsport/kaizen-primitive-core";

import {
  DEFAULT_BT_PAGE_SIZE,
  usePayoutBalanceTransactions,
} from "#src/hooks/use-payout-balance-transactions";
import { useTranslation } from "#src/utils/i18n";

import {
  DISPLAY_TYPE_MAP,
  type ModalDisplayTypeKey,
  type ModalPaymentMethodKey,
  type ModalReconciliationStatusKey,
  PAYMENT_METHOD_MAP,
  RECONCILIATION_STATUS_CHIP_COLOR,
  RECONCILIATION_STATUS_MAP,
} from "./types";

type BalanceTransactionTableRow = PayoutBalanceTransaction & {
  // TODO: Add those fields back when on-the-fly fees project is complete (gross, fees, total => net)
  // gross: number;
  // fees: number;
  total: number;
};

type BalanceTransactionTableColumn =
  GenericTableColumn<BalanceTransactionTableRow>;

function getDisplayTypeKey(displayType: string): ModalDisplayTypeKey {
  const known = DISPLAY_TYPE_MAP[displayType];
  return known !== undefined
    ? `modal.displayType.${known}`
    : "modal.displayType.other";
}

function getPaymentMethodKey(method: string): ModalPaymentMethodKey | null {
  const known = PAYMENT_METHOD_MAP[method];
  return known !== undefined ? `modal.paymentMethod.${known}` : null;
}

function getReconciliationStatusKey(
  status: string | undefined,
): keyof typeof RECONCILIATION_STATUS_CHIP_COLOR {
  if (status === undefined) return "pending";
  const known = RECONCILIATION_STATUS_MAP[status];
  return known !== undefined ? known : "pending";
}

function getReconciliationStatusI18nKey(
  status: string | undefined,
): ModalReconciliationStatusKey {
  const key = getReconciliationStatusKey(status);
  return `modal.reconciliationStatus.${key}`;
}

export type PayoutBalanceTransactionsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  payout: PayoutListItem | null;
  dateLabel: string;
};

export const PayoutBalanceTransactionsModal: FC<
  PayoutBalanceTransactionsModalProps
> = ({ isOpen, onClose, payout, dateLabel }) => {
  const { t } = useTranslation("payout");

  const [btPage, setBtPage] = useState(1);
  const [btRowsPerPage, setBtRowsPerPage] = useState(DEFAULT_BT_PAGE_SIZE);

  useEffect(() => {
    if (!isOpen) {
      setBtPage(1);
      setBtRowsPerPage(DEFAULT_BT_PAGE_SIZE);
    }
  }, [isOpen]);

  const {
    data: balanceTransactions,
    isFetching: isBtLoading,
    error: btError,
  } = usePayoutBalanceTransactions({
    payoutId: payout?.id ?? null,
    enabled: isOpen && payout != null,
    page: btPage,
    pageSize: btRowsPerPage,
  });

  const balanceTransactionRows: BalanceTransactionTableRow[] = useMemo(
    () =>
      (balanceTransactions?.results ?? []).map((bt) => ({
        ...bt,
        /* gross: bt.amount_cts / 100,
        fees: bt.fee_cts / 100,
        net: bt.net_cts / 100, */
        total: bt.net_cts / 100,
      })),
    [balanceTransactions],
  );

  const balanceTransactionsPaginationProps: PaginationProps = useMemo(
    () => ({
      currentPage: btPage,
      rowsPerPage: btRowsPerPage,
      showRowsPerPageSelector: true,
      disabled: isBtLoading,
      totalItems: balanceTransactions?.count ?? 0,
      onPageSettingsChange: (page, rowsPerPage) => {
        setBtPage(page);
        setBtRowsPerPage(rowsPerPage);
      },
    }),
    [btPage, btRowsPerPage, isBtLoading, balanceTransactions?.count],
  );

  const balanceTransactionsEmptyStateProps = useMemo(
    () => ({
      isEmpty:
        !btError &&
        !isBtLoading &&
        (balanceTransactions?.results?.length ?? 0) === 0,
      emptyConfig: {
        title: t("modal.empty.title"),
        subtitle: t("modal.empty.description"),
      },
    }),
    [btError, isBtLoading, balanceTransactions, t],
  );

  const balanceTransactionsLoadingProps = useMemo(
    () => ({
      isLoading:
        isBtLoading && (balanceTransactions?.results?.length ?? 0) === 0,
      message: t("loading"),
    }),
    [isBtLoading, balanceTransactions, t],
  );

  const balanceTransactionColumns: BalanceTransactionTableColumn[] = [
    {
      id: "type",
      header: t("modal.table.type"),
      type: "custom",
      render: (row) => t(getDisplayTypeKey(row.display_type)),
    },
    {
      id: "payment_method",
      header: t("modal.table.paymentMethod"),
      type: "custom",
      render: (row) => {
        const method = row.source_payment_method;
        if (!method) return null;
        const labelKey = getPaymentMethodKey(method);
        const label = labelKey ? t(labelKey) : method;
        const iconLeft: IconName | undefined =
          method === "card" ? "credit-card-02" : undefined;
        return (
          <Chip
            label={label}
            iconLeft={iconLeft}
            color="default"
            size="lg"
            type="weak"
          />
        );
      },
    },
    {
      id: "status",
      header: t("modal.table.status"),
      type: "custom",
      render: (row) => (
        <Chip
          label={t(getReconciliationStatusI18nKey(row.reconciliation_status))}
          color={
            RECONCILIATION_STATUS_CHIP_COLOR[
              getReconciliationStatusKey(row.reconciliation_status)
            ]
          }
          size="lg"
          type="weak"
        />
      ),
    },
    /*{
      id: "gross",
      keyPath: "gross",
      header: t("modal.table.gross"),
      type: "price",
      align: "end",
    },
    {
      id: "fees",
      keyPath: "fees",
      header: t("modal.table.fees"),
      type: "price",
      align: "end",
    },*/
    {
      id: "total",
      keyPath: "total",
      header: t("modal.table.total"),
      type: "price",
      align: "end",
    },
    {
      id: "invoices",
      header: "",
      type: "custom",
      align: "center",
      render: (row) => {
        const invoices =
          row.reconciled_bsport_payments?.map((payment) => payment.invoice) ??
          [];

        if (invoices.length === 0) return null;

        if (invoices.length === 1) {
          const invoice = invoices[0];

          return (
            <Button
              icon="link-external-02"
              intent="flat"
              kind="icon-button"
              label={invoice.public_identifier}
              color="default"
              size="md"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                window.open(
                  `/invoice/${invoice.uuid}`,
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
            />
          );
        }

        return (
          <Popover>
            <Popover.Anchor>
              {({ setIsPopoverOpened }) => (
                <Button
                  icon="dots-vertical"
                  intent="flat"
                  kind="icon-button"
                  label="Open invoices"
                  color="default"
                  size="md"
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    setIsPopoverOpened(true);
                  }}
                />
              )}
            </Popover.Anchor>
            <Popover.Content placement="bottom-right">
              {({ setIsPopoverOpened }) => (
                <Menu
                  items={invoices.map((invoice) => ({
                    id: invoice.uuid,
                    label: invoice.public_identifier,
                  }))}
                  onSelectOption={(id) => {
                    const invoice = invoices.find(
                      (currentInvoice) => currentInvoice.uuid === id,
                    );
                    if (!invoice) return;

                    window.open(
                      `/invoice/${invoice.uuid}`,
                      "_blank",
                      "noopener,noreferrer",
                    );
                    setIsPopoverOpened(false);
                  }}
                />
              )}
            </Popover.Content>
          </Popover>
        );
      },
    },
  ];

  if (!payout) {
    return null;
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      title={t("modal.title")}
      description={t("modal.description", { date: dateLabel })}
    >
      <div className="flex flex-col gap-sm">
        {btError && (
          <Alert status="critical" type="weak">
            {t("modal.error")}
          </Alert>
        )}

        <Table
          columns={balanceTransactionColumns}
          rows={balanceTransactionRows}
          paginationProps={balanceTransactionsPaginationProps}
          emptyStateProps={balanceTransactionsEmptyStateProps}
          loadingProps={balanceTransactionsLoadingProps}
          rowHeight="sm"
        />
      </div>
    </Modal>
  );
};
