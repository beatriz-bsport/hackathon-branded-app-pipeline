import React, { useId } from "react";

import {
  type FieldPath,
  type FieldValues,
  FormField,
  useFormContext,
} from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const CAMPAIGN_NAME_MAX_LENGTH = 150;

type CampaignNameFormValues = FieldValues & {
  campaignName: string;
};

type CampaignNameFieldPath<T extends FieldValues> = {
  [K in FieldPath<T>]: K extends "campaignName"
    ? T[K] extends string
      ? K
      : never
    : never;
}[FieldPath<T>];

export const CampaignNameField = <
  TFormValues extends CampaignNameFormValues,
  TFieldName extends
    CampaignNameFieldPath<TFormValues> = CampaignNameFieldPath<TFormValues>,
>() => {
  const { t } = useTranslation("campaign");
  const fieldId = useId();
  const { formState } = useFormContext<TFormValues>();
  const fieldName = "campaignName" as TFieldName;
  const errorMessage = formState.errors.campaignName?.message?.toString();

  return (
    <FormField<TFormValues, TFieldName, TextFieldProps>
      name={fieldName}
      mapProps={({ field, form: { setValue } }) => ({
        value: field.value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setValue(fieldName, e.target.value as never, {
            shouldValidate: true,
            shouldDirty: true,
          });
        },
        helperText: `${field.value?.length ?? 0}/${CAMPAIGN_NAME_MAX_LENGTH}`,
        maxLength: CAMPAIGN_NAME_MAX_LENGTH,
        onClear: () => {
          setValue(fieldName, "" as never, {
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
