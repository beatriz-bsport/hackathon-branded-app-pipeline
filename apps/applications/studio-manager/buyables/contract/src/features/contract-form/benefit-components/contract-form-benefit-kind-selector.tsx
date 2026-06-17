import type { FC } from "react";

import { FormField } from "@bsport/form";
import { Select, type SelectProps } from "@bsport/kaizen-primitive-core";

import { BENEFIT_KIND } from "#src/utils/contract-benefit";
import { useTranslation } from "#src/utils/i18n";

import type { ContractFormData } from "../types";

type ContractFormBenefitKindSelectorProps = {
  formId: string;
  readonly?: boolean;
};

/**
 * Selects the contract {@link BENEFIT_KIND} (defaults to PASS). Drives which
 * controls the benefit configuration renders.
 */
export const ContractFormBenefitKindSelector: FC<
  ContractFormBenefitKindSelectorProps
> = ({ formId, readonly }) => {
  const { t } = useTranslation("contract-details");

  const benefitKindOptions = [
    { id: BENEFIT_KIND.PASS, label: t("formFields.benefit.kind.pass") },
    {
      id: BENEFIT_KIND.APPOINTMENT_PASS,
      label: t("formFields.benefit.kind.appointmentPass"),
    },
    {
      id: BENEFIT_KIND.UNIVERSAL_PASS,
      label: t("formFields.benefit.kind.universalPass"),
    },
  ] as const;

  return (
    <FormField<ContractFormData, "benefitKind", SelectProps>
      name="benefitKind"
      mapProps={({ defaultProps, form }) => ({
        ...defaultProps,
        value: defaultProps.value == null ? undefined : defaultProps.value,
        items: benefitKindOptions.map((config) => ({
          ...config,
          onClick: () =>
            form.setValue("benefitKind", config.id, { shouldDirty: true }),
        })),
      })}
    >
      {/** @ts-expect-error items are provided by the wrapper */}
      <Select
        id={`${formId}-benefit-kind`}
        label={t("formFields.benefit.kind.label")}
        required
        fullWidth
        disabled={!!readonly}
      />
    </FormField>
  );
};
