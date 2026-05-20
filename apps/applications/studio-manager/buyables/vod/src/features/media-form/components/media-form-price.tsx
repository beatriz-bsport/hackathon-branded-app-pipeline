import type { FC } from "react";

import { CreditsInput } from "@bsport/kaizen-business-components/buyables/credits-input";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import type { MediaFormData } from "../types";

type MediaFormPriceProps = {
  formId: string;
};

export const MediaFormPrice: FC<MediaFormPriceProps> = ({ formId }) => {
  const { t } = useTranslation("media-form");
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const creditFactor = companyTheme?.pass_credit_factor ?? 1;

  return (
    <CreditsInput<MediaFormData, "credit_price">
      id={`${formId}-credit_price`}
      passCreditFactor={companyTheme?.pass_credit_factor}
      fieldName="credit_price"
      placeholder="0"
      getHelperText={(params) => {
        return creditFactor === 1
          ? ""
          : t("formFields.credit_price.equivalentCredits", {
              creditsDisplay: params.creditsMessage,
            });
      }}
      required
      fullWidth
      maxDigits={0}
    />
  );
};
