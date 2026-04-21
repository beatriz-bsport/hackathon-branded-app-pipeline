import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { COLLECTION_FORM_DATA_DEFAULT, FIELD_CONSTRAINTS } from "../constants";
import type { CollectionFormData } from "../types";

type CollectionFormTitleProps = {
  formId: string;
};

export const CollectionFormTitle: FC<CollectionFormTitleProps> = ({
  formId,
}) => {
  const { t } = useTranslation("collection-form");

  return (
    <FormField<CollectionFormData, "name", TextFieldProps>
      name="name"
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,
        helperText: `${field.value?.length ?? 0}/${FIELD_CONSTRAINTS.NAME_MAX_LENGTH}`,
        maxLength: FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        onClear: () => {
          form.setValue("name", COLLECTION_FORM_DATA_DEFAULT.name, {
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
