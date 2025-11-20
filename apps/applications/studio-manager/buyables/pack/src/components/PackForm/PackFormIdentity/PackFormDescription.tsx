import React from "react";

import { FormField } from "@bsport/form";
import { TextArea, type TextAreaProps } from "@bsport/kaizen-primitive-core";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_DESCRIPTION_MAX_LENGTH } from "../schema";

type PackFormDescriptionProps = { fieldIdPrefix: string };

export const PackFormDescription: React.FC<PackFormDescriptionProps> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("details");

  return (
    <FormField<PackFormData, "description", TextAreaProps>
      name="description"
      mapProps={({ defaultProps, field }) => ({
        ...defaultProps,
        helperText: t("formFields.description.helperText", {
          length: field.value.length,
          maxLength: FIELD_DESCRIPTION_MAX_LENGTH,
        }),
      })}
    >
      <TextArea
        id={`${fieldIdPrefix}-pack-description`}
        label={t("formFields.description.label")}
        required
      />
    </FormField>
  );
};
