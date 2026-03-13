import { type FC, useCallback, useState } from "react";

import { PayoutListItem } from "@bsport/api-financial-services";
import { Alert, ListLayout, Modal } from "@bsport/kaizen-primitive-core";

import { PayoutDetailDrawer } from "#src/components/payout-detail-drawer/payout-detail-drawer";
import {
  PayoutTable,
  usePayoutTableColumns,
} from "#src/components/payout-table";
import type { PayoutTableRow } from "#src/components/payout-table/types";
import { usePaginatedPayouts } from "#src/hooks/use-paginated-payouts";
import { useTranslation } from "#src/utils/i18n";

const PayoutPage: FC = () => {
  const { t } = useTranslation("payout");
  const { payouts, paginationProps, isLoading, error } = usePaginatedPayouts();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PayoutListItem | null>(null);

  const onDetailedClick = useCallback(() => setIsModalOpen(true), []);

  const columns = usePayoutTableColumns({ onDetailedClick });

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
            isEmpty: !error && !isLoading && rows.length === 0,
            emptyConfig: {
              title: t("emptyTable.title"),
              subtitle: t("emptyTable.description"),
              className: "h-full justify-center",
            },
          }}
          loadingProps={{
            isLoading: isLoading && rows.length === 0,
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

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        title=""
      />
    </ListLayout>
  );
};

export default PayoutPage;
