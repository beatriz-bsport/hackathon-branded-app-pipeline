import type { FC } from "react";

import { FormNumberField } from "@bsport/kaizen-business-components/form/number-field";
import { FormToggle } from "@bsport/kaizen-business-components/form/toggle";

import { useTranslation } from "#src/utils/i18n";

import type { ContractFormData, ContractFormMethods } from "../types";

type ContractFormAutoRenewalProps = {
  formId: string;
  methods: ContractFormMethods;
  isFromMigration: boolean;
  isShared: boolean;
};

export const ContractFormAutoRenewal: FC<ContractFormAutoRenewalProps> = ({
  formId,
  methods,
  isFromMigration,
  isShared,
}) => {
  const { t } = useTranslation("contract-details");

  const hasAutoRenewal = methods.watch("auto_renewal");

  return (
    <>
      <FormToggle<ContractFormData, "auto_renewal">
        fieldName="auto_renewal"
        id={`${formId}-auto-renewal`}
        label={t("formFields.autoRenewal.label")}
        disabled={isFromMigration || isShared}
      />

      {hasAutoRenewal && (
        <FormNumberField<ContractFormData, "nb_interval_after_auto_renewal">
          fieldName="nb_interval_after_auto_renewal"
          id={`${formId}-nb-interval-after-auto-renewal`}
          step={1}
          helperText={t("formFields.autoRenewal.helperText")}
          label={t("formFields.autoRenewal.sublabel")}
          maxDigits={0}
          disabled={isFromMigration}
          containerProps={{
            className: "ml-[40px]",
          }}
        />
      )}
    </>
  );
};
