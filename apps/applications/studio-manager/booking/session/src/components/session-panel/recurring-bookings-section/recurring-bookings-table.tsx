import { type FC, useMemo } from "react";

import { Table } from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { useObjectLevelPermission } from "#src/utils/permission";

import type { RecurringBookingRow } from "./build-recurring-booking-rows";
import { buildRecurringBookingColumns } from "./columns";

export const RecurringBookingsTable: FC<{ rows: RecurringBookingRow[] }> = ({
  rows,
}) => {
  const { t, i18n } = useTranslation("sessionManagement");
  const intlLocale = i18n?.language;
  const canAccessProfile = useObjectLevelPermission(
    "member.allowed_actions.accessProfile",
  );

  const columns = useMemo(
    () => buildRecurringBookingColumns(t, canAccessProfile, intlLocale),
    [t, canAccessProfile, intlLocale],
  );

  const tableRows = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        onRowClick: canAccessProfile
          ? () =>
              window.open(
                LEGACY_URLS.MEMBER_BOOKINGS(row.memberId),
                "_blank",
                "noopener,noreferrer",
              )
          : undefined,
      })),
    [rows, canAccessProfile],
  );

  // No bordered card: in a modal, the modal *is* the card. A border + overflow-hidden
  // here would clip the table at narrow widths; rendering it directly lets the modal
  // body scroll horizontally instead (matches the payout balance-transactions modal).
  return <Table columns={columns} rowHeight="lg" rows={tableRows} />;
};
