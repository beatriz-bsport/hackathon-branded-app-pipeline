import { type FC, useId, useState } from "react";

import { useFormContext, useFormController } from "@bsport/form";
import { Alert, Modal } from "@bsport/kaizen-primitive-core";

import { useCreateLevel } from "#src/hooks/api/level/use-create-level";
import { useTranslation } from "#src/utils/i18n";

import type { MediaFormData } from "../../types";
import { LevelForm } from "./level-form";
import { useLevelSchema } from "./use-level-schema";

export const CreateLevelModal: FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useTranslation("media-form");
  const { setValue } = useFormContext<MediaFormData>();
  const { mutate, isPending } = useCreateLevel();
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
      title={t("formFields.level.create")}
      onClose={onClose}
      confirmButton={{
        label: t("formFields.level.confirmCreate"),
        type: "submit",
        form: formId,
        disabled: isError || isPending,
        iconLeft: isPending ? "loading" : undefined,
      }}
      cancelButton={{
        label: t("formFields.level.cancel"),
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
                setErrorMessage(t("formFields.level.error"));
              },
            },
          )
        }
      />
    </Modal>
  );
};
