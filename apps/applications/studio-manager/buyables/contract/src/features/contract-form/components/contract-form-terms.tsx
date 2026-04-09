import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextArea, type TextAreaProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { ContractFormData } from "../types";

type ContractFormTermsProps = {
  formId: string;
  readonly?: boolean;
};

export const ContractFormTerms: FC<ContractFormTermsProps> = ({
  formId,
  readonly,
}) => {
  const { t } = useTranslation("contract-details");

  return (
    <FormField<ContractFormData, "contract", TextAreaProps>
      name="contract"
      mapProps={({ defaultProps, field }) => ({
        ...defaultProps,
        statusText: t("formFields.terms.helperText", {
          currentLength: (field.value ?? "").length,
          maxLength: FIELD_CONSTRAINTS.TERMS_LENGTH_MAX,
        }),
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
