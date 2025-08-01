import React from "react";

import { FormField } from "@bsport/form";
import {
  TextArea,
  type TextAreaProps,
  TextField,
} from "@bsport/kaizen-primitive-core";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_DESCRIPTION_MAX_LENGTH, FIELD_NAME_MAX_LENGTH } from "./schema";

type PackFormIdentityProps = {
  fieldIdPrefix: string;
};

/**
 * Form Section to edit :
 * - the name of the pack (limited to 200 caracters)
 * - the description of the pack (limited to 2000 caracters)
 */
export const PackFormIdentity: React.FC<PackFormIdentityProps> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("details");

  return (
    <div className="flex flex-col gap-md">
      <FormField<PackFormData, "name">
        name="name"
        mapProps={({ defaultProps, field, form }) => ({
          ...defaultProps,
          helperText: t("formFields.name.helperText", {
            length: field.value.length,
            maxLength: FIELD_NAME_MAX_LENGTH,
          }),
          onClear: () => {
            form.setValue("name", "", { shouldDirty: true });
            field.onBlur();
          },
        })}
      >
        <TextField
          id={`${fieldIdPrefix}-pack-name`}
          label={t("formFields.name.label")}
          required
          fullWidth
        />
      </FormField>

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
    </div>
  );
};
