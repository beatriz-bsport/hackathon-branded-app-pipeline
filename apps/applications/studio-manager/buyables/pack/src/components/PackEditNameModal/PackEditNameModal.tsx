import { type FC, useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { PackFormName } from "#src/components/PackForm/PackFormIdentity";
import { useTranslation } from "#src/utils/i18n";

import { type PackFormNameSchema, usePackNameSchema } from "./schema";

type PackEditNameModalProps = {
  initialName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void | Promise<void>;
};

export const PackEditNameModal: FC<PackEditNameModalProps> = ({
  initialName,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation("details");

  // In order to submit the form, all the fields must be handled and validated --> manage only name
  const packNameSchema = usePackNameSchema();
  const methods = useFormController<PackFormNameSchema>({
    mode: "onChange",
    schema: packNameSchema,
    defaultValues: { name: initialName },
  });

  const internalNameIsWrong = !!methods.formState.errors.name;
  const internalNameValue = methods.watch("name");
  const editNameFormId = useId();

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("editNameModal.buttons.rename"),
        color: "main",
        form: editNameFormId,
        type: "submit",
        disabled:
          internalNameValue.trim().length === 0 ||
          internalNameValue === initialName ||
          internalNameIsWrong,
      }}
      cancelButton={{
        label: t("editNameModal.buttons.cancel"),
        onClick: onClose,
      }}
      onCloseButtonClick={onClose}
      title={t("editNameModal.title")}
      size="md"
      onClickOutside={onClose}
    >
      <ControlledForm
        id={editNameFormId}
        onSubmit={async (data) => {
          await onConfirm(data.name);
          // Reset to initial value in case the changes are discarded
          methods.setValue("name", initialName);
        }}
        {...methods}
      >
        <PackFormName fieldIdPrefix="edit" />
      </ControlledForm>
    </Modal>
  );
};
