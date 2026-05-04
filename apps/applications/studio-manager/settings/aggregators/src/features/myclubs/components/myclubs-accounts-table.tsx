import { type FC, useMemo } from "react";

import {
  Button,
  type GenericTableColumn,
  Table,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { AccountRow } from "../adapters/account-row";
import { AccountStatusChip } from "./account-status-chip";
import { EstablishmentChips } from "./establishment-chips";
import { MyclubsRowActions } from "./myclubs-row-actions";

type TableColumn = GenericTableColumn<AccountRow>;

type MyclubsAccountsTableProps = {
  rows: AccountRow[];
};

export const MyclubsAccountsTable: FC<MyclubsAccountsTableProps> = ({
  rows,
}) => {
  const { t } = useTranslation("common");
  const { copyToClipboard } = useCopyToClipboard();

  const columns = useMemo<TableColumn[]>(
    () => [
      {
        id: "myclubs-external-id",
        header: t("myclubs.table.columns.partnerId"),
        type: "custom",
        align: "start",
        render: (row) => {
          const partnerId = row.externalId;
          return (
            <Button
              className="max-w-full"
              iconLeft="copy-07"
              label={partnerId}
              intent="flat"
              size="md"
              color="default"
              onClick={() => {
                copyToClipboard(partnerId);
              }}
              aria-label={t("myclubs.table.actions.copyId")}
            />
          );
        },
      },
      {
        id: "myclubs-establishments",
        header: t("myclubs.table.columns.establishments"),
        type: "custom",
        align: "start",
        render: (row) => (
          <EstablishmentChips establishments={row.establishments} />
        ),
      },
      {
        id: "myclubs-status",
        header: t("myclubs.table.columns.status"),
        type: "custom",
        align: "center",
        render: (row) => <AccountStatusChip status={row.status} />,
      },
      {
        id: "myclubs-actions",
        header: "",
        type: "custom",
        align: "end",
        render: (row) => <MyclubsRowActions status={row.status} />,
      },
    ],
    [copyToClipboard, t],
  );

  return (
    <div className="w-full overflow-x-auto">
      <Table
        columns={columns}
        rows={rows}
        rowHeight="lg"
        emptyStateProps={{
          isEmpty: rows.length === 0,
          emptyConfig: {
            title: t("myclubs.table.empty.title"),
            subtitle: t("myclubs.table.empty.subtitle"),
          },
        }}
      />
    </div>
  );
};
