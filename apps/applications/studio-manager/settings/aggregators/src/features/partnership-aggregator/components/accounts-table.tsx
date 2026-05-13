import { type FC, type ReactNode, useMemo } from "react";

import {
  Button,
  type GenericTableColumn,
  Table,
  useCopyToClipboard,
} from "@bsport/kaizen-primitive-core";

import { type TFunction, useTranslation } from "#src/utils/i18n";

import type { AccountRow } from "../adapters/account-row";
import type { AggregatorNamespace } from "../types";
import { AccountStatusChip } from "./account-status-chip";
import { EstablishmentChips } from "./establishment-chips";

type TableColumn = GenericTableColumn<AccountRow>;

const COLUMN_KEYS = {
  myclubs: {
    partnerId: "myclubs.table.columns.partnerId",
    establishments: "myclubs.table.columns.establishments",
    status: "myclubs.table.columns.status",
    copyId: "myclubs.table.actions.copyId",
    emptyTitle: "myclubs.table.empty.title",
    emptySubtitle: "myclubs.table.empty.subtitle",
  },
  wellhub: {
    partnerId: "wellhub.table.columns.partnerId",
    establishments: "wellhub.table.columns.establishments",
    status: "wellhub.table.columns.status",
    copyId: "wellhub.table.actions.copyId",
    emptyTitle: "wellhub.table.empty.title",
    emptySubtitle: "wellhub.table.empty.subtitle",
  },
  usc: {
    partnerId: "usc.table.columns.partnerId",
    establishments: "usc.table.columns.establishments",
    status: "usc.table.columns.status",
    copyId: "usc.table.actions.copyId",
    emptyTitle: "usc.table.empty.title",
    emptySubtitle: "usc.table.empty.subtitle",
  },
} as const satisfies Record<
  AggregatorNamespace,
  Record<string, Parameters<TFunction>[0]>
>;

type AccountsTableProps = {
  rows: AccountRow[];
  namespace: AggregatorNamespace;
  readOnly?: boolean;
  renderRowActions: (row: AccountRow) => ReactNode;
};

export const AccountsTable: FC<AccountsTableProps> = ({
  rows,
  namespace,
  readOnly,
  renderRowActions,
}) => {
  const { t } = useTranslation("common");
  const { copyToClipboard } = useCopyToClipboard();
  const keys = COLUMN_KEYS[namespace];

  const columns = useMemo<TableColumn[]>(
    () => [
      {
        id: "external-id",
        header: t(keys.partnerId),
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
              onClick={() => copyToClipboard(partnerId)}
              aria-label={t(keys.copyId)}
            />
          );
        },
      },
      {
        id: "establishments",
        header: t(keys.establishments),
        type: "custom",
        align: "start",
        render: (row) => (
          <EstablishmentChips
            establishments={row.establishments}
            namespace={namespace}
            readOnly={readOnly}
          />
        ),
      },
      {
        id: "status",
        header: t(keys.status),
        type: "custom",
        align: "center",
        render: (row) => (
          <AccountStatusChip status={row.status} namespace={namespace} />
        ),
      },
      {
        id: "actions",
        header: "",
        type: "custom",
        align: "end",
        render: (row) => renderRowActions(row),
      },
    ],
    [copyToClipboard, t, keys, namespace, readOnly, renderRowActions],
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
            title: t(keys.emptyTitle),
            subtitle: t(keys.emptySubtitle),
          },
        }}
      />
    </div>
  );
};
