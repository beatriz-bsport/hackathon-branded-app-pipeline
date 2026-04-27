import { FC } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { Chip } from "@bsport/kaizen-primitive-core";

import { IconChip } from "#src/components/common/IconChip";
import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import { useSessionManagementStore } from "#src/stores/session-management/store.js";
import { BookingListedInformation } from "#src/stores/session-management/types.js";
import type { RefinedBooking } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

type ChipsCellProps = Pick<
  RefinedBooking,
  "recurrence_rule_booking" | "first_in_company" | "memberData"
>;

const baseChipsProps = {
  size: "lg" as const,
  color: "default" as const,
  type: "weak" as const,
};

export const ChipsCell: FC<ChipsCellProps> = ({
  recurrence_rule_booking,
  first_in_company,
  memberData,
}) => {
  const { t } = useTranslation("sessionManagement");
  const { tags, total_unpaid_amount } = memberData ?? {};
  const unpaidAmount = Number(total_unpaid_amount ?? 0);

  const listedInformation = useSessionManagementStore(
    (state) => state.listedInformation,
  );

  return (
    <div className="flex items-center gap-xs">
      {first_in_company &&
        listedInformation.includes(BookingListedInformation.NEW_MEMBER) && (
          <Chip {...baseChipsProps} label={t("bookingsTable.chips.new")} />
        )}
      {recurrence_rule_booking &&
        listedInformation.includes(
          BookingListedInformation.RECURRING_BOOKING,
        ) && (
          <IconChip
            icon="refresh-ccw-02"
            tooltip={t("bookingsTable.chips.recurring")}
          />
        )}
      {unpaidAmount > 0 &&
        listedInformation.includes(
          BookingListedInformation.UNPAID_INVOICES,
        ) && (
          <Chip
            color="critical"
            type="weak"
            size="lg"
            label={getCurrencyDisplayWithPrice(unpaidAmount, true)}
          />
        )}
      {!!tags?.length &&
        listedInformation.includes(BookingListedInformation.TAGS) && (
          <ResponsiveTooltip
            label={t("bookingsTable.chips.tags")}
            placement="bottom"
            className="whitespace-normal"
          >
            <Chip
              {...baseChipsProps}
              label={tags.length.toString()}
              iconLeft="tag-01"
            />
          </ResponsiveTooltip>
        )}
    </div>
  );
};
