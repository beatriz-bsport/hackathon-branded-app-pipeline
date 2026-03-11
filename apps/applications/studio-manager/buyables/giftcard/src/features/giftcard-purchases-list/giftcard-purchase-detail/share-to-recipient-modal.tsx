import { type FC, useEffect, useId } from "react";
import { z } from "zod";

import { ControlledForm, useFormController } from "@bsport/form";
import { FormField } from "@bsport/form";
import {
  Body,
  Chip,
  CopyToClipboard,
  Modal,
  TextField,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { useSendEmailInvitation } from "../api/use-send-email-invitation";
import { GiftcardPurchase } from "../types";

type ShareToRecipientModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  giftcardPurchase: GiftcardPurchase;
  companyId: number;
};

type FormValues = { recipientEmails: string[]; emailInput: string };
type Schema = z.ZodType<FormValues>;

const validateEmail = (email: string) => {
  return z.string().email().safeParse(email);
};
export const ShareToRecipientModal: FC<ShareToRecipientModalProps> = ({
  isOpen,
  closeModal,
  giftcardPurchase,
  companyId,
}) => {
  const { t } = useTranslation("giftcard-details");

  const { isLoading, sendEmailActivation } = useSendEmailInvitation();

  const schema = z.object({
    recipientEmails: z.array(z.string().email()).min(1),
    emailInput: z.string(),
  });

  const methods = useFormController<Schema>({
    schema,
    defaultValues: {
      recipientEmails: (giftcardPurchase.giftcard_recipients ?? []).map(
        (recipient) => recipient.email_sent_to,
      ),
      emailInput: "",
    },
  });

  useEffect(() => {
    methods.reset({
      recipientEmails: (giftcardPurchase.giftcard_recipients ?? []).map(
        (recipient) => recipient.email_sent_to,
      ),
      emailInput: "",
    });
  }, [giftcardPurchase, methods]);

  const sendInvitation = async ({
    recipientEmails,
  }: {
    recipientEmails: string[];
  }) => {
    await sendEmailActivation({
      consumerGiftcardId: giftcardPurchase.id,
      recipientEmails,
    });
    closeModal();
  };

  const formId = useId();

  /**
   * 3 states:
   * - already activated => no actions
   * - already sent => can share via link
   * - not sent yet => can edit recipients and share via link
   */
  const isAlreadyActivated = !!giftcardPurchase.date_activated;
  const isAlreadySent = giftcardPurchase.invitation_sent;

  let title = "";
  let description = "";

  if (isAlreadyActivated) {
    title = t("purchases.detailDrawer.shareModal.alreadyActivated.title");
    description = t(
      "purchases.detailDrawer.shareModal.alreadyActivated.description",
    );
  } else if (isAlreadySent) {
    title = t("purchases.detailDrawer.shareModal.alreadySent.title");
    description = t(
      "purchases.detailDrawer.shareModal.alreadySent.description",
    );
  } else {
    title = t("purchases.detailDrawer.shareModal.notSentYet.title");
    description = t("purchases.detailDrawer.shareModal.notSentYet.description");
  }

  const canEditRecipients = !isAlreadyActivated && !isAlreadySent;

  const currentEmails = methods.watch("recipientEmails");

  const removeEmail = (email: string) => {
    const updatedList = currentEmails.filter((value) => value !== email);
    methods.setValue("recipientEmails", updatedList, { shouldValidate: true });
  };

  return (
    <Modal
      open={isOpen}
      confirmButton={{
        label: t("purchases.detailDrawer.shareModal.buttons.save"),
        color: "main",
        form: formId,
        type: "submit",
        disabled:
          isLoading ||
          isAlreadySent ||
          isAlreadyActivated ||
          !methods.formState.isValid,
      }}
      cancelButton={{
        label: t("purchases.detailDrawer.shareModal.buttons.close"),
        onClick: closeModal,
        disabled: isLoading,
      }}
      onCloseButtonClick={closeModal}
      title={title}
      size="md"
      onClickOutside={closeModal}
    >
      <ControlledForm
        id={formId}
        onSubmit={sendInvitation}
        {...methods}
        className="flex flex-col gap-md items-start"
      >
        <Body htmlVariant="p">{description}</Body>

        <CopyToClipboard
          iconLeft="link-01"
          intent="default"
          color="main"
          size="md"
          kind="default"
          disabled={isAlreadyActivated}
          value={LEGACY_URLS.ACTIVATION_LINK({
            companyId: companyId,
            activationCode: giftcardPurchase.activation_code,
          })}
          placement="bottom"
          className="w-fit"
          label={t(
            "purchases.detailDrawer.shareModal.copyActivationLinkButton",
          )}
        />

        <FormField<FormValues, "emailInput", TextFieldProps>
          name="emailInput"
          mapProps={({ defaultProps, field, form }) => ({
            ...defaultProps,
            onKeyDown: (event) => {
              // When the user adds a "separator", add the item to the recipientEmails list and clear the textfield
              const separators = [" ", ",", "Tab", "Space"];
              const cleanValue = field.value.trim();

              if (cleanValue && separators.includes(event.key)) {
                const { success } = validateEmail(cleanValue);

                if (success && !currentEmails.includes(cleanValue)) {
                  // Add recipient email to list
                  form.setValue(
                    "recipientEmails",
                    [...currentEmails, cleanValue],
                    { shouldValidate: true },
                  );
                  // Reset TextField input
                  form.setValue("emailInput", "");
                }

                if (success && currentEmails.includes(cleanValue)) {
                  form.setError("emailInput", {
                    message: t(
                      "purchases.detailDrawer.shareModal.addRecipientEmail.emailAlreadyExist",
                    ),
                  });
                }

                if (!success) {
                  form.setError("emailInput", {
                    message: t(
                      "purchases.detailDrawer.shareModal.addRecipientEmail.incorrectFormat",
                    ),
                  });
                }
              }

              if (!separators.includes(event.key)) {
                form.clearErrors("emailInput");
              }
            },
            onChange: (event) => {
              const nextValue = event.target.value;
              if (nextValue === " " || nextValue === ",") {
                // Don't write the separator at the beginning of the input
                return;
              }
              defaultProps.onChange(event);
            },
            onClear: () => {
              form.setValue("emailInput", "", {
                shouldValidate: true,
              });
            },
          })}
        >
          <TextField
            id={`${formId}-textfield-input`}
            label={t(
              "purchases.detailDrawer.shareModal.addRecipientEmail.label",
            )}
            required={canEditRecipients}
            disabled={!canEditRecipients}
            containerProps={{ className: "self-stretch" }}
            fullWidth
            placeholder={t(
              "purchases.detailDrawer.shareModal.addRecipientEmail.placeholder",
            )}
          />
        </FormField>

        <div className="flex flex-wrap gap-2xs">
          {currentEmails.map((email, index) => (
            <Chip
              key={`${formId}-email-${index}-${email}`}
              color="default"
              size="lg"
              type="weak"
              label={email}
              dismissible={canEditRecipients}
              onClick={canEditRecipients ? () => removeEmail(email) : undefined}
            />
          ))}
        </div>
      </ControlledForm>
    </Modal>
  );
};
