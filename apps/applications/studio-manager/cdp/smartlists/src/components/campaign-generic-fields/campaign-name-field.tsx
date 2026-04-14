import React, { useId } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const CAMPAIGN_NAME_MAX_LENGTH = 150;

type CampaignNameFormValues = {
  campaignName: string;
};

/**
 * Campaign-name input for forms that expose a `campaignName: string` field.
 *
 * Usage:
 * - Wrap inside a `ControlledForm`/form context.
 * - Use directly as `<CampaignNameField />`.
 * - Validation messages/constraints come from the schema validation;
 *   this component only renders the field UI and binds updates to `campaignName`.
 */
export const CampaignNameField = () => {
  const { t } = useTranslation("campaign");
  const fieldId = useId();
  const { formState } = useFormContext<CampaignNameFormValues>();
  const errorMessage = formState.errors.campaignName?.message?.toString();

  return (
    <FormField<CampaignNameFormValues, "campaignName", TextFieldProps>
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
        label={t("generic.creation.form.campaignName.label")}
        status={errorMessage ? "error" : "default"}
        statusText={errorMessage}
        required
        fullWidth
      />
    </FormField>
  );
};
