import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextArea, type TextAreaProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { ContractFormData } from "../types";

type ContractFormDescriptionProps = {
  formId: string;
  readonly?: boolean;
};

export const ContractFormDescription: FC<ContractFormDescriptionProps> = ({
  formId,
  readonly,
}) => {
  const { t } = useTranslation("contract-details");

  return (
    <FormField<
      ContractFormData,
      "description",
      TextAreaProps
    > name="description">
      <TextArea
        id={`${formId}-description`}
        label={t("formFields.description.label")}
        required
        disabled={!!readonly}
      />
    </FormField>
  );
};
