import {
  Button,
  Chip,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { copyPayoutIdToClipboard } from "#src/utils/copy-payout-id-to-clipboard";
import { useTranslation } from "#src/utils/i18n";

import { getStatusColor, getStatusKey } from "./payout-status";
import type { PayoutTableRow } from "./types";

type TableColumn = GenericTableColumn<PayoutTableRow>;

type UsePayoutTableColumnsParams = {
  onDetailedClick: (id: number | string) => void;
};

const PAYOUT_RECONCILIATION_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  PARTIALLY_FAILED: "partially_failed",
  SKIPPED_MANUAL: "skipped_manual",
} as const;

export const usePayoutTableColumns = ({
  onDetailedClick,
}: UsePayoutTableColumnsParams): TableColumn[] => {
  const { t } = useTranslation("payout");

  return [
    {
      id: "date",
      keyPath: "date",
      header: t("table.date"),
      type: "date",
    },
    {
      id: "amount",
      keyPath: "amount",
      header: t("table.amount"),
      type: "price",
      align: "end",
    },
    {
      id: "transactions",
      keyPath: "transactions",
      header: t("table.transactions"),
      type: "number",
    },
    {
      id: "readableId",
      header: t("table.id"),
      type: "custom",
      render: (row) => (
        <Tooltip label={t("table.copyForReport")} placement="bottom">
          <Button
            intent="flat"
            color="default"
            size="sm"
            iconLeft="copy-07"
            label={row.readableId}
            onClick={async (e) => {
              e.stopPropagation();
              await copyPayoutIdToClipboard(row.readableId, {
                successDescription: t("table.copyForReportSuccess"),
                failureDescription: t("table.copyForReportFailure"),
              });
            }}
          />
        </Tooltip>
      ),
    },
    {
      id: "status",
      header: t("table.status"),
      type: "custom",
      render: (row) => (
        <div className="flex flex-row gap-sm">
          <Chip
            label={t(`status.${getStatusKey(row.status)}`)}
            color={getStatusColor(row.status)}
            size="lg"
            type="weak"
          />
          {row.reconciliationStatus ===
            PAYOUT_RECONCILIATION_STATUS.PARTIALLY_FAILED && (
            <Tooltip label={t("table.couldNotBeReconciled")} placement="bottom">
              <Chip
                color="warning"
                size="lg"
                type="weak"
                iconLeft="alert-triangle"
              />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      id: "detailed",
      header: "",
      type: "custom",
      align: "center",
      render: (row) => (
        <Button
          intent="default"
          color="main"
          size="md"
          label={t("table.transactions")}
          onClick={(e) => {
            e.stopPropagation();
            onDetailedClick(row.id);
          }}
        />
      ),
    },
  ];
};
