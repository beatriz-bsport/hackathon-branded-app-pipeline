import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextArea, type TextAreaProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { MediaFormData } from "../types";

type MediaFormDescriptionProps = {
  formId: string;
};

export const MediaFormDescription: FC<MediaFormDescriptionProps> = ({
  formId,
}) => {
  const { t } = useTranslation("media-form");

  return (
    <FormField<MediaFormData, "description", TextAreaProps>
      name="description"
      mapProps={({ defaultProps, field }) => ({
        ...defaultProps,
        helperText: `${field.value?.length ?? 0}/${FIELD_CONSTRAINTS.DESCRIPTION_MAX_LENGTH}`,
      })}
    >
      <TextArea
        id={`${formId}-description`}
        label={t("formFields.description.label")}
        placeholder={t("formFields.description.placeholder")}
      />
    </FormField>
  );
};
