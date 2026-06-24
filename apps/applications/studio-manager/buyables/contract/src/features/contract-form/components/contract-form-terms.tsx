import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextArea, type TextAreaProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { ContractFormData } from "../types";

type ContractFormTermsProps = {
  formId: string;
  readonly: boolean;
};

export const ContractFormTerms: FC<ContractFormTermsProps> = ({
  formId,
  readonly,
}) => {
  const { t } = useTranslation("contract-details");

  return (
    <FormField<ContractFormData, "contract", TextAreaProps>
      name="contract"
      mapProps={({ defaultProps }) => ({
        ...defaultProps,
        statusText: t("formFields.terms.helperText"),
      })}
    >
      <TextArea
        id={`${formId}-terms`}
        label={t("formFields.terms.label")}
        required
        disabled={!!readonly}
      />
    </FormField>
  );
};
