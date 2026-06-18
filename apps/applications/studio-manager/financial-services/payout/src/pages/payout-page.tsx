import { type FC, useCallback, useState } from "react";

import { type PayoutListItem } from "@bsport/api-financial-services/payout";
import { PAYMENT_GROUP_METHOD_IDENTIFIER_PAYPAL_WALLET } from "@bsport/common/lib/master-data/payment-group";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Alert,
  Chip,
  List,
  type ListItemProps,
  ListLayout,
  Tooltip,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { PayoutBalanceTransactionsModal } from "#src/components/payout-balance-transactions-modal";
import { PayoutDetailDrawer } from "#src/components/payout-detail-drawer/payout-detail-drawer";
import { PayoutInformation } from "#src/components/payout-information";
import {
  PayoutTable,
  usePayoutTableColumns,
} from "#src/components/payout-table";
import {
  getStatusColor,
  getStatusKey,
} from "#src/components/payout-table/payout-status";
import type { PayoutTableRow } from "#src/components/payout-table/types";
import { usePaginatedPayouts } from "#src/hooks/use-paginated-payouts";
import { useTranslation } from "#src/utils/i18n";

const PayoutPage: FC = () => {
  const { t, i18n } = useTranslation("payout");
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const companyTimezone = companyTheme?.timezone_name;
  const hasPaypalActivated = [
    ...(companyTheme?.payment_method_available ?? []),
    ...(companyTheme?.payment_method_available_basket ?? []),
    ...(companyTheme?.payment_method_available_subscription ?? []),
    ...(companyTheme?.payment_method_available_manager ?? []),
  ].includes(PAYMENT_GROUP_METHOD_IDENTIFIER_PAYPAL_WALLET);

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

  const isMobile = !useMatchMedia("lg");

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
          ...payout,
          date: payout.payment_provider_date_created,
          amount: payout.amount_cts / 100,
          readableId: payout.readable_identifier,
          reconciliationStatus: payout.reconciliation_status,
          onRowClick: () => {
            setSelectedRow(payout);
            setIsDrawerOpen(true);
          },
        }));

  const mobileItems: ListItemProps[] = rows.map((row) => ({
    id: `payout-${row.id}`,
    title: formatDateTime(row.date, DATETIME_FORMATS.MEDIUM_DATE, {
      locale: i18n.language,
      timeZone: companyTimezone,
    }),
    description: getCurrencyDisplayWithPrice(row.amount),
    customNode: (
      <div className="flex flex-row gap-sm">
        {row.reconciliationStatus === "partially_failed" && (
          <Tooltip
            label={t("table.couldNotBeReconciled")}
            placement="bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <Chip
              color="warning"
              size="lg"
              type="weak"
              iconLeft="alert-triangle"
            />
          </Tooltip>
        )}
        <Chip
          label={t(`status.${getStatusKey(row.status)}`)}
          color={getStatusColor(row.status)}
          size="lg"
          type="weak"
        />
      </div>
    ),
    onClick: row.onRowClick,
    isActive: (isDrawerOpen || isModalOpen) && selectedRow?.id === row.id,
  }));

  const emptyStateProps = {
    isEmpty: !error && !isFetching && rows.length === 0,
    emptyConfig: {
      title: t("emptyTable.title"),
      subtitle: t("emptyTable.description"),
      className: "h-full justify-center",
    },
  };

  const loadingProps = {
    isLoading: isFetching && rows.length === 0,
    message: t("loading"),
  };

  const layoutEndGroupActions = [
    <PayoutInformation key="payout-information-popover" />,
  ];

  return (
    <ListLayout className="w-full">
      <ListLayout.Header
        pageTitle={t("title")}
        endGroupActions={layoutEndGroupActions}
      />
      <ListLayout.Content className="flex flex-col">
        {hasPaypalActivated ? (
          <Alert
            layout="banner-flush"
            status="warning"
            type="weak"
            title={t("paypalWarning.title")}
          >
            {t("paypalWarning.description")}
          </Alert>
        ) : null}
        {error != null ? (
          <Alert status="critical" type="weak">
            {t("emptyTable.loadError")}
          </Alert>
        ) : null}
        {isMobile ? (
          <List
            id="payouts-mobile-list"
            items={mobileItems}
            paginationProps={paginationProps}
            emptyStateProps={emptyStateProps}
            loadingProps={loadingProps}
          />
        ) : (
          <PayoutTable
            columns={columns}
            rows={rows}
            paginationProps={paginationProps}
            emptyStateProps={emptyStateProps}
            loadingProps={loadingProps}
          />
        )}
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
