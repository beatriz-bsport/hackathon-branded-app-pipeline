import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle, ToggleProps } from "@bsport/kaizen-primitive-core";

import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

import { SessionDescriptionField } from "./SessionDescriptionField";
import { SessionNameField } from "./SessionNameField";

const OverrideToggle: FC<{
  fieldIdPrefix: string;
  trackOverrideToggleChange?: (checked: boolean) => void;
  isChecked: boolean;
  disabled?: boolean;
}> = ({
  fieldIdPrefix,
  trackOverrideToggleChange,
  isChecked,
  disabled = false,
}) => {
  const { t } = useTranslation("sessionCreation");

  return (
    <FormField<
      SessionCreationFormData,
      "allowCustomNameAndDescription",
      ToggleProps
    >
      name="allowCustomNameAndDescription"
      mapProps={({ form }) => ({
        onToggleChange: (checked) => {
          form.setValue("allowCustomNameAndDescription", checked, {
            shouldValidate: false,
            shouldDirty: false,
          });
          trackOverrideToggleChange?.(checked);
        },
      })}
    >
      <Toggle
        checked={isChecked}
        disabled={disabled}
        id={`${fieldIdPrefix}-session-name-override-toggle`}
        label={t(
          "addSessionModal.steps.configureSession.details.overrideToggle.label",
        )}
        helperText={t(
          "addSessionModal.steps.configureSession.details.overrideToggle.helperText",
        )}
      />
    </FormField>
  );
};

type OverrideFormProps = {
  fieldIdPrefix: string;
  trackOverrideToggleChange?: (checked: boolean) => void;
  isGroupSession?: boolean;
};

const OverrideForm: FC<OverrideFormProps> = ({
  fieldIdPrefix,
  trackOverrideToggleChange,
  isGroupSession = false,
}) => {
  const { watch } = useFormContext();

  const isChecked = watch("allowCustomNameAndDescription");
  return (
    <>
      <OverrideToggle
        fieldIdPrefix={fieldIdPrefix}
        trackOverrideToggleChange={trackOverrideToggleChange}
        isChecked={isChecked}
        disabled={isGroupSession}
      />
      {isChecked && !isGroupSession && (
        <div className="flex flex-col gap-md ml-xl">
          <SessionNameField fieldIdPrefix={fieldIdPrefix} />
          <SessionDescriptionField fieldIdPrefix={fieldIdPrefix} />
        </div>
      )}
    </>
  );
};

export default OverrideForm;
