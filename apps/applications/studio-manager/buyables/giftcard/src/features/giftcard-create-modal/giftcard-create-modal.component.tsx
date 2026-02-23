import { type FC, useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal, Title } from "@bsport/kaizen-primitive-core";

import { GiftcardFormAdvancedSection } from "#src/features/giftcard-form/components/giftcard-form-advanced-section.component";
import { GiftcardFormCover } from "#src/features/giftcard-form/components/giftcard-form-cover.component";
import { GiftcardFormDescription } from "#src/features/giftcard-form/components/giftcard-form-description.component";
import { GiftcardFormExpirationDays } from "#src/features/giftcard-form/components/giftcard-form-expiration-days.component";
import { GiftcardFormName } from "#src/features/giftcard-form/components/giftcard-form-name.component";
import { GiftcardFormPaymentMethods } from "#src/features/giftcard-form/components/giftcard-form-payment-methods.component";
import { GiftcardFormTagsAfterPurchase } from "#src/features/giftcard-form/components/giftcard-form-tags-after-purchase.component";
import { GiftcardFormValue } from "#src/features/giftcard-form/components/giftcard-form-value.component";
import { GiftcardFormVisibilitySelector } from "#src/features/giftcard-form/components/giftcard-form-visibility-selector.component";
import { GIFTCARD_FORM_DATA_DEFAULT } from "#src/features/giftcard-form/constants";
import { useGiftcardFormSchema } from "#src/features/giftcard-form/schema";
import type { GiftcardFormSchema } from "#src/features/giftcard-form/types";
import { transformFormStateIntoAPIData } from "#src/features/giftcard-form/utils";
import { useGiftcardNavigation } from "#src/hooks/useGiftcardNavigation";
import { useTranslation } from "#src/utils/i18n";

import { useCreateGiftcard } from "./use-create-giftcard";

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

  const { navigateToGiftcardDetails } = useGiftcardNavigation();

  const { createGiftcard, isLoading } = useCreateGiftcard({
    onSuccess: (value) => {
      onClose();
      navigateToGiftcardDetails(value.id);
    },
  });

  const methods = useFormController<GiftcardFormSchema>({
    mode: "onChange",
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
        iconLeft: isLoading ? "loading" : undefined,
        disabled: !isValid || !isDirty || isSubmitting || isLoading,
      }}
      cancelButton={{
        label: t("createModal.buttons.cancel"),
        onClick: closeModal,
      }}
    >
      <ControlledForm
        id={formId}
        onSubmit={(data) => {
          const finalData = transformFormStateIntoAPIData(data);
          createGiftcard(finalData);
        }}
        {...methods}
      >
        <div className="flex flex-col gap-md w-full">
          <GiftcardFormCover formId={formId} methods={methods} />

          <GiftcardFormValue formId={formId} methods={methods} />

          <GiftcardFormName formId={formId} />
          <GiftcardFormDescription formId={formId} />

          <GiftcardFormExpirationDays formId={formId} methods={methods} />

          <Title htmlVariant="h4" weight="strong">
            {t("sections.pricing")}
          </Title>
          <GiftcardFormPaymentMethods formId={formId} methods={methods} />

          <Title htmlVariant="h4" weight="strong">
            {t("sections.visibility")}
          </Title>
          <GiftcardFormVisibilitySelector />

          <GiftcardFormAdvancedSection formId={formId}>
            <GiftcardFormTagsAfterPurchase formId={formId} />
          </GiftcardFormAdvancedSection>
        </div>
      </ControlledForm>
    </Modal>
  );
};
