import { Body, Button } from "@bsport/kaizen-primitive-core";

import { usePassesQuery } from "#src/api/use-passes-query";
import { PassSelectionField } from "#src/components/filters/passes-filter/components/pass-selection-field";
import { useTranslation } from "#src/utils/i18n";

import type { TotalBookingSubFilterSectionProps } from "../total-booking-sub-filter-section-props";

export const PaymentPackSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: TotalBookingSubFilterSectionProps) => {
  const { t } = useTranslation("filters");
  const passesLabel = t("filters.22.subFilters.passes");
  const { data } = usePassesQuery("");
  const passOptions = data?.results ?? [];
  return (
    <div className="w-full flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <Body size="lg" weight="strong">
          {passesLabel}
        </Body>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.22.actions.removeSubFilter", {
            subFilterLabel: passesLabel,
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>

      <PassSelectionField
        id={id}
        value={value.paymentPack.selectedPaymentPackIds}
        passOptions={passOptions}
        errorText={
          errors.paymentPack?.selectedPaymentPackIds?.message
            ? String(errors.paymentPack.selectedPaymentPackIds.message)
            : undefined
        }
        onChange={(nextSelectedIds) => {
          setValue(
            "paymentPack",
            {
              selectAllPaymentPacks: false,
              selectedPaymentPackIds: nextSelectedIds,
            },
            { shouldDirty: true, shouldValidate: true },
          );
        }}
      />
    </div>
  );
};
