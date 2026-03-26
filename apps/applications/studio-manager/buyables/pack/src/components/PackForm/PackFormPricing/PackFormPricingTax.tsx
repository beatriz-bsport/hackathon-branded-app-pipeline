import React from "react";

import type { UseFormControllerOutput } from "@bsport/form";
import { BookkeepingAccountFormSelector } from "@bsport/kaizen-business-components/financial-services/bookkeeping-account/selector";
import { FormNumberField } from "@bsport/kaizen-business-components/form/number-field";
import { FormToggle } from "@bsport/kaizen-business-components/form/toggle";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { PackFormData } from "../schema";
import {
  FIELD_TAX_RATE_MAXIMUM,
  FIELD_TAX_RATE_MINIMUM,
  type PackFormSchema,
} from "../schema";
import { useBookkeepingAccountSelector } from "../utils";

type PackFormPricingTaxProps = {
  fieldIdPrefix: string;
  watch: UseFormControllerOutput<PackFormSchema>["watch"];
};

export const PackFormPricingTax: React.FC<PackFormPricingTaxProps> = ({
  fieldIdPrefix,
  watch,
}) => {
  const { t } = useTranslation("details");
  const applySingleTax = watch("use_payment_combo_tax_on_items");
  const bookkeepingAccount = watch("bookkeeping_account");
  const enableBookkeepingAccountSelector = useBookkeepingAccountSelector();

  return (
    <>
      <FormToggle<PackFormData, "use_payment_combo_tax_on_items">
        fieldName="use_payment_combo_tax_on_items"
        id={`${fieldIdPrefix}-pack-unique-tax-toggle`}
        label={t("formFields.pricingSection.taxToggle.description")}
        helperText={t("formFields.pricingSection.taxToggle.helperText")}
      />

      {applySingleTax && (
        <div className="ml-[40px]">
          <FormNumberField<PackFormData, "tax">
            fieldName="tax"
            id={`${fieldIdPrefix}-pack-unique-tax-value`}
            label={t("formFields.pricingSection.taxToggle.label")}
            required={applySingleTax}
            disabled={
              enableBookkeepingAccountSelector && bookkeepingAccount != null
            }
            suffix={{ type: "text", value: "%" }}
            min={FIELD_TAX_RATE_MINIMUM}
            max={FIELD_TAX_RATE_MAXIMUM}
          />

          {enableBookkeepingAccountSelector && (
            <BookkeepingAccountFormSelector<
              PackFormData,
              "bookkeeping_account",
              "tax"
            >
              idFieldName="bookkeeping_account"
              taxFieldName="tax"
              taxFieldClearedValue={FIELD_TAX_RATE_MINIMUM}
              fetch={fetch}
              withCreationFlow
            />
          )}
        </div>
      )}
    </>
  );
};
