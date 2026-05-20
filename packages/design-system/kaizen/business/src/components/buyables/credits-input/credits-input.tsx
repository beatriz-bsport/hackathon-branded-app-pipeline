import type { ReactElement } from "react";

import type { FieldValues } from "@bsport/form";

import { useCreditFactor } from "#src/components/buyables/credit-factor";
import {
  FormNumberField,
  type FormNumberFieldProps,
} from "#src/components/form/number-field";
import { i18nInstance, useTranslation } from "#src/i18n";
import type { NumberFieldPath } from "#src/utils/form-types";

export type CreditsInputProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
> = FormNumberFieldProps<TFormValues, TFieldName> & {
  /** Value from company theme (e.g. `useCompanyTheme()?.pass_credit_factor`). */
  passCreditFactor?: number | null;
  /**
   * Optional builder for a dynamic helper text based on the value.
   * Receives three different inputs:
   * - adjusted credits amount, e.g. 0.5
   * - adjusted credits display, e.g. "0.5" or "0,5"
   * - adjusted credits display with message, e.g. "0,5 credits"
   */
  getHelperText?: (params: {
    creditsAmount: number;
    creditsDisplay: string;
    creditsMessage: string;
  }) => string;
};

/**
 * Form-bound credits number input. Defaults the label to the translated
 * "Credits" string and exposes a `getHelperText` builder that receives the
 * credit-factor-adjusted display value derived from the current field value.
 */
export const CreditsInput = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
>({
  passCreditFactor,
  getHelperText,
  label,
  ...formNumberFieldProps
}: CreditsInputProps<TFormValues, TFieldName>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });
  const {
    creditFactor,
    getCreditsDividedValue,
    getCreditsDividedDisplay,
    getCreditsDividedMessage,
  } = useCreditFactor(passCreditFactor);

  const getDynamicHelperText = (currentValue: number | null) => {
    const credits = currentValue ?? 0;
    if (!getHelperText) {
      return creditFactor === 1 ? "" : getCreditsDividedMessage(credits);
    }
    return getHelperText({
      creditsAmount: getCreditsDividedValue(credits),
      creditsDisplay: getCreditsDividedDisplay(credits),
      creditsMessage: getCreditsDividedMessage(credits),
    });
  };

  return (
    <FormNumberField<TFormValues, TFieldName>
      label={label ?? t("creditFactor.fieldLabel")}
      dynamicProps={(currentValue) => ({
        helperText: getDynamicHelperText(currentValue),
      })}
      {...formNumberFieldProps}
    />
  );
};

CreditsInput.displayName = "KaizenCreditsInput";
