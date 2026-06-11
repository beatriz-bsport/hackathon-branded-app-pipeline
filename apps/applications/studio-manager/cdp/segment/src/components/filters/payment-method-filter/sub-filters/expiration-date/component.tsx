import { Body, Button, Card } from "@bsport/kaizen-primitive-core";

import { DateFilter } from "#src/components/primitive-filters/date-filter/date-filter";
import { useTranslation } from "#src/utils/i18n";

import type { PaymentMethodSubFilterSectionProps } from "../payment-method-sub-filter-section-props";

/**
 * Renders the payment method expiration date sub-filter using the shared date primitive.
 */
export const ExpirationDateSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: PaymentMethodSubFilterSectionProps) => {
  const { t } = useTranslation("filters");

  return (
    <Card className="w-full">
      <div className="flex flex-col gap-xs">
        <div className="flex items-center justify-between">
          <Body size="lg" weight="strong">
            {t("filters.600.subFilters.expirationDate")}
          </Body>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="sm"
            label={t("filters.600.actions.removeSubFilter", {
              subFilterLabel: t("filters.600.subFilters.expirationDate"),
            })}
            intent="flat"
            color="default"
            onClick={onRemove}
          />
        </div>
        <DateFilter
          id={id}
          value={value.expirationDate}
          onChange={(nextValue) =>
            setValue("expirationDate", nextValue, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          errors={{
            absoluteFromDate:
              errors.expirationDate?.absolute?.fromDate?.message?.toString(),
            absoluteToDate:
              errors.expirationDate?.absolute?.toDate?.message?.toString(),
            relativeFirstDays:
              errors.expirationDate?.relative?.firstDays?.message?.toString(),
            relativeSecondDays:
              errors.expirationDate?.relative?.secondDays?.message?.toString(),
          }}
        />
      </div>
    </Card>
  );
};
