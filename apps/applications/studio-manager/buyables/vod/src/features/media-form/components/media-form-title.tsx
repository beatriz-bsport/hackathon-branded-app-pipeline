import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS, MEDIA_FORM_DATA_DEFAULT } from "../constants";
import type { MediaFormData } from "../types";

type MediaFormTitleProps = {
  formId: string;
};

export const MediaFormTitle: FC<MediaFormTitleProps> = ({ formId }) => {
  const { t } = useTranslation("media-form");

  return (
    <FormField<MediaFormData, "name", TextFieldProps>
      name="name"
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,
        helperText: `${field.value?.length ?? 0}/${FIELD_CONSTRAINTS.NAME_MAX_LENGTH}`,
        onClear: () => {
          form.setValue("name", MEDIA_FORM_DATA_DEFAULT.name, {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
      })}
    >
      <TextField
        id={`${formId}-name`}
        label={t("formFields.name.label")}
        placeholder={t("formFields.name.placeholder")}
        required
        fullWidth
      />
    </FormField>
  );
};
