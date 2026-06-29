import { FC } from "react";

import { FormField } from "@bsport/form";
import {
  TextArea,
  TextAreaProps,
  TextField,
  Title,
} from "@bsport/kaizen-primitive-core";

import { SessionCreationFormData } from "#src/stores/session-creation/types.js";
import { useTranslation } from "#src/utils/i18n";

import ActivitySelector from "./activity-selector";

type DetailsFormProps = {
  fieldIdPrefix: string;
  isGroupSession?: boolean;
};

const DetailsForm: FC<DetailsFormProps> = ({
  fieldIdPrefix,
  isGroupSession = false,
}) => {
  const { t } = useTranslation(["sessionEdit", "sessionCreation"]);

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h5" weight="stronger">
        {t("editSessionForm.content.detailsForm.title", { ns: "sessionEdit" })}
      </Title>
      <ActivitySelector
        fieldIdPrefix={fieldIdPrefix}
        isGroupSession={isGroupSession}
      />

      <div className="flex flex-col gap-md">
        <FormField<SessionCreationFormData, "name_override">
          name="name_override"
          disabled={isGroupSession}
          mapProps={({ defaultProps, field, form }) => ({
            ...defaultProps,
            onClear: () => {
              form.setValue("name_override", "", { shouldDirty: true });
              field.onBlur();
            },
          })}
        >
          <TextField
            id={`${fieldIdPrefix}-session-name-override`}
            label={t(
              "addSessionModal.steps.configureSession.details.sessionName",
              { ns: "sessionCreation" },
            )}
            fullWidth
          />
        </FormField>
        <FormField<
          SessionCreationFormData,
          "description_override",
          TextAreaProps
        >
          name="description_override"
          disabled={isGroupSession}
        >
          <TextArea
            className="bg-surface-default"
            id={`${fieldIdPrefix}-session-description-override`}
            label={t(
              "addSessionModal.steps.configureSession.details.description",
              { ns: "sessionCreation" },
            )}
          />
        </FormField>
      </div>
    </div>
  );
};

export default DetailsForm;
