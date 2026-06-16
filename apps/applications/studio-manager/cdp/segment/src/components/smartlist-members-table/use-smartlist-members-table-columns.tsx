import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import {
  Body,
  CopyToClipboard,
  type GenericTableColumn,
} from "@bsport/kaizen-primitive-core";

import { MemberAvatar } from "#src/components/member-avatar";
import { useTranslation } from "#src/utils/i18n";

import { SmartlistMembersTableRow } from "./types";

type TableColumn = GenericTableColumn<SmartlistMembersTableRow>;

const EMPTY_CELL = (
  <Body htmlVariant="span" size="md" color="weak">
    —
  </Body>
);

/**
 * Returns column definitions for the smartlist members table.
 */
export const useSmartlistMembersTableColumns = (): TableColumn[] => {
  const { t } = useTranslation("details");

  return [
    {
      header: t("membersTable.columns.name"),
      id: "smartlist-member-name",
      type: "custom",
      align: "start",
      render: (row) => (
        <div className="flex min-w-0 flex-row items-center gap-sm">
          <MemberAvatar name={row.name} />
          <Body
            className="block truncate"
            size="md"
            htmlVariant="span"
            weight="weak"
          >
            {row.name}
          </Body>
        </div>
      ),
    },
    {
      header: t("membersTable.columns.email"),
      id: "smartlist-member-email",
      type: "custom",
      align: "start",
      render: (row) =>
        row.email ? (
          <CopyToClipboard
            label={row.email}
            color="default"
            intent="flat"
            size="md"
          />
        ) : (
          EMPTY_CELL
        ),
    },
    {
      header: t("membersTable.columns.balance"),
      id: "smartlist-member-balance",
      type: "custom",
      align: "start",
      render: (row) => {
        const balanceColor =
          row.balance > 0
            ? "positive"
            : row.balance < 0
              ? "critical"
              : undefined;

        return (
          <Body htmlVariant="span" size="md" color={balanceColor}>
            {getCurrencyDisplayWithPrice(row.balance, row.balance < 0)}
          </Body>
        );
      },
    },
    {
      header: t("membersTable.columns.joinDate"),
      id: "smartlist-member-join-date",
      type: "custom",
      align: "start",
      render: (row) => (
        <Body htmlVariant="span" size="md">
          {row.joinDateLabel}
        </Body>
      ),
    },
  ];
};
