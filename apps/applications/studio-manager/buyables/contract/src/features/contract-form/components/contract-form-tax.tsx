import type { FC } from "react";

import { isBookkeepingAccountActive } from "@bsport/kaizen-business-components/financial-services/bookkeeping-account/is-active";
import { BookkeepingAccountFormSelector } from "@bsport/kaizen-business-components/financial-services/bookkeeping-account/selector";
import { FormNumberField } from "@bsport/kaizen-business-components/form/number-field";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import { DEFAULT_DATA, FIELD_CONSTRAINTS } from "../constants";
import type { ContractFormData, ContractFormMethods } from "../types";

type ContractFormTaxProps = {
  formId: string;
  watch: ContractFormMethods["watch"];
  readonly: boolean;
};

export const ContractFormTax: FC<ContractFormTaxProps> = ({
  formId,
  watch,
  readonly,
}) => {
  const { t } = useTranslation("contract-details");
  const bookkeepingAccount = watch("bookkeeping_account_id");

  const companyTheme = dataAccessLayer.useCompanyTheme();

  const enableBookkeepingAccountSelector =
    isBookkeepingAccountActive(companyTheme);

  return (
    <>
      <FormNumberField<ContractFormData, "tax">
        fieldName="tax"
        id={`${formId}-tax`}
        label={t("formFields.tax.label")}
        required
        disabled={
          (enableBookkeepingAccountSelector && bookkeepingAccount != null) ||
          readonly
        }
        suffix={{ type: "text", value: "%" }}
        min={FIELD_CONSTRAINTS.TAX_RATE_MIN}
        max={FIELD_CONSTRAINTS.TAX_RATE_MAX}
      />

      {enableBookkeepingAccountSelector && (
        <BookkeepingAccountFormSelector<
          ContractFormData,
          "bookkeeping_account_id",
          "tax"
        >
          idFieldName="bookkeeping_account_id"
          taxFieldName="tax"
          taxFieldClearedValue={DEFAULT_DATA.tax}
          fetch={fetch}
          withCreationFlow
          disabled={readonly}
        />
      )}
    </>
  );
};
