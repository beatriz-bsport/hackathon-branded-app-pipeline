import type { FC } from "react";

import type { PlatformInvoice } from "@bsport/api-financial-services";
import { formatPriceWithCurrency } from "@bsport/currency";
import { fromIsoString, toLocaleString } from "@bsport/datetime-manipulation";
import {
  Body,
  Button,
  Card,
  Chip,
  type GenericTableColumn,
  Table,
  Title,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import {
  ACTIONABLE_STATUSES,
  DISPUTED_STATUSES,
  FAILED_STATUSES,
  MISSING_CHARGE_STATUSES,
  PAID_STATUSES,
  PENDING_STATUSES,
  getInvoiceStatusChipColor,
} from "#src/utils/platform-invoice-status";

const InvoiceStatusChip: FC<{ status: PlatformInvoice["status"] }> = ({
  status,
}) => {
  const { t } = useTranslation("subscription");

  const label = PAID_STATUSES.includes(status)
    ? t("billing.invoice-history.status.paid")
    : FAILED_STATUSES.includes(status)
      ? t("billing.invoice-history.status.failed")
      : DISPUTED_STATUSES.includes(status)
        ? t("billing.invoice-history.status.disputed")
        : MISSING_CHARGE_STATUSES.includes(status)
          ? t("billing.invoice-history.status.missing-charge")
          : PENDING_STATUSES.includes(status)
            ? t("billing.invoice-history.status.pending")
            : t("billing.invoice-history.status.cancelled");

  return (
    <Chip
      type="weak"
      color={getInvoiceStatusChipColor(status)}
      size="lg"
      label={label}
    />
  );
};

type BillingInvoiceHistorySectionProps = {
  invoices: PlatformInvoice[];
  currencyDisplay: string;
  payInvoice: (paymentBackendId: string) => void;
  isPayingInvoice: boolean;
};

const BillingInvoiceHistorySection: FC<BillingInvoiceHistorySectionProps> = ({
  invoices,
  currencyDisplay,
  payInvoice,
  isPayingInvoice,
}) => {
  const { t, i18n } = useTranslation("subscription");

  const columns: GenericTableColumn<PlatformInvoice>[] = [
    {
      id: "invoice",
      header: t("billing.invoice-history.columns.invoice"),
      type: "custom",
      render: (row) => <Body size="sm">{row.id}</Body>,
    },
    {
      id: "date",
      header: t("billing.invoice-history.columns.date"),
      type: "custom",
      render: (row) => {
        const isoDate = `${row.year}-${String(row.month).padStart(2, "0")}-01`;
        const formatted = toLocaleString({
          datetime: fromIsoString(isoDate, { locale: i18n.language }),
          formatOptions: { year: "numeric", month: "long" },
        });
        return <Body size="sm">{formatted}</Body>;
      },
    },
    {
      id: "amount",
      header: t("billing.invoice-history.columns.amount"),
      type: "custom",
      render: (row) => (
        <Body size="sm">
          {formatPriceWithCurrency(row.total_price_cts / 100, currencyDisplay)}
        </Body>
      ),
    },
    {
      id: "status",
      header: t("billing.invoice-history.columns.status"),
      type: "custom",
      render: (row) => <InvoiceStatusChip status={row.status} />,
    },
    {
      id: "actions",
      header: "",
      type: "custom",
      align: "end",
      render: (row) => (
        <div className="flex items-center gap-xs justify-end">
          {ACTIONABLE_STATUSES.includes(row.status) && (
            <Button
              label={t("billing.invoice-history.pay-now")}
              kind="default"
              intent="call-to-action"
              color="main"
              size="md"
              disabled={isPayingInvoice}
              onClick={() => payInvoice(row.payment_backend_id)}
            />
          )}
          {row.pdf_url && (
            <Button
              label={t("billing.invoice-history.download")}
              intent="flat"
              color="main"
              size="md"
              iconLeft="download-01"
              onClick={() =>
                window.open(row.pdf_url, "_blank", "noopener,noreferrer")
              }
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-sm">
      <Title htmlVariant="h2" weight="strong">
        {t("billing.invoice-history.title")}
      </Title>
      <Card padding="none" className="min-w-0 w-full overflow-x-auto">
        <Table
          columns={columns}
          rows={invoices}
          selectable={false}
          rowHeight="lg"
          withHorizontalDivider
          emptyStateProps={{
            isEmpty: invoices.length === 0,
            emptyConfig: { title: t("billing.invoice-history.empty") },
          }}
        />
      </Card>
    </section>
  );
};

export default BillingInvoiceHistorySection;
