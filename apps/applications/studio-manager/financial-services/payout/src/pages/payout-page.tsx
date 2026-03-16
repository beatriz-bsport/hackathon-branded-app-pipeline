import { type FC, useCallback, useState } from "react";

import { type PayoutListItem } from "@bsport/api-financial-services/payout";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Alert, ListLayout } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { PayoutBalanceTransactionsModal } from "#src/components/payout-balance-transactions-modal";
import { PayoutDetailDrawer } from "#src/components/payout-detail-drawer/payout-detail-drawer";
import {
  PayoutTable,
  usePayoutTableColumns,
} from "#src/components/payout-table";
import type { PayoutTableRow } from "#src/components/payout-table/types";
import { usePaginatedPayouts } from "#src/hooks/use-paginated-payouts";
import { useTranslation } from "#src/utils/i18n";

const PayoutPage: FC = () => {
  const { t, i18n } = useTranslation("payout");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const { payouts, paginationProps, isFetching, error } = usePaginatedPayouts();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PayoutListItem | null>(null);

  const onDetailedClick = useCallback(
    (id: number | string) => {
      const numericId = typeof id === "string" ? Number(id) : id;
      const payout = payouts.find((item) => item.id === numericId);

      if (!payout) return;

      setSelectedRow(payout);
      setIsDrawerOpen(false);
      setIsModalOpen(true);
    },
    [payouts],
  );

  const columns = usePayoutTableColumns({ onDetailedClick });

  const modalDate = selectedRow
    ? formatDateTime(
        selectedRow.payment_provider_date_created,
        DATETIME_FORMATS.MEDIUM_DATE,
        { locale: i18n.language, timeZone: companyTimezone },
      )
    : "";

  const rows: PayoutTableRow[] =
    error || !Array.isArray(payouts)
      ? []
      : payouts.map((payout) => ({
          id: payout.id,
          date: payout.payment_provider_date_created,
          amount: payout.amount_cts / 100,
          transactions: payout.balance_transaction_count,
          readableId: payout.readable_identifier,
          status: payout.status,
          reconciliationStatus: payout.reconciliation_status,
          onRowClick: () => {
            setSelectedRow(payout);
            setIsDrawerOpen(true);
          },
        }));

  return (
    <ListLayout className="w-full">
      <ListLayout.Header pageTitle={t("title")} />
      <ListLayout.Content className="flex flex-col gap-sm">
        {error != null ? (
          <Alert status="critical" type="weak">
            {t("emptyTable.loadError")}
          </Alert>
        ) : null}
        <PayoutTable
          columns={columns}
          rows={rows}
          paginationProps={paginationProps}
          emptyStateProps={{
            isEmpty: !error && !isFetching && rows.length === 0,
            emptyConfig: {
              title: t("emptyTable.title"),
              subtitle: t("emptyTable.description"),
              className: "h-full justify-center",
            },
          }}
          loadingProps={{
            isLoading: isFetching && rows.length === 0,
            message: t("loading"),
          }}
        />
      </ListLayout.Content>

      {selectedRow && (
        <PayoutDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onDetailedPayoutClick={() => setIsModalOpen(true)}
          row={selectedRow}
        />
      )}

      {selectedRow && (
        <PayoutBalanceTransactionsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          payout={selectedRow}
          dateLabel={modalDate}
        />
      )}
    </ListLayout>
  );
};

export default PayoutPage;
