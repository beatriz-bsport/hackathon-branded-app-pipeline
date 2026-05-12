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
import { WellhubRowActions } from "./wellhub-row-actions";

type TableColumn = GenericTableColumn<AccountRow>;

type WellhubAccountsTableProps = {
  rows: AccountRow[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReactivate: (id: string) => void;
};

export const WellhubAccountsTable: FC<WellhubAccountsTableProps> = ({
  rows,
  onEdit,
  onDelete,
  onReactivate,
}) => {
  const { t } = useTranslation("common");
  const { copyToClipboard } = useCopyToClipboard();

  const columns = useMemo<TableColumn[]>(
    () => [
      {
        id: "wellhub-external-id",
        header: t("wellhub.table.columns.partnerId"),
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
              aria-label={t("wellhub.table.actions.copyId")}
            />
          );
        },
      },
      {
        id: "wellhub-establishments",
        header: t("wellhub.table.columns.establishments"),
        type: "custom",
        align: "start",
        render: (row) => (
          <EstablishmentChips establishments={row.establishments} />
        ),
      },
      {
        id: "wellhub-status",
        header: t("wellhub.table.columns.status"),
        type: "custom",
        align: "center",
        render: (row) => <AccountStatusChip status={row.status} />,
      },
      {
        id: "wellhub-actions",
        header: "",
        type: "custom",
        align: "end",
        render: (row) => (
          <WellhubRowActions
            status={row.status}
            onEdit={() => onEdit(row.id)}
            onDelete={() => onDelete(row.id)}
            onReactivate={() => onReactivate(row.id)}
          />
        ),
      },
    ],
    [copyToClipboard, t, onEdit, onDelete, onReactivate],
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
            title: t("wellhub.table.empty.title"),
            subtitle: t("wellhub.table.empty.subtitle"),
          },
        }}
      />
    </div>
  );
};
