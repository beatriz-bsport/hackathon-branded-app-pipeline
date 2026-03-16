import React, { useId } from "react";

import { FormField, useFormContext } from "@bsport/form";
import {
  Body,
  SegmentedControl,
  SegmentedControlProps,
  TextArea,
  type TextAreaProps,
  TextField,
  type TextFieldProps,
  Title,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  MESSAGE_TYPE_EMAIL_TEMPLATE,
  MESSAGE_TYPE_TEXT_ONLY,
} from "./constants";
import type { EmailCampaignFormData } from "./types";
import { isMessageTypeValid } from "./utils";

export const ContentSection: React.FC = () => {
  const { t } = useTranslation("campaign");
  const baseId = useId();

  const { watch } = useFormContext<EmailCampaignFormData>();
  const isTextOnly = watch("isTextOnly");

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-xs">
        <Title htmlVariant="h2" weight="strong">
          {t("email.creation.form.message.title")}
        </Title>
      </div>

      <div className="w-[240px]">
        <FormField<EmailCampaignFormData, "isTextOnly", SegmentedControlProps>
          name="isTextOnly"
          mapProps={({ field, defaultProps, form }) => ({
            ...defaultProps,
            value: field.value
              ? MESSAGE_TYPE_TEXT_ONLY
              : MESSAGE_TYPE_EMAIL_TEMPLATE,
            onChangeValue: (value) => {
              if (!isMessageTypeValid(value)) {
                console.warn(`[MessageSection] Invalid message type: ${value}`);
                return;
              }
              if (value === MESSAGE_TYPE_EMAIL_TEMPLATE) {
                form.setValue("emailSubject", undefined, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                form.setValue("emailBody", undefined, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
              form.setValue("isTextOnly", value === MESSAGE_TYPE_TEXT_ONLY, {
                shouldValidate: true,
                shouldDirty: true,
              });
            },
          })}
        >
          <SegmentedControl
            id={`${baseId}-message-type`}
            fullWidth={true}
            options={[
              {
                value: MESSAGE_TYPE_TEXT_ONLY,
                label: t("email.creation.form.message.textOnly"),
              },
              {
                value: MESSAGE_TYPE_EMAIL_TEMPLATE,
                label: t("email.creation.form.message.emailTemplate"),
              },
            ]}
          />
        </FormField>
      </div>

      {isTextOnly ? (
        <div className="flex flex-col gap-md">
          <FormField<EmailCampaignFormData, "emailSubject", TextFieldProps>
            name="emailSubject"
            mapProps={({
              field,
              form: { setValue: setFormValue },
              defaultProps,
            }) => ({
              ...defaultProps,
              value: field.value ?? "",
              onClear: () => {
                setFormValue("emailSubject", "", {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              },
            })}
          >
            <TextField
              id={`${baseId}-email-subject`}
              label={t("email.creation.form.message.subjectLabel")}
              required
              fullWidth
            />
          </FormField>

          <FormField<EmailCampaignFormData, "emailBody", TextAreaProps>
            name="emailBody"
            mapProps={({ field, defaultProps }) => ({
              ...defaultProps,
              value: field.value ?? "",
            })}
          >
            <TextArea
              id={`${baseId}-email-body`}
              label={t("email.creation.form.message.bodyLabel")}
              required
            />
          </FormField>
        </div>
      ) : (
        <Body htmlVariant="p" size="md" weight="weak" color="weak">
          {t("email.creation.form.message.emailTemplatePlaceholder")}
        </Body>
      )}
    </div>
  );
};
