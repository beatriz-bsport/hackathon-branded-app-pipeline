import React, { useId } from "react";

import {
  ControlledForm,
  type ControlledFormProps,
  FormField,
} from "@bsport/form";
import {
  TextArea,
  type TextAreaProps,
  TextField,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SmartlistFormData } from "./shared-types";

type SmartlistFormProps = Omit<
  ControlledFormProps<SmartlistFormData>,
  "children"
>;

/**
 * Form component for creating or editing a smartlist using react-hook-form and zod validation
 *
 * @param id - Optional form id for external submit buttons
 * @param onSubmit - Function called when form is submitted with valid data
 * @param isSubmitting - Whether the form is currently submitting
 */
export const SmartlistForm: React.FC<SmartlistFormProps> = ({
  id,
  onSubmit,
  ...methods
}) => {
  const { t } = useTranslation("list");
  const fieldIdPrefix = useId();

  return (
    <ControlledForm
      id={id}
      onSubmit={onSubmit}
      className="flex flex-col gap-md"
      {...methods}
    >
      <FormField<SmartlistFormData, "name">
        name="name"
        mapProps={({ defaultProps, form, field }) => ({
          ...defaultProps,
          onClear: () => {
            form.setValue("name", "", { shouldDirty: true });
            // We trigger validation after clearing the value
            field.onBlur();
          },
        })}
      >
        <TextField
          id={`${fieldIdPrefix}-smartlist-name}`}
          label={t("editForm.fields.name.label")}
          placeholder={t("editForm.fields.name.placeholder")}
          disabled={methods.formState.isSubmitting}
        />
      </FormField>

      <FormField<
        SmartlistFormData,
        "description",
        TextAreaProps
      > name="description">
        <TextArea
          id={`${fieldIdPrefix}-smartlist-description`}
          label={t("editForm.fields.description.label")}
          placeholder={t("editForm.fields.description.placeholder")}
          disabled={methods.formState.isSubmitting}
        />
      </FormField>
    </ControlledForm>
  );
};
