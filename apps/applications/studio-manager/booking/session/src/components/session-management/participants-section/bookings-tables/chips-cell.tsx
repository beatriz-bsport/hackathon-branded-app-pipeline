import { FC } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import { Chip } from "@bsport/kaizen-primitive-core";

import { IconChip } from "#src/components/common/IconChip";
import { ResponsiveTooltip } from "#src/components/common/responsive-tooltip";
import { RefinedBooking } from "#src/hooks/booking/fetch/use-fetch-refined-bookings";
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

  return (
    <div className="flex items-center gap-xs">
      {first_in_company && (
        <Chip {...baseChipsProps} label={t("bookingsTable.chips.new")} />
      )}
      {recurrence_rule_booking && (
        <IconChip
          icon="refresh-ccw-02"
          tooltip={t("bookingsTable.chips.recurring")}
        />
      )}
      {unpaidAmount > 0 && (
        <Chip
          color="critical"
          type="weak"
          size="lg"
          label={getCurrencyDisplayWithPrice(unpaidAmount, true)}
        />
      )}
      {!!tags?.length && (
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
