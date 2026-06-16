import type { FC } from "react";

import { ActivityFormSelector } from "@bsport/kaizen-business-components/booking/activity-selector";
import { CategoryFormSelector } from "@bsport/kaizen-business-components/core/category-selector";
import { EstablishmentFormSelector } from "@bsport/kaizen-business-components/core/establishment-selector";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

import type { ContractFormData } from "../types";

type ContractFormBenefitRestrictionsProps = {
  formId: string;
  readonly?: boolean;
};

/**
 * Compatibility restrictions shared by `pass` and `universal-pass` benefits:
 * only the selected categories / venues / classes stay compatible.
 */
export const ContractFormBenefitRestrictions: FC<
  ContractFormBenefitRestrictionsProps
> = ({ formId, readonly }) => {
  const { t } = useTranslation("contract-details");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  if (companyId == null) {
    return null;
  }

  return (
    <>
      <CategoryFormSelector<ContractFormData, "payment_pack_details.sct_ids">
        fieldName="payment_pack_details.sct_ids"
        companyId={companyId}
        helperText={t("formFields.benefit.restrictions.categoriesHelper")}
        withChips
        withSearch
        withSelectAll
        disabled={readonly}
      />

      <EstablishmentFormSelector<
        ContractFormData,
        "payment_pack_details.establishment_ids"
      >
        fieldName="payment_pack_details.establishment_ids"
        companyId={companyId}
        helperText={t("formFields.benefit.restrictions.establishmentsHelper")}
        withChips
        withSearch
        withSelectAll
        disabled={readonly}
      />

      <ActivityFormSelector<
        ContractFormData,
        "payment_pack_details.meta_activity_ids"
      >
        id={`${formId}-compatible-activities`}
        fieldName="payment_pack_details.meta_activity_ids"
        fetch={fetch}
        multiSelect
        statusText={t("formFields.benefit.restrictions.activitiesHelper")}
        disabled={readonly}
      />
    </>
  );
};
