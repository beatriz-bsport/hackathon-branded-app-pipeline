import { type FC, useEffect, useId, useState } from "react";

import { useFormContext, useFormController } from "@bsport/form";
import { Alert, Modal } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchLevels } from "#src/hooks/api/level/use-fetch-levels";
import { useUpdateLevel } from "#src/hooks/api/level/use-update-level";
import { useTranslation } from "#src/utils/i18n";

import type { MediaFormData } from "../../types";
import { LevelForm } from "./level-form";
import { useLevelSchema } from "./use-level-schema";

export const EditLevelModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  levelId: number | null;
}> = ({ isOpen, onClose, levelId }) => {
  const { t } = useTranslation("media-form");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const { setValue } = useFormContext<MediaFormData>();
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

  useEffect(() => {
    if (level) {
      updateLevelMethods.reset({
        name: level.name ?? "",
        color: level.color ?? "#FFFFFF",
      });
    }
  }, [level, updateLevelMethods]);

  const handleClose = () => {
    setErrorMessage(null);
    onClose();
  };

  if (!levelId || !level) {
    return null;
  }

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("formFields.level.edit")}
      onClose={handleClose}
      confirmButton={{
        label: t("formFields.level.save"),
        type: "submit",
        form: formId,
      }}
      cancelButton={{
        label: t("formFields.level.cancel"),
        onClick: handleClose,
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
                handleClose();
              },
              onError: () => {
                setErrorMessage(t("formFields.level.error"));
              },
            },
          )
        }
      />
    </Modal>
  );
};
