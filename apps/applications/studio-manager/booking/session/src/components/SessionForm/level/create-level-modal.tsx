import { FC, useId, useState } from "react";

import { useFormContext, useFormController } from "@bsport/form";
import { Alert, Modal } from "@bsport/kaizen-primitive-core";

import { useLevelSchema } from "#src/components/SessionForm/schemas";
import { useCreateLevel } from "#src/hooks/level/useCreateLevel";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

import { LevelForm } from "./level-form";

export const CreateLevelModal: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("sessionCreation");

  const { setValue } = useFormContext<SessionCreationFormData>();

  const { mutate } = useCreateLevel();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const levelSchema = useLevelSchema();

  const formId = useId();

  const createLevelMethods = useFormController({
    schema: levelSchema,
    mode: "onBlur",
    shouldFocusError: true,
    defaultValues: {
      name: "",
      color: "#FFFFFF",
    },
  });

  const isError = !createLevelMethods.formState.isValid;

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("addSessionModal.steps.configureSession.settings.level.create")}
      onClose={onClose}
      confirmButton={{
        label: t(
          "addSessionModal.steps.configureSession.settings.level.confirmCreate",
        ),
        type: "submit",
        form: formId,
        disabled: isError,
      }}
      cancelButton={{
        label: t(
          "addSessionModal.steps.configureSession.settings.level.cancel",
        ),
        onClick: onClose,
      }}
    >
      {errorMessage && <Alert status="critical">{errorMessage}</Alert>}
      <LevelForm
        formId={formId}
        methods={createLevelMethods}
        onSubmit={(data) =>
          mutate(
            { data },
            {
              onSuccess: (level) => {
                createLevelMethods.reset();
                setValue("level", level.id, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                setErrorMessage(null);
                onClose();
              },
              onError: () => {
                setErrorMessage(t("addSessionModal.errors.generic"));
              },
            },
          )
        }
      />
    </Modal>
  );
};
