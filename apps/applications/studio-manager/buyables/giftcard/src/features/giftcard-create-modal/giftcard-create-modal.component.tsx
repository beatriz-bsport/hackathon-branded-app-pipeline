import { type FC, useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";

import { GiftcardFormDescription } from "#src/features/giftcard-form/components/giftcard-form-description.component";
import { GiftcardFormName } from "#src/features/giftcard-form/components/giftcard-form-name.component";
import { GIFTCARD_FORM_DATA_DEFAULT } from "#src/features/giftcard-form/constants";
import { useGiftcardFormSchema } from "#src/features/giftcard-form/schema";
import type { GiftcardFormSchema } from "#src/features/giftcard-form/types";
import { useTranslation } from "#src/utils/i18n";

type GiftcardCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const GiftcardCreateModal: FC<GiftcardCreateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("giftcard-details");

  const formId = `giftcard-form-create-${useId()}`;

  const giftcardFormSchema = useGiftcardFormSchema();

  const methods = useFormController<GiftcardFormSchema>({
    mode: "onBlur",
    schema: giftcardFormSchema,
    defaultValues: GIFTCARD_FORM_DATA_DEFAULT,
  });

  const { isDirty, isSubmitting, isValid } = methods.formState;

  const closeModal = () => {
    methods.reset(); // Reset fields to initial state
    onClose();
  };

  const handleClickOutside = () => {
    if (isDirty || isSubmitting) {
      // Prevent accidental closing when there are form data
      return;
    }

    closeModal();
  };

  return (
    <Modal
      open={isOpen}
      size="lg"
      title={t("createModal.title")}
      onClose={closeModal}
      onClickOutside={handleClickOutside}
      confirmButton={{
        color: "main",
        label: t("createModal.buttons.create"),
        type: "submit",
        form: formId,
        disabled: !isValid || !isDirty || isSubmitting,
      }}
      cancelButton={{
        label: t("createModal.buttons.cancel"),
        onClick: closeModal,
      }}
    >
      <ControlledForm id={formId} onSubmit={console.log} {...methods}>
        <div className="flex flex-col gap-md w-full">
          <GiftcardFormName formId={formId} />
          <GiftcardFormDescription formId={formId} />
        </div>
      </ControlledForm>
    </Modal>
  );
};
