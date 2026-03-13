import type { FC } from "react";

import type { PayoutListItem } from "@bsport/api-financial-services";
import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Alert,
  Body,
  Button,
  Chip,
  type ChipProps,
  DetailDrawer,
  Divider,
  Title,
  Tooltip,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import {
  getStatusColor,
  getStatusKey,
} from "#src/components/payout-table/payout-status";
import { DISPLAY_TYPES } from "#src/constants/display-types";
import { usePayoutDetail } from "#src/hooks/use-payout-detail";
import { copyPayoutIdToClipboard } from "#src/utils/copy-payout-id-to-clipboard";
import { useTranslation } from "#src/utils/i18n";

export type PayoutDetailDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onDetailedPayoutClick: () => void;
  row: PayoutListItem;
};

const RECONCILIATION_STATUS_KEYS = [
  "pending",
  "processing",
  "completed",
  "partially_failed",
  "skipped_manual",
  "unknown",
] as const;

type ReconciliationStatusKey = (typeof RECONCILIATION_STATUS_KEYS)[number];

const RECONCILIATION_STATUS_I18N_KEYS: Record<
  ReconciliationStatusKey,
  | "drawer.reconciliationStatusPayoutStatus.pending"
  | "drawer.reconciliationStatusPayoutStatus.processing"
  | "drawer.reconciliationStatusPayoutStatus.completed"
  | "drawer.reconciliationStatusPayoutStatus.partially_failed"
  | "drawer.reconciliationStatusPayoutStatus.skipped_manual"
  | "drawer.reconciliationStatusPayoutStatus.unknown"
> = {
  pending: "drawer.reconciliationStatusPayoutStatus.pending",
  processing: "drawer.reconciliationStatusPayoutStatus.processing",
  completed: "drawer.reconciliationStatusPayoutStatus.completed",
  partially_failed: "drawer.reconciliationStatusPayoutStatus.partially_failed",
  skipped_manual: "drawer.reconciliationStatusPayoutStatus.skipped_manual",
  unknown: "drawer.reconciliationStatusPayoutStatus.unknown",
};

const RECONCILIATION_STATUS_COLORS: Record<
  ReconciliationStatusKey,
  ChipProps["color"]
> = {
  pending: "warning",
  processing: "info",
  completed: "positive",
  partially_failed: "critical",
  skipped_manual: "warning",
  unknown: "default",
};

function getReconciliationStatusKey(
  status: string | undefined,
): ReconciliationStatusKey {
  const key = status as ReconciliationStatusKey;
  return RECONCILIATION_STATUS_KEYS.includes(key) ? key : "unknown";
}

function getReconciliationStatusColor(
  status: string | undefined,
): ChipProps["color"] {
  return RECONCILIATION_STATUS_COLORS[getReconciliationStatusKey(status)];
}

type ReconciliationStatusTranslationKey =
  (typeof RECONCILIATION_STATUS_I18N_KEYS)[ReconciliationStatusKey];

function getReconciliationStatusLabel(
  status: string | undefined,
  t: (key: ReconciliationStatusTranslationKey) => string,
): string {
  return t(RECONCILIATION_STATUS_I18N_KEYS[getReconciliationStatusKey(status)]);
}

