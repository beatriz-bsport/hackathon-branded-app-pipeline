import { Body, Button } from "@bsport/kaizen-primitive-core";

import { NumericComparatorFilter } from "#src/components/primitive-filters/numeric-comparator-filter/numeric-comparator-filter";
import { TimedInfoPopover } from "#src/components/timed-info-popover";
import { useTranslation } from "#src/utils/i18n";

import type { PassSubFilterSectionProps } from "../pass-sub-filter-section-props";

/**
 * Converts stored credit units (tenths) to a display value for copy and i18n placeholders.
 */
function getCreditsDividedValue(credits: number) {
  if (credits === 0) {
    return 0.0;
  }
  return credits / 10;
}

/**
 * Renders remaining credits (numeric comparator) with help popover and remove.
 */
export const CreditLeftSubFilterSection = ({
  id,
  value,
  errors,
  setValue,
  onRemove,
}: PassSubFilterSectionProps) => {
  const { t } = useTranslation("filters");

  const creditLeft = value.creditLeft;
  const firstCreditsValue = creditLeft?.firstValue ?? null;
  const secondCreditsValue = creditLeft?.secondValue ?? null;
  const shouldShowCreditsSummaryBelowComparator =
    creditLeft !== undefined && firstCreditsValue !== null;

  let creditsSummaryTranslation: string | null = null;
  if (shouldShowCreditsSummaryBelowComparator) {
    if (secondCreditsValue == null || secondCreditsValue === 0) {
      creditsSummaryTranslation = t("filters.19.subFilters.creditsDisplay", {
        count: getCreditsDividedValue(firstCreditsValue),
      });
    } else {
      creditsSummaryTranslation = t(
        "filters.19.subFilters.creditsRangeDisplay",
        {
          count: getCreditsDividedValue(firstCreditsValue),
          secondCount: getCreditsDividedValue(secondCreditsValue),
        },
      );
    }
  }

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex flex-col gap-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-xxs">
            <Body size="lg" weight="strong">
              {t("filters.19.subFilters.creditLeft")}
            </Body>
            <TimedInfoPopover
              label={t("filters.19.subFilters.creditLeftInfoLabel")}
              placement="bottom-left"
            >
              <Body size="sm">
                {t("filters.19.subFilters.creditLeftInfoContent")}
              </Body>
            </TimedInfoPopover>
          </div>
          <Button
            kind="icon-button"
            icon="trash-01"
            size="sm"
            label={t("filters.19.actions.removeSubFilter", {
              subFilterLabel: t("filters.19.subFilters.creditLeft"),
            })}
            intent="flat"
            color="default"
            onClick={onRemove}
          />
        </div>
        <NumericComparatorFilter
          id={id}
          value={value.creditLeft}
          onChange={(nextValue) =>
            setValue("creditLeft", nextValue, { shouldDirty: true })
          }
          suffix={t("filters.19.fields.creditsSuffix")}
          errors={{
            firstValue: errors.creditLeft?.firstValue?.message
              ? String(errors.creditLeft.firstValue.message)
              : undefined,
            secondValue: errors.creditLeft?.secondValue?.message
              ? String(errors.creditLeft.secondValue.message)
              : undefined,
          }}
        />
      </div>
      {creditsSummaryTranslation !== null ? (
        <Body size="sm" color="weak" className="self-end">
          {creditsSummaryTranslation}
        </Body>
      ) : null}
    </div>
  );
};
