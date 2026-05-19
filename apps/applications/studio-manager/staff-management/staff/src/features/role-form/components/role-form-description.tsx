import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextArea, type TextAreaProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { RoleFormData } from "../types";

type RoleFormDescriptionProps = {
  formId: string;
  disabled?: boolean;
};

export const RoleFormDescription: FC<RoleFormDescriptionProps> = ({
  formId,
  disabled = false,
}) => {
  const { t } = useTranslation("role-form");

  return (
    <FormField<RoleFormData, "description", TextAreaProps>
      name="description"
      mapProps={({ defaultProps, field }) => ({
        ...defaultProps,
        helperText: `${field.value?.length ?? 0}/${FIELD_CONSTRAINTS.DESCRIPTION_MAX_LENGTH}`,
      })}
    >
      <TextArea
        id={`${formId}-description`}
        label={t("formFields.description.label")}
        className="w-full"
        disabled={disabled}
      />
    </FormField>
  );
};
