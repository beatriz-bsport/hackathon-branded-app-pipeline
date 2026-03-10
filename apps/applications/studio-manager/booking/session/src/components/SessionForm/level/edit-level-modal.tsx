import { FC, useId, useState } from "react";

import { useFormContext, useFormController } from "@bsport/form";
import { Alert, Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchLevels } from "#src/hooks/level/useFetchLevels";
import { useUpdateLevel } from "#src/hooks/level/useUpdateLevel";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

import { useLevelSchema } from "../schemas";
import { LevelForm } from "./level-form";

export const EditLevelModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  levelId: number | null;
}> = ({ isOpen, onClose, levelId }) => {
  const { t } = useTranslation("sessionCreation");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const { setValue } = useFormContext<SessionCreationFormData>();

  const { mutate } = useUpdateLevel();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const levelSchema = useLevelSchema();

  const formId = useId();

  const { data } = useFetchLevels(companyId);

  const level = levelId ? data?.[levelId] : null;

  const updateLevelMethods = useFormController({
    schema: levelSchema,
    mode: "onBlur",
    defaultValues: {
      name: level?.name || "",
      color: level?.color || "#FFFFFF",
    },
  });

  if (!levelId || !level) {
    return null;
  }

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("addSessionModal.steps.configureSession.settings.level.edit")}
      onClose={onClose}
      confirmButton={{
        label: t("addSessionModal.steps.configureSession.settings.level.save"),
        type: "submit",
        form: formId,
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
        methods={updateLevelMethods}
        onSubmit={(data) =>
          mutate(
            { data: { ...data, id: levelId } },
            {
              onSuccess: (level) => {
                setValue("level", level.id, {
                  shouldValidate: true,
                  shouldDirty: true,
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