export const PayoutDetailDrawer: FC<PayoutDetailDrawerProps> = ({
  isOpen,
  onClose,
  onDetailedPayoutClick,
  row,
}) => {
  const { i18n, t } = useTranslation("payout");
  const companyTimezone = dataAccessLayer.useCompanyTheme()?.timezone_name;
  const { detail, error, isFetching } = usePayoutDetail({
    payoutId: row.id,
    enabled: isOpen,
  });

  const hasPreviousPayouts = row.amount_cts_from_previous_included_payouts > 0;
  const stats = detail?.balance_transaction_stats;
  const isSummaryLoading = isFetching && !error;

  return (
    <DetailDrawer id="payout-detail-drawer" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-xs">
        <Title htmlVariant="h2" weight="strong">
          {t("drawer.detailsTitle")}
        </Title>

        <div className="flex flex-col gap-xs">
          <div className="flex gap-xs justify-between">
            <Body size="lg" weight="weak">
              {t("drawer.date")}
            </Body>
            <Body size="lg" weight="weak">
              {formatDateTime(
                row.payment_provider_date_created,
                DATETIME_FORMATS.MEDIUM_DATE,
                {
                  locale: i18n.language,
                  timeZone: companyTimezone,
                },
              )}
            </Body>
          </div>
          <div className="flex gap-xs justify-between">
            <Body size="lg" weight="weak">
              {t("drawer.amount")}
            </Body>
            <Body size="lg" weight="weak">
              {getCurrencyDisplayWithPrice(row.amount_cts / 100)}
            </Body>
          </div>
          <div className="flex gap-xs justify-between">
            <Body size="lg" weight="weak">
              {t("drawer.transactions")}
            </Body>
            <Body size="lg" weight="weak">
              {row.balance_transaction_count}
            </Body>
          </div>
          <div className="flex gap-xs justify-between">
            <Body size="lg" weight="weak">
              {t("drawer.id")}
            </Body>
            <Tooltip label={t("table.copyForReport")} placement="bottom">
              <Button
                intent="flat"
                color="default"
                size="sm"
                iconLeft="copy-07"
                label={row.readable_identifier}
                onClick={async (e) => {
                  e.stopPropagation();
                  await copyPayoutIdToClipboard(row.readable_identifier, {
                    successDescription: t("table.copyForReportSuccess"),
                    failureDescription: t("table.copyForReportFailure"),
                  });
                }}
              />
            </Tooltip>
          </div>
          <div className="flex gap-xs justify-between">
            <Body size="lg" weight="weak">
              {t("drawer.status")}
            </Body>
            <Chip
              label={t(`status.${getStatusKey(row.status)}`)}
              color={getStatusColor(row.status)}
              size="lg"
              type="weak"
            />
          </div>
        </div>
      </div>

      {hasPreviousPayouts && (
        <Alert status="info" type="weak">
          {t("drawer.previouslyIncludedPayouts", {
            amount: getCurrencyDisplayWithPrice(
              row.amount_cts_from_previous_included_payouts / 100,
            ),
          })}
        </Alert>
      )}

      <Divider orientation="horizontal" weight="thin" />

      <Title htmlVariant="h2" weight="strong">
        {t("drawer.summaryTitle")}
      </Title>

      {error && (
        <Alert status="critical" type="weak">
          {t("drawer.summaryLoadError")}
        </Alert>
      )}

      {isSummaryLoading && (
        <Body size="lg" weight="weak">
          {t("drawer.loading")}
        </Body>
      )}

      {!isSummaryLoading && stats && (
        <div className="flex flex-col gap-2xs">
          {/* Reconciliation row (always first) */}
          <div className="flex justify-between">
            <Body size="lg" weight="weak">
              {t("drawer.reconciliation")}
            </Body>
            <Chip
              label={getReconciliationStatusLabel(
                detail?.reconciliation_status,
                t,
              )}
              color={getReconciliationStatusColor(
                detail?.reconciliation_status,
              )}
              size="lg"
              type="weak"
            />
          </div>

          {Object.entries(stats.by_display_type).map(([key, stat]) => {
            // Skip summarizing the 'payout' display type since it's redundant with the top-level payout information.
            if (key === "payout") return null;

            const hasValue = stat.count > 0 || stat.amount_cts !== 0;
            if (!hasValue) return null;

            const label = DISPLAY_TYPES.includes(
              key as (typeof DISPLAY_TYPES)[number],
            )
              ? t(`drawer.summary.${key}` as "drawer.summary.payment")
              : key;

            const hasCount = stat.count > 0;
            const hasAmount = stat.amount_cts !== 0;
            const value =
              hasCount && hasAmount
                ? `${stat.count} (${getCurrencyDisplayWithPrice(
                    stat.amount_cts / 100,
                  )})`
                : hasCount
                  ? String(stat.count)
                  : getCurrencyDisplayWithPrice(stat.amount_cts / 100);

            return (
              <div key={key} className="flex justify-between">
                <Body size="lg" weight="weak">
                  {label}
                </Body>
                <Body size="lg" weight="weak">
                  {value}
                </Body>
              </div>
            );
          })}

          {(stats.no_display_type.count > 0 ||
            stats.no_display_type.amount_cts !== 0) && (
            <div className="flex justify-between">
              <Body size="lg" weight="weak">
                {t("drawer.summary.no_display_type")}
              </Body>
              <Body size="lg" weight="weak">
                {stats.no_display_type.count > 0 &&
                stats.no_display_type.amount_cts !== 0
                  ? `${stats.no_display_type.count} (${getCurrencyDisplayWithPrice(
                      stats.no_display_type.amount_cts / 100,
                    )})`
                  : stats.no_display_type.count > 0
                    ? stats.no_display_type.count
                    : getCurrencyDisplayWithPrice(
                        stats.no_display_type.amount_cts / 100,
                      )}
              </Body>
            </div>
          )}
        </div>
      )}

      <Divider orientation="horizontal" weight="thin" />

      <Button
        intent="default"
        color="main"
        size="md"
        label={t("drawer.detailedPayout")}
        onClick={onDetailedPayoutClick}
      />
    </DetailDrawer>
  );
};
