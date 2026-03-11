import { useMemo } from "react";

import { Body, type GenericTableColumn } from "@bsport/kaizen-primitive-core";

import { AvatarWithName } from "#src/components/avatar-with-name";
import { useTranslation } from "#src/utils/i18n";

import { GiftcardPurchaseStatusChip } from "../giftcard-purchase-status";
import {
  AVAILABLE_COLUMNS,
  type AvailableColumn,
  type TableRowData,
} from "./constants";

type TableColumn = GenericTableColumn<TableRowData>;

export const useTableColumns = ({
  selectedColumns,
}: {
  selectedColumns: Record<AvailableColumn, boolean>;
}) => {
  const { t, i18n } = useTranslation("giftcard-details");

  const columnBuilders = useMemo<Record<AvailableColumn, TableColumn>>(() => {
    const columnIssueDate: TableColumn = {
      id: "giftcard-purchases-issue-date",
      header: t("purchases.table.columns.issueDate"),
      keyPath: "issueDate",
      type: "date",
      align: "start",
    };

    const columnStatus: TableColumn = {
      id: "giftcard-purchases-status",
      header: t("purchases.table.columns.status"),
      keyPath: "status",
      type: "custom",
      render: (row) => <GiftcardPurchaseStatusChip status={row.status} />,
      align: "start",
    };

    const columnBuyer: TableColumn = {
      id: "giftcard-purchases-buyer",
      header: t("purchases.table.columns.buyer"),
      type: "custom",
      align: "start",
      render: (row) => (
        <AvatarWithName
          name={row.buyer?.name}
          avatarSrc={row.buyer?.avatarSrc}
        />
      ),
    };

    const columnRecipient: TableColumn = {
      id: "giftcard-purchases-recipient",
      header: t("purchases.table.columns.recipient"),
      type: "custom",
      align: "start",
      render: (row) => {
        if (!row.recipient) {
          return (
            <Body size="md" color="default">
              {t("purchases.table.rows.emptyRecipient")}
            </Body>
          );
        }
        return (
          <AvatarWithName
            name={row.recipient?.name}
            avatarSrc={row.recipient?.avatarSrc}
          />
        );
      },
    };

    const columnExpiryDate: TableColumn = {
      id: "giftcard-purchases-expiry-date",
      header: t("purchases.table.columns.expiryDate"),
      keyPath: "expiryDate",
      type: "string",
      align: "start",
    };

    const columnPrintableCode: TableColumn = {
      id: "giftcard-purchases-printable-code",
      header: t("purchases.table.columns.printableCode"),
      keyPath: "printableCode",
      type: "string",
      align: "start",
    };

    const columnValue: TableColumn = {
      id: "giftcard-purchases-value",
      header: t("purchases.table.columns.value"),
      keyPath: "value",
      type: "price",
      align: "start",
    };

    const columnBalance: TableColumn = {
      id: "giftcard-purchases-balance",
      header: t("purchases.table.columns.balance"),
      keyPath: "balance",
      type: "price",
      priceColoring: {
        positive: "info",
      },
      align: "start",
    };

    return {
      balance: columnBalance,
      buyer: columnBuyer,
      "expiry-date": columnExpiryDate,
      "issue-date": columnIssueDate,
      "printable-code": columnPrintableCode,
      recipient: columnRecipient,
      status: columnStatus,
      value: columnValue,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColumns, i18n.language]);

  return Object.values(AVAILABLE_COLUMNS)
    .filter((col) => selectedColumns[col])
    .map((col) => columnBuilders[col]);
};
