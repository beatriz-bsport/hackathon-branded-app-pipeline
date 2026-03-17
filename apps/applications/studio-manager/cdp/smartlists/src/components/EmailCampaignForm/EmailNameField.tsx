import React, { useId } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { TextField, TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { EmailCampaignFormData } from "./types";

export const CAMPAIGN_NAME_MAX_LENGTH = 150;

export const EmailNameField: React.FC = () => {
  const { t } = useTranslation("campaign");
  const fieldId = useId();
  const { formState } = useFormContext<EmailCampaignFormData>();
  const errorMessage = formState.errors.campaignName?.message;

  return (
    <FormField<EmailCampaignFormData, "campaignName", TextFieldProps>
      name="campaignName"
      mapProps={({ field, form: { setValue } }) => ({
        value: field.value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setValue("campaignName", e.target.value, {
            shouldValidate: true,
            shouldDirty: true,
          });
        },
        helperText: `${field.value?.length ?? 0}/${CAMPAIGN_NAME_MAX_LENGTH}`,
        maxLength: CAMPAIGN_NAME_MAX_LENGTH,
        onClear: () => {
          setValue("campaignName", "", {
            shouldValidate: true,
            shouldDirty: true,
          });
        },
      })}
    >
      <TextField
        id={`campaign-name-${fieldId}`}
        label={t("email.creation.form.campaignName.label")}
        status={errorMessage ? "error" : "default"}
        statusText={errorMessage}
        required
        fullWidth
      />
    </FormField>
  );
};
