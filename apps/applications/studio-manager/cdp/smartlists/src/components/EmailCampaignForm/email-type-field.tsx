import React, { useId } from "react";

import { FormField } from "@bsport/form";
import {
  RadioGroup,
  type RadioGroupProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { EMAIL_TYPE_INFORMATIONAL, EMAIL_TYPE_MARKETING } from "./constants";
import type { EmailCampaignFormData } from "./types";
import { isEmailTypeValid } from "./utils";

export const EmailTypeField: React.FC = () => {
  const { t } = useTranslation("campaign");
  const fieldId = useId();

  const options: Array<RadioGroupProps["options"][number]> = [
    {
      label: t("email.creation.form.emailType.options.marketing"),
      value: EMAIL_TYPE_MARKETING,
    },
    {
      label: t("email.creation.form.emailType.options.informational"),
      value: EMAIL_TYPE_INFORMATIONAL,
    },
  ];

  return (
    <FormField<EmailCampaignFormData, "emailType", RadioGroupProps>
      name="emailType"
      mapProps={({ field, form: { setValue } }) => ({
        value: field.value,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          if (!isEmailTypeValid(e.target.value)) {
            console.warn("[EmailTypeField] - Invalid email type");
            return;
          }
          setValue("emailType", e.target.value, {
            shouldDirty: true,
          });
        },
      })}
    >
      <RadioGroup
        id={`email-type-${fieldId}`}
        label={t("email.creation.form.emailType.label")}
        options={options}
        required
      />
    </FormField>
  );
};
