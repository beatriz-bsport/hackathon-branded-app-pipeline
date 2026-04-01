import React from "react";

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
  isRevampedContract: boolean;
  readonly?: boolean;
};

export const ContractFormTax: React.FC<ContractFormTaxProps> = ({
  formId,
  watch,
  isRevampedContract,
  readonly,
}) => {
  const { t } = useTranslation("contract-details");
  const bookkeepingAccount = watch(
    "payment_pack_details.bookkeeping_account_id",
  );

  const companyTheme = dataAccessLayer.useCompanyTheme();

  if (!isRevampedContract) {
    // Tax is inherited from the selected benefit
    return null;
  }

  const enableBookkeepingAccountSelector =
    isBookkeepingAccountActive(companyTheme);

  return (
    <>
      <FormNumberField<ContractFormData, "payment_pack_details.tax">
        fieldName="payment_pack_details.tax"
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
          "payment_pack_details.bookkeeping_account_id",
          "payment_pack_details.tax"
        >
          idFieldName="payment_pack_details.bookkeeping_account_id"
          taxFieldName="payment_pack_details.tax"
          taxFieldClearedValue={DEFAULT_DATA.payment_pack_details.tax}
          fetch={fetch}
          withCreationFlow
          disabled={readonly}
        />
      )}
    </>
  );
};
