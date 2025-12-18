import { FC } from "react";
import { z } from "zod";

import {
  ControlledForm,
  FormField,
  UseFormControllerOutput,
} from "@bsport/form";
import { TextField, TextFieldProps } from "@bsport/kaizen-primitive-core";

import { LevelFormData } from "#src/components/SessionForm/types";
import { useTranslation } from "#src/utils/i18n";

export const LevelForm: FC<{
  formId: string;
  methods: UseFormControllerOutput<z.ZodType<LevelFormData>>;
  onSubmit: (data: LevelFormData) => void;
}> = ({ formId, methods, onSubmit }) => {
  const { t } = useTranslation("sessionCreation");

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
            label={t(
              "addSessionModal.steps.configureSession.settings.level.nameLabel",
            )}
          />
        </FormField>
        <FormField<LevelFormData, "color", TextFieldProps> name="color">
          <TextField
            id={`${formId}-level-color-field`}
            fullWidth
            type="color"
            label={t(
              "addSessionModal.steps.configureSession.settings.level.colorLabel",
            )}
          />
        </FormField>
      </div>
    </ControlledForm>
  );
};
