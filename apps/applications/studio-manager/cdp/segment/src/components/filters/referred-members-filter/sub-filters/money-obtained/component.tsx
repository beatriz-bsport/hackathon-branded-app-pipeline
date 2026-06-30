import { Body, Button } from "@bsport/kaizen-primitive-core";

import { NumericComparatorFilter } from "#src/components/primitive-filters/numeric-comparator-filter/numeric-comparator-filter";
import { TimedInfoPopover } from "#src/components/timed-info-popover";
import { getCurrencyCodeSuffix } from "#src/utils/format-price-with-currency-code";
import { useTranslation } from "#src/utils/i18n";

import type { ReferredMembersSubFilterSectionProps } from "../referred-members-sub-filter-section-props";

/**
 * Renders the referral earnings sub-filter using the shared numeric comparator primitive.
 */
export const MoneyObtainedSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: ReferredMembersSubFilterSectionProps) => {
  const { t } = useTranslation("filters");

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-xxs">
          <Body size="lg" weight="strong">
            {t("filters.30.subFilters.moneyObtained")}
          </Body>
          <TimedInfoPopover
            label={t("filters.30.subFilters.moneyObtainedInfoLabel")}
            placement="bottom-left"
          >
            <Body size="sm" color="weak">
              {t("filters.30.subFilters.moneyObtainedHelp")}
            </Body>
          </TimedInfoPopover>
        </div>
        <Button
          kind="icon-button"
          icon="trash-01"
          size="sm"
          label={t("filters.30.actions.removeSubFilter", {
            subFilterLabel: t("filters.30.subFilters.moneyObtained"),
          })}
          intent="flat"
          color="default"
          onClick={onRemove}
        />
      </div>
      <NumericComparatorFilter
        id={id}
        value={value.moneyObtained}
        onChange={(nextValue) =>
          setValue("moneyObtained", nextValue, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        suffix={getCurrencyCodeSuffix()}
        errors={{
          firstValue: errors.moneyObtained?.firstValue?.message
            ? String(errors.moneyObtained.firstValue.message)
            : undefined,
          secondValue: errors.moneyObtained?.secondValue?.message
            ? String(errors.moneyObtained.secondValue.message)
            : undefined,
        }}
      />
    </div>
  );
};
