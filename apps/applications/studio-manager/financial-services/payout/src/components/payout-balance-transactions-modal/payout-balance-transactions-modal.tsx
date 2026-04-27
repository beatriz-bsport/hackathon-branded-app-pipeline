import { type FC, useEffect, useMemo, useState } from "react";

import type {
  PayoutBalanceTransaction,
  PayoutListItem,
} from "@bsport/api-financial-services/payout";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import PaymentMethodChip from "@bsport/kaizen-business-components/financial-services/payment-method-chip";
import {
  Alert,
  Button,
  Chip,
  type GenericTableColumn,
  Menu,
  Modal,
  type PaginationProps,
  Popover,
  Table,
  cx,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  DEFAULT_BT_PAGE_SIZE,
  usePayoutBalanceTransactions,
} from "#src/hooks/use-payout-balance-transactions";
import { useTranslation } from "#src/utils/i18n";

import {
  DISPLAY_TYPE_MAP,
  type ModalDisplayTypeKey,
  type ModalReconciliationStatusKey,
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
  const { t, i18n } = useTranslation("payout");
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const companyTimezone = companyTheme?.timezone_name;

  const [btPage, setBtPage] = useState(1);
  const [btRowsPerPage, setBtRowsPerPage] = useState(DEFAULT_BT_PAGE_SIZE);

  const isMobile = !useMatchMedia("lg");

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
      id: "creation_date",
      header: t("modal.table.creationDate"),
      type: "custom",
      render: (row) =>
        row.payment_provider_created_at
          ? formatDateTime(
              row.payment_provider_created_at,
              DATETIME_FORMATS.MEDIUM_DATETIME,
              {
                locale: i18n.language,
                ...(companyTimezone ? { timeZone: companyTimezone } : {}),
              },
            )
          : "-",
    },
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

        return <PaymentMethodChip type={method} />;
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
          row.reconciled_bsport_payments
            ?.map((payment) => payment.invoice)
            .filter(
              (invoice, index, self) =>
                invoice != null &&
                self.findIndex(
                  (currentInvoice) => currentInvoice?.uuid === invoice.uuid,
                ) === index,
            ) ?? [];

        if (invoices.length === 0) return null;

        if (invoices.length === 1) {
          const invoice = invoices[0];

          return (
            <div className="flex items-center gap-xs">
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
              <Button
                icon="download-01"
                intent="flat"
                kind="icon-button"
                label={t("modal.invoice.download", {
                  identifier: invoice.public_identifier,
                })}
                color="default"
                size="md"
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  window.open(
                    invoice.stripe_invoice_pdf,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
              />
            </div>
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
                  label={t("modal.invoice.openInvoices")}
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
                  items={invoices.flatMap((invoice) => [
                    {
                      id: `details-${invoice.uuid}`,
                      label: t("modal.invoice.openLabel", {
                        identifier: invoice.public_identifier,
                      }),
                    },
                    {
                      id: `download-${invoice.uuid}`,
                      label: t("modal.invoice.downloadLabel", {
                        identifier: invoice.public_identifier,
                      }),
                    },
                  ])}
                  onSelectOption={(id) => {
                    const [action, ...uuidParts] = id.split("-");
                    const invoiceUuid = uuidParts.join("-");
                    const invoice = invoices.find(
                      (currentInvoice) => currentInvoice.uuid === invoiceUuid,
                    );
                    if (!invoice) return;

                    if (action === "download") {
                      window.open(
                        invoice.stripe_invoice_pdf,
                        "_blank",
                        "noopener,noreferrer",
                      );
                    } else {
                      window.open(
                        `/invoice/${invoice.uuid}`,
                        "_blank",
                        "noopener,noreferrer",
                      );
                    }
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
  /**
   * TODO: Temporary sticky last-column style for mobile only.
   * Remove when native support is added:
   * https://linear.app/bsport/issue/KAI-550/table-sticky-column
   */
  const stickyLastColumnClasses = [
    // Body rows: sticky last cell with default surface background
    "[&_[data-component='Kaizen-Table-Row']_[data-component='Kaizen-Table-Cell']:last-child]:sticky",
    "[&_[data-component='Kaizen-Table-Row']_[data-component='Kaizen-Table-Cell']:last-child]:-right-md",
    "[&_[data-component='Kaizen-Table-Row']_[data-component='Kaizen-Table-Cell']:last-child]:bg-surface-default",
    "[&_[data-component='Kaizen-Table-Row']_[data-component='Kaizen-Table-Cell']:last-child]:z-[2]",
    // Header row: sticky last cell with weaker header background
    "[&_[data-component='Kaizen-Table-Header']_[data-component='Kaizen-Table-Cell']:last-child]:sticky",
    "[&_[data-component='Kaizen-Table-Header']_[data-component='Kaizen-Table-Cell']:last-child]:-right-md",
    "[&_[data-component='Kaizen-Table-Header']_[data-component='Kaizen-Table-Cell']:last-child]:bg-surface-default-weaker",
    "[&_[data-component='Kaizen-Table-Header']_[data-component='Kaizen-Table-Cell']:last-child]:z-[3]",
  ];

  /**
   * TODO: The modal content has always padding (1rem)
   * Remove this padding via a prop or make it generic for all modals on mobile:
   * https://linear.app/bsport/issue/KAI-549/modal-option-to-have-no-padding
   */
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
          className={cx(isMobile && stickyLastColumnClasses)}
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
