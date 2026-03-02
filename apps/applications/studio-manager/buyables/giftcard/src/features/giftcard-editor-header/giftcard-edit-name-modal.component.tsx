import { type FC, useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { GiftcardFormName } from "#src/features/giftcard-form/components/giftcard-form-name.component";
import { useTranslation } from "#src/utils/i18n";

import { type GiftcardFormNameSchema, useGiftcardNameSchema } from "./schema";

type GiftcardEditNameModalProps = {
  initialName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void | Promise<void>;
};

export const GiftcardEditNameModal: FC<GiftcardEditNameModalProps> = ({
  initialName,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { t } = useTranslation("giftcard-details");

  const giftcardNameSchema = useGiftcardNameSchema();
  const internalMethods = useFormController<GiftcardFormNameSchema>({
    mode: "onChange",
    schema: giftcardNameSchema,
    defaultValues: { name: initialName },
  });

  const internalNameIsWrong = !!internalMethods.formState.errors.name;
  const internalNameValue = internalMethods.watch("name");
  const editNameFormId = useId();

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("editor.editNameModal.buttons.rename"),
        color: "main",
        form: editNameFormId,
        type: "submit",
        disabled:
          internalNameValue.trim().length === 0 ||
          internalNameValue === initialName ||
          internalNameIsWrong,
      }}
      cancelButton={{
        label: t("editor.editNameModal.buttons.cancel"),
        onClick: onClose,
      }}
      onCloseButtonClick={onClose}
      title={t("editor.editNameModal.title")}
      size="md"
      onClickOutside={onClose}
    >
      <ControlledForm
        id={editNameFormId}
        onSubmit={async (data) => {
          await onConfirm(data.name);
          // Reset the internal initial value in case the changes are discarded
          internalMethods.setValue("name", initialName);
        }}
        {...internalMethods}
      >
        <GiftcardFormName formId={`${editNameFormId}-edit`} />
      </ControlledForm>
    </Modal>
  );
};
