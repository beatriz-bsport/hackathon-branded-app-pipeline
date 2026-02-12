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
}> = ({ fieldIdPrefix, trackOverrideToggleChange, isChecked }) => {
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
};

const OverrideForm: FC<OverrideFormProps> = ({
  fieldIdPrefix,
  trackOverrideToggleChange,
}) => {
  const { watch } = useFormContext();

  const isChecked = watch("allowCustomNameAndDescription");
  return (
    <>
      <OverrideToggle
        fieldIdPrefix={fieldIdPrefix}
        trackOverrideToggleChange={trackOverrideToggleChange}
        isChecked={isChecked}
      />
      {isChecked && (
        <div className="flex flex-col gap-md ml-xl">
          <SessionNameField fieldIdPrefix={fieldIdPrefix} />
          <SessionDescriptionField fieldIdPrefix={fieldIdPrefix} />
        </div>
      )}
    </>
  );
};

export default OverrideForm;
