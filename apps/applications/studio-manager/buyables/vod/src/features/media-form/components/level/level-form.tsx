import type { FC } from "react";
import type { z } from "zod";

import {
  ControlledForm,
  FormField,
  type UseFormControllerOutput,
} from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { LevelFormData } from "./types";

export const LevelForm: FC<{
  formId: string;
  methods: UseFormControllerOutput<z.ZodType<LevelFormData>>;
  onSubmit: (data: LevelFormData) => void;
}> = ({ formId, methods, onSubmit }) => {
  const { t } = useTranslation("media-form");

  return (
    <ControlledForm
      id={formId}
      {...methods}
      onSubmit={onSubmit}
      className="w-full"
    >
      <div className="flex flex-col gap-xs">
        <FormField<LevelFormData, "name", TextFieldProps>
          name="name"
          mapProps={({ form, defaultProps }) => ({
            ...defaultProps,
            onClear: () =>
              form.setValue("name", "", {
                shouldDirty: true,
                shouldValidate: true,
              }),
          })}
        >
          <TextField
            id={`${formId}-level-name-field`}
            required
            type="text"
            fullWidth
            label={t("formFields.level.nameLabel")}
          />
        </FormField>
        <FormField<LevelFormData, "color", TextFieldProps> name="color">
          <TextField
            id={`${formId}-level-color-field`}
            fullWidth
            type="color"
            label={t("formFields.level.colorLabel")}
          />
        </FormField>
      </div>
    </ControlledForm>
  );
};
