import type { FC } from "react";

import { useFormContext } from "@bsport/form";
import { useCreditFactor } from "@bsport/kaizen-business-components/buyables/credit-factor";
import { FormNumberField } from "@bsport/kaizen-business-components/form/number-field";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import type { MediaFormData } from "../types";

type MediaFormPriceProps = {
  formId: string;
};

export const MediaFormPrice: FC<MediaFormPriceProps> = ({ formId }) => {
  const { t } = useTranslation("media-form");
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const { creditFactor, getCreditsFieldLabel, getCreditsDividedDisplay } =
    useCreditFactor(companyTheme?.pass_credit_factor);

  const { watch } = useFormContext<MediaFormData>();
  const creditPrice = watch("credit_price");

  const helperText =
    creditFactor === 1
      ? undefined
      : t("formFields.credit_price.equivalentCredits", {
          credits: getCreditsDividedDisplay(Number(creditPrice) || 0),
        });

  return (
    <FormNumberField<MediaFormData, "credit_price">
      id={`${formId}-credit_price`}
      fieldName="credit_price"
      label={getCreditsFieldLabel()}
      placeholder={t("formFields.credit_price.placeholder")}
      helperText={helperText}
      required
      fullWidth
      maxDigits={0}
    />
  );
};
