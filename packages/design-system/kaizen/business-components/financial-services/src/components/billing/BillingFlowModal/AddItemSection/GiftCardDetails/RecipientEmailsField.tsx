import React, { useId, useState } from "react";

import { FormField, useFormContext } from "@bsport/form";
import {
  Body,
  Button,
  Divider,
  TextField,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const RecipientEmailsField: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const recipientEmailsId = useId();
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const { watch, setValue } = useFormContext<BillingFlowFormState>();

  const emails = watch("addItemGiftcardRecipientEmails");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && emailInput.trim()) {
      e.preventDefault();
      const trimmedEmail = emailInput.trim();

      if (!EMAIL_REGEX.test(trimmedEmail)) {
        setEmailError(t("billingFlowModal.giftCardDetails.invalidEmailError"));
        return;
      }

      if (emails.includes(trimmedEmail)) {
        setEmailError(
          t("billingFlowModal.giftCardDetails.duplicateEmailError"),
        );
        return;
      }

      setValue("addItemGiftcardRecipientEmails", [...emails, trimmedEmail], {
        shouldDirty: true,
      });
      setEmailInput("");
      setEmailError("");
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setValue(
      "addItemGiftcardRecipientEmails",
      emails.filter((email) => email !== emailToRemove),
      { shouldDirty: true },
    );
  };

  return (
    <div className="flex flex-col gap-xs">
      <FormField<
        BillingFlowFormState,
        "addItemGiftcardRecipientEmails",
        TextFieldProps
      >
        name="addItemGiftcardRecipientEmails"
        mapProps={() => ({
          value: emailInput,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setEmailInput(e.target.value);
            setEmailError("");
          },
          onClear: () => {
            setEmailInput("");
            setEmailError("");
          },
          onKeyDown: handleKeyDown,
          helperText:
            emailError ||
            t("billingFlowModal.giftCardDetails.recipientEmailsHelper"),
          status: emailError ? "error" : undefined,
          required: true,
        })}
      >
        <TextField
          id={`giftcard-recipient-emails-${recipientEmailsId}`}
          label={t("billingFlowModal.giftCardDetails.recipientEmails")}
          placeholder={t(
            "billingFlowModal.giftCardDetails.recipientEmailsPlaceholder",
          )}
          fullWidth
        />
      </FormField>

      {emails.length > 0 && (
        <div className="flex flex-col gap-2xs">
          {emails.map((email, index) => (
            <React.Fragment key={email}>
              <div
                key={email}
                className="flex items-center gap-2xs px-xs py-2xs rounded-md"
              >
                <Body htmlVariant="span" size="md" className="flex-1">
                  {email}
                </Body>
                <Button
                  kind="icon-button"
                  icon="x-close"
                  label={t("billingFlowModal.giftCardDetails.removeEmail")}
                  size="sm"
                  intent="flat"
                  color="critical"
                  onClick={() => handleRemoveEmail(email)}
                />
              </div>
              {index < emails.length - 1 && (
                <Divider orientation="horizontal" weight="thin" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
