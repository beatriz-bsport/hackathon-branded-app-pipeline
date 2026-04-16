import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextArea, type TextAreaProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { CollectionFormData } from "../types";

type CollectionFormDescriptionProps = {
  formId: string;
};

export const CollectionFormDescription: FC<CollectionFormDescriptionProps> = ({
  formId,
}) => {
  const { t } = useTranslation("collection-form");

  return (
    <FormField<CollectionFormData, "description", TextAreaProps>
      name="description"
      mapProps={({ defaultProps, field }) => ({
        ...defaultProps,
        helperText: `${field.value?.length ?? 0}/${FIELD_CONSTRAINTS.DESCRIPTION_MAX_LENGTH}`,
        maxLength: FIELD_CONSTRAINTS.DESCRIPTION_MAX_LENGTH,
      })}
    >
      <TextArea
        id={`${formId}-description`}
        label={t("formFields.description.label")}
        placeholder={t("formFields.description.placeholder")}
        required
      />
    </FormField>
  );
};
